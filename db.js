const mongoose = require('mongoose');
const Stage = require('./models/Stage');
const Tag = require('./models/Tag');
const { STAGES, TAGS } = require('./constants');

const setupDatabase = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
  } catch (e) {
    console.error(`An error occurred connection to db: ${e.message}`);
    return;
  }


  // Setup Stages
  for (const stage of Object.values(STAGES)) {
    try {
      await (new Stage({ name: stage })).save();
    } catch (e) {
      console.log(`Skipping stage creation: "${stage}" already exists`);
    }
  }

  // Setup Tags
  for (const tag of TAGS) {
    try {
      await (new Tag({ name: tag })).save();
    } catch (e) {
      console.log(`Skipping tag creation: "${tag}" already exists`);
    }
  }
};

module.exports = {
  setupDatabase
};
