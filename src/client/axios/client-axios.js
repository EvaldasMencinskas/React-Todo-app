import axios from 'axios';

const API_BASE_URL = new URL('https://65e9d18dc9bf92ae3d3a5376.mockapi.io/tasks');

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getTasks = async (page, limit, completed, title) => {
  const existingFilters = JSON.parse(localStorage?.getItem('filters')) || {};

  const queryParams = new URLSearchParams();

  if (title && title.trim() !== '') {
  queryParams.append('title', title);
  }
  if (completed !== null) {
    queryParams.append('completed', completed);
  } else if (existingFilters?.completed === true || 
    existingFilters?.completed ===  false){
      queryParams.append('completed', existingFilters?.completed);
    }

  queryParams.append('sortBy', 'createdAt');
  queryParams.append('order', 'desc');

  queryParams.append('page', page);
  queryParams.append('limit', limit);

  const apiUrl = `${API_BASE_URL}?${queryParams.toString()}`;

  try {
    const response = await axios.get(apiUrl, {
      validateStatus: (status) => status === 200 || status === 404,
    });

    if (response.status === 200) {
      return response.data;
    } else if (response.status === 404) {
      return [];
    } else {
      throw new Error(`Failed to fetch data. Status: ${response.status}`);
    }
  } catch (error) {
    if (error.response && error.response.status === 429) {
      const retryAfter = error.response.headers['retry-after'] || 5000;
      console.log(`Rate limited. Retrying after ${retryAfter / 1000} seconds.`);
      await delay(retryAfter);
      return getTasks(page, limit, completed, title);
    }
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const getTotalCount = async (completed, title) => {
  const queryParams = new URLSearchParams();

  if (title && title.trim() !== '') {
  queryParams.append('title', title);
  }
  if (completed !== null) {
    queryParams.append('completed', completed);
  }

  const apiUrl = `${API_BASE_URL}?${queryParams.toString()}`;

  try {
    const response = await axios.get(apiUrl, {
      validateStatus: (status) => status === 200 || status === 404,
    });

    if (response.status === 200) {
      const totalCount = response.data.length;
      return totalCount;
    }else if (response.status === 404) {
      return [];
    } else {
      throw new Error(`Failed to total count data. Status: ${response.status}`);
    }
  } catch (error) {
    if (error.response && error.response.status === 429) {
      const retryAfter = error.response.headers['retry-after'] || 5000;
      console.log(`Rate limited. Retrying after ${retryAfter / 1000} seconds.`);
      await delay(retryAfter);
      return getTotalCount(completed, title);
    }
    console.error('Error fetching total count:', error);
    throw error;
  }
};

export const deleteTask = async (task) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${task}`, {
      method: 'DELETE'
    });

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(`Failed to delete data. Status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error deleting data:', error);
    throw error;
  }
};

export const insertTask = async (newTaskData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}`, newTaskData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 201) {
      return response.data;
    } else {
      throw new Error(`Failed to insert task. Status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error inserting task:', error);
    throw error;
  }
};

export const updateTaskTitle = async (task, updatedData) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/${task}`,
      { title: updatedData.title, completed: updatedData.completed }
    );

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(`Failed to update title. Status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error update title:', error);
    throw error;
  }
};

