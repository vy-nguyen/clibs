#!/bin/bash

# Server stuffs
sudo apt-get install letsencrypt nginx clang cscope ctags
wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | sudo apt-key add - 
sudo sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list'


# Install gradle stuffs
#
sudo add-apt-repository ppa:fcwu-tw/ppa   
sudo add-apt-repository ppa:cwchien/gradle
sudo add-apt-repository ppa:alessandro-strada/ppa
sudo add-apt-repository ppa:webupd8team/java -y

sudo apt-get update
sudo apt-get install google-drive-ocamlfuse
sudo apt-get install vim tmux
sudo apt-get install gradle
sudo apt-get install mail-stack-delivery

# Server stuffs
#
sudo apt-get install software-properties-common python-software-properties
sudo apt-get install google-chrome-stable

# Install java
#
sudo apt-get install oracle-java8-set-default

# Install nodejs, npm...
#
sudo apt-get install curl
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install npm -g
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
popd
