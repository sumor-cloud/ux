import dayjs from './dayjsWrapper'

export default time => {
  const date = dayjs(time)

  return {
    year: date.year(),
    month: date.month() + 1,
    date: date.date(),
    hour: date.hour(),
    minute: date.minute(),
    second: date.second(),
    weekday: date.day() + 1,
    yearday: date.dayOfYear(),
    week: date.week(),
    quarter: date.quarter()
  }
}
