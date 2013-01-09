#!/bin/bash
# This file deploys a compressed or uncompressed version of the software to a locally hosted webserver.  For more info read more about dev work flows on the wiki.
#
# Copyright 2012 Eric Jonathan Whyne
#
#   Licensed under the Apache License, Version 2.0 (the "License");
#   you may not use this file except in compliance with the License.
#   You may obtain a copy of the License at
#
#       http://www.apache.org/licenses/LICENSE-2.0
#   Unless required by applicable law or agreed to in writing, software
#   distributed under the License is distributed on an "AS IS" BASIS,
#   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#   See the License for the specific language governing permissions and
#   limitations under the License.

projectdir="/home/eric/workspace/SimpleSpatial/"
deploydir="/var/www/html/simplespatial/"
yui="yui/yuicompressor-2.4.7.jar"
files=(
	#text files
	"head.php"
	"index.php"
	"toolui.php"
	"tutorials.php"
	"site.css"
	"iphone-checkboxes.css"
	"jquery-ui-eb.css"
	"jquerycolors.css"
	"buildkml.php"
	"builddataterrainkml.php"
	"buildheatmapkml.php"
	"fetchgoogspreadsheet.php"
	"postecho.php"
	#graphic files
	"compass.png"
	"earth.jpg"
	"Snow-cholera-map.jpg"
	"modernvis.png"
	"googless.png"
	"logo.png"
	"bubble.png"
	"geicon.png"
	"gmicon.png"
	"version.png"
	"question.png"
	"check-icon.png"
	"cross-icon.png"
	#Proof of concept
	"oauthpoc.php"
	"loading.gif"
)
# yui takes a while, some of these are commented out to speed things up
javascriptfiles=(
	"depend/date.js"
	"depend/functions.js"
	"depend/hm.js"
	"depend/iphone-style-checkboxes.js"
	"depend/jquery-1.7.2.js"
	"depend/jquery-ui-1.8.21.custom.min.js"
	"depend/jquery-ui-timepicker-addon.js"
	"depend/jquerycolors.js"
	"depend/uistuff.js"
)
#exceptions
exception1="depend/images"
exception1a="depend"
mkdir $deploydir$exception1a
echo "exception: recursive copy " $projectdir$exception1 " to " $deploydir$exception1a
cp -R $projectdir$exception1 $deploydir$exception1
exception2="oauth"
echo "exception: recursive copy " $projectdir$exception2 " to " $deploydir
cp -R $projectdir$exception2 $deploydir$exception2
exception3="kmlfiles"
mkdir $deploydir$exception3
chmod a+w $deploydir$exception3

for file in "${files[@]}" 
do
	echo "copying " $projectdir$file " to " $deploydir$file
	cp -f $projectdir$file $deploydir$file
done
for file in "${javascriptfiles[@]}" 
do
	#echo "yui " $projectdir$file " to " $deploydir$file
	#java -jar $projectdir$yui $projectdir$file -o $deploydir$file
	echo "yuiOFF copying " $projectdir$file " to " $deploydir$file
	cp -f $projectdir$file $deploydir$file
done
echo "Done!"
