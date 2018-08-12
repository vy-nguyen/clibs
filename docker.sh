#!/bin/bash

REPO=vyproject/ubuntu:dev.3
docker pull ${REPO}
docker run -it --mount type=bind,source="$(pwd)",target=/tvntd ${REPO} /root/start.sh
