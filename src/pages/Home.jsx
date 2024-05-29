import io from 'socket.io-client'
import { useEffect, useRef, useState } from 'react'
import style from './Home.module.css'
import { Box, Button, Center, Text } from '@chakra-ui/react';
import Register from '../Components/Register/Register';
import Login from '../Components/Login/Login';
import { setTime } from '../utils/setTime';
import { getToken } from '../hook/use-token';
import Search from '../Components/Search/Search';
import { CloseIcon } from '@chakra-ui/icons';
import { CircleIcon } from '../Components/Icon/CircleIcon';
import { useStore } from '../store/users';
import { useUser } from '../hook/useUser';
import { useAuth } from '../Guard/AuthProvider';

const socket = io('https://chat-server-b4h1.onrender.com', {
  transports: ['websocket']
})

function Home() {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [selectedUser, setSelectedUser] = useState({})
  const [isOpenRegister, setIsOpenRegister] = useState(false)
  const [isOpenLogin, setIsOpenLogin] = useState(false)
  const [isShow, setIsShow] = useState(false)
  const { isAuthenticated, logOut} = useAuth()
  const token = getToken()
  const setUsers = useStore((state) => state.setUsers)
  const ref = useRef(null)
  const { data } = useUser(isAuthenticated)

  useEffect(() => {
    socket.on('user_connected', userConnected)
    socket.on('receive_message', receiveMessage)
    socket.on('user_disconnected', userConnected)
    return () => {
      socket.off('user_connected', userConnected)
      socket.off('receive_message', receiveMessage)
      socket.off('user_disconnected', userConnected)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (token !== 'Anonymous'){
      socket.emit('authentication', token)
    }
  }, [token])

  useEffect(() => {}, [isAuthenticated])
  
  const userConnected = (data) => {
    let users = []
    
    Object.keys(data.users).forEach((key) => {
      const obj = {
        username: data.users[key].username,
        socketID: data.users[key].socketID,
        id: key
      }
      users.push(obj)
    })
    setUsers(users)
  }
  
  const receiveMessage = (data) => {
    setMessages(prev => [...prev, data])
    ref.current?.scrollTo({
        top: ref.current.scrollHeight
      })
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    const newMessage = {
      from: 'Me',
      message
    }
    if (message.length > 0){
      if (token !== 'Anonymous'){
        socket.emit('send_message_to_user', {
          to: selectedUser.id,
          message
        })
      } else {
        socket.emit('anonymous_message', {
          message
        })
      }
      setMessages(prev => [...prev, newMessage])
      setMessage('')
      ref.current?.scrollTo({
        top: ref.current.scrollHeight,
      })
    }
  }

  const handleLogout = () => {
    socket.emit('logout', {
      token: 'Anonymous',
      userID: data?._id
    })
    logOut()
  }

  return (
    <div className={style['container']} >
      {
        !isAuthenticated ? (
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
        ): (
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
      <Search isShow={isShow} setIsShow={setIsShow} setSelectedUser={setSelectedUser}/>
    </div>
      {
        selectedUser?.username ? (
          <div>
            <Center h={10} mt={4}>
              <Box 
                p={'8px 15px'} 
                bg='#003c64' 
                borderRadius='md' 
                fontWeight={700} 
                color={'white'} 
                display={'flex'} 
                alignItems={'center'} 
                justifyContent={'space-between'}
              >
                <CircleIcon 
                  boxSize={2} 
                  color={'#54F54F'}
                  mr={2}
                  />
                <span>{selectedUser.username}</span>
                <CloseIcon 
                  boxSize={2.5} 
                  ml={3}
                  onClick={() => setSelectedUser(null)}
                  cursor={'pointer'}
                  />
              </Box>
            </Center>
          </div>
        ): null
      }
    <div className={style['chat-container']} onClick={() => setIsShow(false)}>
      <div className={style['chat-header']}>
        <ul className={style['chat-messages']} ref={ref}>
          { 
            messages.map((msg, i) => {
              return (
                <div className={`${
                  msg.from === 'Me' ? 
                  style['message-container'] : 
                  style['message-container-other']}`} key={i} >
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
          <input 
            className={style['chat-input']} 
            type="text" 
            value={message} 
            placeholder={selectedUser?.username || token === 'Anonymous' ? 'Write a message' : 'Select a user to send a message'}
            onChange={(e) => setMessage(e.target.value)} 
            disabled={!(token === 'Anonymous') && !selectedUser?.username }
            />
          <button disabled={!(token === 'Anonymous') && !selectedUser?.username}>
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
