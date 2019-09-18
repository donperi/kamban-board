const moment = require('moment');
const Task = require('../models/Task');
const Stage = require('../models/Stage');
const { STAGES } = require('../constants');
const { filterMapper } = require('../utils');


class TaskRepository {
  static async find(filters) {
    filters = filterMapper(filters, {
      title: value => new RegExp(value, 'i'),
      time_estimates: value => value === 'null' ? null : value,
      due_date: (value) => (
        {
          $gte: moment(value).toDate(),
          $lte: moment(value).endOf('day').toDate()
        }
      )
    });

    return Task.find(filters);
  }

  static async create(props) {
    const task = new Task(props);
    const todoStage = await Stage.findByName(STAGES.TODO);
    task.stage = todoStage._id;

    try {
      const newTask = await task.save();
      await todoStage.update({ $push: { tasks: newTask._id }});

      return newTask;
    } catch (e) {
      throw (e);
    }
  }

  static async update(taskId, props) {
    try {
      props = { ...props };
      delete props.stage;

      const task = await Task.findByIdAndUpdate(taskId, props, { new: true });
      return task;
    } catch (e) {
      throw (e)
    }
  }

  static async move (tasksIds, toStage, atIndex) {
    const tasks = await Task.find({ _id: { $in: tasksIds }});
    let stages = await Stage.find({ _id: { $in: [toStage, ...tasks.map(t => t.stage )] }});

    stages = stages.reduce((carry, stage) => {
      carry[stage._id] = stage;
      return carry;
    }, {});

    for (const task of tasks) {
      const stage = stages[task.stage];
      if (!stage) { continue; }

      const index = stage.tasks.indexOf(task._id);
      if (index === -1) { continue; }

      stage.tasks.splice(index, 1);
    }

    for (const stage of Object.values(stages)) {
      await stage.save();
    }

    const destination = stages[toStage];
    destination.tasks.splice(atIndex, 0, ...tasksIds);
    await destination.save();

    await Task.updateMany({ _id: { $in: tasks }}, { $set: { stage: toStage }});
  }

  static async delete(taskId) {
    const task = await Task.findById(taskId);
    await Stage.update({ _id: task.stage }, { $pull: { tasks: taskId }});
    await task.delete();
  }

  static async bulkEdit(taskIds, { tags = [], assignee, due_date, time_estimates }) {
    const tasks = await Task.find({ _id: { $in: taskIds } });

    for (const task of tasks) {
      if (assignee) { task.assignee = assignee; }
      if (due_date) { task.due_date = due_date; }
      if (time_estimates) { task.time_estimates = time_estimates; }

      for (const tag of tags) {
        if (task.tags.indexOf(tag) === -1) { task.tags.push(tag); }
      }

      await task.save();
    }

    return tasks;
  }

}

module.exports = TaskRepository;
