import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router'
import './Todo.css'

import Card from '../../components/Card/Card'
import Pagination from '../../components/Pagination/Pagination'
import Input from '../../components/Input/Input'
import Btn from '../../components/Button/Btn'

function Todo() {

  const history = useHistory()

  const [todoList, setTodoList] = useState([])
  const [totalPage, setTotalPage] = useState(0)
  const [pageCurent, setPageCurent] = useState(1)

  /* alway clean data */
  const [editOpen, setEditOpen] = useState(false)
  const [editObj, setEditObj] = useState({})
  const [state, setState] = useState({
    title: '',
  })

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  }

  const url = 'http://localhost:3000/api/v1'

  const limit = 10

  useEffect(() => {
    getTodo()
  }, [pageCurent])

  const getTodo = async () => {
    try {
      const getTodo = await axios.get(`${url}/todos?limit=${limit}&page=${pageCurent}&sorted_order=desc`, { headers })
      setTodoList(getTodo.data.result)
      console.log('getTodo.data.total -> ', getTodo.data.total)
      setPageAmount(getTodo.data.total)

      setEditObj({})
      setEditOpen(false)
      setState({ title: '' })
    } catch (error) {
      if (error.response.data.message === 'jwt expired' || error.response.data.message === 'jwt malformed' || error.response.data.message === 'invalid signature') {
        localStorage.removeItem('token')
        localStorage.removeItem('id')
        history.push('/')
      }
    }
  }

  const setPageAmount = (total) => {
    const page_amount = Math.ceil(total / limit)
    setTotalPage(page_amount)
  }


  const delTodoFunc = async (id) => {
    try {
      const delTodoResult = await axios.delete(`${url}/todos/${id}`, { headers })
      const del_todo = todoList.filter(todo => todo._id !== id)
      setTodoList(del_todo)
  
      setPageAmount(delTodoResult.data.total)
  
      getTodo()
  
      if (pageCurent === 1 && del_todo.length === 0) {
        getTodo()
      } else if (pageCurent !== 1 && del_todo.length === 0) {
        setPageCurent(pageCurent - 1)
      }
  
      setEditObj({})
      setEditOpen(false)
    } catch(error) {
      if (error.response.data.message === 'jwt expired' || error.response.data.message === 'jwt malformed') {
        localStorage.removeItem('token')
        localStorage.removeItem('id')
        history.push('/')
      }
    }
  }

  const editTodoFunc = async (data) => {
    setEditOpen(true)
    const edit_data = todoList.find(todo => todo._id === data._id)
    setEditObj(edit_data)
    setState({ title: edit_data.title })
  }

  const handleInputChangeFunc = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value
    });
  }

  const handleSubmitAdd = async (e) => {
    e.preventDefault()
    try {
      const createTodo = await axios.post(`${url}/todos`, { title: state.title }, { headers })

      if (todoList.length >= 10) {
        const cloneTodoList = JSON.parse(JSON.stringify(todoList))
        cloneTodoList.pop()
        setTodoList([createTodo.data.result, ...cloneTodoList])
      } else {
        setTodoList([createTodo.data.result, ...todoList])
      }
  
      console.log('add todo -> ', createTodo.data.total)
      setPageAmount(createTodo.data.total)
      setState({ title: '' })
    } catch(error) {
      if (error.response.data.message === 'jwt expired' || error.response.data.message === 'jwt malformed' || error.response.data.message === 'invalid signature') {
        localStorage.removeItem('token')
        localStorage.removeItem('id')
        history.push('/')
      }
    }
  }

  const handleSubmitEdit = async (e) => {
    e.preventDefault()
    try {
      const editTodo = await axios.patch(`${url}/todos/${editObj._id}`, { title: state.title }, { headers })
      const list = todoList.map(todo => {
        if (todo._id === editObj._id) {
          return {
            ...todo,
            ...editTodo.data,
          }
        } else {
          return todo
        }
      })
      setTodoList(list)
  
      setEditOpen(false)
      setEditObj({})
      setState({ title: '' })
    } catch (error) {
      if (error.response.data.message === 'jwt expired' || error.response.data.message === 'jwt malformed') {
        localStorage.removeItem('token')
        localStorage.removeItem('id')
        history.push('/')
      }
    }
  }

  const taskSuccessFunc = async (data) => {
    try {
      await axios.patch(`${url}/todos/${data._id}`, { completed: !data.completed }, { headers })

      const completed_list = todoList.map(todo => {
        if (todo._id === data._id) {
          return {
            ...todo,
            completed: !todo.completed
          }
        } else {
          return todo
        }
      })
      setTodoList(completed_list)
    } catch(error) {
      if (error.response.data.message === 'jwt expired' || error.response.data.message === 'jwt malformed') {
        localStorage.removeItem('token')
        localStorage.removeItem('id')
        history.push('/')
      }
    }
  }

  return (
    <div className="todo__container">
      <h1 style={{ textAlign: 'center' }}>Demo Todo</h1>
      <div className="list__container">
        {
          editOpen
            ?
            <form onSubmit={handleSubmitEdit}>
              <Input
                handleOnChangeFunc={handleInputChangeFunc}
                value={editObj.title}
                onFocus={true}
                name="title" />
              <Btn value="Edit" />
            </form>
            :
            <form onSubmit={handleSubmitAdd}>
              <Input
                handleOnChangeFunc={handleInputChangeFunc}
                value={state.title}
                name="title"
                placeholder="Type your todo here..." />
              <Btn value="Add" />
            </form>
        }

        <div className="list__title">List Todo</div>
        <div className="list__item">
          {
            todoList.length ?
              todoList.map((item, index) => (
                <Card taskSuccessFunc={taskSuccessFunc} delTodoFunc={delTodoFunc} editTodoFunc={editTodoFunc} key={index} item={item} />
              ))
              :
              <p>data empty</p>
          }
        </div>
        {(todoList.length != 0) && <Pagination totalPage={totalPage} pageCurent={pageCurent} setPageCurent={setPageCurent} />}
      </div>
    </div>
  )
}

export default Todo
