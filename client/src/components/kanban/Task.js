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

import {deleteTaskOnApi} from "../../services/kanban";
import FilterBadge from "./FilterBadge";
import Badge from "react-bootstrap/Badge";

const Task = ({ task, index, isSelected, isGhost, onTaskSelection, selectionCount, history }) => {
  const dispatch = useDispatch();
  const users = useSelector(state => state.kanban.users);
  const tags = useSelector(state => state.kanban.tags);
  const assignee = users[task.assignee] ? {
    _id: users[task.assignee]._id,
    name: users[task.assignee].name
  } : { _id: null };

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

  const handleDelete = async () => {
    if (!window.confirm("Are you sure?")) {
      return;
    }

    try {
      await dispatch(deleteTaskOnApi(task._id))
    } catch (e) {
      toastr.error('An error occurred deleting the task.')
    }
  };

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
             <Card className={classes} onClick={handleClick}>
              <Card.Body>
                <Card.Title className="h6 clearfix">
                  <NavLink to={`/task/${task._id}`}> {task.title}</NavLink>
                </Card.Title>

                <div className='d-flex'>
                  <div className="flex-grow-1">
                    <Card.Text className="small">
                      <strong className="mr-2">Assignee:</strong>
                      <FilterBadge
                        field="assignee"
                        value={assignee._id}
                        label={assignee.name}
                        allowEmptySearch
                        emptyMessage="Unassigned"
                      />
                    </Card.Text>

                    <Card.Text className="small">
                      <strong className="mr-2">Due Date:</strong>
                      <FilterBadge
                        field="due_date"
                        value={task.due_date &&  moment(task.due_date).format('YYYY-MM-DD')}
                        allowEmptySearch
                        emptyMessage="No Set" />
                    </Card.Text>

                    <Card.Text className="small">
                      <strong className="mr-2">Estimates:</strong>
                      <FilterBadge
                        field="time_estimates"
                        allowEmptySearch
                        value={task.time_estimates}
                        emptyMessage={"No Set"}
                      />
                    </Card.Text>
                  </div>

                  <div className="flex-grow-0 align-self-end">
                    {shouldShowSelection && (
                      <h3><Badge variant="primary" size="lg">{selectionCount}</Badge></h3>
                    )}

                    {!shouldShowSelection && (
                      <ButtonGroup size={"sm"} className="float-right">
                        <NavLink
                          to={{ pathname: `/task/${task._id}/edit`, search: history.location.search }}
                          className="btn btn-outline-primary"
                        >
                          <FontAwesomeIcon icon="edit" />
                        </NavLink>
                        <Button variant="outline-danger" onClick={handleDelete}>
                          <FontAwesomeIcon icon="trash" />
                        </Button>
                      </ButtonGroup>
                    )}
                  </div>
                </div>

                <div>
                  {task.tags.map((tId) => (
                    <FilterBadge key={tId} field="tags" value={tags[tId]._id} label={tags[tId].name} variant={"primary"} classNames={"mr-2"}/>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </div>
        )
      }}
    </Draggable>
  );
};

export default Task;
