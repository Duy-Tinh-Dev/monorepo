import { Button, Stack } from '@mui/material';
import { useTranslation } from '@op/i18n';
import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { useAuth } from '@/contexts/auth-context';
import { auth } from '@/config/firebase';
import { AppleIcon, FacebookIcon, GoogleIcon } from '../icon';

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
    color: '#000',
    fontWeight: 'bold',
    height: {
      xs: 40,
      sm: 56,
    },
    minWidth: {
      xs: '100%',
      sm: 400,
    },
    fontSize: {
      xs: '14px',
      sm: '18px',
    },
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
