#!/bin/bash

gradle jettyRun -Dorg.eclipse.jetty.annotations.maxWait=120 $@
