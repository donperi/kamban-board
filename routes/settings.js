const router = require('express').Router();
const Setting = require('../models/Setting');
const { appResponse } = require('../utils');

router.get('/api/settings', async (req, res) => {
  try {
    const setting = await Setting.findOne({});
    console.log(setting)
    appResponse(res, setting, 200);
  } catch (e) {
    appResponse(res, {}, 404);
  }
});

router.put('/api/settings', async (req, res) => {
  try {
    const setting = await Setting.findOneAndUpdate({}, req.body, { new: true });
    appResponse(res, setting, 200);
  } catch (e) {
    appResponse(res, {}, 404);
  }
});

module.exports = router;

