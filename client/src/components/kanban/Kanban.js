import React, { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch, withRouter } from "react-router-dom";
import { DragDropContext } from "react-beautiful-dnd";
import toastr from "toastr";

import { addStages, moveTasks } from "../../modules/kanban";
import AddTaskForm from "./AddTaskForm";
import TaskDetail from "./TaskDetail";
import Stage from "./Stage";
import EditTaskForm from "./EditTaskForm";
import Menu from "./Menu";
import useKanbanInitializer from "../../effects/useKanbanInitializer";
import useFilteredTasks from "../../effects/useFilteredTasks";
import { moveTasksOnApi } from "../../services/kanban";

const KanBan = ({ history }) => {
  const dispatch = useDispatch();

  const { tasks, stages, settings, loading } = useKanbanInitializer();
  const [filteredTasks, loadingFilteredTasks] = useFilteredTasks(
    history.location
  );

  const [selectedTasks, setSelectedTask] = useState([]);
  const [draggingTaskId, setDraggingTaskId] = useState(null);

  const handleTaskSelection = useCallback(
    (taskId, reset = false) => {
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
    },
    [selectedTasks]
  );

  const handleKanbanAreaClick = (event) => {
    if (event.defaultPrevented) {
      return;
    }

    setSelectedTask([]);
  };

  const handleDragStart = (start) => {
    const id = start.draggableId;

    if (selectedTasks.indexOf(id) === -1) {
      setSelectedTask([id]);
    }

    setDraggingTaskId(id);
  };

  const handleDragEnd = async (result) => {
    const { destination } = result;
    setDraggingTaskId(null);

    if (!destination) {
      return;
    }

    dispatch(
      moveTasks({
        taskIds: selectedTasks,
        toStage: destination.droppableId,
        atIndex: destination.index,
      })
    );

    try {
      await dispatch(
        moveTasksOnApi(
          selectedTasks,
          destination.droppableId,
          destination.index
        )
      );
    } catch (e) {
      dispatch(addStages(Object.values(stages)));
      toastr.error("An error occurred moving the card(s).");
    }
  };

  if (loading) {
    return <h3 className="text-center mt-3">Loading Board...</h3>;
  }

  return (
    <>
      <Menu
        settings={settings}
        filteredTasks={filteredTasks}
        isFiltering={loadingFilteredTasks}
        search={history.location.search}
        selectedTasks={selectedTasks}
      />

      <div
        onClick={handleKanbanAreaClick}
        className="Kanban d-flex flex-grow-1 overflow-auto pb-2"
      >
        <DragDropContext
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          {Object.values(stages).map((stage) => {
            return (
              <Stage
                key={stage._id}
                stage={stage}
                allTasks={filteredTasks || tasks}
                onTaskSelection={handleTaskSelection}
                selectedTasks={selectedTasks}
                draggingTaskId={draggingTaskId}
                history={history}
                settings={settings}
              />
            );
          })}
        </DragDropContext>

        <Switch>
          <Route exact path="/task/add" component={AddTaskForm} />
          <Route exact path="/task/:id/edit" component={EditTaskForm} />
          <Route exact path="/task/:id" component={TaskDetail} />
        </Switch>
      </div>
    </>
  );
};

export default withRouter(KanBan);
