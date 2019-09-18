import {
  addTasks,
  addStages,
  deleteTask,
  addTags,
  addUsers,
  addNewTask,
  addFilteredTasks,
  setSettings
} from "../modules/kanban";
import {apiUrl, apiRequest} from "../utils";

export const fetchTask = (id) => async (dispatch) => {
  const response = await apiRequest(apiUrl(`/api/tasks/${id}`));

  if (response.error) {
    return Promise.reject(response);
  }

  dispatch(addTasks([response.data]));
  return response.data
};

export const fetchTasks = () => async (dispatch) => {
  const response = await apiRequest(apiUrl('/api/tasks'));

  if (response.error) {
    return Promise.reject(response);
  }

  dispatch(addTasks(response.data));
  return response.data;
};

export const createTask = (task) => async (dispatch) => {
  task.assignee = task.assignee || null;

  const response = await apiRequest(apiUrl('/api/tasks'), {
    method: 'post',
    body: JSON.stringify(task)
  });

  if (response.error) {
    return Promise.reject(response);
  }

  dispatch(addNewTask(response.data));
  return response.data;
};

export const updateTask = (id, task) => async (dispatch) => {
  task.assignee = task.assignee || null;

  const response = await apiRequest(apiUrl(`/api/tasks/${id}`), {
    method: 'put',
    body: JSON.stringify(task)
  });

  if (response.error) {
    return Promise.reject(response);
  }

  dispatch(addTasks([response.data]));
  return response.data;
};

export const bulkEditTasks =(tasksIds, props) => async (dispatch) => {
  const data = { tasks: tasksIds, ...props };

  const response = await apiRequest(apiUrl('/api/tasks/bulk_edit'), {
    method: 'put',
    body: JSON.stringify(data)
  });

  if (response.error) {
    return Promise.reject(response)
  }

  dispatch(addTasks(response.data));
  return response.data

};

export const filterTasks = (query = {}) => async (dispatch) => {
  const response = await apiRequest(apiUrl('/api/tasks', query));

  if (response.error) {
    return Promise.reject(response);
  }

  dispatch(addFilteredTasks(response.data));
  return response.data;
};

export const fetchStages = () => async (dispatch) => {
  const response = await apiRequest(apiUrl('/api/stages'));

  if (response.error) {
    return Promise.reject(response)
  }

  dispatch(addStages(response.data));
  return response.data;
};

export const moveTasksOnApi = (tasksIds, toStageId, atIndex) => async (dispatch) => {
  const response  = await apiRequest(apiUrl('/api/tasks/move'), {
    method: 'put',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      tasks: tasksIds,
      toStage: toStageId,
      atIndex
    })
  });

  if (response.error) {
    return Promise.reject(response);
  }

  dispatch(addStages(response.data.stages));
  dispatch(addTasks(response.data.tasks));

  return response.data;
};

export const deleteTaskOnApi = (taskId) => async (dispatch) => {
  const response = await apiRequest(apiUrl(`/api/tasks/${taskId}`), {
    method: 'delete'
  });

  if (response.error) {
    return Promise.reject(response);
  }

  dispatch(deleteTask(taskId));
  return true;
};

// Tags

export const fetchTags = () => async (dispatch) => {
  const response = await  apiRequest(apiUrl('/api/tags'));

  if (response.error) {
    return Promise.reject(response);
  }

  dispatch(addTags(response.data));
  return response.data;
};


// Users

export const fetchUsers = () => async (dispatch) => {
  const response = await  apiRequest(apiUrl('/api/users'));

  if (response.error) {
    return Promise.reject(response);
  }

  dispatch(addUsers(response.data));
  return response.data;
};

export const createUser = (body) => async (dispatch) => {
  const response = await apiRequest('/api/users', {
    method: 'post',
    body: JSON.stringify(body)
  });

  if (response.error) {
    return Promise.reject(response)
  }

  dispatch(addUsers([response.data]));
  return response.data;
};

// Settings

export const fetchSettings = () => async (dispatch) => {
  const response = await  apiRequest(apiUrl('/api/settings'));

  if (response.error) {
    return Promise.reject(response);
  }

  dispatch(setSettings(response.data));
  return response.data;
};

export const updateSettings = (settings) => async (dispatch) => {
  const response = await apiRequest(apiUrl('/api/settings'), {
    method: 'put',
    body: JSON.stringify(settings)
  });

  if (response.error) {
    return Promise.reject(response);
  }

  dispatch(setSettings(response.data));
  return response.data;
};
