HARTXT
=============

SPARKTECH created an SMS system that allows passengers to text the location ID, already provided at each stop, with the Bus Number they want and receive an automated response with the next 3 times the bus will arrive. It also is available in spanish and is blind accessible.

Ubuntu Installation
-------------

+ Install NODE package
	- sudo apt-get install python-software-properties
	- sudo apt-add-repository ppa:chris-lea/node.js
	- sudo apt-get update
	- sudo apt-get install nodejs npm
+ Run controller.js:
	-	node controller.js
	-	for background mode: nohup node controller.js &
	
http://createch.github.com/HACKATHON--HARTXT/