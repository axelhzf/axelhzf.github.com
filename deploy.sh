#!/bin/sh
rm -rf out/*
docpad generate
cd out
git add .
git add -u
git commit -m "update site"
git push