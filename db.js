const mongoose = require('mongoose');
const Stage = require('./models/Stage');
const Tag = require('./models/Tag');
const Setting = require('./models/Setting');
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

  // Stages Setup
  for (const stage of Object.values(STAGES)) {
    try {
      await (new Stage({ name: stage })).save();
    } catch (e) {
      console.log(`Skipping stage creation: "${stage}" already exists`);
    }
  }

  // Tags Setup
  for (const tag of TAGS) {
    try {
      await (new Tag({ name: tag })).save();
    } catch (e) {
      console.log(`Skipping tag creation: "${tag}" already exists`);
    }
  }

  // Settings Setup
  let settings = await Setting.findOne({});
  if  (!settings) {
    settings = await Setting.create({});
  }

  const defaultSettingResolver = {
    visible_stages: async () => {
      const stages = await Stage.find({});
      return stages.reduce((carry, stage) => {
        carry[stage._id] = true;
        return carry;
      }, {});
    }
  }

  const defaultValues = await Object.keys(defaultSettingResolver).reduce(async (prevPromise, key) => {
    const carry = await prevPromise;
    if (settings[key]) { return carry; }

    carry[key] = await defaultSettingResolver[key]();
    return carry;
  }, Promise.resolve({}));

  if (Object.keys(defaultValues).length) {
    console.log('Create default values for settings' , defaultValues);
    await Setting.updateOne({}, defaultValues)
  }
};

module.exports = {
  setupDatabase
};
