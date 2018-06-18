#!/bin/bash

#gradle jettyRun -Dorg.eclipse.jetty.annotations.maxWait=160 $@

gradle jettyRunDebug -Dorg.eclipse.jetty.annotations.maxWait=120 $@
# ./gradlew jettyRun -Dorg.eclipse.jetty.annotations.maxWait=120 $@

