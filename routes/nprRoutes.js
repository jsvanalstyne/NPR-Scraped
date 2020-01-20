var axios = require("axios");
var cheerio = require("cheerio");
var dbArticle = require("../models/Article");
var dbSaved = require("../models/Saved");
var ObjectId = require('mongodb').ObjectID;
var dbNote = require("../models/Note");
module.exports = function (app) {
  // GET Route for scraping NPR and storing the results to the article collection
  app.get("/scrape", function (req, res) {
    axios.get("https://www.npr.org").then(function (response) {
      var $ = cheerio.load(response.data);
      $("article").each(function (i, element) {
        var title = $(element).find("h3").text();
        var link = $(element).find("a").attr("href");
        var summary = $(element).find("img").attr("src");
        var headerArticle = $(element).find("h2").text()
        dbArticle.create({ title: title, link: link, summary: summary, headerArticle: headerArticle }).catch(function (err) {
          console.log(err);
        })
      });
    });
    res.json("scrape successful");
  });
// POST route for saving articles to the saved collection
  app.post("/savedArticle", function (req, res) {
    dbSaved.create({ title: req.body.title, link: req.body.link, summary: req.body.summary }).catch(function (err) {
      console.log(err);
    });
    dbArticle.deleteOne({ title: req.body.title, link: req.body.link, summary: req.body.summary }).catch(function (err) {
      console.log(err);
    });
    res.json(200);
  });
// GET route for display all notes for a specific article
  app.get("/savedArticleNotes/:id", function (req, res) {
    console.log(req.params.id);
    dbSaved.findOne({ _id: ObjectId(req.params.id) })
      .populate("note")
      .then(function (dbArticle) {
        console.log("inside .then")
        res.json(dbArticle);

      })
      .catch(function (err) {

        res.json(err);
      });
  });
// POST route for creating a note and then saving it to the Note colleciton and the saved collection
  app.post("/savedArticles/:id", function (req, res) {
    console.log("npre routes line 59 " + (req.body));
    dbNote.create(req.body).then(function (articleNotePost) {
      return dbSaved.findOneAndUpdate({ _id: ObjectId(req.params.id) }, { $push: { note: articleNotePost._id } }, { new: true });
    })
    res.json(200)
  });
// Delete route for deleting a specific article
  app.delete("/savedArticle", function (req, res) {
    dbSaved.deleteOne({ _id: ObjectId(req.body.id) }).catch(function (err) {
      console.log(err);
    });
    res.json(200);
  });
// DELETE route for deleting everything from saved, articles and from notes. 
  app.delete("/articles", function (req, res) {
    dbArticle.deleteMany({}).catch(function (err) {
      console.log(err);
    });
    dbNote.deleteMany({}).catch(function (err) {
      console.log(err);
    });
    dbSaved.deleteMany({}).catch(function (err) {
      console.log(err);
    });
    res.json(200);
  });
// DELETE request for deleting a specific note. 
  app.delete("/notes/:id", function (req, res) {
    dbNote.deleteOne({ _id: ObjectId(req.params.id) }).catch(function (err) {
      console.log(err);
    });
    res.json(200);
  });
}
