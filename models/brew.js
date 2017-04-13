const mongoose = require("mongoose");

const brewSchema = new mongoose.Schema({
  name: String,
  brewery: String,
  breweryLocation: String,
  beerAdvocateURL: String,
  image: String,
  description: String,
});

module.exports = mongoose.model("Brew", brewSchema);