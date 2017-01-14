#!/bin/bash

# Install gradle stuffs
#
sudo apt-get install software-properties-common python-software-properties
sudo add-apt-repository ppa:cwchien/gradle
sudo add-apt-repository ppa:webupd8team/java -y

sudo apt-get update
sudo apt-get install gradle

# Install java
#
sudo apt-get install oracle-java8-set-default

# Install nodejs, npm...
#
sudo apt-get install curl
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install npm -g
sudo npm install bower -g
npm install webpack

# Create links...
#
pushd .
cd java/socnet
ln -s ../../foss foss
# cd src/main/webapp/images/
# ln -s ../../../../../../webapp-static poc
popd

# Create mysql database & account.
#
sudo apt-get install mysql-server

#
# mysql --user=root -p
# GRANT ALL PRIVILEGES ON *.* TO 'socnet'@'localhost';
# FLUSH PRIVILEGES;

# Sync front-end modules.
#
pushd .
cd java/socnet
npm install
bower install
popd
