import React from 'react';
import { Button, Stack } from '@mui/material';
import { useTranslation } from '@op/i18n';
import { AppleIcon, FacebookIcon, GoogleIcon } from '@components/icon';
import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { auth } from '@config/firebase';
import { useAuth } from '@context/auth-context';

const SignInMethod = () => {
  const { t } = useTranslation(['auth']);
  const { setCurrentUser } = useAuth();
  const handleSignInWithGoogle = () => {
    const ggProvider = new GoogleAuthProvider();

    signInWithPopup(auth, ggProvider)
      .then((result) => {
        setCurrentUser(result.user);
      })
      .catch((_error) => {});
  };

  const handleSignInWithFacebook = () => {
    const fbProvider = new FacebookAuthProvider();

    signInWithPopup(auth, fbProvider)
      .then((result) => {
        setCurrentUser(result.user);
      })
      .catch((_error) => {});
  };

  const styleButton = {
    padding: '0 16px',
    minWidth: '400px',
    height: '48px',
    fontSize: '18px',
    color: '#000',
    fontWeight: 'bold',
  };

  return (
    <Stack gap={2}>
      <Button
        variant='outlined'
        color='info'
        startIcon={<GoogleIcon />}
        sx={{
          '&.MuiButtonBase-root': styleButton,
        }}
        onClick={handleSignInWithGoogle}
      >
        {t('signInMethod.google')}
      </Button>
      <Button
        variant='outlined'
        color='info'
        startIcon={<FacebookIcon />}
        sx={{
          '&.MuiButtonBase-root': styleButton,
        }}
        onClick={handleSignInWithFacebook}
      >
        {t('signInMethod.facebook')}
      </Button>
      <Button
        variant='outlined'
        color='info'
        startIcon={<AppleIcon />}
        sx={{
          '&.MuiButtonBase-root': styleButton,
        }}
      >
        {t('signInMethod.apple')}
      </Button>
    </Stack>
  );
};

export default SignInMethod;
