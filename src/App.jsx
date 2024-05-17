import io from 'socket.io-client'
import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid';
import style from './App.module.css'

const getUsername = async () => {
  const username = localStorage.getItem('username')
  if (username) {
    return username
  }
  const response = await fetch('https://random-data-api.com/api/v2/users')

  const { username: randomUsername } = await response.json()
  console.log(randomUsername)
  localStorage.setItem('username', randomUsername)
  return randomUsername
}

const getToken = () => {
  const token = localStorage.getItem('token')
  if (token) {
    return token
  }

  localStorage.setItem('token', uuidv4())
  return uuidv4()
}

const socket = io('/', {
  auth: {
    username: await getUsername(),
    token: getToken(),
  },
})

function App() {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [user, setUser] = useState('')

  const setTime = () => {
    const time = new Date().toLocaleTimeString()
    const [ hour, minute, secondAndAmPm] = time.split(':')
    const amOrPm = secondAndAmPm.toLowerCase()
    return `${hour}:${minute} ${amOrPm.includes('p') ? 'pm' : 'am'}`
  }

  useEffect(() => {
    socket.on('message', reciveMessage)
    return () => {
      socket.off('message', reciveMessage)
    }
  }, [])
  
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

  return (
    <div className={style['container']}>
    <h1>Chat</h1>
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
  </div>
  )
}

export default App
