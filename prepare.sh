#!/bin/bash

pushd .
cd java/socnet
ln -s ../../foss foss

npm install
bower install
popd

