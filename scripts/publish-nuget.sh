#!/bin/bash
scriptdir=$(cd $(dirname $0) && pwd)
set -eu # we don't want "pipefail" to implement idempotency

###
#
# Publishes all nupkg to nuget
#
# Usage: ./publish-maven.sh [DIR]
#
# NUGET_API_KEY: API key for nuget
#
###

[ -n "${1:-}" ] && cd $1

if [ -z "${NUGET_API_KEY:-}" ]; then
    echo "NUGET_API_KEY is required"
    exit 1
fi

packages=$(find . -name *.nupkg -not -iname *.symbols.nupkg)
if [ -z "${packages}" ]; then
    echo "❌ No *.nupkg files found under $PWD. Nothing to publish"
    exit 1
fi

echo "Publishing NuGet packages..."

nuget_source="https://api.nuget.org/v3/index.json"
nuget_symbol_source="https://nuget.smbsrc.net/"

log=$(mktemp -d)/log.txt

for package_dir in "${packages}"; do
    echo "📦  Publishing ${package_dir} to NuGet"
    (
        cd $(dirname $package_dir)
        nuget_package_name=$(basename $package_dir)
        nuget_package_base=${nuget_package_name%.nupkg}

        [ -f "${nuget_package_base}.snupkg" ] || echo "⚠️ No symbols package was found!"

        # The .snupkg will be published at the same time as the .nupkg if both are in the current folder (which is the case)
        dotnet nuget push $nuget_package_name -k ${NUGET_API_KEY} -s ${nuget_source} | tee ${log}
        exit_code="${PIPESTATUS[0]}"

        # If push failed, check if this was caused because we are trying to publish
        # the same version again, which is not an error by searching for a magic string in the log
        # ugly, yes!
        if cat ${log} | grep -q "already exists and cannot be modified"; then
            echo "⚠️ Artifact already published. Skipping"
        elif [ "${exit_code}" -ne 0 ]; then
            echo "❌ Release failed"
            exit 1
        fi
    )
done

echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
echo "✅ All Done!"
