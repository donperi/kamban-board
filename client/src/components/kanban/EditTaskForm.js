import React, { useState } from 'react';
import {useDispatch, useSelector} from "react-redux";
import Modal from "react-bootstrap/Modal";
import {withRouter} from "react-router-dom";
import toastr from 'toastr';

import TaskForm from "./TaskForm";
import {updateTask} from "../../services/tasks";

const AddTaskForm = ({ match, history }) => {
  const [show, setShow] = useState(true);
  const tasks = useSelector(state => state.kanban.tasks);
  const dispatch = useDispatch();

  const task = tasks[match.params.id];

  if (!task) {
    toastr.error(`Task ${match.params.id} doesn't exists`);
    history.back();
  }

  const onHide = () => {
    setShow(false);
    setTimeout(() => {
      history.push({
        pathname: '/',
        search: history.location.search
      });
    }, 200);
  };

  const handleSubmit = async (values) => {
    try {
      await dispatch(updateTask(match.params.id, values));
      onHide();
      return true;
    } catch (e) {
      return Promise.reject(e);
    }
  };

  return (
    <Modal size="lg" show={show} onHide={onHide} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title >Add Task</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <TaskForm
          initialValues={{
            title: task.title,
            description: task.description,
            due_date: task.due_date,
            assignee: task.assignee,
            time_estimates: task.time_estimates,
            tags: task.tags,
          }}
          onSubmit={handleSubmit}
          onCancel={onHide}
          submitText="Update"
        />
      </Modal.Body>
    </Modal>
  )
};

export default withRouter(AddTaskForm);
