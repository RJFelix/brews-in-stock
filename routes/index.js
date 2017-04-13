const router = require("express").Router();

// INDEX AND GENERAL ROUTES
// / should display landing page

router.get("/", function(req, res) {
  // display landing page
  res.render("index");
});

router.get("/login", function(req, res) {
  // display login page
  res.render("login");
});

router.post("/login", function(req, res) {
  // handle login logic
});

router.get("/register", function(req, res) {
  // display registration page
  res.render("register");
});

router.post("/register", function(req, res) {
  // handle registration logic
});

router.get("/search", function(req, res) {
  // display search results:

  // process search string

  // get results from DB

  // format results

  // send
  res.render("search");
});

module.exports = router;