topdir      := ..
proj_env    := user
proj_target := lib
proj_incl   := $(topdir)/include/crypto .

proj_cpp    := \
	crypto.cpp \
	crypto-user.cpp \
	user-cache.cpp \
	types.pb.cc \
	types.grpc.pb.cc

proj_libs   := crypto-app
crypto-app  := $(proj_cpp)

include $(topdir)/Makefile.incl
