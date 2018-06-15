#!/bin/bash

gradle jettyRun -Dorg.eclipse.jetty.annotations.maxWait=120 $@

# gradle jettyRunDebug -Dorg.eclipse.jetty.annotations.maxWait=120 $@
# ./gradlew jettyRun -Dorg.eclipse.jetty.annotations.maxWait=120 $@

