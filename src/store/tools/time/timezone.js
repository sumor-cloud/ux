import dayjs from './dayjsWrapper'
export default () => {
  return dayjs.tz.guess()
}
