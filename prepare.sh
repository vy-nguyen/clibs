#!/bin/bash

# git submodule update --init --recursive  
pushd .
cd java/socnet
ln -s ../../foss foss

npm install
make prepare
(cd src/main/css && make)

popd
