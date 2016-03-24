#!/bin/bash

# $1 : destination dir.
# $2 : source dir.
# $3 : source filter pattern.
# $4 : optional, top source dir.
#
if [ $# -lt 3 ]; then
    echo "Usage: $0 <dest-dir> <src-dir> <src-filter>"
    exit -1
fi

if [ "x$4" = "x" ]; then
    src_dir=$2
else
    src_dir=$4
fi
dst_dir=$1
pat_fil=$3

for f in `find $src_dir -regex "$pat_fil" -print`; do
    [ -d $f ] && continue
    file=$dst_dir/`basename $f`
    [ -e $file ] && rm $file
    echo "    [LN]         $file"
    ln -s `pwd`/$f $file
done
