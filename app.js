const express = require("express");
const app = express();
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const http = require("http");
const mongoose = require("mongoose");

// setup general Express stuff
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set("view engine", "ejs");

// setup mongoose
const dbURL = process.env.DATABASEURL || "mongodb://localhost/beers-in-stock";
mongoose.connect(dbURL);


const indexRoutes = require("./routes/index");
const brewRoutes = require("./routes/brews");
const storeRoutes = require("./routes/stores");
const commentRoutes = require("./routes/comments");

// bring in routes
app.use("/", indexRoutes);
app.use("/brews", brewRoutes);
app.use("/stores", storeRoutes);
app.use("/stores/:id/comments", commentRoutes);

const server = http.createServer(app);
server.listen(3001, "localhost");
server.on("listening", function() {
  console.log("Beers-in-stock-dev server listening.");
})