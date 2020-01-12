var express = require("express");
var mongojs = require("mongojs");
var exphbs = require("express-handlebars");
var app = express();

// Set up a static folder (public) for our web app
app.use(express.static("public"));
var databaseUrl = "nprdb";
var collections = ["npr"];

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
// Use mongojs to hook the database to the db variable
var db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
    console.log("Database Error:", error);
  });
  
  // Routes
  // 1. At the root path, send a simple hello world message to the browser
  app.get("/", function(req, res) {
    res.render('index', { current: 'NPR' });
  });
  app.listen(3000, function() {
    console.log("App running on port 3000!");
  });
  