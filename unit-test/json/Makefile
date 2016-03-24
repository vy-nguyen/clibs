topdir        := ../..
proj_env      := user
proj_target   := test

proj_cpp      := \
	unit-test-basic.cpp \
	json-obj-test.cpp

proj_json     :=

# List of binaries to build
#
proj_exes     := \
	json-obj \
	unit-basic	

json-obj      := json-obj-test.cpp
unit-basic    := unit-test-basic.cpp

# Run binaries during unit test phase
#
proj_tests     := unit-basic

proj_sys_libs  :=
proj_foss_libs :=
proj_dep_libs  :=

# Arguments to run unit test code.  Separate each dataset with the |
#
unit-basic_args := -i ../template/input.json

include ../Makefile
