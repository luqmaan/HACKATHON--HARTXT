Linux installation

-Install NODE package: 

sudo apt-get install python-software-properties
sudo apt-add-repository ppa:chris-lea/node.js
sudo apt-get update
sudo apt-get install nodejs npm


-run Controller.js in the background: nohup node controller.js &

(May need to hit enter acouple times to clear nohup. You may log out of the server at this point.)
-Send text to 813-434-1117 in format: <es> locationID (space) Bus#/Route#
(ie: "es 1234 34" (spanish) or "1234 34" (english))