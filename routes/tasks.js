const router = require('express').Router();
const { sanitizeQuery, sanitizeBody, matchedData } = require('express-validator');
const ObjectId = require('mongoose').Types.ObjectId;
const moment = require('moment');

const Task = require('../models/Task');
const Stage = require('../models/Stage');
const Tag = require('../models/Tag');
const User = require('../models/User');
const TaskRepository = require('../repositories/tasksRepository');
const { appResponse, filterUndefinedValues  } = require('../utils');

const objectIdSanitizer = value => {
  if (value === undefined) { return; }
  if (value === "null") { return null; }
  if (!value || !ObjectId.isValid(value)) { return new ObjectId(); }

  return value;
};

const nullStringSanitizer = value => value || null;

const dateSanitizer  = value => {
  if (value === 'null' || !value) { return value; }
  return moment(value).toDate();
};

router.get('/api/stages', async (req, res) => {
  const stages = await Stage.find({})
  appResponse(res, stages);
});

router.get('/api/tasks', [
  sanitizeQuery('title'),
  sanitizeQuery('time_estimates'),
  sanitizeQuery('assignee').customSanitizer(objectIdSanitizer),
  sanitizeQuery('tags').customSanitizer(objectIdSanitizer),
  sanitizeQuery('due_date').customSanitizer(dateSanitizer)
], async (req, res) => {
  try {
    const tasks = await TaskRepository.find(req.query || {});
    appResponse(res, tasks);
  } catch (e) {
    appResponse(res, {}, 500, e.message);
  }
});

router.get('/api/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    appResponse(res, task, 200);
  } catch (e) {
    appResponse(res, {}, 404)
  }
});

router.post('/api/tasks', [
  sanitizeBody('due_date').customSanitizer(dateSanitizer),
  sanitizeBody('time_estimates').customSanitizer(nullStringSanitizer)
], async (req, res) => {
  try {
    console.log(req.body)
    const newTask = await TaskRepository.create(req.body);
    appResponse(res, newTask);
  } catch (e) {
    appResponse(res, e.errors, 400, e.message);
  }
});

router.put('/api/tasks/bulk_edit', async (req, res) => {
  try {
    const tasks = await TaskRepository.bulkEdit(req.body.tasks, req.body);
    appResponse(res, tasks);
  } catch (e) {
    appResponse(res, e.errors, 400, e.message);
  }
});

router.put('/api/tasks/move', async (req, res) => {
  const {
    tasks,
    toStage,
    atIndex
  } = req.body;

  try {
    await TaskRepository.move(tasks, toStage, atIndex);

    appResponse(res, {
      stages: await Stage.find({}),
      tasks: await Task.find({ _id: { $in: tasks }})
    })
  } catch (e) {
    appResponse(res, {}, 500, e.message)
  }
});

router.put('/api/tasks/:id', [
  sanitizeBody('due_date').customSanitizer(dateSanitizer),
  sanitizeBody('time_estimates').customSanitizer(nullStringSanitizer)
], async (req, res) => {
  try {
    const task = await TaskRepository.update(req.params.id, req.body);

    if (!task) {
      return appResponse(res, {}, 404);
    }

    appResponse(res, task);
  } catch (e) {
    appResponse(res, {}, 400, e.message);
  }
});

router.delete('/api/tasks/:id', async (req, res) => {
  try {
    await TaskRepository.delete(req.params.id);
    appResponse(res, {}, 200);
  } catch (e) {
    appResponse(res, {}, 200)
  }
});


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

router.get('/api/tags', async (req,res) => {
  try {
    const tags = await Tag.find({});
    appResponse(res, tags);
  } catch (e) {
    appResponse(res, {}, 500)
  }
});

module.exports = router;
