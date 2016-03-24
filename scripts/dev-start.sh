#!/bin/bash

# Create links...
#
cd java/socnet
ln -s ../../foss foss
cd src/main/webapp/images/
ln -s ../../../../../../webapp-static poc

# Create mysql database & account.
#
