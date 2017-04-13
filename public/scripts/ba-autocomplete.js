(function() { 
const acInput = document.querySelector("#beerSearch");
const acResult = document.querySelector("#autocompleteResult");
const submissionForm = {
  beer_name: document.querySelector("#submitBeerName"),
  brewery_name: document.querySelector("#submitBreweryName"),
  brewery_location: document.querySelector("#submitBreweryLocation"),
  beer_url: document.querySelector("#submitBeerURL")
};

let queryInProgress = false;
acInput.addEventListener("keyup", function(e) {
  if(queryInProgress) {
    return;
  }
  // block further queries until this one resolves
  // (we only want one query out at a time)
  queryInProgress = true;
  // wait a little bit to do the query (for user experience and so we don't DDoS BeerAdvocate)
  setTimeout(doAutocomplete, 500);
});

function doAutocomplete() {
  // grab the Promise-wrapped list of beers
  query = getBeers(acInput.value);
  // once it's ready, populate the list on the page
  query.then(function(beers) {
    // TODO: make this into more of a component; store beer info to use to display an individual beer
    let displayedBeers = [];
    // clear results panel and add item for each found beer
    acResult.innerHTML = "";
    beers.forEach(function(beer) {
      displayedBeers.push({ beer_name: beer.beer_name,
                            brewery_name: beer.brewery_name,
                            brewery_location: beer.brewery_location,
                            beer_url: beer.beer_url });
      let newBeer = "<li class=\"resultBeer\" data-beerurl=" + beer.beer_url + ">";
      newBeer += "<strong>" + beer.beer_name + "</strong> - ";
      newBeer += beer.brewery_name + ", " + beer.brewery_location + " - ";
      newBeer += "<a href=\"https://www.beeradvocate.com" + beer.beer_url + "\">BeerAdvocate profile";
      newBeer += "</li>";
      acResult.innerHTML += newBeer;
    });
    // add a click listener to populate form on click
    document.querySelectorAll("#autocompleteResult li").forEach(function(el, idx) {
      el.addEventListener("click", function(e) {
        submissionForm.beer_name.value = displayedBeers[idx].beer_name;
        submissionForm.beer_url.value = "https://www.beeradvocate.com" + displayedBeers[idx].beer_url;
        submissionForm.brewery_location.value = displayedBeers[idx].brewery_location;
        submissionForm.brewery_name.value = displayedBeers[idx].brewery_name;
      });
    });
  });
  // unblock queries since this one is done
  queryInProgress = false;
}

function getBeers(text) {
  const headers = new Headers({
    "Content-Type": "application/x-www-form-urlencoded"
  });
  var result = fetch("http://localhost:3001/brews/new/ba-search", {
    method: "POST",
    headers: headers,
    body: "beerName=" + text
  }).then(function(response) {
      return response.json();
  }).then(function(data) {
      return data;
  });
  return result;
}
})();