#!/bin/bash

# gradle jettyRunDebug -Dorg.eclipse.jetty.annotations.maxWait=120 $@

gradle jettyRun -Dorg.eclipse.jetty.annotations.maxWait=120 $@

