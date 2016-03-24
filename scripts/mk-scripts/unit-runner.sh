#!/bin/bash

echo Exec unit test from `pwd`
export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:$1

if [ "$2" == "valgrind" ]; then
    exec_str="valgrind --leak-check=\"yes\" $3 "
    testargs=$4
else
    exec_str="$2 "
    testargs=$3
fi

IFS='|'; export IFS
for arg in $testargs; do
    exe=$exec_str$arg
    echo $exe
    eval $exe
done
