var searchFormEl = document.querySelector("#search-form");
var bandInputEl = document.querySelector("#band-input");
var cityInputEl = document.querySelector("#city-input");
var showListEl = document.querySelector("#show-list");
var searchHistoryEl = document.querySelector("#search-history");
var searchHistoryArr = [];
var statusEl = document.createElement("div");

function displayShow(showObj) {
    // hide status
    statusEl.remove();

    // create showWrapEl
    var showWrapEl = document.createElement("div");
    showWrapEl.classList = "primary callout grid-x";

    // create showInfoEl and append to showWrapEl
    var showInfoEl = document.createElement("div");
    showInfoEl.classList = "large-10 medium-10 small-12 cell";
    showWrapEl.appendChild(showInfoEl);

        // append artist to showInfoEl
        var artistEl = document.createElement("h5");
        artistEl.classList = "artist";
        artistEl.textContent = showObj.artistName;
        showInfoEl.appendChild(artistEl);

        // append event name to showInfoEl
        var eventNameEl = document.createElement("p");
        eventNameEl.classList = "event-name";
        eventNameEl.textContent = showObj.eventName;
        showInfoEl.appendChild(eventNameEl);

        // append date to showInfoEl
        var dateEl = document.createElement("p");
        dateEl.classList = "date";
        // check if multi-day event
        if (showObj.endDate) {
            dateEl.textContent = showObj.startDate + " - " + showObj.endDate;
        } else {
            dateEl.textContent = showObj.startDate;
        }
        showInfoEl.appendChild(dateEl);

        // append venue and city to showInfoEl
        var venueEl = document.createElement("p");
        venueEl.classList = "venue";
        venueEl.textContent = showObj.venue + ", " + showObj.city;
        showInfoEl.appendChild(venueEl);
    
    // create showTixEl and append to showWrapEl
    var showTixEl = document.createElement("div");
    showTixEl.classList = "large-2 medium-2 small-12 cell";
    showWrapEl.appendChild(showTixEl);

        // append get tix button to showInfoEl
        var getTixBtn = document.createElement("a");
        getTixBtn.classList = "get-tix-btn button";
        getTixBtn.textContent = "Get Tickets";
        getTixBtn.setAttribute("href", showObj.getTixURL);
        getTixBtn.setAttribute("target", "_blank");
        showTixEl.appendChild(getTixBtn);

    // append showInfoEl to DOM
    showListEl.appendChild(showWrapEl);
}

function displayStatus(message, status) {
    statusEl.classList = status + " callout grid-x";
    statusEl.textContent = message;
    showListEl.appendChild(statusEl);
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
                                showObj.artistName = artistName.trim();
                                showObj.eventName = fetchedEvents[i].name.trim();
                                showObj.startDate = moment(fetchedEvents[i].dates.start.localDate).format("ddd, MMM D, YYYY");
                                // set endDate only if it exists
                                if (fetchedEvents[i].dates.end) {
                                    showObj.endDate = moment(fetchedEvents[i].dates.end.localDate).format("ddd, MMM D, YYYY");
                                }
                                showObj.city = fetchedEvents[i]._embedded.venues[0].city.name.trim(),
                                showObj.venue = fetchedEvents[i]._embedded.venues[0].name.trim(),
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
                        displayStatus("Searching...", "primary");
                        fetchEventData();
                    } else if (showsFound === 0) {
                        displayStatus("No shows found. Try a searching a different band or city.", "warning");
                    } else {
                        // hide status
                        statusEl.remove();
                    }
                })
                .catch(function (err) {
                    console.log(err);
                })
        }, 200);
    }

    // call initial fetch
    fetchEventData();
}

function getSimilarArtists(searchedArtist, searchedCity) {
    // clear show list
    showListEl.innerHTML = "";
    // display status to user
    displayStatus("Searching...", "primary");

	var cors_preface = 'https://uofa21cors.herokuapp.com/';
	var apiURL = "https://tastedive.com/api/similar?q=" + searchedArtist + "&k=425855-ShowFind-GMZOGDQD"
	fetch(cors_preface + apiURL)
	.then(function(response) {
		return response.json();
	})
	.then(function(data) {
        var similarArtistsArr = [];
        for (let i = 0; i < data.Similar.Results.length; i++) {
            similarArtistsArr.push(data.Similar.Results[i].Name);
        }

        // check if similar artists found
        if (similarArtistsArr.length === 0) {
            displayStatus("Sorry, nothing found. Try searching for a different artist.", "warning");
            return;
        }

        // get shows
        getShows(similarArtistsArr, searchedCity);
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
}

function saveSearch(artist, city) {
    // create object for searched terms
    var searchObj = {
        artist: artist,
        city: city
    };
    
    // push object to first item in searchHistoryArr
    searchHistoryArr.unshift(searchObj);

    // trim array so it holds a max of 5 items
    searchHistoryArr.splice(5);
    
    // update searchHistory in local storage
    localStorage.setItem("searchHistory", JSON.stringify(searchHistoryArr));

    // update DOM
    displaySearchHistory();
}

function searchFormHandler(event) {
    event.preventDefault();

    // get user inputs
    var searchedArtist = bandInputEl.value.trim();
    var searchedCity = cityInputEl.value.trim();

    getSimilarArtists(searchedArtist, searchedCity);
    saveSearch(searchedArtist, searchedCity);
}

function searchBtnHandler(event) {
    if (event.target.matches("button")) {
        // clear form
        bandInputEl.value = "";
        cityInputEl.value = "";

        // get info from data attributes
        var index = event.target.getAttribute("data-index");
        var artist = event.target.getAttribute("data-artist");
        var city = event.target.getAttribute("data-city");

        // find similar artists
        getSimilarArtists(artist, city);

        // move clicked button to top
        searchHistoryArr.splice(index, 1);
        saveSearch(artist, city);
    }
}

displaySearchHistory();

searchFormEl.addEventListener("submit", searchFormHandler);

searchHistoryEl.addEventListener("click", searchBtnHandler);