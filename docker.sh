#!/bin/bash

docker pull vyproject/ubuntu:dev.2
docker create --name TD_Dev vyproject/ubuntu:dev.2
docker run -it --mount type=bind,source="$(pwd)",target=/tvntd vyproject/ubuntu:dev.2 /root/start.sh
