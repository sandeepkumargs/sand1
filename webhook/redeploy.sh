#!/bin/bash
git pull -f origin develop
npm install
pm2 reload
pm2 save 
