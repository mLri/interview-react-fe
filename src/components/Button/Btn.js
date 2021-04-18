import React from 'react'
import './Btn.css'

function Btn({ value, handleSubmitFunc }) {
  return (
    <div className="btn">
      <button>{value}</button>
    </div>
  )
}

export default Btn
