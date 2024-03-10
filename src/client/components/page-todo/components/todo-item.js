import React from 'react';
import styled from 'styled-components';
import { deleteTask, updateTaskTitle } from '../../../axios/client-axios';
import SVGIconBin from '../../../svg/svg-icon-bin';
import SVGIconEdit from '../../../svg/svg-icon-edit';

 const TodoItem = (props) => {
  const [editStates, setEditStates] = React?.useState({});
  const [updatedData, setUpdatedData] = React?.useState({});
  const [expandedTasks, setExpandedTasks] = React?.useState({});

  const handleDeleteTask = async (taskId) => {
      await deleteTask(taskId);

      props?.onTasksChange(props?.page, props?.limit, props?.completedFilterState, props?.titleFilterState);
  };



  const handleToggleEdit = (taskId) => {
    setEditStates((prevStates) => ({
      ...prevStates,
      [taskId]: !prevStates[taskId],
    }));
  };

  const handleUpdateTaskTitle = async (taskId, updatedData) => {
      await updateTaskTitle(taskId, updatedData);

      setEditStates((prevStates) => {
        const updatedStates = { ...prevStates };
        updatedStates[taskId] = false;
        return updatedStates;
      });

      setUpdatedData((prev) => ({ ...prev, [taskId]: '' }));

      props?.onTasksChange(props?.page, props?.limit, props?.completedFilterState, props?.titleFilterState);
  };


  const loadInitialData = (taskId) => {
    const taskToEdit = props?.tasksState.find((task) => task.id === taskId);
  
    if (taskToEdit) {
      setUpdatedData((prev) => ({
        ...prev,
        [taskId]: {
          title: taskToEdit.title,
          completed: taskToEdit.completed,
        },
      }));
    }
  };

  const toggleExpand = (taskId) => {
    setExpandedTasks((prevExpandedTasks) => ({
      ...prevExpandedTasks,
      [taskId]: !prevExpandedTasks[taskId],
    }));
  };
  
  return (
    <ContainerTodoItem>
        {props?.tasksState?.map((task) => (
          <div key={task?.id} className={`item ${editStates[task?.id] ? 'edit-mode' : ''}`}>
            {editStates[task?.id] ? 
              <div className='edit_inputs'>
                <input 
                  className='title_input'
                  type='text' 
                  placeholder='Title'
                  value={updatedData[task?.id]?.title}
                  onChange={(e) => {
                    setUpdatedData((prev) => ({ ...prev, [task?.id]: { ...prev[task?.id], title: e.target.value } }));
                  }}
                />
                <input
                  type="checkbox"
                  id="Completed"
                  checked={updatedData[task?.id]?.completed}
                  onChange={() => {
                    setUpdatedData((prev) => ({ ...prev, [task?.id]: { ...prev[task?.id], completed: !prev[task?.id]?.completed } }));
                  }}/>
                <label htmlFor="Completed" />
                    
              </div>
             : <h5
             key={task.id}
             onClick={() => toggleExpand(task.id)}
             className={`${expandedTasks[task.id] ? 'expanded' : ''} ${
               task?.completed === true ? 'completed_todo' : ''
             }`}
           >
             {task.title}
           </h5>}
            <div className='buttons_container'>
              {editStates[task?.id] ? 
                  <>
                    <button
                      className='save_button'
                      type='button'
                      onClick={() => {
                        handleUpdateTaskTitle(task?.id, updatedData[task?.id]);
                        handleToggleEdit(task?.id);
                      }}
                    >
                      Save
                    </button>
                    <button
                      className='cancel_button'
                      type='button'
                      onClick={() => {
                        setUpdatedData((prev) => ({ ...prev, [task?.id]: '' }));
                        handleToggleEdit(task?.id);
                      }}
                    >
                      Cancel
                    </button>
                  </> 
                  : 
                  <button
                  className='edit_button'
                  type='button'
                  onClick={() => { 
                    loadInitialData(task?.id)
                    handleToggleEdit(task?.id)
                  }}
                  >
                   <SVGIconEdit />
                  </button>}


              <button
                  className='delete_button'
                  type='button'
                  onClick={() => { handleDeleteTask(task?.id)}}
                  >
                <SVGIconBin/>
              </button>
            </div>
          </div>
        ))}
    </ContainerTodoItem>
  );
};

export default TodoItem;

const ContainerTodoItem = styled.div`
.item{
    background-color: #444;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 5px;
    padding: 5px 10px 5px 10px;
    border-radius: 7px;
  }

  .edit_inputs{
    display: flex;
    align-items: center;
    .title_input{
      border-radius: 7px;
      border: solid 2px #f90;
      height: 22px;
      text-indent: 10px;
    }

    .title_input:focus{
      border: solid 2px #f90;
      outline: #f90;
    }
   
    input[type="checkbox"] {
	    display: none;
    }

    input[type="checkbox"] + label {
      width: 24px;
      height: 24px;
      background: #fff;
      border: 2px solid #f90;
      border-radius: 7px;
      cursor: pointer;
      margin-left: 10px;
    }

    input[type="checkbox"]:checked + label {
      background: #f90
        url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 80'%3E%3Cpath d='M.5.5h79v79H.5z' fill='%23ff9e12'/%3E%3Cpath d='M60.7 16c1.2.3 2.2.8 3.1 1.7 1.5 1.6 1.7 4 .3 5.8l-9 13.2C49.5 45 43.8 53.2 38.2 61.5c-1.6 2.6-5.1 3.3-7.7 1.7-.5-.3-1-.8-1.4-1.3-4.3-5.2-8.7-10.4-13-15.7-.5-.7-.9-1.5-1.3-2.3v-1.6c.1-.1.1-.2.2-.4.5-1.9 2.2-3.3 4.1-3.5 2-.4 4 .3 5.2 1.9l8.2 9.8c.2.2.3.4.6.7l3.1-4.6c6.2-9.2 12.5-18.3 18.7-27.5.9-1.4 2.3-2.4 4-2.7h1.8z' fill='%23fff'/%3E%3C/svg%3E")
        no-repeat;
    }
  }
  

  .buttons_container{
    display: flex;
    align-items: center;
    button{
      cursor: pointer;
      border-radius: 7px;
      font-weight: 600;
      
    }

    .save_button{
      height: 29px;
      border: solid 2px #409573;
      color: #409573;
      margin-left: 10px;
    }

    .cancel_button{
      height: 29px;
      border: solid 2px #a73d3d;
      color: #a73d3d;
      margin-left: 10px;
    }

    .edit_button{
      border: solid 2px #409573;
      margin-left: 10px;
    }

    .delete_button{
      border: solid 2px #a73d3d;
      margin-left: 10px;
    }
  }

  h5{
    text-align: justify;
    max-width: 380px;
    margin: 0px;

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .expanded {
  white-space: normal;
  max-width: none;
}

  .completed_todo{
    text-decoration: line-through;
    color: gray;
  }

  @media only screen and (max-width: 540px) {
    .item:is(.edit-mode) {
    display: block;
    }

    .buttons_container{
      margin-top: 10px;

      .save_button{
        margin-left: 0px;
      }
    }
  }
`;

