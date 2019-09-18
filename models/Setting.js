const mongoose = require('mongoose');

const SettingSchema = mongoose.Schema({
  visible_stages: { type: Map, default: {} }
});

const Setting = mongoose.model('Setting', SettingSchema);

module.exports = Setting;
