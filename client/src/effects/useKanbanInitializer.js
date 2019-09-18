import {useEffect,useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import toastr from "toastr";

import {fetchStages, fetchTags, fetchTasks, fetchUsers} from "../services/tasks";

function useKanbanInitializer() {
  const dispatch = useDispatch();
  const tasks = useSelector(state => state.kanban.tasks);
  const stages = useSelector(state => state.kanban.stages);

  const [loading, setLoading] = useState(true);

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
  }, []); //eslint-disable-line

  return [tasks, stages, loading];
};

export default useKanbanInitializer;
