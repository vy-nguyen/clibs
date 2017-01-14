#!/bin/bash

gradle jettyRun -Dorg.eclipse.jetty.annotations.maxWait=120 $@ > server.out 2>&1 &
