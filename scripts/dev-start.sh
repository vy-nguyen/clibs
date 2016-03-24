#!/bin/bash

# Create links...
#
pushd .
cd java/socnet
ln -s ../../foss foss
# cd src/main/webapp/images/
# ln -s ../../../../../../webapp-static poc
popd

# Create mysql database & account.
#

# Sync front-end modules.
#
pushd .
cd java/socnet
npm install
bowel install
popd
