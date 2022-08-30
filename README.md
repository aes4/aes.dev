# aes.dev
nodejs, express, ejs


note:
chmod +x restart.sh

!/bin/bash
sleep 30
cd aes.dev/
screen -d -m node server.js

crontab -e @reboot ~/restart.sh

systemd service file future?
