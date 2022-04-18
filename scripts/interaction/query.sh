#! /bin/sh

url="http://localhost:8080/?query=$1"
echo "$url"
curl "$url" | json_pp
