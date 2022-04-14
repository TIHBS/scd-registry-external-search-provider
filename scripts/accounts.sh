#! /bin/sh

curl -X GET -w " %{http_code}" http:/localhost:8080/accounts