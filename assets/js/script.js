function displayShow(showObj) {
    // create concertInfoEl
    var concertInfoEl = document.createElement("div");

    // append artist to concertInfoEl
    var artistEl = document.createElement("p");
    artistEl.classList = "artist";
    artistEl.textContent = showObj.artistName;
    concertInfoEl.appendChild(artistEl);

    // append event name to concertInfoEl
    var eventNameEl = document.createElement("p");
    eventNameEl.classList = "event-name";
    eventNameEl.textContent = showObj.eventName;
    concertInfoEl.appendChild(eventNameEl);

    // append date to concertInfoEl
    var dateEl = document.createElement("p");
    dateEl.classList = "date";
    // check if multi-day event
    if (showObj.endDate) {
        dateEl.textContent = showObj.startDate + " - " + showObj.endDate;
    } else {
        dateEl.textContent = showObj.startDate;
    }
    concertInfoEl.appendChild(dateEl);

    // append city to concertInfoEl
    var cityEl = document.createElement("p");
    cityEl.classList = "city";
    cityEl.textContent = showObj.city;
    concertInfoEl.appendChild(cityEl);

    // append venue to concertInfoEl
    var venueEl = document.createElement("p");
    venueEl.classList = "venue";
    venueEl.textContent = showObj.venue;
    concertInfoEl.appendChild(venueEl);

    // append get tix button to concertInfoEl
    var getTixBtn = document.createElement("a");
    getTixBtn.classList = "get-tix-btn";
    getTixBtn.textContent = "Get Tickets";
    getTixBtn.setAttribute("href", showObj.getTixURL);
    concertInfoEl.appendChild(getTixBtn);

    // append concertInfoEl to DOM
    console.log(concertInfoEl);
}

function getShows(similarArtistsArr, searchedCity) {
    // set counters
    i = 0;
    showsFound = 0;

    // setup function to fetch event data
    function fetchEventData() {
        // set timeout to avoid quota limit violation
        setTimeout(function() {
            var artistName = similarArtistsArr[i];
            var cors_preface = 'https://uofa21cors.herokuapp.com/';
            var apiURL = "https://app.ticketmaster.com/discovery/v2/events.json?keyword=" + artistName + "&city=" + searchedCity + "&size=1&apikey=8nw8dGeQMSK25Lgn95Z3tuN9wAFfccB3";
            //var apiURL = "https://app.ticketmaster.com/discovery/v2/events.json?keyword=" + artistName + "&city=" + searchedCity + "&size=1";
            fetch(cors_preface + apiURL)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    if (data._embedded) {
                        var fetchedEvents = data._embedded.events;
                        for (var i = 0; i < fetchedEvents.length; i++) {
                            // update showsFound counter
                            showsFound++;

                            // create object for each show
                            var showObj = {};
                                showObj.artistName = artistName;
                                showObj.eventName = fetchedEvents[i].name;
                                showObj.startDate = moment(fetchedEvents[i].dates.start.localDate).format("ddd, MMM D, YYYY");
                                // set endDate only if it exists
                                if (fetchedEvents[i].dates.end) {
                                    showObj.endDate = moment(fetchedEvents[i].dates.end.localDate).format("ddd, MMM D, YYYY");
                                }
                                showObj.city = fetchedEvents[i]._embedded.venues[0].city.name,
                                showObj.venue = fetchedEvents[i]._embedded.venues[0].name,
                                showObj.getTixURL = fetchedEvents[i].url;
                            // display object to DOM
                            displayShow(showObj);
                        }
                    }
                })
                .then(function() {
                    // increase counter
                    i++;
                    // check if there are more artists to search
                    if (i < similarArtistsArr.length) {
                        fetchEventData();
                    } else if (showsFound === 0) {
                        console.log("No shows found.");
                    }
                })
                .catch(function (err) {
                    console.log("Whoops. Something went wrong.", err);
                })
        }, 200);
    }

    // call initial fetch
    fetchEventData();
}

function getSimilarArtists(searchedTerm) {
	var cors_preface = 'https://uofa21cors.herokuapp.com/';
	var apiURL = "https://tastedive.com/api/similar?q=" + searchedTerm + "&k=425855-ShowFind-GMZOGDQD"
	fetch(cors_preface + apiURL)
	.then(function(response) {
		return response.json();
	})
	.then(function(data) {
        var similarArtistsArr = [];
        for (let i = 0; i < data.Similar.Results.length; i++) {
            similarArtistsArr.push(data.Similar.Results[i].Name);
        }
	})
	.catch(function(err) {
		console.error(err);
	});
}

function saveSearch(artist, city) {
    console.log (artist, city)
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
    ];
    var searchedCity = "Boston";
    getShows(similarArtistsArr, searchedCity);
    saveSearch(searchedArtist, searchedCity);
}

searchFormHandler();