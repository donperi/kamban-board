const router = require('express').Router();
const Stage = require('../models/Stage');

const { appResponse } = require('../utils');

router.get('/api/stages', async (req, res) => {
  const stages = await Stage.find({})
  appResponse(res, stages);
});

module.exports = router;
