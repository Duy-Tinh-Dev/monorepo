import {
  Box,
  Button,
  Divider,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
  Popover,
  Stack,
  Typography,
} from '@mui/material';
import { grey } from '@mui/material/colors';
import {
  DateCalendar,
  LocalizationProvider,
  TimePicker,
} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import dayjs from 'dayjs';
import { useState } from 'react';
import { QuickTime } from '../types';
import {
  addTimeToDate,
  getDayQuickWithTime,
  getEndOfDayWithTime,
  getDayQuick,
} from '@/utils';
import { useTranslation } from '@op/i18n';
import { usePopover } from '@/hooks';
import { optionsQuickTime } from './constants';

interface TodoDateProps {
  expireTime?: string;
  setExpireTime: React.Dispatch<React.SetStateAction<string | undefined>>;
  onClose: () => void;
}

const TodoDate: React.FC<TodoDateProps> = ({
  expireTime,
  setExpireTime,
  onClose,
}) => {
  const { t } = useTranslation(['common']);
  const [valueTime, setValueTime] = useState<dayjs.Dayjs | null>(
    expireTime ? dayjs(expireTime) : null
  );
  const { id, open, anchorEl, handleClick, handleClose } =
    usePopover('todo-time');

  const handlePickTime = (time: dayjs.Dayjs | null) => {
    setValueTime(time);
  };

  const handleSetExpireTime = (time: string) => {
    setExpireTime(time);
    onClose();
  };

  const handlePickQuickDay = (time: QuickTime) => {
    if (valueTime) {
      const valueTimeQuick = getDayQuickWithTime(time, valueTime);
      handleSetExpireTime(valueTimeQuick.format());
    } else {
      const valueTimeQuick = getDayQuick(time);
      handleSetExpireTime(valueTimeQuick.format());
    }
  };

  const handlePickDay = (time: dayjs.Dayjs) => {
    if (valueTime) {
      const valueDay = addTimeToDate(valueTime, dayjs(time));
      handleSetExpireTime(valueDay.format());
    } else {
      const valueDay = getEndOfDayWithTime(time);
      handleSetExpireTime(valueDay);
    }
  };

  const handleSaveTime = () => {
    if (valueTime) {
      const valueDay = addTimeToDate(valueTime, dayjs(expireTime));

      setExpireTime(valueDay.format());
    } else {
      setExpireTime(dayjs().format());
    }
    handleClose();
  };

  const getLabelTime = () => {
    if (valueTime) {
      return valueTime.format('H:mm A');
    }

    return t('time.title');
  };

  return (
    <Paper
      sx={{
        width: '250px',
        borderRadius: '8px',
        boxShadow: 3,
      }}
    >
      {optionsQuickTime.map((option) => (
        <MenuList key={option.id}>
          <MenuItem
            onClick={() => handlePickQuickDay(option.value)}
            sx={{
              padding: '4px 16px',
            }}
          >
            <ListItemIcon>{option.icon}</ListItemIcon>
            <ListItemText>
              <Typography fontSize='14px' fontWeight={500}>
                {option.label}
              </Typography>
            </ListItemText>
            <Typography variant='body2' color='text.secondary'>
              {option.date}
            </Typography>
          </MenuItem>
        </MenuList>
      ))}
      <Divider />
      <Box padding={2}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar
            value={expireTime ? dayjs(expireTime) : dayjs()}
            onChange={handlePickDay}
            minDate={dayjs()}
            sx={{
              padding: 0,
              width: '100%',
              height: '280px',
              '& .MuiPickersCalendarHeader-root ': {
                paddingX: '0',
              },
              '& .MuiPickersDay-root': {
                height: '28px',
              },
              '& .MuiPickersSlideTransition-root': {
                minHeight: '200px',
              },
            }}
          />
        </LocalizationProvider>
        <Button
          color='secondary'
          startIcon={<AccessTimeIcon fontSize='small' />}
          endIcon={
            valueTime && (
              <Button
                sx={{
                  padding: 0,
                  minWidth: 0,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handlePickTime(null);
                }}
              >
                <CloseOutlinedIcon
                  sx={{
                    color: grey[400],
                  }}
                  fontSize='small'
                />
              </Button>
            )
          }
          onClick={handleClick}
          sx={{
            width: '100%',
            fontSize: '13px',
            border: '1px solid',
            borderColor: grey[300],
            rounded: 1,
          }}
        >
          {getLabelTime()}
        </Button>
        <Popover
          id={id}
          open={open}
          onClose={handleClose}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
        >
          <Stack
            flexDirection='row'
            alignItems='center'
            gap={2}
            sx={{
              padding: '16px 16px 0 16px',
            }}
          >
            <Typography>{t('time.title')}</Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimePicker
                value={valueTime ?? dayjs()}
                minutesStep={5}
                minTime={dayjs()}
                onChange={handlePickTime}
                sx={{
                  '& .MuiInputBase-input': {
                    paddingY: 1,
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: grey[300],
                  },
                }}
              />
            </LocalizationProvider>
          </Stack>
          <Divider
            sx={{
              marginY: 2,
            }}
          />
          <Stack
            flexDirection='row'
            alignItems='center'
            justifyContent='end'
            padding='0 16px 8px'
            gap={2}
          >
            <Button
              sx={{
                paddingX: 1.5,
                color: grey[700],
                backgroundColor: grey[100],
                boxShadow: 'none',
                '&:hover': {
                  backgroundColor: grey[200],
                  boxShadow: 'none',
                },
              }}
              variant='contained'
              onClick={handleClose}
            >
              {t('actions.cancel')}
            </Button>
            <Button variant='contained' onClick={handleSaveTime}>
              {t('actions.save')}
            </Button>
          </Stack>
        </Popover>
      </Box>
    </Paper>
  );
};

export default TodoDate;
