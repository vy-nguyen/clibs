topdir        := ../..
proj_env      := user
proj_target   := test

proj_cpp      := \
	transaction.cpp

# List of binaries to build
#
proj_exes     := \
	transaction

# Run binaries during unit test phase
#
proj_tests     := \
	transaction

proj_sys_libs  := \
	boost_thread \
	boost_system \
	boost_filesystem

proj_foss_libs := \
	gtest \
	janson \
	protobuf-3

proj_dep_libs  := \
	utest

transaction    := transaction.cpp

# Arguments to run unit test code.
#
transaction_args  :=

include ../Makefile
