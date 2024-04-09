import dayjs from 'dayjs';

export const formatHeaderDate = (date?: string) => {
  if (date) {
    return dayjs(date).format('DD MMM ‧ dddd');
  } else {
    return 'No dua date';
  }
};
