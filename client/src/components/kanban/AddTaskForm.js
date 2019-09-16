import React, { useState } from 'react';
import {useDispatch} from "react-redux";
import Modal from "react-bootstrap/Modal";
import {withRouter} from "react-router-dom";

import TaskForm from "./TaskForm";
import {createTask} from "../../services/tasks";

const AddTaskForm = ({ history }) => {
  const [show, setShow] = useState(true);
  const dispatch = useDispatch();

  const onHide = () => {
    setShow(false);
    setTimeout(() => { history.push('/'); }, 200);
  };

  const handleSubmit = async (values, actions) => {
    try {
      await dispatch(createTask(values));
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
            title: '',
            description: '',
            due_date: '',
            assignee: '',
            time_estimates: '',
            tags: [],
          }}
          onSubmit={handleSubmit}
          onCancel={onHide}
          submitText="Create"
        />
      </Modal.Body>
    </Modal>
  )
};

export default withRouter(AddTaskForm);
