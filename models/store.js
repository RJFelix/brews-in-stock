const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String,
  address: String,
  location: {
    coordinates: [Number, Number]
  },
  owner: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    username: String
  },
  beers: [{
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brew"
    },
    name: String
  }],
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
    }
  ]
});

module.exports = mongoose.model("Store", storeSchema);