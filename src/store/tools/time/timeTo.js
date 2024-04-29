import dayjs from './dayjsWrapper'
export default (store) => {
  return (target, from) => {
    from = from || Date.now()
    const obj = dayjs(from).locale(store.language.toLowerCase())
    return obj.to(dayjs(target))
  }
}
