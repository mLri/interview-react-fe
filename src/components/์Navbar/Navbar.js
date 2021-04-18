import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router'

import './Navbar.css'

function Navbar({ show_login = false, logoutFunc }) {

  const history = useHistory()

  const [isLogin, setIsLogin] = useState(false)

  useEffect(() => {
    setIsLogin(show_login)
  }, [isLogin])

  const logoutFunction = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('id')
    history.push('/')
    logoutFunc()
  }

  return (
    <div className="container">
      <div className="nav__logo">mLri</div>
      <div></div>
      <div className="nav__login">
        {
          show_login
            &&
            <span onClick={logoutFunction} className="logout">Logout</span>
        }

      </div>
    </div>
  )
}

export default Navbar
