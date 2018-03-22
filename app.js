// Connect to a server at localhost:30003 that is sending messages in SBS1
// format.  You can pass an options object containing host and port to
// createClient to connect to a different server/port.

const express = require('express')
const app = express()
const path = require("path");
var fs = require('fs');



app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
var sbs1 = require('sbs1');
var adsb = require('./lib/adsb.js');
var bW = require('./lib/birdWatcher.js');



var options = {
    host: "192.168.178.30",
    port: "30003"
  }

var client = sbs1.createClient(options);



app.get('/', function (req, res) {

const stream = fs.createWriteStream('./big.file');


const packeger = client.on('message', function(msg) {
    if (msg.message_type === sbs1.MessageType.TRANSMISSION &&
        msg.transmission_type === sbs1.TransmissionType.ES_AIRBORNE_POS) {
          console.log(msg)
          // for (var i in msg){
          //     bW.saveToStream(msg[i]);
          //   }
    }
  });

packeger.pipe(stream);


  // packeger.pipe(res);

      // console.log(res.packets);

      // res.render('index',
      //   {
      //     heading: 'Welcome',
      //     welcome: 'yeah'
      //   });

    });



app.listen(4200, () => console.log('Example app listening on port 4200!'))
