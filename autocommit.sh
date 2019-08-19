#!/bin/bash
npm run build
git rm -r /home/jover/Desktop/jover/Demo/PLK/Front/1/dist
cp -r dist /home/jover/Desktop/jover/Demo/PLK/Front/1
cd /home/jover/Desktop/jover/Demo/PLK/Front/1/
git add .
git commit -m "$1"
git push origin master
