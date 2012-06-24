console.log("hai");

var express = require('express'),
    app = express.createServer();
app.use(express.bodyParser());

var TwilioClient = require('twilio').Client,
    Twiml = require('twilio').Twiml,
    util = require('util');

var _ = require('underscore');
var EventEmitter = require('events').EventEmitter,
    emitter = new EventEmitter;

var client = new TwilioClient('ACf68e2b63d2b3d88e0d52573b084a2de6', '36078c0b449f1b570b392ee95baf255f', '99.198.122.112');
var phone = client.getPhoneNumber('+18134341117');

var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'ilovetorideonthehartbuslol123',
    database: 'gohart'
});

connection.connect();

/* sun ridge apartments */
// getTimes("4598 6", "+13217507895", true);
/* hyatt regency */
// getTimes("5872 46", "+13217507895", false);

app.post('/sms', function (req, res) {

    console.log("\n\n===================================");
    console.log("received text message, pow!");

    var message = req.body.Body;
    var from = req.body.From;


    /* back to the real work */
    var sanitize = new RegExp("[^0-9 esES]", "g");
    var twoNums = new RegExp("\\d\\s\\d", "g");
    var es = new RegExp("es", "gi");


    if (sanitize.test(message) || (!twoNums.test(message))) {
        console.log("Invalid input, failed sanitized test");
        console.log(message);
        console.log(twoNums.test(message));
        var errorMessage = 'Your text was invalid. Please text the bus stop LOCATION ID and BUS STOP #. (Example: "1234 30"). Para espanol, empeza su texto con ES. (Ejemplo: "ES 1234 30").';
        if (es.test(message)) var errorMessage = 'Su mensaje de texto no es valido. Por favor envie los numeros de su LOCATION ID y BUS STOP #. (ejemplo: "ES 1234 30")';
        sendSMS(from, errorMessage);
    } else if (es.test(message)) {
        console.log("Language is Español");

        getTimes(message, from, true);
    } else {
        console.log("Language is English");
        getTimes(message, from, false);
    }

});

app.post('/voice', function (req, res) {

    console.log("received voice call, pyaah!");
    console.log(req.body);

});


function getTimes(message, from, spanish) {

    // INSERT test if number with spaces (regex)
    var stop_id, route_id;

    console.log(message);

    var a = message.replace("es", "").replace("Es", "").replace("eS", "").replace("ES", "").trim().split(" ");


    /* 	This here ugly block of if statements figures out which of the numbers is the stop_id and route_id
		The 86 condition is unique to this dataset
	 */

    a[0] = parseInt(a[0]);
    a[1] = parseInt(a[1]);

    if (a[0] == 86) {
        console.log("if")
        stop_id = a[0];
        route_id = a[1];
    } else if (a[1] == 86) {
        console.log("else if 1")
        stop_id = a[1];
        route_id = a[0];
    } else if (a[0] < 100 && a[0] != 86) {
        console.log("else if 2")
        stop_id = a[1];
        route_id = a[0];
    } else {
        console.log("else")
        stop_id = a[0];
        route_id = a[1];
    }

    route_id = connection.escape(route_id);
    stop_id = connection.escape(stop_id);

    console.log("Stop: " + stop_id);
    console.log("Route: " + route_id);

    /* Determine if this is an actual route_id/stop_id or not */
    // 0 means invalid
    // 1 means valid
    var locCount = 3,
        routeCount = 3;

    var locQuery = "SELECT COUNT(*) as \'NumLoc\' FROM stops WHERE stop_id =" + stop_id;

    var queryLoc = connection.query(locQuery, function (err, rows, fields) {
        if (err) throw err;
        locCount = parseInt(rows[0].NumLoc);
    });

    // test if the location is valid
    queryLoc.on('end', function (err, rows, fields) {
        if (err) throw err;

        var routeQuery = "SELECT COUNT(*) as \'NumRoute\' FROM routes WHERE route_id =" + route_id;

        var queryRoute = connection.query(routeQuery, function (err, rows, fields) {
            if (err) throw err;
            routeCount = parseInt(rows[0].NumRoute);
        });

        // test if the route is valid		
        queryRoute.on('end', function () {

            if (routeCount === 0) {
                console.log("Invalid Route!!!!");
                var errorMessage = 'Sorry, we could not find that bus number in the HART system. Please try a different number.';
                if (spanish) errorMessage = 'Lo siento pero no podemos encontar ese numero de BUS NUMERO en nuestro sistema. Por favor intente un numero diferente.';
                sendSMS(from, errorMessage);
                return;
            }
            if (locCount === 0) {
                console.log("Invalid Location!!!!");
                var errorMessage = 'Sorry, we were unable to find that location id in the HART system. Please try a different number.';
                if (spanish) errorMessage = 'Lo siento pero no podemos encontar ese numero de LOCATION ID en nuestro sistema. Por favor intente un numero diferente.';
                sendSMS(from, errorMessage);
                return;
            }

            // determine the day of the week and which schedule it is operating on (regular, saturday, or sunday)
            var service_id = serviceDay();

            // determine the current time (less a few minutes, in case the bus is late)
            var d = new Date();
            d.setMinutes(d.getMinutes() - 20);
            var h = d.getHours();
            var m = d.getMinutes();
            var start = h + ":" + m + ":00";
            var end = "23:59:59";


            /* We have a good stop_id/route_id, move forward! */
            console.log
            var lequery = "SELECT * FROM (SELECT * FROM trips WHERE route_id = " + route_id + " AND service_id = '" + service_id + "') AS l STRAIGHT_JOIN (SELECT * FROM stop_times WHERE stop_id = " + stop_id + " AND arrival_time BETWEEN '" + start + "' AND '" + end + "') r  ON l.trip_id = r.trip_id ORDER BY arrival_time ASC LIMIT 3";

            console.log(lequery);

            var times = {};

            // THE SEARCH! find matching routes
            var query = connection.query(lequery, function (err, rows, fields) {
                if (err) throw err;

                // push the current row onto the times object        
                times = _.extend(times, rows);

            });

            // once we're done with THE SEARCH
            query.on('end', function () {

                // get the name of the stop    
                var stop_name = "";
                var stop_name_query = connection.query('SELECT stop_name FROM stops WHERE stop_id = ' + stop_id, function (err, rows, fields) {
                    if (err) throw err;
                    stop_name = rows[0].stop_name;

                });

                // ready to work with the data! call the event for times-found
                stop_name_query.on('end', function () {
                    emitter.emit('times-found', times, route_id, stop_id, from, stop_name, spanish);
                });
            });

        });

    });

};

function sendSMS(from, message) {
    console.log("Phone: " + from + " Message: " + message);
    phone.setup(function () {
        phone.sendSms(from, message, {}, function () {
            console.log(arguments[0]);
            console.log('------------------------------');
        })
    });
}

// ok we now have data
emitter.on('times-found', function (times, route_id, stop_id, from, stop_name, spanish) {

    var message;

    console.log(times)

    // if there are no bus times found
    if (isEmpty(times)) {
        // if the bus times are not found because it is a weekend, let the user know
        console.log("No times were found for this bus");

        var start = "00:00:00";
        var end = "24:59:59";
        var service_id = serviceDay();
        var busTodayQuery = "SELECT COUNT(*) FROM (SELECT * FROM trips WHERE route_id = " + route_id + " AND service_id = '" + service_id + "') AS l STRAIGHT_JOIN (SELECT * FROM stop_times WHERE stop_id = " + stop_id + " AND arrival_time BETWEEN '" + start + "' AND '" + end + "') r  ON l.trip_id = r.trip_id ORDER BY arrival_time ASC LIMIT 3";
        var numberOfTimesBusComesToday = 0;
        var doesTheBusEvenComeToday = connection.query(busTodayQuery, function (err, rows, fields) {
            if (err) throw err;
            // push the current row onto the times object   
            console.log(rows);
            numberOfTimesBusComesToday = parseInt(rows[0]['COUNT(*)'], 10);
        });

        doesTheBusEvenComeToday.on('end', function () {

            console.log("Today the bus comes " + numberOfTimesBusComesToday + " times.");

            if (numberOfTimesBusComesToday === 0) {
                var day = serviceDay();
                switch (day) {
                case "We":
                    message = "Sorry, this Location and Bus Route doesn't run during the week!";
                    if (spanish) message = "Lo siento pero esta lugar y ruta de autobus no corres durante la semana.";
                    break;
                case "Sa":
                    message = "Sorry, this Location and Bus Route doesn't run on Saturday!";
                    if (spanish) message = "Lo siento pero esta lugar y ruta de autobus no corres durante el Sabado.";
                    break;
                case "Su":
                    message = "Sorry, this Location and Bus Route doesn't run on Sunday!";
                    if (spanish) message = "Lo siento pero esta lugar y ruta de autobus no corres durante el Domingo.";
                    break;
                };
            }
            // otherwise, just let the user know there are no more buses (this usually happens at end of day)
            else {
                message = 'Sorry, no bus ' + route_id + ' routes could be found for stop ' + stop_id + ' at this time.';
                if (spanish) message = 'Lo siento pero no podemos encontrar rutas de autobus ' + route_id + ' en lugar ' + stop_id + ' ahora.';
            }

            sendSMS(from, message)
        });

    } else {
        // valid input; send message with time
        // You're at ______ and _______.  The next __ Bus will arrive at: ____, ____ and ____.
        message = "You're at " + stop_name + ". Bus " + route_id + " will arrive at: ";
        if (spanish) message = "Estas localado entre " + stop_name + ". El proximo autobus " + route_id + " llega a: ";

        // for each time in times, append it to the message
        var key, count = 0;
        for (key in times) {
            // remove seconds and leading 0			
            var prettyTime = (times[key].arrival_time).trim();
            var h = parseInt(prettyTime.substr(0, 2), 10);
            if (h > 12) h = h - 12;
            var prettyTime = h + prettyTime.substr(2, 3);
            message += prettyTime + " ";
        }

        sendSMS(from, message);
    }
});



function serviceDay() {

    var d = new Date();
    var day = d.getDay();

    switch (day) {
    case 6:
        return "Sa";
        break;
    case 0:
        return "Su";
        break;
    default:
        return "We"
    };

};

function isEmpty(map) {
    for (var key in map) {
        if (map.hasOwnProperty(key)) return false;
    }
    return true;
};


function sendSMS(from, message) {
    console.log("Phone: " + from + " Message: " + message);
    phone.setup(function () {
        phone.sendSms(from, message, {}, function () {
            console.log(arguments[0]);
            console.log('------------------------------');
        })
    });
};


(function () {
    Date.prototype.toTimestamp = toTimestamp;

    function toTimestamp() {
        var year, month, day;
        year = String(this.getFullYear());
        month = String(this.getMonth() + 1);
        if (month.length == 1) {
            month = "0" + month;
        }
        day = String(this.getDate());
        if (day.length == 1) {
            day = "0" + day;
        }
        return year + "-" + month + "-" + day + " " + this.getHours() + ":" + this.getMinutes() + ":" + this.getSeconds();
    }
})();

app.listen(80);

// 8134341117