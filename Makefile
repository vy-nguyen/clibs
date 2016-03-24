ifndef topdir
	topdir    := .
	proj_dirs := \
		include \
		common \
		db \
		tools \
		template \
		crypto \
		unit-test \
		app
endif
include $(topdir)/Makefile.incl
