#!/bin/bash

# git submodule update --init --recursive  
pushd .
cd java/socnet
ln -s ../../foss foss

make prepare
(cd src/main/css && make)

popd
