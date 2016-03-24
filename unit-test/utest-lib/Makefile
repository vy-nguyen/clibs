topdir      := ../..
proj_env    := user
proj_target := lib
proj_cc     := \
	datagen.c \
	data-test.c \
	utest-lib.c \
	utest-shell.c

proj_cpp    := \
	json-unit.cpp \
	json-gtest.cpp \
	unit-test-def.cpp

utest       := $(proj_cc) $(proj_cpp)
proj_libs   := utest

include ../Makefile
