import dayjs from './dayjsWrapper';
export default (store)=> {
  return (value, format, timezone) => {
    const obj = dayjs(value)
        .tz(timezone || store.timezone)
        .locale(store.language.toLowerCase());
    return obj.format(format);
  };
}
