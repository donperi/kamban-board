import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from "react-bootstrap/Button";
import {withRouter} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {fetchTask} from "../../services/kanban";

const TaskDetail = ({ history, match }) => {
  const [show, setShow] = useState(true);
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const users = useSelector(state => state.kanban.users);

  useEffect(() => {
    (async () => {
      const task = await dispatch(fetchTask(match.params.id));
      setTask(task);
      setLoading(false);
    })()

  }, [dispatch, match.params.id]);

  const onHide = () => {
    setShow(false);
    setTimeout(() => {
      history.push('/');
    }, 200);
  };

  if (loading) {
    return (
      <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <h3>Loading...</h3>
        </Modal.Header>
      </Modal>
    );
  }

  const assignee = users[task.assignee] ? users[task.assignee].name : null;

  return (
    <Modal show={show} onHide={onHide} className="TaskDetail">
      <Modal.Header closeButton>
        <Modal.Title>{task.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {task.description && <pre>{task.description}</pre>}
        <ul>
          <li>
            <strong>Assignee:</strong> {assignee || (<i>No One</i>)}
          </li>
          <li>
            <strong>Due Date:</strong> {task.due_date || (<i>Not Set</i>)}
          </li>
          <li>
            <strong>Estimate:</strong> {task.time_estimates}
          </li>
        </ul>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onHide} variant="secondary">Close</Button>
      </Modal.Footer>
    </Modal>
  )
};

export default withRouter(TaskDetail);
