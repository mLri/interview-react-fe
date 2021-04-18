import React from 'react'
import './Pagination.css'

function Pagination({ totalPage, pageCurent, setPageCurent }) {

  const selectPage = (e) => {
    setPageCurent(paginate => paginate = e.target.innerText)
    const paginateElm = Array.from(document.querySelectorAll('.paginate'))
    paginateElm.map(p => p.className = 'paginate')
    e.target.className = 'paginate active'
  }

  return (
    <div className="paginate__container">
      {
        [...Array(totalPage)].map((val, index) => {
        return (
          <span className={`paginate ${pageCurent === index + 1 ? 'active' : ''}`} key={index} onClick={selectPage}>{index + 1}</span>
        )})
      }
    </div>
  )
}

export default Pagination
