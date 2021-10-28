# Makefile
#
# This file contains some helper scripts for building / deploying this site.

build:
	rm -rf public
	bower install
	hugo

develop:
	rm -rf public
	bower install
	hugo server --buildDrafts --buildFuture --watch --logFile './server.log'

deploy: build
	aws s3 sync public/ s3://www.akinjide.me --acl public-read --delete
	aws configure set region us-east-1
	aws configure set preview.cloudfront true
	aws cloudfront create-invalidation --distribution-id E3UYGGKZAO7WMS --paths '/*'
