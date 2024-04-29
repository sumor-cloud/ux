import now from './now';
import parse from './parse';
import format from './format';
import timeTo from './timeTo';
export default (store)=> {
  return {
    now,
    parse,
    format:format(store),
    timeTo:timeTo(store)
  }
};
