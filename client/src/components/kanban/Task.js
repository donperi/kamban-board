import React from "react";
import {NavLink} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Card from "react-bootstrap/Card";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";
import {Draggable} from "react-beautiful-dnd";
import classNames from 'classnames';
import toastr from 'toastr';
import moment from 'moment';

import {deleteTaskOnApi} from "../../services/tasks";
import FilterBadge from "./FilterBadge";


const Task = ({ task, index, isSelected, isGhost, onTaskSelection, selectionCount }) => {
  const dispatch = useDispatch();
  const users = useSelector(state => state.kanban.users);
  const tags = useSelector(state => state.kanban.tags);
  const assignee = users[task.assignee] ? users[task.assignee].name : null;

  const handleClick = (event) => {
    if (event.defaultPrevented) {
      return;
    }

    event.preventDefault();
    if (event.ctrlKey) {
      onTaskSelection(task._id);
      return;
    }

    onTaskSelection(task._id, true);
  };

  const onDeleteHandler = async () => {
    if (!window.confirm("Are you sure?")) {
      return;
    }

    try {
      await dispatch(deleteTaskOnApi(task._id))
    } catch (e) {
      toastr.error('An error occurred deleting the task.')
    }
  }

  const dueDate = task.due_date ? moment(task.due_date).format('MM-DD-YYYY') : '';

  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided, snapshot) => {
        const shouldShowSelection = snapshot.isDragging && selectionCount > 1;

        const classes = classNames({
          Task: true,
          'mb-1': true,
          'Task-selected': isSelected,
          'Task-ghost': isGhost && !snapshot.isDragging
        });

        return (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={provided.draggableProps.style}
          >
            {
              shouldShowSelection && (
                <div>{selectionCount}</div>
              )
            }
             <Card className={classes} onClick={handleClick}>
              <Card.Body>
                <Card.Title className="h6 clearfix">
                  <NavLink to={`/task/${task._id}`}> {task.title}</NavLink>
                </Card.Title>

                <div className='d-flex'>
                  <div className="flex-grow-1">
                    <Card.Text className="small">
                      <strong className="mr-2">Assignee:</strong>
                      <FilterBadge field="assignee" value={assignee} emptyMessage="Unassigned" />
                    </Card.Text>
                    <Card.Text className="small">
                      <strong className="mr-2">Due Date:</strong>
                      <FilterBadge field="due_date" value={dueDate} emptyMessage="No Set" />
                    </Card.Text>
                    <Card.Text className="small">
                      <strong className="mr-2">Estimates:</strong>
                      <FilterBadge field="time_estimate" value={task.time_estimates} emptyMessage={"No Set"} />
                    </Card.Text>
                  </div>
                  <div className="flex-grow-0 align-self-end">
                    <ButtonGroup size={"sm"} className="float-right">
                      <NavLink to={`/task/${task._id}/edit`}className="btn btn-outline-primary">
                        <FontAwesomeIcon icon="edit" />
                      </NavLink>
                      <Button variant="outline-danger" onClick={onDeleteHandler}>
                        <FontAwesomeIcon icon="trash" />
                      </Button>
                    </ButtonGroup>
                  </div>
                </div>

                <div>
                  {task.tags.map((tId) => (
                    <FilterBadge key={tId} field="tag" value={tags[tId].name} variant={"primary"} classNames={"mr-2"}/>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </div>
        )
      }}
    </Draggable>
  );
}

export default Task;
