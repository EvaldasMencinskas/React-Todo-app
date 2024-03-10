import React from 'react';
import styled from 'styled-components';
import { SVGIconArrowRightThin } from '../../../svg/svg-icon-arrow-right-thin';


 const Paginator = (props) => {
  const totalPages = Math.ceil(props?.totalCount / props?.limit);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      props?.setPage(() => newPage);
    }
  };

  const renderPageButtons = () => {
    const visiblePages = [];
    const maxVisiblePages = 1;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= props?.page - 1 && i <= props?.page + 1) ||
        (i >= totalPages - maxVisiblePages && i <= totalPages)
      ) {
        visiblePages?.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={i === props?.page ? 'active_page' : ''}
          >
            {i}
          </button>
        );
      } else if (
        (i === props?.page - 2 && i > 2) ||
        (i === totalPages - maxVisiblePages - 1 && i < totalPages - 1)
      ) {
        visiblePages.push(<span key={i}>...</span>);
      }
    }

    return visiblePages;
  };

  
  return (
    <ContainerTodoItem>

      <div className='paginator_page'>
          <label htmlFor="pageSizeSelect" className='page_label'>Page: </label>
          <button 
            className='left_paginator_arrow' 
            onClick={() => handlePageChange(props?.page - 1)}>
              <SVGIconArrowRightThin/>
          </button>

          {renderPageButtons()}

          <button 
            className='right_paginator_arrow'
            onClick={() => handlePageChange(props?.page + 1)}>
            <SVGIconArrowRightThin/>
          </button>
      </div>
      
      <div className="paginator_page_size">
          <label htmlFor="pageSizeSelect" className='page_size_label'>Page Size: </label>
          <select
            className='page_size_select'
            id="pageSizeSelect"
            value={props?.limit}
            onChange={(e) => {
              props?.setPage(() => 1)
              props?.setLimit(() => e.target.value)
            }}
          >
            <option className='page_size_option' value={5}>5</option>
            <option className='page_size_option' value={10}>10</option>
            <option className='page_size_option' value={15}>15</option>
          </select>
      </div>
    </ContainerTodoItem>
  );
};

export default Paginator;

const ContainerTodoItem = styled.div`
  margin: 20px 0px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  button{
    cursor: pointer;

  }

  .left_paginator_arrow{
    cursor: pointer;
    transform: rotateY(180deg);
  }
  
  .right_paginator_arrow{
    cursor: pointer;
  }

  .page_size_label, .page_label{
    font-weight: 600;
  }

  button {
    margin-right: 5px;
    border-radius: 7px;
    background-color: #444;
    border: 2px solid #fff;
    color: #fff;
  }

  span{
    margin-right: 5px;
  }

  .active_page {
    cursor: pointer;
    border: 2px solid #f90;
    border-radius: 7px;
    font-weight: bold;
    color: #f90;
  }

  .page_size_select {
    font-weight: 600;
    font-size: 14px;
    color: #f90;
    border: 1px solid #ccc;
    border-radius: 4px;
    outline: none;
    cursor: pointer;
  }

  .page_size_select:hover {
    border-color: #f90;
  }

  .page_size_select:focus {
    border-color: #f90;
    box-shadow: 0 0 5px #f90;
  }

  select option {
    font-weight: 600;
  }


  @media only screen and (max-width: 540px) {
    display: block;

    .paginator_page{
      margin-bottom: 20px;
    }

    .paginator_page button:not(.active_page, .left_paginator_arrow, .right_paginator_arrow) {
      display: none;
    }
  }
`;
