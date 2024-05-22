import io from 'socket.io-client'
import { useEffect, useState } from 'react'
import style from './Home.module.css'
import { Button, Text } from '@chakra-ui/react';
import Register from '../Components/Register/Register';
import Login from '../Components/Login/Login';
import { getToken } from '../hook/use-token';
import { setTime } from '../utils/setTime';
import { useLogout } from '../hook/use-auth';

const socket = io('/', {
  auth: {
    token: getToken(),
  },
})

function Home() {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [user, setUser] = useState('')
  const [isOpenRegister, setIsOpenRegister] = useState(false)
  const [isOpenLogin, setIsOpenLogin] = useState(false)
  const isAuthenticated = localStorage.getItem('token')
  const { logout: logOut } = useLogout()

  useEffect(() => {
    socket.on('message', reciveMessage)
    return () => {
      socket.off('message', reciveMessage)
    }
  }, [])

  useEffect(() => {
  }, [isAuthenticated])
  
  const reciveMessage = (msg) => {
    setMessages(prev => [...prev, msg])
    setUser(msg.from)
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    socket.emit('message', message)
    setMessage('')
  }
  const userName = localStorage.getItem('username')
  const handleLogout = () => {
    logOut()
  }

  return (
    <div className={style['container']}>
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
    <div className={style['chat-container']}>
      <div className={style['chat-header']}>
        <ul className={user === userName ? style['chat-messages'] : style['chat-messages-other']}>
          { 
            messages.map((msg, i) => {
              return (
                <div className={style['message-container']} key={i}>
                  <small className={style['message-name']}>{user === userName ? 'Me' : msg.from}</small>
                  <div className={style['messages-list']} >
                    <li key={i}>
                    {msg.body}
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
  </div>
  )
}

export default Home
