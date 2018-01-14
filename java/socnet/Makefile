topdir       := ../..
proj_scripts := js_test
proj_dirs    := \
	src/main/css

include ./Makefile.incl

web:
	@$(set_alias_scpt)
	npm run vntd --watch

source_path  := $(web_jsdir)
test_dir     := $(source_path)/tests
test_sources := \
	$(wildcard $(test_dir)/*.js* $(test_dir)/*/*.js* $(test_dir)/*/*/*.js*)

set_alias_scpt :=                                                                    \
	pushd . > /dev/null;                                                             \
	cd $(source_path);                                                               \
	[ ! -e vntd-root ] && ln -s tvntd vntd-root;                                     \
	[ ! -e vntd-shared ] && ln -s shared vntd-shared;                                \
	popd > /dev/null;                                                                \
	cd $(npm_modules);                                                               \
	[ ! -e react-mod ] && ln -s react react-mod;                                     \
	exit 0

js_test:
	@$(set_alias_scpt)
	@export NODE_PATH=$(web_jsdir); $(mocha) $(mocha_args) $(test_sources)
