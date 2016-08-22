#!/bin/bash

export LD_LIBRARY_PATH=../../Build.clang/foss-lib
../../Build.clang/bin/key-server --config ../../etc/db-cfg.json

