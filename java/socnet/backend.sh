#!/bin/bash

export DEV_ENVIRONMENT=true
# export KEY_DB_HOST=10.1.10.11
export KEY_DB_HOST=localhost
export GETH_RPC=local

gradle jettyRun -Dorg.eclipse.jetty.annotations.maxWait=180 $@
# gradle tomcatRun $@

# gradle jettyRunDebug -Dorg.eclipse.jetty.annotations.maxWait=180 $@
# ./gradlew jettyRun -Dorg.eclipse.jetty.annotations.maxWait=120 $@

