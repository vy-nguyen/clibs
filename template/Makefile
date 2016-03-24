topdir      := ..
proj_env    := user
proj_target := test
proj_cpp    := \
	tool.cpp \
	daemon.cpp \
	hello.grpc.pb.cc \
	hello.pb.cc \
	client.cpp \
	server.cpp

proj_incl  := .
proj_proto := hello.proto

proj_exes  := unit tool daemon client server
tool       := tool.cpp
daemon     := daemon.cpp
client     := \
	hello.grpc.pb.cc \
	hello.pb.cc \
	client.cpp

server     := \
	hello.grpc.pb.cc \
	hello.pb.cc \
	server.cpp

proj_sys_libs  :=
proj_foss_libs := \
	gtest \
	janson \
	grpc++_unsecure \
	grpc_unsecure \
	grpc++ \
	grpc \
	protobuf-3 \
	gpr \
	dl

proj_dep_libs  := \
	di \
	cpptype \
	ctype

include $(topdir)/Makefile.incl
