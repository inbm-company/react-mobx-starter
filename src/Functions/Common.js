import _ from 'lodash';
import moment from 'moment';

const CommonFunctions = {
  goBack() {
    window.history.back(-1);
  },
  trim(str) {
    return str.replace(/^\s+|\s+$/g, '');
  },
  getBeforeDateFromNow(days) {
    let d = new Date();
    d.setDate(d.getDate() - days);
    d = Date.parse(d.toString());
    return d;
  },
  getFormattedDate(date) {
    const now = Date.now(),
      nowTime = parseInt(moment(now).format('YYYYMMDDHH')),
      dateTime = parseInt(moment(date).format('YYYYMMDDHH')),
      today = moment(now).format('YYYYMMDD'),
      dateFormmated = moment(date).format('YYYYMMDD'),
      afterTime = nowTime - dateTime;

    // 오늘이면 ~~시간 전 계산하여 반환
    if (today === dateFormmated) {
      if (afterTime < 10) {
        if (afterTime < 1) {
          return '방금 전';
        } else {
          return `${afterTime}시간 전`;
        }
      } else {
        return moment(date).format('HH:MM');
      }
    } else {
      // 오늘이 아니면 시간과 날짜 반환
      return moment(date).format('HH:MM');
    }
  },
  urlToLink(text) {
    var exp = /(\b((https?|ftp|file):\/\/|(www))[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|]*)/gi;
    return text.replace(exp, '<a href="$1" rel="noopener noreferrer" class="external-link" target="_blank">$1</a>');
  }
};

export default CommonFunctions;
