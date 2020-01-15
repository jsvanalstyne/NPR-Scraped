var axios = require("axios");
var cheerio = require("cheerio");
var dbArticle = require("../models/Article");
var dbSaved = require("../models/Saved");
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
    })
res.json(200);
});

}
