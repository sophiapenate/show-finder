var getShows = function(artistID) {
    var apiURL = "https://app.ticketmaster.com/discovery/v2/events.json?attractionId=" + artistID + "&size=1&apikey=8nw8dGeQMSK25Lgn95Z3tuN9wAFfccB3";
    fetch(apiURL).then(function(response) {
        return response.json();
    })
    .then(function(data) {
        console.log(data._embedded.events);
    })
    .catch(function(err) {
        console.error(err);
    })
}

var getArtistID = function(searchedTerm) {
    var apiURL = "https://app.ticketmaster.com/discovery/v2/attractions.json?keyword=" + searchedTerm + "&apikey=8nw8dGeQMSK25Lgn95Z3tuN9wAFfccB3";
    fetch(apiURL).then(function(response) {
        return response.json();
    })
    .then(function(data) {
        console.log(data);
        var artistID = data._embedded.attractions[0].id;
        getShows(artistID);
    })
    .catch(function(err) {
        console.error(err);
    })
}

function getSimilarArtists(searchedTerm) {
	var cors_preface = 'https://uofa21cors.herokuapp.com/';
	var apiURL = "https://tastedive.com/api/similar?q=" + searchedTerm + "&k=425855-ShowFind-GMZOGDQD"
	fetch(cors_preface + apiURL)
	.then(function(response) {
		return response.json();
	})
	.then(function(data) {
		console.log(data);
        var similarArtistsArr = [];
        // write loop to push artist names into similarArtistsArr
	})
	.catch(function(err) {
		console.error(err);
	});
}

var searchedTerm = "Red Hot Chili Peppers";

getArtistID(searchedTerm)

getSimilarArtists(searchedTerm);