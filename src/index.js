import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

/* import lib for redux */
import { createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'

// /* import reducer */
import authReducer from './reducers/auth.reducer'
import chatReducer from './reducers/chat.reducer'

const rootReducer = combineReducers({
  auth: authReducer,
  chat: chatReducer
})

const store = createStore(rootReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())


ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
