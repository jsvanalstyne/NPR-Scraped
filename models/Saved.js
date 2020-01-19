var mongoose = require("mongoose");
var Schema = mongoose.Schema

var savedSchema = new Schema({
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
note:[{
    type: Schema.Types.ObjectId,
    ref: "Note"
}]
});

var Saved = mongoose.model("Saved", savedSchema);

module.exports = Saved;