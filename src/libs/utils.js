function formatNumber(num) {
  const n = num.toString()
  return n[1] ? n : `0${n}`
}

function formatTime(date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const dateStr = [year, month, day].map(formatNumber).join('/')
  const timeStr = [hour, minute, second].map(formatNumber).join(':')
  return `${dateStr} ${timeStr}`
}

export { formatTime }  // eslint-disable-line
