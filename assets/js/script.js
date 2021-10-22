function getShows(searchedArtist, searchedCity) {
    var apiURL = "https://app.ticketmaster.com/discovery/v2/events.json?keyword=" + searchedArtist + "&city=" + searchedCity +"&size=1&apikey=8nw8dGeQMSK25Lgn95Z3tuN9wAFfccB3";
    fetch(apiURL).then(function(response) {
        return response.json();
    })
    .then(function(data) {
        if (data._embedded) {
            console.log(data._embedded);
        } else {
            console.log("No shows found.");
        }
    })
    .catch(function(err) {
        console.error("ERROR: " + err);
    })
}

function getArtistID(searchedArtist) {
    var apiURL = "https://app.ticketmaster.com/discovery/v2/attractions.json?keyword=" + searchedArtist + "&apikey=8nw8dGeQMSK25Lgn95Z3tuN9wAFfccB3";
    fetch(apiURL).then(function(response) {
        return response.json();
    })
    .then(function(data) {
        var artistID = data._embedded.attractions[0].id;
        console.log(artistID);
        return artistID;
    // set timeout to avoid quota policy violation
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

function searchFormHandler() {
    var searchedArtist = "Red Hot Chili Peppers";
    var similarArtistsArr = [
        "Red Hot Chili Peppers",
        "Gorillaz",
        "Nirvana",
        "Foo Fighters",
        "Rage Against the Machine",
        "The White Stripes",
        "Incubus"
    ]
    var searchedLocation = "London";
    
    for (var i = 0; i < similarArtistsArr.length; i++) {
        // set timeout to avoid 5 requests per second quota policy violation
        setTimeout(function() {
            getShows(similarArtistsArr[i], searchedLocation);
        }, 200);
    }
}

searchFormHandler();