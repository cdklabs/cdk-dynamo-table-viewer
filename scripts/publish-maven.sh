#!/bin/bash
set -eu # we don't want "pipefail" to implement idempotency

###
#
# Publishes all maven modules in the current directory to maven.
#
# Usage: ./publish-maven.sh DIR
#
# MAVEN_STAGING_PROFILE_ID         - Maven Central (sonatype) staging profile ID (e.g. 68a05363083174)
# MAVEN_USERNAME                   - User name for Sonatype
# MAVEN_PASSWORD                   - Password for Sonatype
# MAVEN_GPG_PRIVATE_KEY            - GPG private key where newlines are encoded as "\n"
# MAVEN_GPG_PRIVATE_KEY_FILE       - GPG private key file (mutually exclusive with MAVEN_GPG_PRIVATE_KEY)
# MAVEN_GPG_PRIVATE_KEY_PASSPHRASE - The passphrase of the provided key.
# MAVEN_DRYRUN                     - Set to "true" for a dry run
#
###

###
#
# HOW TO CREATE A GPG KEY?
#
#   gpg --gen-key (use RSA, 4096, passphrase)
#
# Export and publish the public key:
#   1. gpg -a --export > public.pem
#   2. Go to https://keyserver.ubuntu.com/ and submit the public key
#
# Export and use the private key:
#   1. gpg -a --export-secret-keys <fingerprint> > private.pem
#   2. Set MAVEN_GPG_PRIVATE_KEY_FILE =t point to `private.pem`
#      or
#   3. You can also export the private key to a single line where newlines are encoded
#      as "\n" and then assign it to MAVEN_GPG_PRIVATE_KEY.
#      MAVEN_GPG_PRIVATE_KEY="$(echo $(cat -e private.pem) | sed 's/\$ /\\n/g' | sed 's/\$$//')"
#
###

error() { echo "❌ $@"; exit 1; }

[ -z "${1:-}" ] && {
    echo "Usage: $(basename $0) DIR"
    exit 1
}

cd $1

[ -z "${MAVEN_STAGING_PROFILE_ID:-}" ] && error "MAVEN_STAGING_PROFILE_ID is required"
[ -z "${MAVEN_USERNAME:-}" ] && error "MAVEN_USERNAME is required"
[ -z "${MAVEN_PASSWORD:-}" ] && error "MAVEN_PASSWORD is required"

[ -z "${MAVEN_GPG_PRIVATE_KEY_PASSPHRASE:-}" ] && error "MAVEN_GPG_PRIVATE_KEY_PASSPHRASE is required"
[ -z "${MAVEN_GPG_PRIVATE_KEY_FILE:-}" ] && [ -z "${MAVEN_GPG_PRIVATE_KEY:-}" ] && error "MAVEN_GPG_PRIVATE_KEY_FILE or MAVEN_GPG_PRIVATE_KEY is required"
[ -n "${MAVEN_GPG_PRIVATE_KEY:-}" ] && [ -n "${MAVEN_GPG_PRIVATE_KEY_FILE:-}" ] && error "Cannot specify both MAVEN_GPG_PRIVATE_KEY and MAVEN_GPG_PRIVATE_KEY_FILE"

if [[ -n "${MAVEN_DRYRUN:-}" ]]; then
    echo "==========================================="
    echo "            🏜️ DRY-RUN MODE 🏜️"
    echo
    echo "Set FOR_REAL=true to do actual publishing!"
    echo "==========================================="
    mvn="echo mvn"
    dry_run=true
else
    mvn=mvn
    dry_run=false
fi

#---------------------------------------------------------------------------------------------------------------------------------------
# Import private GPG key
#---------------------------------------------------------------------------------------------------------------------------------------

echo "Importing GPG key..." >&2

# GnuPG will occasionally bail out with "gpg: <whatever> failed: Inappropriate ioctl for device", the following attempts to fix
export GNUPGHOME=$(mktemp -d)
export GPG_TTY=$(tty)


if [ -n "${MAVEN_GPG_PRIVATE_KEY}" ]; then
    MAVEN_GPG_PRIVATE_KEY_FILE="${GNUPGHOME}/private.pem"
    echo -e "${MAVEN_GPG_PRIVATE_KEY}" > ${MAVEN_GPG_PRIVATE_KEY_FILE}
fi

gpg --allow-secret-key-import --batch --yes --no-tty --import "${MAVEN_GPG_PRIVATE_KEY_FILE}" || {
    echo "❌ GPG key import failed"
    exit 1
}

gpg_key_id=$(gpg --list-keys --with-colons | grep pub | cut -d: -f5)
echo "gpg_key_id=${gpg_key_id}"

GPG_PASSPHRASE_FROM_STDIN="--passphrase-fd 0"
if [[ "$(uname)" == "Darwin" ]]; then
    # On Mac, we must pass this to disable a prompt for
    # passphrase, but option is not recognized on Linux.
    GPG_PASSPHRASE_FROM_STDIN="${GPG_PASSPHRASE_FROM_STDIN} --pinentry-mode loopback"
fi
export GPG_PASSPHRASE_FROM_STDIN

poms="$(find . -name '*.pom')"
if [ -z "${poms}" ]; then
    echo "❌ No JARS to publish: no .pom files found under $PWD"
    exit 1
fi

echo "📦 Publishing to Maven Central"
staging=$(mktemp -d)
workdir=$(mktemp -d)

# Create a settings.xml file with the user+password for maven
mvn_settings="${workdir}/mvn-settings.xml"
cat > ${mvn_settings} <<-EOF
<?xml version="1.0" encoding="UTF-8" ?>
<settings xmlns="http://maven.apache.org/SETTINGS/1.0.0"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.0.0
                              http://maven.apache.org/xsd/settings-1.0.0.xsd">
  <servers>
    <server>
      <id>ossrh</id>
      <username>${MAVEN_USERNAME}</username>
      <password>${MAVEN_PASSWORD}</password>
    </server>
  </servers>
</settings>
EOF

echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
echo " Preparing repository"
echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"

# Sign and stage our artifacts into a local directory
for pom in "${poms}"; do
    $mvn --settings=${mvn_settings} gpg:sign-and-deploy-file                    \
        -Durl=file://${staging}                                                 \
        -DrepositoryId=maven-central                                            \
        -Dgpg.homedir=${GNUPGHOME}                                              \
        -Dgpg.keyname=0x${gpg_key_id}                                           \
        -Dgpg.passphrase=${MAVEN_GPG_PRIVATE_KEY_PASSPHRASE}                    \
        -DpomFile=${pom}                                                        \
        -Dfile=${pom/.pom/.jar}                                                 \
        -Dsources=${pom/.pom/-sources.jar}                                      \
        -Djavadoc=${pom/.pom/-javadoc.jar}
done


echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
echo " Deploying and closing repository..."
echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"

staging_output="${workdir}/deploy-output.txt"
$mvn --settings=${mvn_settings}                                                    \
    org.sonatype.plugins:nexus-staging-maven-plugin:1.6.5:deploy-staged-repository \
    -DrepositoryDirectory=${staging}                                               \
    -DnexusUrl=${MAVEN_ENDPOINT:-https://oss.sonatype.org}                                            \
    -DserverId=ossrh                                                               \
    -DautoReleaseAfterClose=true                                                   \
    -DstagingProfileId=${MAVEN_STAGING_PROFILE_ID} | tee ${staging_output}

# we need to consule PIPESTATUS sinec "tee" is the last command
if [ ${PIPESTATUS[0]} -ne 0 ]; then
    echo "❌ Repository deployment failed"
    exit 1
fi

echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
echo " Releasing repository"
echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"

# Extract the ID of the closed repository from the log output of "deploy-staged-repository"
# This is because "deploy-staged-repository" doesn't seem to support autoReleaseAfterClose
# See https://issues.sonatype.org/browse/OSSRH-42487
if $dry_run; then
    echo 'Closing staging repository with ID "dummyrepo"' > ${staging_output}
fi

repository_id="$(cat ${staging_output} | grep "Closing staging repository with ID" | cut -d'"' -f2)"
if [ -z "${repository_id}" ]; then
    echo "❌ Unable to extract repository ID from deploy-staged-repository output."
    echo "This means it failed to close or there was an unexpected problem."
    echo "At any rate, we can't release it. Sorry"
    exit 1
fi

echo "Repository ID: ${repository_id}"

# Create a dummy pom.xml because the "release" goal needs one, but it doesn't care about it at all
release_pom="${workdir}/release-pom.xml"
cat > ${release_pom} <<HERE
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>
  <groupId>dummy</groupId>
  <artifactId>dummy</artifactId>
  <version>0.0.0</version>
</project>
HERE

# Release!
release_output="${workdir}/release-output.txt"
$mvn --settings ${mvn_settings} -f ${release_pom} \
    org.sonatype.plugins:nexus-staging-maven-plugin:1.6.5:release \
    -DserverId=ossrh \
    -DnexusUrl=${MAVEN_ENDPOINT:-https://oss.sonatype.org} \
    -DstagingProfileId=${MAVEN_STAGING_PROFILE_ID} \
    -DstagingRepositoryId=${repository_id} | tee ${release_output}

# If release failed, check if this was caused because we are trying to publish
# the same version again, which is not an error. The magic string "does not
# allow updating artifact" for a ".pom" file indicates that we are trying to
# override an existing version. Otherwise, fail!
if [ ${PIPESTATUS[0]} -ne 0 ]; then
    if cat ${release_output} | grep "does not allow updating artifact" | grep -q ".pom"; then
        echo "⚠️ Artifact already published. Skipping"
    else
        echo "❌ Release failed"
        exit 1
    fi
fi

echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
echo "✅ All Done!"
