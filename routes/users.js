const router = require('express').Router();

const User = require('../models/User');
const { appResponse } = require('../utils');

router.get('/api/users', async (req,res) => {
  try {
    const users = await User.find({});
    appResponse(res, users);
  } catch (e) {
    appResponse(res, {}, 500)
  }
});

router.post('/api/users', async (req, res) => {
  try {
    const user = await User.create(req.body);
    appResponse(res, user);
  } catch (e) {
    appResponse(res, e.errors, 400, e.message);
  }
});

module.exports = router;
