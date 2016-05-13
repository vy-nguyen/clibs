#!/bin/bash

if [ !-e jetty-runner* ]; then
    wget http://central.maven.org/maven2/org/eclipse/jetty/jetty-runner/9.3.0.M1/jetty-runner-9.3.0.M1.jar
fi

java -jar jetty-runner-9.3.0.M1.jar --port 8090 build/libs/skel.war
