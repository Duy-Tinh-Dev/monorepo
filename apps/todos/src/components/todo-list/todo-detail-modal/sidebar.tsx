import { Button, Popover, Stack, Typography } from '@mui/material';
import FlagIcon from '@mui/icons-material/Flag';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import { usePopover } from '@/hooks';
import { PriorityList } from '../priority-list';
import { PriorityItem, Todo } from '../types';

interface SidebarProps {
  todo: Todo;
  onEditPriority: (todo: Todo) => void;
}

const Sidebar = ({ todo, onEditPriority }: SidebarProps) => {
  const { priority } = todo;
  const { id, open, anchorEl, handleClick, handleClose } =
    usePopover('priority');

  const handleClickedPriority = (priority: PriorityItem) => {
    const newTodo = {
      ...todo,
      priority,
    };

    onEditPriority(newTodo);
  };

  return (
    <Stack
      sx={(theme) => ({
        position: 'relative',
        [theme.breakpoints.up('sm')]: {
          alignItems: 'flex-start',
          flexDirection: 'column',
        },
        [theme.breakpoints.down('sm')]: {
          alignItems: 'center',
          flexDirection: 'row',
        },
      })}
    >
      <Typography
        paddingX={1}
        fontSize='14px'
        fontWeight='500'
        marginBottom={0.5}
        color='grey.600'
      >
        Priority
      </Typography>
      <Stack width='100%'>
        <Button
          aria-describedby={id}
          startIcon={
            <FlagIcon
              sx={{
                color: priority.color,
              }}
            />
          }
          sx={{
            justifyContent: 'start',
            '&:hover > .MuiSvgIcon-root': {
              visibility: 'visible',
            },
            position: 'relative',
          }}
          onClick={handleClick}
        >
          <Typography
            width='100%'
            textAlign='start'
            color='grey.800'
            fontSize='14px'
          >
            P4
          </Typography>
          <KeyboardArrowDownOutlinedIcon
            sx={{
              visibility: 'hidden',
            }}
          />
        </Button>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <PriorityList
            id={priority.id}
            onClickPriorityItem={handleClickedPriority}
            onClosePopover={handleClose}
          />
        </Popover>
      </Stack>
    </Stack>
  );
};

export default Sidebar;
