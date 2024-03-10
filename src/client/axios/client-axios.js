import axios from 'axios';

const API_BASE_URL = new URL('https://65e9d18dc9bf92ae3d3a5376.mockapi.io/tasks');

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getTasks = async () => {
  try {
    const response = await axios.get(API_BASE_URL, {
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

export const updateTask = async (task, updatedData) => {
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

