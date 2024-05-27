import { Input } from '@chakra-ui/react'
import { Search2Icon } from '@chakra-ui/icons'
import style from './Search.module.css'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { CircleIcon } from '../Icon/CircleIcon'
import { useUser } from '../../hook/useUser'
import { useAutheticated } from '../../hook/use-auth'
import { useStore } from '../../store/users'

const Search = ({ isShow, setIsShow, setSelectedUser }) => {
  const [search, setSearch] = useState('')
  const [suggestions, setSuggestions] = useState([]);
  const isAuthenticated = useAutheticated()
  const { data } = useUser(isAuthenticated)
  const usersConnect = useStore((state) => state.users)
  
  const handleSearch = (e) => {
    const value = e.target.value
    setSearch(value)
    setSuggestions(getSuggestions(value))
    setIsShow(true)
  }
  
  const getSuggestions = (value) => {
    if(usersConnect.length > 0){
      let usernames = usersConnect.filter((term) => term.username.toLowerCase().includes(value.toLowerCase()))
      usernames = usernames.filter((user) => user.username !== data.username)

      const newUsernames = new Set(usernames)
      return [...newUsernames]
    }
    return []
  }

  const selectUser = (user) => {
    setSearch('')
    setIsShow(false)
    setSelectedUser(user)
  }
  return (
    <div>
      <div className={style['search-container']}>
      <Search2Icon 
        boxSize={6} 
        color={'white'} 
        className={style['search-icon']}
        />
      <Input 
        placeholder='Search your friends' 
        width={350} 
        backgroundColor={'#157bbe'}
        borderRadius={search && isShow === true ? '15px 15px 0 0' : '15px'}
        outline={'none'}
        border={'none'}
        color={'white'}
        _placeholder={{ color: '#fffa' }}
        _focusVisible={{ outlineOffset: 'none', outline: 'none', border: 'none'}}
        padding={'23px 23px 23px 40px'}
        onChange={handleSearch}
        onClick={() => setIsShow(true)}
        value={search}
        />
      </div>
        <ul className={`${!search || !isShow ? style['suggestions-not-display'] :  style['suggestions']}`}>
          {
            suggestions?.length === 0 ? (
              <li className={style['not-found']}>Not found...</li>
            ) :
            suggestions?.map((suggestion, i) => {
              return (
                <div key={i} className={style['suggestions-item']} onClick={() => selectUser(suggestion)}>
                  <li className={style['suggestions-item-text']}>
                    <div className={style['suggestions-item-text-circle']}>
                      <small>Online</small>
                      <CircleIcon boxSize={2} color={'#54F54F'} className={style['circle-icon']} backgroundColor={'green'}/>
                    </div>
                    <span>{suggestion.username}</span>
                  </li>
                </div>
              )
            })
          }
        </ul>
    </div>
  )
}

Search.propTypes = {
  isShow: PropTypes.bool,
  setIsShow: PropTypes.func,
  users: PropTypes.array,
  setSelectedUser: PropTypes.func,
}

export default Search
