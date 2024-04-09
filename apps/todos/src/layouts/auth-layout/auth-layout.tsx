import { useEffect } from 'react';
import { Header } from '@/components/header';
import { Container } from '@mui/material';
import { useAuth } from '@/contexts/auth-context';
import { Outlet, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants';

const AuthLayout = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate(ROUTES.home);
    }
  }, [currentUser]);

  return (
    <Container maxWidth='md'>
      <Header
        sx={{
          margin: '30px 0 50px',
        }}
      />
      <Outlet />
    </Container>
  );
};

export default AuthLayout;
