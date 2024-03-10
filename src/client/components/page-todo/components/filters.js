import React from 'react';
import styled from 'styled-components';


 const Filters = (props) => {
   const existingFilters = JSON.parse(localStorage.getItem('filters')) || {};

  return (
    <ContainerTodoItem>
      <div className='PageTodo_filters'>
        <div className='filter_section'>
          <input 
            className='search_input'
            type='text' 
            placeholder='Search'
            value={existingFilters?.title || props?.titleFilterState}
            onChange={(e) => {
              const newTitleFilter = e.target.value;
              props?.setPage(() => 1)
              props?.setTitleFilterState(() => newTitleFilter)

              const updatedFilters = { ...existingFilters, title: newTitleFilter };
              localStorage.setItem('filters', JSON.stringify(updatedFilters));
              }}
          />

          <div className='completed_filter_container'>
            <div className='completed_filter_container_inner'>
              <label htmlFor='TitleInput'>Show</label>
              <div className='completed_filter_buttons'>
                <button
                  className={props?.completedFilterState === true ? 'active' : 'inactive'}
                  onClick={() => {
                    props?.setPage(() => 1)
                    props?.setCompletedFilterState(false)
                    const updatedFilters = { ...existingFilters, completed: false };
                    localStorage.setItem('filters', JSON.stringify(updatedFilters));
                  }}
                >
                  Completed
                </button>
                <button
                  className={props?.completedFilterState === false ? 'active' : 'inactive'}
                  onClick={() => {
                    props?.setPage(() => 1)
                    props?.setCompletedFilterState(null)
                    const updatedFilters = { ...existingFilters, completed: null };
                    localStorage.setItem('filters', JSON.stringify(updatedFilters));
                  }}
                >
                  Incomplete
                </button>
                <button
                  className={props?.completedFilterState === null ? 'active' : 'inactive'}
                  onClick={() => {
                    props?.setPage(() => 1)
                    props?.setCompletedFilterState(true)
                    const updatedFilters = { ...existingFilters, completed: true };
                    localStorage.setItem('filters', JSON.stringify(updatedFilters));
                  }}
                >
                  All
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ContainerTodoItem>
  );
};

export default Filters;

const ContainerTodoItem = styled.div`
margin-bottom: 10px;
  .filter_section{
    display: flex;
    justify-content: space-between;
  }

  .active{
    display: block;
  }

  .inactive{
    display: none;
  }

  .completed_filter_container{
    display: flex;
    align-items: center;
    font-weight: 600;
  }

  .completed_filter_container_inner{
    display: flex;
    align-items: center;
  }

  .completed_filter_buttons{
    margin-left: 10px;

    button{
      height: 29px;
      border: solid 2px #f90;
      color: #f90;
      cursor: pointer;
      border-radius: 7px;
      font-weight: 600;
    }
  }

  .search_input{
      border-radius: 7px;
      border: solid 2px #f90;
      height: 22px;
      text-indent: 10px;
      font-weight: 600;
  }

  .search_input:focus{
      border: solid 2px #f90;
      outline: #f90;
    }

  @media only screen and (max-width: 540px) {
    .filter_section{
    display: block;
  }

  .completed_filter_container_inner{
    margin-top: 10px;
  }
  }
`;
