#!/bin/bash

#start app
cd /home/ec2-user/webservice
sudo pm2 kill
sudo pm2 start index.js 