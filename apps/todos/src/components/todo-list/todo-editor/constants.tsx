import LightModeIcon from '@mui/icons-material/LightMode';
import ChairIcon from '@mui/icons-material/Chair';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import FilterFramesIcon from '@mui/icons-material/FilterFrames';
import { green } from '@mui/material/colors';
import dayjs from 'dayjs';
import { QuickTime } from '../types';

export const optionsQuickTime = [
  {
    id: 0,
    label: 'Today',
    icon: <LightModeIcon fontSize='small' sx={{ color: green[400] }} />,
    date: dayjs().add(1, 'day').format('dd'),
    value: QuickTime.TODAY,
  },
  {
    id: 1,
    label: 'Later this weed',
    icon: <ContentPasteIcon fontSize='small' sx={{ color: green[400] }} />,
    date: dayjs().add(7, 'day').format('dd'),
    value: QuickTime.LATER_THIS_WEEK,
  },
  {
    id: 2,
    label: 'This weekend',
    icon: <ChairIcon fontSize='small' sx={{ color: green[400] }} />,
    date: dayjs().endOf('week').format('dd'),
    value: QuickTime.THIS_WEEKEND,
  },
  {
    id: 3,
    label: 'Next week',
    icon: <FilterFramesIcon fontSize='small' sx={{ color: green[400] }} />,
    date: dayjs().endOf('week').add(2, 'day').format('ddd DD MMM'),
    value: QuickTime.NEXT_WEEK,
  },
];
