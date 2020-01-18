var axios = require("axios");
var cheerio = require("cheerio");
var dbArticle = require("../models/Article");
var dbSaved = require("../models/Saved");
var ObjectId = require('mongodb').ObjectID;
var dbNote = require("../models/Note");
module.exports = function(app){
app.get("/scrape", function(req, res){
axios.get("https://www.npr.org").then(function(response) {

  var $ = cheerio.load(response.data);

  var results = [];
  $("article").each(function(i, element) {

    var title = $(element).find("h3").text();
    var link = $(element).find("a").attr("href");
    var summary = $(element).find("a").text();
    // results.push({
    //   title: title,
    //   link: link
    // });
    console.log(title, link)

    dbArticle.create({title:title,link:link, summary:summary}).catch(function(err){
        console.log(err);
    })
  });
  console.log(results);
  
  
});
res.json("scrape successful");
});


app.post("/savedArticle", function(req, res){
console.log(req.body); 
    dbSaved.create({title:req.body.title,link:req.body.link, summary:req.body.summary}).catch(function(err){ console.log(err);
    });
    dbArticle.deleteOne({title:req.body.title,link:req.body.link, summary:req.body.summary}).catch(function(err){ console.log(err);
    });
res.json(200);
});
app.get("/savedArticleNotes/:id", function(req, res){
dbSaved.findOne({_id: ObjectId(req.params.id)}).then(function(data){
  res.render("index", {Notes: data})
});
// res.json(200);
});
app.post("/savedArticles/:id", function (req, res) {
  dbNote.create(req.body).then(function (articleNotePost) {
    return dbSaved.findOneAndUpdate({ _id: ObjectId(req.params.id) }, { $push: { note: articleNotePost._id } }, { new: true });
  })
});

app.delete("/savedArticle", function(req, res){
  console.log(req.body.id);
  dbSaved.deleteOne({_id: ObjectId(req.body.id)}).catch(function(err){ console.log(err);
  });
  res.json(200);
});
app.delete("/articles", function(req, res){
  dbArticle.deleteMany({}).catch(function(err){ console.log(err);
  });
  dbSaved.deleteMany({}).catch(function(err){ console.log(err);
  });
  res.json(200);
})
}
