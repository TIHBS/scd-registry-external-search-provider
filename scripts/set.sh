#! /bin/sh

curl -X PUT -w "%{http_code}" "http:/localhost:8080/set/?message=$1"