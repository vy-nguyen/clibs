ifndef topdir
	topdir    := ..
	proj_dirs := \
		schema \
		utest-lib \
		template \
		common \
		json \
		crypto \
		util
endif

proj_incl     += $(topdir)/unit-test/include

proj_dep_libs += \
	utest \
	json \
	util \
	di \
	cpptype \
	ctype

proj_sys_libs += \
	boost_thread \
	boost_system \
	boost_filesystem

proj_foss_libs += \
	gtest \
	janson

include $(topdir)/Makefile.incl
