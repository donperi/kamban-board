const mongoose = require("mongoose");

const TagSchema = mongoose.Schema({
  name: { type: String, unique: true },
});

const Tag = mongoose.model("Tag", TagSchema);

module.exports = Tag;
