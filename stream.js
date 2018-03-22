

const express = require('express')
const app = express()
const path = require("path");
var fs = require('fs');



app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

var adsb = require('./lib/adsb.js');
var sbs1 = require('sbs1');
var net = require('net');

// Config
var host = '192.168.178.30';
var port = 30003;

// Connect to our datasource and start processing incoming data
var client = net.connect({host: host, port: port}, function(){
	console.log('client connected');
});

// client.on('data', function(data){
// 	// Sometimes we get multiple packets here -- need to split them
// 	var packets = data.toString().trim().split("\n");
// 	for (var i in packets){
// 		adsb.decodePacket(packets[i]);
// 	}
// });

client.on('end', function(){
	console.log('client disconnected');

	// All done, output stats
	var stats = adsb.getStats();
	console.log('------------');
	console.log('Total packets: '+stats.packets);
	console.log('Invalid packets: '+stats.invalid_packets);
	console.log('CRC Errors: '+stats.crc_errors);
});

client.on('error', function(){
	console.log('connection error');
});


app.get('/', function (req, res) {

	const stream = fs.createWriteStream('./big.file');


  const packeger = client.on('data', function(data){
  	// Sometimes we get multiple packets here -- need to split them
  	var packets = data.toString().trim().split("\n");
  	for (var i in packets){
  		adsb.decodePacket(packets[i]);
  	}
  });

	// const decoder = packeger.on('data', function(data) {
	// 	var msg = sbs1.parseSbs1Message(data);
	// 	if (msg.message_type === sbs1.MessageType.TRANSMISSION &&
	// 	    msg.transmission_type === sbs1.TransmissionType.ES_AIRBORNE_POS) {
	// 				return msg
	// 	}
	// });

	// const decoder = packeger.on('data', function(data){
	// 	var packets = data.toString().trim().split("\n");
	// 	for (var i in packets){
	// 	adsb.decodePacket(packets[i]);
	// 	console.log(packets)
	// 	}
	// });

  packeger.pipe(stream);

      //   res.render('index',
      //     {
      //       heading: 'Welcome',
      //       welcome: packets
      //     });
      //
      // });


});


app.listen(4200, () => console.log('Example app listening on port 4200!'))
