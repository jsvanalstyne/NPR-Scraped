var express = require("express");
var mongojs = require("mongojs");
var exphbs = require("express-handlebars");
var app = express();
var dbArticle = require("./models/Article");
var dbSaved = require("./models/Saved");
var mongoose = require("mongoose");
// Set up a static folder (public) for our web app
app.use(express.static("public"));
var databaseUrl = "nprdb";
var collections = ["npr"];

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
// Use mongojs to hook the database to the db variable
// var db = mongojs(databaseUrl, collections);
// db.on("error", function (error) {
//     console.log("Database Error:", error);
// });
mongoose.connect("mongodb://localhost/nprdb");
require("./routes/nprRoutes")(app);

app.get("/", function (req, res) {
    dbArticle.find().then(function (dbArticles) {
        res.render('index', { article: dbArticles });
    });

});
app.get("/saved", function (req, res) {
    dbSaved.find().then(function (saved) {
        res.render('index', { savedArticle: saved });
    });
});


app.listen(3000, function () {
    console.log("App running on port 3000!");
});
