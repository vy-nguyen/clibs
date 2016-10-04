topdir       := ../..
proj_scripts := test
test_dir     := src/front-end/tests
test_sources := \
	$(wildcard $(test_dir)/*.js*)

mocha_args   := --compilers js:babel-core/register --require $(test_dir)/setup.js
node_bin_pwd := $(topdir)/java/socnet/node_modules/.bin

include $(topdir)/Makefile.incl

test:
	$(node_bin_pwd)/mocha $(mocha_args) $(test_sources)
