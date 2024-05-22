export const setTime = () => {
  const time = new Date().toLocaleTimeString()
  const [ hour, minute, secondAndAmPm] = time.split(':')
  const amOrPm = secondAndAmPm.toLowerCase()
  return `${hour}:${minute} ${amOrPm.includes('p') ? 'pm' : 'am'}`
}