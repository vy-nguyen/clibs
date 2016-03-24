topdir      := ../..
proj_env    := user
proj_target := lib
proj_incl   := $(topdir)/include/util

proj_cpp    := \
	fs.cpp \
	uuid.cpp \
	pagelock.cpp \
	bigint.cpp \
	bigint.pb.cc \
	async-rpc.cpp

proj_libs   := util
util        := $(proj_cpp)

include $(topdir)/Makefile.incl
