import { act } from "react-dom/test-utils"

const authReducer = (state = { rooms: [], messages: [] }, action) => {
  switch (action.type) {
    case 'SET_ROOM':
      let find_room = state.rooms.find(val => String(val._id) === String(action.payload[0]._id))
      console.log('find room === ', find_room)
      if (!find_room) {
        console.log('if...')
        const new_room = state.rooms.concat(action.payload)
        return { ...state, rooms: new_room }
      } else {
        console.log('else...')
        find_room.users = action.payload[0].users
        console.log(state)
        return { ...state, rooms: state.rooms }
      }
    case 'GET_MESSAGE':
      return { ...state, messages: action.payload }
    case 'SET_DATA':
      return { ...state, rooms: action.payload.rooms, messages: action.payload.messages }
    case 'RECEIV_MESSAGE':
      console.log('payload...', action.payload)
      const new_message = state.messages.concat(action.payload)
      return { ...state, messages: new_message }
    default:
      return state
  }
}

export default authReducer