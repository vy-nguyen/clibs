#!/bin/bash

git submodule update --init --recursive  
pushd .
cd java/socnet
ln -s ../../foss foss

npm install
bower install
popd

