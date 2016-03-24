topdir      := ../..
proj_env    := user
proj_target := lib
proj_incl   := ../include $(topdir)/include/util

proj_cpp    := \
	key-db.pb.cc \
	transaction.pb.cc

proj_libs   := app-proto
app-proto   := $(proj_cpp)

include $(topdir)/Makefile.incl
