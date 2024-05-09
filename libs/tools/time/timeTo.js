import dayjs from './dayjsWrapper'
import personalization from '../../personalization/index.js'
export default (target, from) => {
  from = from || Date.now()
  const obj = dayjs(from).locale(personalization.language.toLowerCase())
  return obj.to(dayjs(target))
}
