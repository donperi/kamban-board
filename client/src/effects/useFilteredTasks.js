import {useEffect,useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import qs from "qs";

import {clearTaskFilter} from "../modules/kanban";
import {filterTasks} from "../services/tasks";

const useFilteredTasks = (location) => {
  const dispatch = useDispatch();
  const filteredTasks = useSelector(state => state.kanban.filtered_tasks);
  let query = qs.parse(location.search, { ignoreQueryPrefix: true });
  const [loading, setLoading] = useState(false);

  console.log(query);

  useEffect(() => {
    (async () => {
      const shouldFilter = Object.values(query).find(v => v)
      if (!shouldFilter) {
        dispatch(clearTaskFilter());
        return;
      }

      setLoading(true);

      await dispatch(filterTasks(query));

      setLoading(false);
    })()

  }, [query.title, query.tags, query.assignee, query.due_date, query.time_estimates]); // eslint-disable-line

  return [filteredTasks, loading];
};

export default useFilteredTasks;
