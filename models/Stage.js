const mongoose = require("mongoose");

const StageSchema = mongoose.Schema({
  name: { type: String, unique: true },
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
});

StageSchema.statics.findByName = async function (stageName) {
  return this.findOne({ name: stageName });
};

const Stage = mongoose.model("Stage", StageSchema);

module.exports = Stage;
