var express = require("express");
var mongojs = require("mongojs");
var exphbs = require("express-handlebars");
var app = express();
var dbArticle = require("./models/Article");
var dbSaved = require("./models/Saved");
var dbNote = require("./models/Note");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);


// Set up a static folder (public) for our web app
app.use(express.static("public"));
app.use(bodyParser.json());


app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
// Use mongojs to hook the database to the db variable
// var db = mongojs(databaseUrl, collections);
// db.on("error", function (error) {
//     console.log("Database Error:", error);
// });
// mongoose.connect("mongodb://localhost/nprdb", { useNewUrlParser: true })
require("./routes/nprRoutes")(app);

app.get("/", function (req, res) {
    dbArticle.find().then(function (dbArticles) {
        res.render('index', { article: dbArticles });
    });

});
app.get("/savedArticle", function (req, res) {
    dbSaved.find().then(function (saved) {
        res.render('index', { Saved: saved });
    });
});
// app.post("/savedArticle", function (req, res) {
//     dbArticle.find().then(function (dbArticle) {
//         res.render('index', { article: dbArticle });
//     });
// })

app.listen(3000, function () {
    console.log("App running on port 3000!");
});
