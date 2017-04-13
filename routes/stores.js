const router = require("express").Router();
const Store = require("../models/store");
const googleMapsClient = require("@google/maps").createClient({
  key: "AIzaSyA0usHoAlvqzQ3iDaJaj7riuHSacx4UXk0"
});

// STORES ROUTES

router.get("/", function(req, res) {
  // some sort of index page for stores

  // need user location (geolocation or manual input)

  // search DB for stores near location

  // working version - just display all the stores
  Store.find({}, function(err, allStores) {
    if(err) {
      console.log(err);
    } else {
      res.render("stores/index", { stores: allStores });
    }
  });
});

router.get("/new", function(req, res) {
  // form to add a new store. should only hit on initial vendor signup
  res.render("stores/new");
});

router.post("/", function(req, res) {
  // add a store to the db. should only be hit from the above route.
  let newStore = {
    name: req.body.name,
    image: req.body.image,
    description: req.body.description,
    address: req.body.address,
    location: {
      coordinates: [0, 0]
    }
  }
  // convert address to coordinates
  // TODO: change this to use Places API, store and use Place ID alongside coordinates
  const geocodeResult = googleMapsClient.geocode({
    address: newStore.address
  }, function(err, response) {
    if(err) {
      console.log(err);
    } else {
      // TIL that response.json does not contain JSON - it contains the result object!
      // tsk tsk google
      const location = response.json.results[0].geometry.location;
      newStore.location.coordinates[0] = location.lng;
      newStore.location.coordinates[1] = location.lat;
      Store.create(newStore, function(err, newlyCreated) {
        if(err) {
          console.log(err);
        } else {
          res.redirect("/stores");
        }
      });
    }
  });
});

router.get("/:id", function(req, res) {
  // show a particular store
  Store.findById(req.params.id).exec(function(err, foundStore) {
    if(err) {
      console.log(err);
    } else {
      res.render("stores/show", { store: foundStore });
    }
  })
});

router.get("/:id/edit", function(req, res) {
  // form to edit store details. includes editing beers in stock. should only be accessible to logged in vendors
  Store.findById(req.params.id).exec(function(err, foundStore) {
    if(err) {
      console.log(err);
    } else {
      res.render("stores/edit", { store: foundStore });
    }
  })
});

router.put("/:id", function(req, res) {
  // update store details from edit form. should only hit for logged in vendors
  let updatedStore = {
    name: req.body.name,
    description: req.body.description,
    image: req.body.image,
    address: req.body.address
  }
  // save ourselves a Google API call
  Store.findById(req.params.id)
       .select("address")
       .exec(function(err, foundStore) {
         if(foundStore.address === updatedStore.address) {
           console.log("updating without fetching new location");
           Store.findByIdAndUpdate(req.params.id, updatedStore, function(err) {
             if(err) {
               console.log(err);
             }
             res.redirect("/stores/" + req.params.id);
           });
         } else {
           // address changed, must update location
           googleMapsClient.geocode({
             address: updatedStore.address
           }, function(err, response) {
             console.log("updating with new location");
             if(err) {
               console.log(err);
               // TODO: flag and try to update later
               //       if address is malformed, message store owner
             } else {
               const location = response.json.results[0].geometry.location;
               updatedStore.location.coordinates[0] = location.lng;
               updatedStore.location.coordinates[1] = location.lat;
               Store.findByIdAndUpdate(req.params.id, updatedStore, function(err) {
                 if(err) {
                   console.log(err);
                 }
                 res.redirect("/stores/" + req.params.id);
               });
             }
           });
         }
      })
});

router.delete("/:id", function(req, res) {
  // delete a store. needs multiple big red warning buttons... and opportunities to get help for whatever is making you quit. only valid if you are the vendor. 
  Store.findByIdAndRemove(req.params.id, function(err) {
    res.redirect("/stores");
  })
});

module.exports = router;