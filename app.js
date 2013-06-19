var  express = require('express')
    , app = express()
    , server = require('http').createServer(app)
    , twilio = require('twilio');

// Load twilio properties
var TWILIO_SID = process.env.TWILIO_SID,
	TWILIO_AUTHTOKEN = process.env.TWILIO_AUTHTOKEN;

// Create twilio client
var twilioClient = twilio(TWILIO_SID, TWILIO_AUTHTOKEN);


// Start server
var port = process.env.PORT || 5001;
server.listen(port);
console.log("server listening on port " + port);


// Configure express
app.use(express.bodyParser());
app.use("/", express.static(__dirname + '/public'));


// Configure routes
app.get('/twilio/account', function(request, response) {
	twilioClient.accounts(TWILIO_SID).get(function(err, account) {
    	if(err) {
    		response.send({});
    	} else {
    		response.send({
    			friendlyName: account.friendly_name,
    			created: account.date_created,
    			sid: account.sid,
    			status: account.status
    		});
    	}
	});
});

app.get('/ch2', function(req, res) {
    
    var resp = new twilio.TwimlResponse();

    twilioClient.makeCall({
        to: '18013807870',
        from: '18012079719',
        url: 'http://powerful-beach-5064.herokuapp.com/twiml'
    }, function(err, response) {
        console.log(err);
        console.log(response);
    });

    res.end('success');
});

app.get('/ch3', function(req, res) {
    
    twilioClient.makeCall({
        to: '18018897433',
        from: '18012079719',
        url: 'http://powerful-beach-5064.herokuapp.com/five'
    }, function(err, response) {
        // console.log(err);
        console.log(response);
    });
});

// record
app.post('/five', function(req, res) {
    var resp = new twilio.TwimlResponse();

    resp.gather({
            action: "http://powerful-beach-5064.herokuapp.com/blah",
            numDigits: 5
        }, function(err, response) {
            this.say('Please Enter 5 numbers');
            // console.log(err);
            // console.log(response);
        });

    res.set('Content-Type', 'text/xml');
    res.send(resp.toString());
    res.end();
});

app.post('/blah', function(req, res) {
    
    var sNums = req.body.Digits.split('');
    var sum = 0;
    sNums.forEach(function(n){
        sum += parseInt(n, 10);
    });


    twilioClient.sms.messages.post({
        to: '18016236842',
        from: '18012079719',
        body: sum
    }, function(err, text) {
        console.log(text);
    });

    response.end('success');

    console.log(req);
    console.log(res);
});

app.post('/voice', function(req, res){
    console.log("SOMEONE IS CALLING");
});

app.get('/sms/send', function(request, response){
	var to = request.params.to;
	var msg = request.body;

	// START HERE
    
    twilioClient.sms.messages.post({
        to: '18016236842',
        from: '18012079719',
        body: 'callme'
    }, function(err, text) {
        console.log(text);
    });

	response.end('success');
});

app.post('/twiml', function(req, res) {
    var resp = new twilio.TwimlResponse();
    resp.play('http://twilio.coderighteo.us/cmm.mp3');
    res.set('Content-Type', 'text/xml');
    res.send(resp.toString());
    res.end();
});

app.post('/sms/received', function(req, res) {
    // var msg = request.body;

    console.log(res);
});


