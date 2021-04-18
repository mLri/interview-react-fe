import { useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { connect } from 'react-redux'

import './App.css'

/* import component */
import Todo from './views/Todo/Todo'
import Login from './views/Login/Login'
import Navbar from './components/์Navbar/Navbar'
import Chat from './views/Chat/Chat'
import Test from './views/test/Test'

function App(props) {

  useEffect(() => {
    const get_token = localStorage.getItem('token')
    if (get_token) {
      props.dispatch({ type: 'SIGNIN' })
    }
  }, [])

  const callbackLogout = () => {
    props.dispatch({ type: 'SIGNOUT' })
  }

  return (
    <div className="app__container">
      <Router>
        <div className="navbar__container">
          <Navbar show_login={props.auth.isLogedin} logoutFunc={callbackLogout} />
        </div>
        <div className="content__container">
          <Switch>
            <Route path="/" exact render={() => (<Login />)} />
            <Route path="/todo" render={() => (<Todo />)} />
            <Route path="/chat" render={() => (<Chat />)} />
            <Route path="/test" render={() => (<Test />)} />
          </Switch>
        </div>
      </Router>
    </div>
  );
}

const mapPropsToState = (state) => {
  return {
    auth: state.auth
  }
}

export default connect(mapPropsToState)(App);
