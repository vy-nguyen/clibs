#!/bin/bash

# gradle jettyRunDebug -Dorg.eclipse.jetty.annotations.maxWait=120 $@

./gradlew jettyRun -Dorg.eclipse.jetty.annotations.maxWait=120 $@

