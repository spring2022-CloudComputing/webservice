#!/bin/bash

sleep 30

sudo yum update -y

sudo yum install git make gcc -y
sudo amazon-linux-extras install epel
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash ~/.nvm/nvm.sh
sudo yum install -y gcc-c++ make
curl -sL https://rpm.nodesource.com/setup_14.x | sudo -E bash -
sudo yum install -y nodejs
sudo npm install -g pm2
mkdir /home/ec2-user/node-app
chown ec2-user:ec2-user /home/ec2-user/node-app