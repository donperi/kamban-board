import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toastr from "toastr";

import {
  fetchSettings,
  fetchStages,
  fetchTags,
  fetchTasks,
  fetchUsers,
} from "../services/kanban";

function useKanbanInitializer() {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.kanban.tasks);
  const stages = useSelector((state) => state.kanban.stages);
  const settings = useSelector((state) => state.kanban.settings);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Kanban Board";
    (async () => {
      try {
        await dispatch(fetchSettings());
        await dispatch(fetchTags());
        await dispatch(fetchUsers());
        await dispatch(fetchStages());
        await dispatch(fetchTasks({}));
        setLoading(false);
      } catch (e) {
        toastr.error(e.message);
      }
    })();
  }, []); //eslint-disable-line

  return { tasks, stages, settings, loading };
}

export default useKanbanInitializer;
