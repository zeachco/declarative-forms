#!/bin/bash

PROD_BRANCH='main'
KILL_CODE=1
PASS='✨'
WARN='⚠️'
FAIL='💥'

deploy() {
    echo "Checking branch..."
    if [ $(getBranch) != "$PROD_BRANCH" ]; then
        echo "$FAIL You need to be on [$PROD_BRANCH] to run deploy."
        exit $KILL_CODE;
    fi

    echo "Checking remote code [$PROD_BRANCH]..."
    if [ $(getDiffRemote) ]; then
        echo "$FAIL You have changes that do not match the remote."
        echo "Please commit or discard those changes before deploying."
        exit $KILL_CODE;
    fi

    echo "Checking pending changes..."
    if [ $(lastActiveTag) == "v$(currentPkgVersion)" ]; then
        echo "$WARN No changelog were found, generating one"
        createVersion
    fi

    publishDocumentation

    createTag

    echo "$PASS All done."
}

# Utilities

getBranch() {
    echo `git rev-parse --abbrev-ref HEAD`
}

getDiffRemote() {
    git fetch origin
    echo `git diff origin/$PROD_BRANCH --name-only`
}

lastActiveTag() {
    echo `git describe --tags --abbrev=0`
}

currentPkgVersion() {
    echo `node -e "process.stdout.write(require('./package.json').version)"`
}

createVersion() {
    echo "Creating new changelog..."
    yarn run changeset status --since=origin/main

    # Runing `changeset version` should bump the package version when changes are found
    yarn run changeset version

    if [ $(lastActiveTag) == "v$(currentPkgVersion)" ]; then
        echo "No changelog were found."
        exit $KILL_CODE;
    fi
}

createTag() {
    _msg="Creating release $(lastActiveTag)..v$(currentPkgVersion) with:"
    echo $_msg
    git tag v$(currentPkgVersion) -m "$_msg"
    echo "Tag created, run the following to create package:"
    echo "git push --follow-tags"
}

publishDocumentation() {
    echo "Publishing documentation..."
    yarn run build:docs
    git add ./docs
    git commit -m "generate doc for release $currentPkgVersion"
}

# Start the deploy

deploy
