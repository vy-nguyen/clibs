ifndef topdir
	topdir    := ..
	proj_dirs := \
		janson \
		googlemock/make \
		googlemock/gtest/make \
		c-algorithms \
		libconfig \
		leveldb \
		grpc
endif

foss_incl_path := $(topdir)/include/foss
proj_clean     := $(foss_incl_path)
proj_predep    := build_dir foss_predep
proj_postlink  := foss_postlink

include $(topdir)/Makefile.incl

build_dir:
	@mkdir -p $(gl_dir_foss_lib);                      \
	mkdir -p $(gl_dir_foss_bin);                       \
	mkdir -p $(foss_incl_path)

foss_predep: \
	janson/configure \
	c-algorithms/Makefile \
	libconfig/configure \
	klib/Makefile \
	grpc/third_party/protobuf/Makefile.am

foss_postlink: \
	janson \
	gmock \
	gtest \
	libcalg \
	libconfig \
	stblib \
	http-parser \
	klib \
	leveldb \
	grpc

# ------------------------------------------------------------------------------------
# Macros to setup soft links for lib and include path
# $1 : target lib to be linked in $(1) path (e.g. libleveldb.a)
# #2 : directory in foss (e.g leveldb).
# $3 : lib built by the Makefile there.
# $4 : optional, top root dir to search for matching pattern.
#
define scpt_foss
$(gl_dir_foss_lib)/$(1): $(2)/$(3)
	@echo "    [LN]         $(2)/$(3)"
	@[ -e $$@ ] && rm $$@; ln -s `pwd`/$$< $$@
	@$(topdir)/scripts/foss-link.sh $(gl_dir_foss_lib) $(2) ".*\.\(a\|so.*\)" $(4)
endef

define scpt_foss_bin
$(gl_dir_foss_bin)/$(1): $(2)/$(3)
	@[ -e $$@ ] && rm $$@; ln -s `pwd`/$$< $$@
	@$(topdir)/scripts/foss-link.sh $(gl_dir_foss_bin) $(2) ".*" $(4)
endef

define scpt_foss_incl
$(foss_incl_path)/$(1): $(3)
	@echo "    [INCL]       $(1)"
	@[ -e $$@ ] && rm $$@; ln -s `pwd`/$(2) $$@
endef

# ------------------------------------------------------------------------------------
# Janson build plugin.
#
janson/configure: janson/configure.ac
	@echo "    [AC]         janson";                                  \
	cd janson; autoreconf -i && ./configure

janson: \
	$(gl_dir_foss_lib)/libjanson.a \
	$(foss_incl_path)/janson

$(eval $(call scpt_foss,libjanson.a,janson,src/.libs/libjansson.a))
$(eval $(call scpt_foss_incl,janson,janson/src,janson/Makefile))

# ------------------------------------------------------------------------------------
# Ngnix build plugin
#
nginx/Makefile: nginx/configure
	@echo "    [AC]         nginx";                                   \
	cd nginx; ./configure

# ------------------------------------------------------------------------------------
# Google Mock/Test plugin
#
gmock: \
	$(gl_dir_foss_lib)/libgmock.a \
	$(foss_incl_path)/gmock

$(eval $(call scpt_foss,libgmock.a,googlemock,make/gmock_main.a))
$(eval $(call scpt_foss_incl,gmock,googlemock/include/gmock,googlemock/Makefile.am))

gtest: \
	$(gl_dir_foss_lib)/libgtest.a \
	$(foss_incl_path)/gtest

$(eval $(call scpt_foss,libgtest.a,googlemock/gtest,make/gtest_main.a))
$(eval $(call scpt_foss_incl,gtest,googlemock/gtest/include/gtest,googlemock/Makefile.am))

# ------------------------------------------------------------------------------------
# C-algorithm plugin
#
c-algorithms/Makefile: c-algorithms/autogen.sh
	@echo "    [AC]         c-algorithms";                            \
	cd c-algorithms; ./autogen.sh

libcalg: \
	$(gl_dir_foss_lib)/libcalg.a \
	$(foss_incl_path)/c-algo

$(eval $(call scpt_foss,libcalg.a,c-algorithms/src/.libs,libcalg.a))
$(eval $(call scpt_foss_incl,c-algo,c-algorithms/src,c-algorithms/Makefile))

# ------------------------------------------------------------------------------------
# Libconfig build
#
libconfig/configure: libconfig/configure.ac
	@echo "    [AC]         libconfig";                               \
	cd libconfig; autoreconf -i && ./configure

libconfig: \
	$(gl_dir_foss_lib)/libconfig.a \
	$(foss_incl_path)/config

$(eval $(call scpt_foss,libconfig.a,libconfig/lib/.libs,libconfig.a))
$(eval $(call scpt_foss_incl,config,libconfig/lib,libconfig/Makefile))

# ------------------------------------------------------------------------------------
# STB lib
#
stblib: $(foss_incl_path)/stb

$(eval $(call scpt_foss_incl,stb,stb,stb/stb.h))

# ------------------------------------------------------------------------------------
# http-parser
#
http-parser: http-parser-make \
	$(gl_dir_foss_lib)/libhttp-parser.so \
	$(foss_incl_path)/http-parser

http-parser-make:
	@(cd http-parser; make library)

$(eval $(call scpt_foss,libhttp-parser.so,http-parser,libhttp_parser.so.2.4.2))
$(eval $(call scpt_foss_incl,http-parser,http-parser,http-parser/Makefile))

# ------------------------------------------------------------------------------------
# klib build
#
klib/Makefile: klib-patch/Makefile
	@cp klib-patch/* klib

klib: $(foss_incl_path)/klib

$(eval $(call scpt_foss_incl,klib,klib,klib/Makefile))

# ------------------------------------------------------------------------------------
# Leveldb build
#
leveldb: \
	$(gl_dir_foss_lib)/libleveldb.a \
	$(foss_incl_path)/leveldb

$(eval $(call scpt_foss,libleveldb.a,leveldb,libleveldb.a))
$(eval $(call scpt_foss_incl,leveldb,leveldb/include/leveldb,leveldb/Makefile))

# ------------------------------------------------------------------------------------
# grpc build
#
rpc/third_party/protobuf/Makefile.am: grpc/Makefile
	@echo "    [GIT]        grpc";                            \
	cd grpc; git submodule update --init

grpc: \
	$(gl_dir_foss_lib)/libprotobuf-3.a \
	$(gl_dir_foss_bin)/protoc \
	$(foss_incl_path)/google \
	$(foss_incl_path)/grpc \
	$(foss_incl_path)/grpc++

$(eval $(call scpt_foss_bin,protoc,grpc/bins/opt/protobuf,protoc,grpc/bins))
$(eval $(call scpt_foss,libprotobuf-3.a,grpc/libs/opt/protobuf,libprotobuf.a,grpc/libs))
$(eval $(call scpt_foss_incl,google,grpc/third_party/protobuf/src/google,grpc/Makefile))
$(eval $(call scpt_foss_incl,grpc,grpc/include/grpc,grpc/Makefile))
$(eval $(call scpt_foss_incl,grpc++,grpc/include/grpc++,grpc/Makefile))
