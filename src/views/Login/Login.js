import React, { useState, useEffect, useReducer } from 'react'
import { useHistory } from 'react-router'
import axios from 'axios'

import { connect } from 'react-redux'

import Input from '../../components/Input/Input'
import Btn from '../../components/Button/Btn'

const headers = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer ' + localStorage.getItem('token')
}

const url = 'http://localhost:3000/api/v1'


function Login(props) {

  const history = useHistory()

  const [state, setState] = useState({ username: '', password: '' })

  useEffect(() => {
    if (localStorage.getItem('token')) {
      history.push('/todo')
    }
    console.log('props Login -> ', props)
  }, [])

  const handleInputChangeFunc = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value
    });
  }

  const loginFunc = async (e) => {
    e.preventDefault()
    const login = await axios.post(`${url}/auth/signin`, { ...state }, { headers })
    localStorage.setItem('token', login.data.access_token)
    localStorage.setItem('id', login.data._id)
    props.dispatch({ type: 'SIGNIN' })
    history.push('/todo')
  }

  return (
    <div className="login__container">
      <form onSubmit={loginFunc}>
        <Input
          handleOnChangeFunc={handleInputChangeFunc}
          value={state.username}
          name="username"
          placeholder="Type your username" />
        <Input
          handleOnChangeFunc={handleInputChangeFunc}
          value={state.password}
          name="password"
          type="password"
          placeholder="Type your password" />
        <div>
          <Btn value="Login" />
        </div>
      </form>
    </div>
  )
}

const mapPropsToState = (state) => {
  return {
    auth: state.auth
  }
}

export default connect(mapPropsToState)(Login)
