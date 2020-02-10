#!/usr/bin/env bash
/app/start_nginx&
gunicorn --workers=1 --bind=0.0.0.0:3939 server.app:'getApp()'