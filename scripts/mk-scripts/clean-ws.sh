#!/bin/bash

clean_list=`find . -regex ".*\.\(pb.*\|grpc.*\)" -print | grep -v "/foss/"`
for f in $clean_list; do
    echo rm -f $f
    rm -f $f
done
