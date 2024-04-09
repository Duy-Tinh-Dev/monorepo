import { TypeTime } from '@/@types/typeTime';
import { getEndOfDay } from '@/utils';
import { green, grey } from '@mui/material/colors';
import dayjs from 'dayjs';

export const getLabelTime = (defaultTime?: TypeTime, expireTime?: string) => {
  if (expireTime === '') {
    return 'Due date';
  }

  return expireTime ? getNameTime(expireTime) : getDefaultNameTime(defaultTime);
};

export const getTimeAddDefault = (defaultTime?: TypeTime) => {
  switch (defaultTime) {
    case TypeTime.TODAY:
      return getEndOfDay();
    case TypeTime.OVERDUE:
      return '';
    case TypeTime.INBOX:
      return '';
    default:
      return '';
  }
};

export const getColorTime = (defaultTime?: TypeTime, expireTime?: string) => {
  if (expireTime === '') {
    return grey[500];
  }

  switch (defaultTime) {
    case TypeTime.TODAY:
      return green[500];
    case TypeTime.OVERDUE:
      return grey[500];
    default:
      return grey[500];
  }
};

export const getDefaultNameTime = (defaultTime?: TypeTime) => {
  switch (defaultTime) {
    case TypeTime.TODAY:
      return 'Today';
    case TypeTime.OVERDUE:
      return 'Due date';
    case TypeTime.INBOX:
      return 'Due date';
    default:
      return 'Today';
  }
};

export const getNameTime = (expireTime?: string) => {
  const endDay = dayjs().endOf('day');
  const date = dayjs(expireTime);
  const isInWeek = date.isBefore(endDay.add(7, 'day'));

  // if have time
  if (
    dayjs(expireTime).get('hour') === 23 &&
    dayjs(expireTime).get('minute') === 59
  ) {
    if (date.isToday()) {
      return 'Today';
    }
    if (isInWeek) {
      return date.format('ddd');
    }

    return date.format('DD MMM');
  }

  if (date.isToday()) {
    return 'Today ' + date.format('HH:mm');
  }
  if (isInWeek) {
    return date.format('ddd HH:mm');
  }

  return date.format('DD MMM HH:mm');
};
