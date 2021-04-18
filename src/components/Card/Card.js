import React from 'react'
import './Card.css'

function Card({ taskSuccessFunc, delTodoFunc, editTodoFunc, item }) {
  return (
    <div onDoubleClick={() => taskSuccessFunc(item)} className={"card__container " + (item.completed ? "card__completed" : "")}>
      <button
        onClick={() => editTodoFunc(item)}
        className="edit__card__btn" >//</button>
      <button
        onClick={() => window.confirm("Are you sure you wish to delete this item?") && delTodoFunc(item._id)}
        className="del__card__btn">
        x
      </button>
      <span>{item.title}</span>
    </div>
  )
}

export default Card
