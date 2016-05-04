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
	hugo server
	
deploy:
	aws s3 sync public/ s3://www.akinjide.me --acl public-read --delete

