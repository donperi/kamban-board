import React, {useEffect, useState, useCallback} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Route, Switch} from "react-router-dom";
import {DragDropContext} from "react-beautiful-dnd";
import toastr from 'toastr';

import {addStages, moveTasks} from "../../modules/kanban";
import {fetchStages, fetchTags, fetchTasks, fetchUsers, moveTasksOnApi} from "../../services/tasks";
import AddTaskForm from "./AddTaskForm";
import TaskDetail from "./TaskDetail";
import Stage from "./Stage";
import EditTaskForm from "./EditTaskForm";
import Menu from "./Menu";

const KanBan = () => {
  const [selectedTasks, setSelectedTask] = useState([]);
  const [draggingTaskId, setDraggingTaskId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error] = useState(false);

  const stages = useSelector(state => state.kanban.stages);
  const allTasks = useSelector(state => state.kanban.tasks);
  const dispatch = useDispatch();

  function onKanbanClick(event) {
    if (event.defaultPrevented) {
      return;
    }

    setSelectedTask([])
  }

  useEffect(() => {
    document.title = 'Kanban Board';
    (async () => {
      try {
        await dispatch(fetchTags());
        await dispatch(fetchUsers());
        await dispatch(fetchStages());
        await dispatch(fetchTasks({}));
        setLoading(false);
      } catch (e) {
        toastr.error(e.message);
      }
    })();
  }, [dispatch]);

  const onTaskSelection =  useCallback((taskId, reset = false) => {
    const index = selectedTasks.indexOf(taskId);
    if (reset) {
      setSelectedTask([taskId]);
      return;
    }


    if (index === -1) {
      setSelectedTask([...selectedTasks, taskId]);
      return;
    }

    const shallow = [...selectedTasks];
    shallow.splice(index, 1);
    setSelectedTask(shallow);
  }, [selectedTasks]);

  const onDragStart = start => {
    const id = start.draggableId;

    if (selectedTasks.indexOf(id) === -1) {
      setSelectedTask([id]);
    }

    setDraggingTaskId(id);
  };

  const onDragEnd = async (result) => {
    const { destination } = result;
    setDraggingTaskId(null);

    if (!destination) {
      return;
    }

    dispatch(moveTasks({
      taskIds: selectedTasks, toStage: destination.droppableId, atIndex: destination.index
    }));

    try {
      await dispatch(moveTasksOnApi(selectedTasks, destination.droppableId, destination.index));
    } catch (e) {
      dispatch(addStages(Object.values(stages)));
      toastr.error('An error occurred moving the card(s).');
    }
  };

  if (error) { return (error); }

  if (loading) {
    return <h3 className="text-center mt-3">Loading Board...</h3>
  }

  return (
    <>
      <Menu selectedTasks={selectedTasks} />
      <div onClick={onKanbanClick} className="Kanban d-flex flex-grow-1 overflow-auto pb-2">
        <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
          {Object.values(stages).map((stage) => {
            return (
              <Stage
                key={stage._id}
                stage={stage}
                allTasks={allTasks}
                onTaskSelection={onTaskSelection}
                selectedTasks={selectedTasks}
                draggingTaskId={draggingTaskId}
              />
            );
          })}
        </DragDropContext>

        <Switch>
          <Route exact path='/task/add' component={AddTaskForm} />
          <Route exact path='/task/:id/edit' component={EditTaskForm} />
          <Route exact path='/task/:id' component={TaskDetail} />
        </Switch>
      </div>
    </>
  );
};

export default KanBan;
