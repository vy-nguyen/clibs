topdir       := ../..
proj_scripts := test
source_path  := src/front-end

test_dir     := $(source_path)/tests
test_sources := \
	$(wildcard $(test_dir)/*.js*)

mocha_args   := --compilers js:babel-core/register --require $(test_dir)/setup.js
node_bin_pwd := $(topdir)/java/socnet/node_modules/.bin

set_alias_scpt :=                                                                    \
	cd $(source_path);                                                               \
	[ ! -e vntd-root ] && ln -s tvntd vntd-root;                                     \
	[ ! -e vntd-shared ] && ln -s shared vntd-shared;                                \
	exit 0

include $(topdir)/Makefile.incl

test:
	@$(set_alias_scpt)
	@export NODE_PATH=src/front-end; $(node_bin_pwd)/mocha $(mocha_args) $(test_sources)
