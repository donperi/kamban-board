const mongoose = require('mongoose');

/*
Title
Description
Tag (SEO article, longform, blog post)
Assignee
Due date
Time estimates
Stage (to do, in progress, ready for review, done)
 */

const TaskSchema = new mongoose.Schema({
  title: { required: true, type: String },
  description: { type: String, default: '' },
  assignee: { type: mongoose.Schema.Types.ObjectId,  ref: 'User', default: null },
  due_date: { type: Date, default: null },
  time_estimates: { type: String,  default: null },
  tags: [{ type: mongoose.Schema.Types.ObjectId,  ref: 'Tag'}],
  stage: { type: mongoose.Schema.Types.ObjectId,  ref: 'Stage' }
});


module.exports = mongoose.model('Task', TaskSchema);
