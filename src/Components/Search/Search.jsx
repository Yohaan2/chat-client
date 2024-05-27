import { Input, Icon } from '@chakra-ui/react'
import { Search2Icon } from '@chakra-ui/icons'
import style from './Search.module.css'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'

const CircleIcon = (props) => (
  <Icon viewBox='0 0 200 200' {...props}>
    <path
      fill='currentColor'
      d='M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0'
    />
  </Icon>
)

const Search = ({ isShow, setIsShow, users, setSelectedUser }) => {
  const [search, setSearch] = useState('')
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {

  }, [users])

  const handleSearch = (e) => {
    const value = e.target.value
    setSearch(value)
    setSuggestions(getSuggestions(value))
    setIsShow(true)
  }

  const getSuggestions = (value) => {
    if(users.length > 0){
      const usernames = users.filter((term) => term.username.toLowerCase().includes(value.toLowerCase()))
      return usernames
    }
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
            suggestions.length === 0 ? (
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
