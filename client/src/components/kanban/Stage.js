import Task from "./Task";
import React from "react";
import {Droppable} from "react-beautiful-dnd";

const Stage = ({ allTasks, stage, selectedTasks, draggingTaskId, onTaskSelection, history, settings }) => {
  if (settings.visible_stages && settings.visible_stages[stage._id] === false) {
    return null;
  }

  return (
    <div className="Stage">
      <h4>{stage.name}</h4>
      <Droppable droppableId={stage._id}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            className="Stage-items pr-2 overflow-y-auto height-full"
          >
            {
              stage.tasks.map((taskId, index) => {
                const task = allTasks[taskId];
                if (!task) {
                  return null;
                }
                const isSelected = selectedTasks.indexOf(taskId) !== -1;
                const isGhost = draggingTaskId && isSelected && draggingTaskId !== taskId;

                return (
                  <Task
                    key={task._id}
                    task={task}
                    index={index}
                    isSelected={isSelected}
                    isGhost={isGhost}
                    selectedTasks={selectedTasks}
                    onTaskSelection={onTaskSelection}
                    selectionCount={selectedTasks.length}
                    history={history}
                  />
                );
              })
            }
            {provided.placeholder}
          </div>
          )}
      </Droppable>
    </div>
  );
};

export default Stage;
