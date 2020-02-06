var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var CardSchema = new Schema({
  title: String,
  color: String
});

var Card = mongoose.model("Post", CardSchema);
module.exports = Card;
