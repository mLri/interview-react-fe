import axios from 'axios'
import React, { useState, useEffect } from 'react'
import socketIOClient from 'socket.io-client'
import { connect } from 'react-redux'

/* import icon component */
import { MdAccountBox } from 'react-icons/md'

import Input from '../../components/Input/Input'
import Btn from '../../components/Button/Btn'

import './Chat.css'

const socket = socketIOClient('http://localhost:3000')

function Chat(props) {

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  }

  const url = 'http://localhost:3000/api/v1'

  const user_id = localStorage.getItem('id')

  const [rooms, setRooms] = useState([])
  const [currentRoom, setCurrentRoom] = useState({})
  const [message, setMessage] = useState('')
  const [indexRoom, setIndexRoom] = useState(0)
  const [sender, setSender] = useState({ first_name: '' })

  const [isAddFriend, setIsAddFriend] = useState(false)
  const [friend, setFriend] = useState({ first_name: '' })
  const [friendTimeOut, setFriendTimeOut] = useState(0)
  const [friendInputATCPShow, setFriendInputATCPShow] = useState(false)
  const [friendList, setFriendList] = useState([])

  useEffect(() => {
    /* socket init */
    socket.on('send_message', (msg) => {
      scrollToBottom({ behavior: 'smooth' })
      props.dispatch({
        type: 'RECEIV_MESSAGE',
        payload: msg
      })
    })

    socket.on('noti_alert', (data) => {
      props.dispatch({
        type: 'SET_ROOM',
        payload: [data]
      })
    })

    leaveNoti(user_id)
    joinNoti(user_id)
  }, [])

  useEffect(async () => {
    const get_room = await axios.get(`${url}/chat_room`, { headers })
    console.log('get_room -L> ', get_room.data)

    if (get_room.data.length) {
      props.dispatch({
        type: 'SET_ROOM',
        payload: get_room.data
      })
      setCurrentRoom(get_room.data[indexRoom])
      // setRooms(get_room.data)

      const find_sender = get_room.data[indexRoom].users.find(val => val._id !== user_id)
      console.log('find_sender -> ', find_sender)
      setSender(find_sender)

      joinChatRoom(get_room.data[indexRoom]._id)

      if (get_room.data[indexRoom].chat.length) {
        await getMsgInRoom(get_room.data[indexRoom]._id)
      }

      scrollToBottom()
    }
  }, [indexRoom])

  const scrollToBottom = (option = {}) => {
    const elm = document.querySelector('.last__message')
    elm.scrollIntoView(option)
  }

  const joinChatRoom = (room_id) => {
    socket.emit('join_room', room_id)
  }

  const joinNoti = (room_id) => {
    socket.emit('join_noti', room_id)
  }

  const leaveNoti = room_id => {
    socket.emit('leave_noti', room_id)
  }

  const leaveChatRoom = room_id => {
    socket.emit('leave_room', room_id)
  }

  const getMsgInRoom = async (id) => {
    const get_message = await axios.get(`${url}/chat_room/${id}`, { headers })
    props.dispatch({
      type: 'GET_MESSAGE',
      payload: get_message.data
    })
  }

  const handleInputChangeFunc = (e) => {
    setMessage(e.target.value)
  }

  const handleInputChangeAddFriend = (e) => {

    if (friendTimeOut) clearTimeout(friendTimeOut)

    let params = '?fields=first_name,username,email'

    if (e.target.value) {
      params += `&search=${e.target.value}`
    } else {
      setFriendInputATCPShow(false)
    }

    setFriendTimeOut(setTimeout(async () => {
      if (e.target.value !== '') {
        const get_friend = await axios.get(`${url}/customers${params}`, { headers })
        console.log('friend ... -> ', get_friend)
        if (get_friend.data.length) {
          setFriendList(get_friend.data)
          setFriendInputATCPShow(true)
        }
      }
      setFriend({ ...friend, first_name: e.target.value })
    }, 700))
  }

  const selectRoom = async (data, index) => {

    const find_sender = data.users.find(val => val._id !== user_id)
    setSender(find_sender)

    leaveChatRoom(currentRoom._id)
    joinChatRoom(data._id)
    await getMsgInRoom(data._id)
    setCurrentRoom(data)
    setIsAddFriend(false)

    setMessage('')
    setFriend('')

    scrollToBottom()
  }

  const sendMessage = async (e) => {
    e.preventDefault()

    const chat_message = {
      room_id: currentRoom._id,
      user_id,
      message: message,
      type: 'message'
    }

    socket.emit('send_message', chat_message)
    setMessage('')
  }

  const readMessage = async () => {
    let data = {
      room_id: currentRoom._id,
      user_id
    }
    socket.emit('read_message', data)
    socket.emit('clear_noti', { room_id: currentRoom._id, user_id })
  }

  const addFriend = async () => {
    setIsAddFriend(true)
  }

  const selectFriend = (data) => {
    setFriend({ ...friend, ...data })
    setFriendInputATCPShow(false)
  }

  const onSubmitAddFriend = async (e) => {
    e.preventDefault()

    if (friend._id) {
      let add_friend = await axios.post(`${url}/chat_room`, { name: friend.first_name, user_id: friend._id }, { headers })

      if (add_friend.data) {

        // add_friend.data.chat = []

        leaveChatRoom(currentRoom._id)

        const rs_add_room = add_friend.data
        console.log('rs_add_room -> ', rs_add_room)

        setCurrentRoom(rs_add_room)

        /* show name who you chat */
        const find_sender = rs_add_room.users.find(val => val._id !== user_id)
        setSender(find_sender)

        setIsAddFriend(false)
        setIndexRoom(rooms.length)

        /* clear text add friend */
        setFriend({ first_name: '' })

        // socket.emit('set_rooms', {
        //   join_chat_id_arr: [friend._id, user_id],
        //   join_room_id: rs_add_room._id,
        //   new_room: rs_add_room
        // })

        /* join new room */
        joinChatRoom(rs_add_room._id)

        /* add room to redux state */
        props.dispatch({
          type: 'SET_ROOM',
          payload: [rs_add_room]
        })

        /* clear message */
        props.dispatch({
          type: 'GET_MESSAGE',
          payload: []
        })
      }

    }
  }

  return (
    <div className="chat__container">

      <div className="chat__left__side">
        <div>Direct Message <span className="add__friend" onClick={addFriend}>+</span></div>
        <div className="chat__list">
          {
            // rooms.map((r, index) => {
            props.chat.rooms.map((r, index) => {
              const sender = r.users.find(val => val._id !== user_id)
              const find_noti = r.users.find(val => val._id === user_id)
              return (
                <div onClick={() => selectRoom(r, index)} key={index} className={`chat__list__item ${(r._id === currentRoom._id) ? 'chat__list__active' : ''}`}>
                  <MdAccountBox size={22} />
                  <span>{sender.first_name}</span>
                  {
                    find_noti.notification[0].noti_count > 0 &&
                    <span className="notification">{find_noti.notification[0].noti_count}</span>
                  }
                </div>
              )
            })
          }
        </div>
      </div>

      <div className="chat__right__side">
        {
          isAddFriend
            ?
            <div>
              add friend...
              <form onSubmit={onSubmitAddFriend}>
                <Input
                  handleOnChangeFunc={handleInputChangeAddFriend}
                  value={friend.first_name}
                  onFocus={true}
                  name="addFriend" />
                <Btn value="invite" />
              </form>
              {
                friendInputATCPShow
                  ?
                  <ul>
                    {
                      friendList.map((f, i) => {
                        return (
                          <li onClick={() => selectFriend(f)} key={i}>{f.email}</li>
                        )
                      })
                    }
                  </ul>
                  : null
              }
            </div>
            :
            <>
              <div className="chat__header">
                <span className="circle__online"></span>
                <span>
                  {sender.first_name}
                </span>
              </div>
              <div className="chat__body">
                {
                  props.chat.messages.map((m, index) => (
                    <div key={index} className={m.user_id === user_id ? 'chat__message__right' : 'chat__message__left'}>{m.chat.message}</div>
                  ))
                }
                <div className="last__message" style={{ width: '100%', height: '20px', float: 'left', clear: 'boat' }} ></div>
              </div>
              <div className="chat__input">
                <form onSubmit={sendMessage}>
                  <Input
                    handleOnClickFunc={readMessage}
                    handleOnChangeFunc={handleInputChangeFunc}
                    value={message}
                    onFocus={true}
                    name="message" />
                </form>
              </div>
            </>
        }
      </div>

    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    chat: state.chat
  }
}

export default connect(mapStateToProps)(Chat)
