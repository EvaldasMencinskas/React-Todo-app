import React, { useEffect } from 'react';
import styled from 'styled-components';
import TodoItem from './components/todo-item';
import { getTasks, getTotalCount, insertTask } from '../../axios/client-axios';
import { useDebounce } from '../../utils/debounce';
import Paginator from './components/paginator';
import Filters from './components/filters';

 const PageTodo = () => {

  const [page, setPage] = React?.useState(1);
  const [limit, setLimit] = React?.useState(10);
  const [totalCount, setTotalCount] = React?.useState();

  const [titleFilterState, setTitleFilterState] = React?.useState('');
  const [completedFilterState, setCompletedFilterState] = React?.useState(null);

  const [tasksState, setTasksState] = React?.useState([]);
  const [insertState, setInsertState] = React?.useState(false);
  const [insertDataState, setInsertDataState] = React?.useState(null);

  const existingFilters = JSON.parse(localStorage.getItem('filters')) || {};

  const debounceSearchValue = useDebounce(existingFilters?.title, 300);

  const fetchTotalCount = async (completedFilter, titleFilter) => {
      const totalCount = await getTotalCount(completedFilter, titleFilter);
      setTotalCount(() => totalCount)
  };

  const fetchTasks = async (page, limit, completedFilter, titleFilter) => {
      const tasksData = await getTasks(page, limit, completedFilter, titleFilter);
      setTasksState(tasksData);
  };


  const createAndInsertTask = async (data) => {
    const newTaskData = {
      createdAt: Math.floor(new Date().getTime() / 1000),
      title: data.title,
      completed: false,
    };

      await insertTask(newTaskData);

      fetchTasks(page, limit, completedFilterState, debounceSearchValue)

      setInsertState(() => false)
  };

  const handleCompletedFilter = () => {
    if (existingFilters?.completed === true || 
      existingFilters?.completed ===  false || 
      existingFilters?.completed ===  null) {
      setCompletedFilterState(existingFilters.completed);
    }
  };

  useEffect(() => {
    handleCompletedFilter()
    fetchTotalCount(completedFilterState, debounceSearchValue);
    fetchTasks(page, limit, completedFilterState, debounceSearchValue);
  }, [page, limit,completedFilterState, debounceSearchValue]);

  return (
    <ContainerPageTodo>
      <div className="PageTodo_inner">
        <h1 className='PageTodo_header'>
          My Todo
        </h1>

        <div className='insert_todo_container'>
          {!insertState ? <button
            type='button'
            onClick={() => { setInsertState(() => true) }}
          >
            Add Todo
          </button> : 
          <button
            type='button'
            onClick={() => { 
              if(insertDataState) { 
                createAndInsertTask(insertDataState) 
              } else{
                setInsertState(() => false)
              }
            }}
          >
            Save
          </button>}
          {insertState ? (
            <div>
              <input
                  className='insert_input'
                  type='text' 
                  placeholder='Title' 
                  onChange={(e) => {
                    setInsertDataState(() => ({title: e?.target?.value}))
                }}
              />
            </div>
          ) : null}
        </div>

        <Filters
          titleFilterState={titleFilterState}
          completedFilterState={completedFilterState}
          setCompletedFilterState={setCompletedFilterState}
          setTitleFilterState={setTitleFilterState}
          setPage={setPage}
        />

        {!tasksState?.length ? <div className='no_data'>No data</div> : null}

        <TodoItem  
          tasksState={tasksState} 
          onTasksChange={fetchTasks} 
          page={page} 
          limit={limit} 
          titleFilterState={debounceSearchValue} 
          completedFilterState={completedFilterState}
        />

        {tasksState?.length ? 
          <Paginator 
            page={page} 
            totalCount={totalCount}
            limit={limit}
            setPage={setPage}
            setLimit={setLimit}
          /> : null}
      </div>
    </ContainerPageTodo>
  );
};

export default PageTodo;

const ContainerPageTodo = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  padding: 20px;

  .PageTodo_inner{
    width: 100%;
    max-width: 500px;
    color: #fff;
    border-radius: 20px;
    background-color: #333;
    padding: 20px;
    display: flex;
    flex-direction: column;

    .PageTodo_header{
      display: flex;
      justify-content: center;
    }

    button{
      max-width: 100px;
    }
  }

  .insert_todo_container{
    display: flex;
    align-items: center;
    margin: 20px 0px;

    .insert_input{
      margin-left: 10px;
      border-radius: 7px;
      border: solid 2px #f90;
      height: 22px;
      text-indent: 10px;
      font-weight: 600;
    }

    .insert_input:focus{
      border: solid 2px #f90;
      outline: #f90;
    }

    button{
      height: 29px;
      width: 200px;
      border: solid 2px #409573;
      color: #409573;
      cursor: pointer;
      border-radius: 7px;
      font-weight: 600;
    }
  }

  .no_data{
    margin-top: 40px;
    width: 100%;
    display: flex;
    justify-content: center;
    font: normal normal 700 34px sans-serif;
  }
`;
