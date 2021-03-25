const router = require("express").Router();

const Tag = require("../models/Tag");
const { appResponse } = require("../utils");

router.get("/api/tags", async (req, res) => {
  try {
    const tags = await Tag.find({});
    appResponse(res, tags);
  } catch (e) {
    appResponse(res, {}, 500);
  }
});

module.exports = router;
