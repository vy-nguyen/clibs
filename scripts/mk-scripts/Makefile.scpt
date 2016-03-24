# 
#  Copyright (C) 2014-2015 Vy Nguyen
#  Github https://github.com/vy-nguyen/c-libraries
# 
#  Redistribution and use in source and binary forms, with or without
#  modification, are permitted provided that the following conditions
#  are met:
# 
#  1. Redistributions of source code must retain the above copyright
#     notice, this list of conditions and the following disclaimer.
#  2. Redistributions in binary form must reproduce the above copyright
#     notice, this list of conditions and the following disclaimer in the
#     documentation and/or other materials provided with the distribution.
# 
#  THIS SOFTWARE IS PROVIDED BY THE AUTHOR AND CONTRIBUTORS ``AS IS'' AND
#  ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
#  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
#  ARE DISCLAIMED.  IN NO EVENT SHALL THE AUTHOR OR CONTRIBUTORS BE LIABLE
#  FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
#  DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS
#  OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
#  HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
#  LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY
#  OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
#  SUCH DAMAGE.
#
# Makefile.scpt
# -------------
# Shared scripts for the Makefile system.

# ----------------------------------------------------------------------------
# Script do subdir build
#
scpt_build_subdir =                                                          \
    for f in $(proj_dirs); do                                                \
        echo Making $(MAKECMDGOALS) in `pwd`/$$f;                            \
        (cd $$f && $(MAKE) $(MAKECMDGOALS) --no-print-directory) || exit 1;  \
    done

# ----------------------------------------------------------------------------
# Script to setup build directory
#
scpt_setup_build_dir :=                                                      \
    [ ! -d "$(gl_dir_build)" ] && mkdir -p $(gl_dir_build);                  \
    [ ! -d "$(comm_dir_obj)" ] && mkdir -p $(comm_dir_obj);                  \
    [ ! -d "$(comm_dir_bin)" ] && mkdir -p $(comm_dir_bin);                  \
    [ ! -d "$(comm_dir_lib)" ] && mkdir -p $(comm_dir_lib);                  \
    [ ! -d "$(topdir)/logs" ] && mkdir -p $(topdir)/logs;                    \
    [ ! -d "$(comm_foss_dir_lib)" ] && mkdir -p $(comm_foss_dir_lib);        \
    exit 0;

ifdef VERBOSE
    gl_v :=
else
    gl_v := @
endif

# ----------------------------------------------------------------------------
# Script to build a static library.
#
#	$(ld) $(lda_flg) $$+ -o $$@
define scpt_mk_static_lib
$(call comm_lib_tgt,$(1)): $(call comm_src2obj,$($(1)))
	$(gl_v)echo "    [LINK .a]    $$@"
	$(gl_v)$(ar) $(ar_flg) $$@ $$+
endef

# ----------------------------------------------------------------------------
# Script to build a dynamic library.
#
define scpt_mk_dynamic_lib
$(call comm_so_tgt,$(1)): $(call comm_src2obj,$($(1)))
	$(gl_v)echo "    [LINK .so]   $$@"
	$(gl_v)$(ld) $(lso_flg) $$+ -o $$@
endef

# ----------------------------------------------------------------------------
# Script to generate .h file from .json
#
define scpt_mk_json2h
../include/$(patsubst %.json,%.h,$(1)): $(1) $(gl_dir_tools)/jsonc
	$(gl_v)echo "    [GEN .json]  $$@"
	$(gl_v)$(gl_dir_tools)/jsonc --log /dev/null --in $$< --out ../include/$$@
endef

# ----------------------------------------------------------------------------
proto_plgin ?= grpc_cpp_plugin
protoc_flag := --plugin=protoc-gen-grpc=$(gl_dir_foss_bin)/$(proto_plgin)

define scpt_mk_proto2cpp
$(patsubst %.proto,%.pb.h,$(1)): $(1)
	$(gl_v)echo "    [GEN .proto] $$@"
	$(gl_v)$(protoc) $(gl_cpp_incl) --cpp_out=. $$<
ifndef proto_norpc
	$(gl_v)$(protoc) $(gl_cpp_incl) --grpc_out=. $(protoc_flag) $$<
endif
ifdef proto_ccp
	$(gl_v)echo "    [MOVE .cc]   $(proto_ccp)"
	$(gl_v)mv $(patsubst %.proto,%.pb.cc,$(1)) $(patsubst %.proto,%.grpc.pb.cc,$(1)) $(proto_ccp)/
endif
ifdef proj_java
	$(gl_v)$(protoc) $(gl_cpp_incl) --java_out=. $$<
endif
endef

# ----------------------------------------------------------------------------
# Script to build a exec binary.
#
define scrpt_mk_exe
$(comm_dir_bin)/$(1): $(call comm_src2obj,$($(1))) $(comm_lib_dep)
	$(gl_v)echo "    [LINK .exe]  $$@"
	$(gl_v)$(cpp) $(call comm_src2obj,$($(1))) $(exe_flg) -o $$@
endef

# ----------------------------------------------------------------------------
# Script to run unit test
#
define scpt_run_test
$(comm_dir_bin)/.$(1)-tested: $(comm_dir_bin)/$(1)
	$(gl_v)echo "------------------------------------------------------------"; \
	echo "[UNIT TEST] in dir `pwd`";                                            \
	echo "------------------------------------------------------------"
ifndef SKIP_TEST
ifndef VALGRIND
	@$(mk_scripts)/unit-runner.sh $(gl_dir_foss_lib) $$< "$($(1)_args)"
else
	@$(mk_scripts)/unit-runner.sh $(gl_dir_foss_lib) valgrind $$< "$($(1)_args)"
endif
else
	@echo Skip: $$< "$($(1)_args)"
endif
	$(gl_v)touch $$@
endef

define scpt_force_run_test
$(comm_dir_bin)/.$(1)-run: $(comm_dir_bin)/$(1)
	$(gl_v)echo "------------------------------------------------------------"; \
	echo "[UNIT TEST] in dir `pwd`";                                            \
	echo "------------------------------------------------------------"
ifndef VALGRIND
	@$(mk_scripts)/unit-runner.sh $(gl_dir_foss_lib) $$< "$($(1)_args)"
else
	@$(mk_scripts)/unit-runner.sh $(gl_dir_foss_lib) valgrind $$< "$($(1)_args)"
endif
endef

# ----------------------------------------------------------------------------
# Script to do a clean
#
scpt_make_clean :=                                                           \
    if [ "$(topdir)" == "." ]; then                                          \
        rm -rf $(gl_dir_build) $(topdir)/logs Build.release;                 \
    else                                                                     \
        rm -rf $(comm_dir_obj) Build.release;                                \
    fi;                                                                      \
    exit 0

# ----------------------------------------------------------------------------
# Script to do cscope.
#
scpt_make_cscope :=                                                          \
    cd $(topdir);                                                            \
    find -L . -name "*.[chx]" -print > cscope.files;                         \
    cat cscope.files | xargs ctags;                                          \
	cscope -q

# ----------------------------------------------------------------------------
# Script to update ctags database
#
scpt_make_ctags :=                                                           \
    ctags `cat cscope.files`
