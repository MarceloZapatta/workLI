#!/usr/bin/env bash
# This is the run file for your project
# Please include any scripts you use to run your project
cd ~/curotec/sigfig/engage
composer install
./vendor/bin/sail up -d
