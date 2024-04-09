import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/sidebar';
import { View } from '@/components/todo-list/types';
import { TodoDetailModal } from '@/components/todo-list/todo-detail-modal';
import { ViewMenuOption } from '@/components/view-menu-option';
import { ROUTES } from '@/constants';
import { useAuth } from '@/contexts/auth-context';
import { todoDetailSelector } from '@/redux/selectors';
import {
  nextDetailTodo,
  previousDetailTodo,
  setCommentDetail,
  setIsOpenModalDetail,
} from '@/redux/slices/todoDetailSlice';
import { filterSelector } from '@/redux/selectors';
import { styleScrollbar } from '@/constants';
import { Outlet, useNavigate } from 'react-router-dom';
import { Box, Stack } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

const DefaultLayout = () => {
  const dispatch = useDispatch();
  const { currentUser } = useAuth();
  const { view } = useSelector(filterSelector);
  const {
    todoDetail,
    indexTodoDetail,
    isCommentModal,
    listTodoModal,
    isOpenModalDetail,
  } = useSelector(todoDetailSelector);
  const navigate = useNavigate();
  const [openSidebar, setOpenSidebar] = useState(true);

  const handleToggleCommentDetail = (isComment: boolean) => {
    dispatch(setCommentDetail(isComment));
  };

  const handleNextDetailTodo = () => {
    dispatch(nextDetailTodo());
  };

  const handlePreviousDetailTodo = () => {
    dispatch(previousDetailTodo());
  };

  const handleCloseModal = () => {
    dispatch(setIsOpenModalDetail(false));
  };

  const handleCloseSidebar = () => {
    setOpenSidebar(false);
  };

  const handleOpenSidebar = () => {
    setOpenSidebar(true);
  };

  useEffect(() => {
    if (!currentUser) {
      navigate(ROUTES.signin);
    }
  }, [currentUser]);

  return (
    <>
      <Stack direction='row'>
        <Sidebar
          openSidebar={openSidebar}
          onCloseSidebar={handleCloseSidebar}
          onOpenSidebar={handleOpenSidebar}
        />
        <Box
          sx={(theme) => ({
            position: 'absolute',
            transition: 'all 0.3s ease',
            [theme.breakpoints.up('sm')]: {
              margin: '100px 50px',
              maxWidth: openSidebar
                ? 'calc(100% - 420px - 100px)'
                : 'calc(100% - 100px)',
              width: openSidebar ? 'calc(100% - 420px)' : '100%',
            },
            [theme.breakpoints.down('sm')]: {
              margin: '100px 16px',
              maxWidth: openSidebar
                ? 'calc(100% - 420px - 100px)'
                : 'calc(100% - 32px)',
              width: '100%',
            },
            [theme.breakpoints.up('md')]: {
              left: openSidebar ? 420 : 0,
            },
            [theme.breakpoints.down('md')]: {
              left: 0,
            },
            ...styleScrollbar,
            ...(view === View.BOARD
              ? {
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '20px',
                  overflowX: 'auto',
                }
              : { overflowY: 'auto', maxHeight: 'calc(100% - 100px)' }),
          })}
        >
          <Outlet />
        </Box>
      </Stack>
      <ViewMenuOption
        sx={(theme) => ({
          position: 'fixed',
          [theme.breakpoints.up('sm')]: {
            right: '70px',
          },
          [theme.breakpoints.down('sm')]: {
            right: '10px',
          },
          top: '50px',
        })}
      />
      {isOpenModalDetail && todoDetail && (
        <TodoDetailModal
          isComment={isCommentModal}
          isDisabledNextTodo={indexTodoDetail === listTodoModal.length - 1}
          isDisabledPreviousTodo={indexTodoDetail === 0}
          isOpen={isOpenModalDetail}
          todo={todoDetail}
          onClose={handleCloseModal}
          onToggleCommentDetail={handleToggleCommentDetail}
          onNextTodoDetail={handleNextDetailTodo}
          onPreviousTodoDetail={handlePreviousDetailTodo}
        />
      )}
    </>
  );
};

export default DefaultLayout;
