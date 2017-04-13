const router = require("express").Router();

// COMMENT ROUTES
// comment on stores

router.get("/new", function(req, res) {
  // display form to add new comment to a store
});

router.post("/", function(req, res) {
  // add comment to the DB
  // display store page
});

router.get("/:comment_id/edit", function(req, res) {
  // display form to edit a comment
});

router.put("/:comment_id", function(req, res) {
  // edit the comment
  // display store page
});

router.delete("/:comment_id", function(req, res) {
  // delete the comment
  // display store page
});

module.exports = router;