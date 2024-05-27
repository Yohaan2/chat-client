import io from 'socket.io-client'
import { useEffect, useState } from 'react'
import style from './Home.module.css'
import { Button, Text } from '@chakra-ui/react';
import Register from '../Components/Register/Register';
import Login from '../Components/Login/Login';
import { setTime } from '../utils/setTime';
import { useLogout } from '../hook/use-auth';
import { getToken } from '../hook/use-token';
import Search from '../Components/Search/Search';

const socket = io('/', {
  auth: {
    token: getToken(),
  },
})

function Home() {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [selectedUserId, setSelectedUserId] = useState('')
  const [selectedUser, setSelectedUser] = useState({})
  const [isOpenRegister, setIsOpenRegister] = useState(false)
  const [isOpenLogin, setIsOpenLogin] = useState(false)
  const [isShow, setIsShow] = useState(false)
  const [users, setUsers] = useState([])
  const [user, setUser] = useState([])
  const isAuthenticated = localStorage.getItem('token')
  const { logout: logOut } = useLogout()
  
  useEffect(() => {
    if(users.length > 0)
    Object.keys(users[0]).forEach((key) => {
      const obj = {
        username: users[0][key].username,
        socketID: users[0][key].socketID,
        id: key
      }
      setUser(prev => [...prev, obj])
    })
    
  }, [users])

  useEffect(() => {
    socket.on('user_connected', userConnected)
    return () => {
      socket.off('user_connected', userConnected)
    }
  }, [socket])

  useEffect(() => {
    socket.on('receive_message', receiveMessage)
    return () => {
      socket.off('receive_message', receiveMessage)
    }
  }, [])

  useEffect(() => {
  }, [isAuthenticated])
  
  const userConnected = (data) => {
    setSelectedUserId(data.userID)
    setUsers(prev => [...prev, data.users])
  }
  
  const receiveMessage = (data) => {
    setMessages(prev => [...prev, data])
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    if (selectedUserId){
      socket.emit('send_message_to_user', {
        to: selectedUser.id,
        message
      })
      const newMessage = {
        from: 'Me',
        message
      }
      setMessages(prev => [...prev, newMessage])
      setMessage('')
    }
  }

  const handleLogout = () => {
    logOut()
  }

  return (
    <div className={style['container']} >
      {
        !isAuthenticated && (
          <>
            <Button
              mt={4}
              ml={6}
              colorScheme='blue'
              variant='outline'
              _hover={{ bg: 'blue.100' }}
              onClick={() => setIsOpenRegister(true)}
            >
              Sign Up
            </Button>
            <Button
              mt={4}
              ml={6}
              colorScheme='blue'
              onClick={() => setIsOpenLogin(true)}
            >
              Sign In
            </Button>
          </>
        )
      }
      {
        isAuthenticated && (
          <Button
            mt={4}
            ml={6}
            colorScheme='blue'
            onClick={() => handleLogout()}
          >
            Log Out
          </Button>
        )
      }
    <Text fontSize='3xl' fontWeight={700} align='center'>Chat</Text>
    <div className={style['search-container']}>
      <Search isShow={isShow} setIsShow={setIsShow} users={user} setSelectedUser={setSelectedUser}/>
    </div>
      {
        selectedUser  ?  (
          <span>{selectedUser.username}</span>
        ): null
      }
    <div className={style['chat-container']} onClick={() => setIsShow(false)}>
      <div className={style['chat-header']}>
        <ul className={style['chat-messages']}>
          { 
            messages.map((msg, i) => {
              return (
                <div className={`${
                  msg.from === 'Me' ? 
                  style['message-container'] : 
                  style['message-container-other']}`} key={i}>
                  <small className={style['message-name']}>{msg.from}</small>
                  <div className={style['messages-list']} >
                    <li key={i}>
                    {msg.message}
                    </li>
                    <span className={style['time']}> {setTime()}</span>
                  </div>
                </div>
              )
          })}
        </ul>
        <form className={style['chat-form']} onSubmit={handleSubmit}>
          <input className={style['chat-input']} type="text" value={message} placeholder='Write a message' onChange={(e) => setMessage(e.target.value)} />
          <button>
            Send
          </button>
        </form>
      </div>
    </div>
    <Register isOpen={isOpenRegister} setIsOpen={setIsOpenRegister} setIsOpenLogin={setIsOpenLogin} />
    <Login isOpen={isOpenLogin} setIsOpen={setIsOpenLogin} /> 
    {
      selectedUserId && (
        <div>
          <small>{selectedUserId}</small>
        </div>
      )
    }
  </div>
  )
}

export default Home
