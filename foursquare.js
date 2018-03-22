// My Foursquare API Key. Get your own at: http://developer.foursquare.com
var fourquareConfig = {
	'secrets' : {
		'clientId' : 'APP_CLIENT_ID',
		'clientSecret' : 'APP_CLIENT_SECRET',
		'redirectUrl' : 'REDIRECT_URL'
	}
};

// Require the Node module node-foursquare and populate it with my information. `npm install node-foursquare` to get started here.
var foursquare = require('node-foursquare')(fourquareConfig);

// Nextup, since this app is only for me, I load in my personal access token. (To get this you need to go through Foursquare's OAuth Flow.)
var foursquareAccessToken = 'MY_FOURSQUARE_ACCESS_TOKEN';

// The main page is where all this data is displayed, so we'll grab Foursquare data when someone GETs /
app.get('/', function (req, res) {
	// Here we load my most recent checkin (to figure out where I am)
	foursquare.Users.getCheckins("self", { 'limit' : 1 }, foursquareAccessToken, function (err, checkins) {
		if(err) throw new Error(err);

		// Grab the location information of my most recent Foursquare checkin
		var location = checkins.checkins.items[0].venue.location;

		// Determine what we're asking Foursquare for.
		var attributes = {
			// Since it's my 21st, we're going to go ahead and look for a bar. You could change this to a restaurant, hotel, tattoo parlor, or anything else you can think of.
			'query': 'bar',
			// I decided to limit my search to five places, so folks didn't have too much to choose from, but you can make this whatever you like.
			'limit' : 5
		};

		// Get a list of venues from Foursquare, based upon my most recent checkin's location and the attributes set above.
		foursquare.Venues.explore(location.lat, location.lng, attributes, foursquareAccessToken, function (err, venues){

			// Extract the list of venues from all the data Foursquare returns.
			var venueList = venues.groups[0].items;

			// Since we're going to be voting on these, I need to give them some nice visual identifiers, I chose letters A-E.
			for (var i = 0; i < venueList.length; i++) {
				venueList[i].visualId = "ABCDE"[i];
			};

			// Prepare the information for rendering.
			var templateInformation = {
				'venues' : venueList
			};

			// Render!
			res.render('index', templateInformation);
		});
	});
});
