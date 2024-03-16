import { QuickTime } from '@/components/todo-list/types';
import dayjs from 'dayjs';

export const getEndOfDay = () => {
  const date = dayjs().endOf('day').format();

  return date;
};

export const getEndOfDayWithTime = (time: dayjs.Dayjs) => {
  const date = dayjs(time).endOf('day').format();

  return date;
};

export const getTimeQuick = (name: string) => {
  switch (name) {
    case QuickTime.TODAY:
      return dayjs().endOf('day');
    case QuickTime.LATER_THIS_WEEK:
      return dayjs().add(7, 'day');
    case QuickTime.THIS_WEEKEND:
      return dayjs().endOf('week');
    case QuickTime.NEXT_WEEK:
      return dayjs().endOf('week').add(2, 'day');
    default:
      return dayjs().add(1, 'day');
  }
};

export const getDayQuickWithTime = (name: string, time: dayjs.Dayjs) => {
  switch (name) {
    case QuickTime.TODAY:
      return addTimeToDate(time, dayjs().add(1, 'day'));

    case QuickTime.LATER_THIS_WEEK:
      return addTimeToDate(time, dayjs().add(7, 'day'));

    case QuickTime.THIS_WEEKEND:
      return addTimeToDate(time, dayjs().endOf('week'));

    case QuickTime.NEXT_WEEK:
      return addTimeToDate(time, dayjs().endOf('week').add(2, 'day'));

    default:
      return addTimeToDate(time, dayjs().add(1, 'day'));
  }
};

export const addTimeToDate = (time: dayjs.Dayjs, date: dayjs.Dayjs) => {
  const hour = dayjs(time).hour();
  const minute = dayjs(time).minute();

  return date.set('hour', hour).set('minute', minute);
};

export const formatDay = (
  time: string,
  typeFormat: 'today' | 'upcomming' | 'inbox'
) => {
  switch (typeFormat) {
    case 'today' || 'upcomming':
      return dayjs(time).format('HH:mm');

    case 'inbox':
      const startDay = dayjs().startOf('day');
      const endDay = dayjs().endOf('day');
      const date = dayjs(time);

      // if have time
      if (date.get('hour') === 23 && date.get('minute') === 59) {
        if (date.isBefore(startDay)) {
          if (date.endOf('day').isSame(endDay.subtract(1, 'day'))) {
            const formatTime = 'Yesterday';
            return formatTime;
          } else {
            const formatTime = date.format('DD MMM');
            return formatTime;
          }
        } else {
          if (date.endOf('day').isSame(endDay.valueOf())) {
            const formatTime = 'Today';
            return formatTime;
          }
          if (date.endOf('day').isSame(endDay.add(1, 'day').valueOf())) {
            const formatTime = 'Tomorrow';
            return formatTime;
          } else {
            const formatTime = date.format('DD MMM');
            return formatTime;
          }
        }
      } else {
        if (date.isBefore(startDay)) {
          if (date.endOf('day').isSame(endDay.subtract(1, 'day'))) {
            const formatTime = 'Yesterday ' + date.format('HH:mm');
            return formatTime;
          } else {
            const formatTime = date.format('DD MMM HH:mm');
            return formatTime;
          }
        } else {
          if (date.endOf('day').isSame(endDay.valueOf())) {
            const formatTime = 'Today' + date.format('HH:mm');
            return formatTime;
          }
          if (date.endOf('day').isSame(endDay.add(1, 'day').valueOf())) {
            const formatTime = 'Tomorrow ' + date.format('HH:mm');
            return formatTime;
          } else {
            const formatTime = date.format('DD MMM HH:mm');
            return formatTime;
          }
        }
      }

    default:
      break;
  }
  return dayjs(time).format(typeFormat);
};

export const checkExpiredTime = (time: string) => {
  const expireTime = dayjs(time);
  const now = dayjs();
  return expireTime.isBefore(now);
};

export const getNameDate = (expireTime: string) => {
  const endDay = dayjs().endOf('day');
  const date = dayjs(expireTime);

  // if have time
  if (
    dayjs(expireTime).get('hour') === 23 &&
    dayjs(expireTime).get('minute') === 59
  ) {
    if (date.endOf('day').isSame(endDay.valueOf())) {
      return 'Today';
    }

    if (date.isBefore(endDay.add(7, 'day'))) {
      return date.format('ddd');
    } else {
      return date.format('DD MMM');
    }
  } else {
    if (date.endOf('day').isSame(endDay.valueOf())) {
      return date.format('Today HH:mm');
    }

    if (date.isBefore(endDay.add(7, 'day'))) {
      return date.format('ddd HH:mm');
    } else {
      return date.format('DD MMM HH:mm');
    }
  }
};
