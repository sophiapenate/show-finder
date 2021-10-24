var searchHistoryEl = document.querySelector("#search-history");
var searchHistoryArr = [];

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

function displaySearchHistory() {
    // reset searchHistoryEl
    searchHistoryEl.innerHTML = "";

    // pull search history from local storage
    searchHistoryArr = JSON.parse(localStorage.getItem("searchHistory"));
    // if no search history exists in local storage
    if (!searchHistoryArr) {
        // set searchHistoryArr to empty
        searchHistoryArr = [];
        // return out of function
        return false;
    }

    // loop through searchHistoryArr and create buttons for each item
    for (var i = 0; i < searchHistoryArr.length; i++) {
        // set artist and city variables
        var artist = searchHistoryArr[i].artist;
        var city = searchHistoryArr[i].city;

        // create and setup search button
        var searchBtn = document.createElement("button");
        searchBtn.textContent = "Find bands similar to " + artist + " playing in " + city;
        searchBtn.setAttribute("data-index", i);
        searchBtn.setAttribute("data-artist", artist);
        searchBtn.setAttribute("data-city", city);
        searchBtn.classList = "button";

        // append search button to DOM
        searchHistoryEl.appendChild(searchBtn);
    }

    console.log("searchHistoryEl", searchHistoryEl);
}

function saveSearch(artist, city) {
    // create object for searched terms
    var searchObj = {
        artist: artist,
        city: city
    };
    
    // push object to first item in searchHistoryArr
    searchHistoryArr.unshift(searchObj);
    
    // update searchHistory in local storage
    localStorage.setItem("searchHistory", JSON.stringify(searchHistoryArr));

    // update DOM
    displaySearchHistory();
}

function searchFormHandler() {
    var searchedArtist = "Gorillaz";
    var similarArtistsArr = [
        "Red Hot Chili Peppers",
        "Gorillaz",
        "Nirvana",
        "Foo Fighters",
        "Rage Against the Machine",
        "The White Stripes",
        "Incubus"
    ];
    var searchedCity = "London";
    getShows(similarArtistsArr, searchedCity);
    saveSearch(searchedArtist, searchedCity);
}

function searchBtnHandler(event) {
    if (event.target.matches("button")) {
        // get info from data attributes
        var index = event.target.getAttribute("data-index");
        var artist = event.target.getAttribute("data-artist");
        var city = event.target.getAttribute("data-city");

        // find similar artists

        // move clicked button to top
        searchHistoryArr.splice(index, 1);
        saveSearch(artist, city);
    }
}

displaySearchHistory();

searchFormHandler();

searchHistoryEl.addEventListener("click", searchBtnHandler);