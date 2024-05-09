import dayjs from './dayjsWrapper'
import personalization from '../../personalization/index.js'
export default (value, format, timezone) => {
  const obj = dayjs(value)
    .tz(timezone || personalization.timezone)
    .locale(personalization.language.toLowerCase())
  return obj.format(format)
}
