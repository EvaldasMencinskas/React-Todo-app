import React, { useEffect } from 'react';
import styled from 'styled-components';
import TodoItem from './components/todo-item';
import { getTasks, insertTask } from '../../axios/client-axios';
import { useDebounce } from '../../utils/debounce';
import Paginator from './components/paginator';
import Filters from './components/filters';
import { isValid } from '../../utils/is-valid';
import { filterSortAndPaginateTasks } from '../../utils/filter-sort-and-paginate-tasks';

 const PageTodo = () => {

  const [page, setPage] = React?.useState(1);
  const [limit, setLimit] = React?.useState(10);
  const [totalCount, setTotalCount] = React?.useState();

  const [titleFilterState, setTitleFilterState] = React?.useState('');
  const [completedFilterState, setCompletedFilterState] = React?.useState(null);

  const [tasksState, setTasksState] = React?.useState([]);
  const [insertState, setInsertState] = React?.useState(false);
  const [insertDataState, setInsertDataState] = React?.useState(null);
  const [refresh, setRefresh] = React.useState(false);
  // testas

  // possibility to use them for sorting from ui.
  const [sortOrder, setSortOrder] = React.useState('desc');
  const [sortBy, setSortBy] = React.useState('createdAt');

  const existingFilters = JSON.parse(localStorage.getItem('filters')) || {};
  const existingData = JSON.parse(localStorage.getItem('todoData')) || {};

  const debounceSearchValue = useDebounce(existingFilters?.title, 300);

  const fetchTasks = async () => {
  if (
    existingData?.tasks &&
    existingData?.timestamp &&
    isValid(existingData?.timestamp)
  ) {
    const paginatedTasks = filterSortAndPaginateTasks(
      existingData?.tasks,
      debounceSearchValue,
      completedFilterState,
      page,
      limit,
      sortBy,
      sortOrder);
    setTasksState(paginatedTasks);
    setTotalCount(existingData?.tasks?.length);
  } else {
    const tasksData = await getTasks();
    const paginatedTasks = filterSortAndPaginateTasks(
      tasksData,
      debounceSearchValue,
      completedFilterState,
      page,
      limit,
      sortBy,
      sortOrder);
    setTasksState(paginatedTasks);
    setTotalCount(() => tasksData?.length)

    const dataToStore = {
      tasks: tasksData,
      timestamp: Date.now(),
    };
    localStorage.setItem('todoData', JSON.stringify(dataToStore));
  }
};


  const createAndInsertTask = async (data) => {
    const newTaskData = {
      createdAt: Math.floor(new Date().getTime() / 1000),
      title: data.title,
      completed: false,
    };

      await insertTask(newTaskData);

      const updatedTasks = await getTasks();

      const dataToStore = {
        tasks: updatedTasks,
        timestamp: Date.now(),
      };
      localStorage.setItem('todoData', JSON.stringify(dataToStore));

      fetchTasks()

      setInsertState(() => false)
      setRefresh((prev) => !prev)
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
    fetchTasks();
  }, [page, limit, debounceSearchValue,completedFilterState, refresh]);

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
          setRefresh={setRefresh}
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
