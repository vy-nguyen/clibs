topdir        := ../..
proj_env      := user
proj_target   := test

proj_cc       := \
	listtest.c \
	hashtest.c

proj_cpp      := \
	mod-test.cpp \
	request.cpp \
	hash-json.cpp \
	pagelock-json.cpp

# List of binaries to build
#
proj_exes     := \
	listtest \
	hashtest \
	modtest \
	hash-json \
	pagelock-json

# Run binaries during unit test phase
#
proj_tests     := \
	modtest \
	hash-json \
	pagelock-json

proj_sys_libs  :=
proj_foss_libs :=

proj_dep_libs  := \
	util

listtest       := listtest.c
hashtest       := hashtest.c
modtest        := mod-test.cpp request.cpp
hash-json      := hash-json.cpp
pagelock-json  := pagelock-json.cpp

# Arguments to run unit test code.
#
listtest_args      :=
hashtest_args      :=
modtest_args       := --log $(topdir)/logs/log.txt --verbose

hash-json_args     := -c $(topdir)/etc/test-cfg.json --in hash-run.json
pagelock-json_args := -c $(topdir)/etc/test-cfg.json --in pagelock-run.json

include ../Makefile
