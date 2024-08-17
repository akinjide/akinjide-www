---
aliases:
  - /push-systemd-standard-streams-to-slack/
date: "2024-08-17"
description: ""
slug: "push-systemd-standard-streams-to-slack"
tags:
  - "programming"
  - "personal development"
title: "Push Systemd Standard Streams to Slack"
draft: true
---

![Sasuke Onward Sketch][]


https://en.wikipedia.org/wiki/Systemd
https://www.scaledrone.com/blog/real-time-notifications-from-systemd-to-slack/


## Install

https://github.com/coursehero/slacktee

slacktee.sh --title "(SystemD) onepitch_functions/journalists" --short-field environment staging -s level error -a danger -s "Timestamp" "$(date)" -s Host 104.248.182.188



function-authors.service
[Unit]
Description=Gunicorn instance to serve authors function
After=network.target

[Service]
User=onepitch
Group=www-data
WorkingDirectory=/home/onepitch/onepitch_functions/authors
Environment="PATH=/home/onepitch/onepitch_functions/authors/authorsenv/bin"

ExecStartPre=/bin/sh -c "echo 'Server starting on $(hostname)' | slacktee.sh --title '(SystemD) onepitch_functions/journalists' --short-field environment staging -s level error -a danger -s 'Timestamp" "$(date)' -s Host 104.248.182.188"
ExecStart=/home/onepitch/onepitch_functions/authors/authorsenv/bin/gunicorn --workers 3 --bind unix:authors.sock -m 007 wsgi:app

[Install]
WantedBy=multi-user.target

/bin/bash

journalctl -u function-journalists.service -n 20 -q --no-pager

Restart=on-failure
RestartSec=1s


## Setup Slack

https://api.slack.com/slack-apps#creating_apps


## Configure Systemd service

```bash
[Unit]
Description=ScaleDrone Server
After=syslog.target network.target

[Service]
Type=simple
User=app
Group=app
WorkingDirectory=/opt/server

ExecStartPre=-/bin/sh -c "echo 'Server starting on $(hostname)' | /usr/bin/slacktee"
ExecStart=server --environment=production

ExecStop=/bin/kill -HUP $MAINPID
ExecStopPost=-/bin/sh -c "{ echo 'Server stopped on $(hostname), last lines from logs:'; /usr/bin/tail -n 22 /var/log/server.log; } | /usr/local/bin/slacktee"

# Redirect logs to syslog where they are written to the /var/log/server.log file
StandardOutput=syslog
StandardError=syslog

# In case if it gets stopped, restart it immediately
Restart=always

[Install]
# multi-user.target corresponds to run level 3
# roughtly meaning wanted by system start
WantedBy=multi-user.target
```

## Final Thoughts


  [Sasuke Onward Sketch]: /static/images/2023/sasuke-onward-sketch.png "Sasuke Onward Sketch"
