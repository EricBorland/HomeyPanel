#!/bin/bash
#
# Git Hooks installation

# Exit on fail
set -e

cp ./hooks/* .git/hooks/
ls .git/hooks | grep -v sample | xargs -I{} chmod +x .git/hooks/{}
npm config set engine-string true
rm -Rf .git/hooks/install.sh
