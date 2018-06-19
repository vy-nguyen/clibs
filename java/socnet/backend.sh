#!/bin/bash

# gradle jettyRun -Dorg.eclipse.jetty.annotations.maxWait=180 $@
gradle tomcatRun $@

# gradle jettyRunDebug -Dorg.eclipse.jetty.annotations.maxWait=120 $@
# ./gradlew jettyRun -Dorg.eclipse.jetty.annotations.maxWait=120 $@

