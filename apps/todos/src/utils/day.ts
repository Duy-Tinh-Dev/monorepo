import { QuickTime } from '@/components/todo-list/types';
import dayjs from 'dayjs';
import isYesterday from 'dayjs/plugin/isYesterday';
import isToday from 'dayjs/plugin/isToday';
import isTomorrow from 'dayjs/plugin/isTomorrow';

dayjs.extend(isYesterday);
dayjs.extend(isToday);
dayjs.extend(isTomorrow);

export const getEndOfDay = () => {
  const date = dayjs().endOf('day').format();

  return date;
};

export const getEndOfDayWithTime = (time: dayjs.Dayjs) => {
  const date = dayjs(time).endOf('day').format();

  return date;
};

export const getDayQuick = (name: string) => {
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
      const date = dayjs(time);

      // if have time and of date
      if (date.get('hour') === 23 && date.get('minute') === 59) {
        if (date.isYesterday()) {
          return 'Yesterday';
        }
        if (date.isToday()) {
          return 'Today';
        }
        if (date.isTomorrow()) {
          return 'Tomorrow';
        }

        return date.format('DD MMM');
      }

      if (date.isYesterday()) {
        return 'Yesterday ' + date.format('HH:mm');
      }
      if (date.isToday()) {
        return 'Today ' + date.format('HH:mm');
      }
      if (date.isTomorrow()) {
        return 'Tomorrow ' + date.format('HH:mm');
      }

      return date.format('DD MMM HH:mm');

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
