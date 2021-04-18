const authReducer = (state = { isLogedin: false }, action) => {
  switch (action.type) {
    case 'SIGNIN':
      return { ...state, isLogedin: true }
    case 'SIGNOUT':
      return { ...state, isLogedin: false }
    default:
      return state
  }
}

export default authReducer