function displayShow(showObj) {
    console.log(showObj);
    //for (var i = 0; i < showsArr.length; i++) {
        // create concertInfoEl
        var concertInfoEl = document.createElement("div");

        // append artist to concertInfoEl
        var artistEl = document.createElement("p");
        artistEl.classList = "artist";
        artistEl.textContent = showObj.name;
        concertInfoEl.appendChild(artistEl);

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

        // append concertInfoEl to DOM
        console.log(concertInfoEl);
   // }
}

function getShows(similarArtistsArr, searchedCity) {
    // setup fetch function to pull data from Ticketmaster API
    function fetchShows(artist, city) {
        var cors_preface = 'https://uofa21cors.herokuapp.com/';
        var apiURL = "https://app.ticketmaster.com/discovery/v2/events.json?keyword=" + artist + "&city=" + city + "&size=1&apikey=8nw8dGeQMSK25Lgn95Z3tuN9wAFfccB3";
        fetch(cors_preface + apiURL)
            .then(function (response) {
                response.json()
                    .then(function (data) {
                        if (data._embedded) {
                            var fetchedEvents = data._embedded.events;
                            for (var i = 0; i < fetchedEvents.length; i++) {
                                // create object for each show
                                var showObj = {};
                                    showObj.name = fetchedEvents[i].name;
                                    showObj.startDate = fetchedEvents[i].dates.start.localDate;
                                    // set endDate only if it exists
                                    if (fetchedEvents[i].dates.end) {
                                        showObj.endDate = fetchedEvents[i].dates.end.localDate;
                                    }
                                    showObj.city = fetchedEvents[i]._embedded.venues[0].city.name,
                                    showObj.venue = fetchedEvents[i]._embedded.venues[0].name,
                                    showObj.getTixURL = fetchedEvents[i].url;
                                // display object to DOM
                                displayShow(showObj);
                            }
                        } else {
                            console.log("No shows found.");
                        }
                    })
            })
            .catch(function (err) {
                console.log(err);
            })
    }

    // loop through each artist in similarArtistsArr and fetch shows for each
    for (var i = 0; i < similarArtistsArr.length; i++) {
        fetchShows(similarArtistsArr[i], searchedCity);
    }
}

function getSimilarArtists(searchedTerm) {
    var cors_preface = 'https://uofa21cors.herokuapp.com/';
    var apiURL = "https://tastedive.com/api/similar?q=" + searchedTerm + "&k=425855-ShowFind-GMZOGDQD"
    fetch(cors_preface + apiURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            var similarArtistsArr = [];
            // write loop to push artist names into similarArtistsArr
        })
        .catch(function (err) {
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
    ];
    var searchedLocation = "Boston";
    getShows(similarArtistsArr, searchedLocation);
}

searchFormHandler();