import React from 'react';
import { Header } from '@components/header';
import { Container, Typography } from '@mui/material';

const AuthLayout = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <Container maxWidth='md'>
      <Header
        sx={{
          margin: '30px 0 50px',
        }}
      />
      <Typography
        fontWeight='bold'
        fontSize='32px'
        component='h1'
        marginBottom={2}
      >
        {title}
      </Typography>
      {children}
    </Container>
  );
};

export default AuthLayout;
