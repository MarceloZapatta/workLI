#!/bin/bash
# This is an workLI Laravel template
# Customize it how you want
ProjectPath=$1
Host=$2
Port=$3

cd ~/${ProjectPath}
composer install
php artisan serve --host=$2 --port=$3
