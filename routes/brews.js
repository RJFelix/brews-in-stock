const router = require("express").Router();
const beerAdvocateApi = require("beeradvocate-api");
const Brew = require("../models/brew");

// BREWS ROUTES

router.get("/", function(req, res) {
  // some sort of index page for the beers
  Brew.find({}, function(err, allBrews) {
    if(err) {
      console.log(err);
    } else {
      res.render("brews/index", { brews: allBrews });
    }
  });
});

router.get("/new", function(req, res) {
  // form to add a new beer. not really a thing in production, but here for the sake of completeness
  res.render("brews/new");
});

router.post("/new/ba-search", function(req, res) {
  // extract beer name to search
  console.log("Received request for beer. Req.body = " + typeof req.body);
  console.log(req.body);
  const beerName = req.body.beerName;
  console.log("beerName = " + beerName);
  beerAdvocateApi.beerSearch(beerName, function(result) {
    beers = JSON.parse(result);
    if(beers.length === 0) {
      console.log("no beers returned from beeradvocate for search string: " + beerName);
      // need to send an error back to the client!
    } else {
      let result = [];
      // standard for loop so we can limit it to 10 results
      // TODO: sanitize
      for(let i = 0; i < beers.length && i < 10; i++) {
        let beerToAdd = {};
        beerToAdd.beer_name = beers[i]["beer_name"];
        beerToAdd.brewery_name = beers[i]["brewery_name"];
        beerToAdd.brewery_location = beers[i]["brewery_location"];
        beerToAdd.beer_url = beers[i]["beer_url"];
        result.push(beerToAdd);
      }
      // send the result back to the browser
      res.json(result);
    }
  });
});

router.get("/:id", function(req, res) {
  // details on a particular beer & where it is available
  // find the right brew
  Brew.findById(req.params.id).exec(function(err, foundBrew) {
    if(err) {
      console.log(err);
    } else {
      res.render("brews/show", { brew : foundBrew });
    }
  });
});

router.post("/", function(req, res) {
  // add a brew to the DB. not really a thing in production, but here for the sake of completeness
  // assemble a Brew object
  const newBrew = {
    name: req.body.name,
    brewery: req.body.brewery,
    breweryLocation: req.body.breweryLocation,
    beerAdvocateURL: req.body.beerAdvocateURL,
    image: req.body.image,
    description: req.body.description
  };
  Brew.create(newBrew, function(err, newlyCreated) {
    if(err) {
      console.log(err); 
    } else {
      res.redirect("/brews");
    }
  })
});

router.get("/:id/edit", function(req, res) {
  // edit a brew. not really a thing in production, but here for the sake of completeness
  // find brew, populate and render page
  Brew.findById(req.params.id, function(err, foundBrew) {
    if(err) {
      console.log(err);
      res.redirect("back");
    } else {
      res.render("brews/edit", { brew: foundBrew });
    }
  })
});

router.put("/:id", function(req, res) {
  // put changes to a brew. not really a thing in production, but here for the sake of completeness
  // assemble updated brew
  const updatedBrew = {
    name: req.body.name,
    image: req.body.image,
    brewery: req.body.brewery,
    breweryLocation: req.body.breweryLocation,
    beerAdvocateURL: req.body.beerAdvocateURL,
    description: req.body.description
  }
  Brew.findByIdAndUpdate(req.params.id, updatedBrew, function(err, brew) {
    if(err) {
      console.log(err);
      res.redirect("back");
    } else {
      res.redirect("/brews/" + req.params.id);
    }
  });
});

router.delete("/:id", function(req, res) {
  // delete a beer from the DB. definitely not a thing in production, but here for the sake of completeness
  Brew.findByIdAndRemove(req.params.id, function(err) {
    if(err) {
      console.log(err);
      res.redirect("/brews");
    } else {
      res.redirect("/brews");
    }
  });
});

module.exports = router;