topdir      := ../..
proj_env    := user
proj_target := exe
proj_cpp    := \
	key-server.cpp \
	key-server-async.cpp \
	key-service.cpp

proj_incl  := .
proj_proto :=

proj_exes  := key-server
key-server := $(proj_cpp)

proj_sys_libs  := \
	util

proj_foss_libs := \
	leveldb \
	crypto \
	ssl

proj_dep_libs  := \
	kvdb

include ../Makefile
