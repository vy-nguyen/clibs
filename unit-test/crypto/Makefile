topdir         := ../..
proj_env       := user
proj_target    := test
proj_cpp       := \
	crypto-test.cpp \
	db-test.cpp

proj_json      :=
proj_grpc      := true
proj_incl      :=

proj_exes      := crypto db
proj_tests     := crypto db
crypto         := crypto-test.cpp
db             := db-test.cpp

proj_sys_libs  :=
proj_foss_libs := \
	crypto \
	leveldb \
	ssl

proj_dep_libs  := \
	crypto-app \
	kvdb \

# Run unit test code.
#
proj_tests     := \
	crypto \
	db

# Arguments to run unit test code
#
crypto_args    := -i input-run.json -c $(topdir)/etc/test-cfg.json
db_args        := -i input-db.json -c db-cfg.json

include ../Makefile
