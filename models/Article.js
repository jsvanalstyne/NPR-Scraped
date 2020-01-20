var mongoose = require("mongoose");
var Schema = mongoose.Schema

var articleSchema = new Schema({
title:{
    type: String,
    required: true,

},
link: {
    type: String,
    required: true,
},
summary:{
    type: String,
    required: false
},
headerArticle: {
    type: String
}
});

var Article = mongoose.model("Article", articleSchema);

module.exports = Article;