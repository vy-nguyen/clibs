ifndef topdir
	topdir     := ..
	proj_dirs  := include protobuf db-driver transaction key-server unit-test
endif

proj_incl      += \
	$(topdir)/unit-test/include \
	$(topdir)/include/util \
	$(topdir)/app/include

proj_dep_libs  += \
	crypto-app \
	transaction \
	db-driver \
	app-proto \
	util \
	json \
	di \
	cpptype \
	ctype

proj_foss_libs += \
	janson \
	grpc++_unsecure \
	grpc_unsecure \
	grpc++ \
	grpc \
	protobuf-3 \
	gpr \
	dl

proj_sys_libs  += \
	boost_thread \
	boost_system \
	boost_filesystem

include $(topdir)/Makefile.incl
