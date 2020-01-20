var express = require("express");
var exphbs = require("express-handlebars");
var app = express();
var dbArticle = require("./models/Article");
var dbSaved = require("./models/Saved");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var PORT = process.env.PORT || 3000;
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI);
app.use(express.static("public"));
app.use(bodyParser.json());
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
require("./routes/nprRoutes")(app);
// Root route for displaying all articles in the article collection and display them using handlebars. 
app.get("/", function (req, res) {
    dbArticle.find().then(function (dbArticles) {
        res.render('index', { article: dbArticles });
    });
});
// GET route for dispalying all saved articles in the saved collection using handlebars. 
app.get("/savedArticle", function (req, res) {
    dbSaved.find().then(function (saved) {
        res.render('index', { Saved: saved });
    });
});
app.listen(PORT, function () {
    console.log("App running on port 3000!");
});
