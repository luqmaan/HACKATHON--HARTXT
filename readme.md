HARTXT
=============

http://createch.github.com/HACKATHON--HARTXT/

SPARKTECH created an SMS system that allows passengers to text the location ID, already provided at each stop, with the Bus Number they want and receive an automated response with the next 3 times the bus will arrive. It also is available in spanish and is blind accessible.

Ubuntu Installation
-------------

+ Install node.js
	- sudo apt-get install python-software-properties
	- sudo apt-add-repository ppa:chris-lea/node.js
	- sudo apt-get update
	- sudo apt-get install nodejs npm
+ Run controller.js
	-	node controller.js
	-	for background mode: nohup node controller.js &
	

Case Study
-------------

### PROBLEM

![][1]

Most HART bus stops do not have route times or when the next bus is coming for passengers. 

Majority of passengers do not have smartphone capabilities and cannot look up the schedule on Google or the HART website.

### SOLUTION

![][2]

SPARKTECH created an SMS system that allows passengers to text the location ID, already provided at each stop, with the Bus Number they want and receive an automated response with the next 3 times the bus will arrive. It also is available in spanish. [TRY IT HERE.][3]

*Why did we choose this solution?*

SPARKTECH felt this was the best solution for public riders with the existing HART resources. Each bus stop already has the Location ID and Bus # available. So we created a database that parses the schedules to make the information easily accessible for passengers. We swayed away from crowd-sourcing because that makes users come out of their comfort zone and tries to force them to learn a new habit. We focused on what the demographic already does which is texting. We also decided on using this type of technology because we understood what type of phones our demographic uses and felt a mobile application isn't necessary for the majority and the individuals with smartphones could just find the information on Google or GoHART.org. 

![][4]

### SPARKTECH TEAM

Luqmaan Dawoodjee | *Lead Developer*  
Daniel Melick | *Lead Strategist*  
Kathleen Tran | *Developer*  
Francis Gelderloos | *Data Developer*  
Erik Christensen | *Mobile Developer*  
Jeremy Fisher | *Researcher*  
Maria Ordehi | *Researcher*  


![][4]

### STATISTICS

Total Ridership in 2011: **14,220,590**  
77% of passengers have cellphones  
Only 26% use smartphones (iPhone, Android, Windows, Blackberry)  
**51%** use regular cellphones (no data plan or browser)  
**25%** of passengers are hispanic (2011 census)  


![][4]

### USER EXPERIENCE

![][5]

Passenger sends a text with â€œ(Location ID, provided at each stop) + (Bus Stop #, also provided at each stop)â€ (example: â€œ5186 46â€) to (813) 434-1117 (short code is available).

HARTXT sends an auto-response with the next 3 times the bus will arrive at that specific bus stop.

<a name="try"></a> ![][4]

### TRY IT YOURSELF!

Here's some bus stops:  


**Sun Ridge Apartments Stop**  
Location ID: 4598   
Bus #: 6  
Text "4598 6" to (813) 434-1117  
*for spanish Text "ES 4598 6"*  


**Hyatt Regency Stop**  
Location ID: 5872   
Bus #: 46  
Text "5872 46" to (813) 434-1117  
*for spanish Text "ES 5872 46"*  


**McKinley Drive & Fowler Ave Stop**  
Location ID: 1619  
Bus #: 5  
Text "1619 5" to (813) 434-1117  
*for spanish Text "ES 1619 5"*  


![][4]

### EXPENSES

Short Code Number: $12,000 a year ($3000 a quarter)  
Cost per Text: $.01   
2500 Bus Signs (estimated) x $10 (estimated + labor): $25,000   


First Year Set Up Total: **$37,000 + $.01 per text**

Year After Total: **$12,000 + $.01 per text**

![][4]

### CONTACT

Phone: 215.531.4937  
Email: <luqmaan@createchwebdesign.com>  
PDF Version: <a href="http://www.danielmelick.com/hart/hartxt.pdf" target="_blank">HARTXT PDF</a>

 [1]: http://www.danielmelick.com/hart/original.jpg
 [2]: http://www.danielmelick.com/hart/photo.jpg
 [3]: #try
 [4]: http://www.danielmelick.com/hart/divider.jpg
 [5]: http://www.danielmelick.com/hart/experience.jpg
