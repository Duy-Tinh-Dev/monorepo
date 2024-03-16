import { AuthLayout } from '@layouts/auth-layout';
import {
  Button,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { SignInMethod } from '@components/sign-in-method';
import { useTranslation } from '@op/i18n';
import { useNavigate } from 'react-router-dom';
import UserImage from '@assets/user.jpg';
import BusinessImage from '@assets/business.jpg';
import ProUserImage from '@assets/pro-user.jpg';
import TaskImage from '@assets/task.jpg';
import { Info } from '@components/info';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '@config/firebase';
import { useAuth } from '@context/auth-context';
import { FormData } from '@components/todo-list/types';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CircularProgress from '@mui/material/CircularProgress';
import useValidationSchema from '@hooks/useValidationSchema';
import UserAvatar from '@assets/user-avatar.png';
import { useState } from 'react';

const SignUp = () => {
  const { t } = useTranslation(['auth']);
  const { currentUser, setCurrentUser } = useAuth();
  const { validationSchema } = useValidationSchema();
  const navigate = useNavigate();

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormData>({
    mode: 'onBlur',
    resolver: yupResolver(validationSchema),
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async ({ email, password }: FormData) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      setCurrentUser(res.user);
      const displayName = email.split('@')[0];

      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName,
          photoURL: UserAvatar,
        });
      }

      navigate('/');
    } catch (error) {
      const errorMessage = t('validate.email.isExist');
      setError('email', { type: 'custom', message: errorMessage });
    }
  };

  const styleSpan = {
    textDecoration: 'underline',
    cursor: 'pointer',
  };

  const color = 'secondary';

  if (currentUser) {
    navigate('/');
  }

  return (
    <AuthLayout title={t('actions.signup')}>
      <Stack direction='row' gap={6} alignItems='center'>
        <Stack gap={2} width={400}>
          <SignInMethod />
          <Divider />
          <form
            onSubmit={handleSubmit(onSubmit)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <Controller
              name='email'
              control={control}
              defaultValue=''
              render={({ field }) => (
                <TextField
                  {...field}
                  label={t('formData.email')}
                  variant='outlined'
                  error={!!errors.email}
                  color={color}
                  helperText={errors.email ? String(errors.email.message) : ''}
                  fullWidth
                  margin='none'
                />
              )}
            />
            <Controller
              name='password'
              control={control}
              defaultValue=''
              render={({ field }) => (
                <TextField
                  {...field}
                  label={t('formData.password')}
                  type={showPassword ? 'text' : 'password'}
                  variant='outlined'
                  error={!!errors.password}
                  color={color}
                  helperText={
                    errors.password ? String(errors.password.message) : ''
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton
                          onClick={handleTogglePassword}
                          edge='end'
                          color={color}
                        >
                          {showPassword ? (
                            <VisibilityIcon />
                          ) : (
                            <VisibilityOffIcon />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  fullWidth
                  margin='none'
                />
              )}
            />
            <Button
              type='submit'
              variant='contained'
              sx={{
                '&.MuiButtonBase-root': {
                  height: '48px',
                  fontWeight: 500,
                  fontSize: '16px',
                  borderRadius: 2.5,
                },
              }}
              disabled={!isValid}
            >
              {isSubmitting ? (
                <CircularProgress color='info' />
              ) : (
                t('signupWithEmail')
              )}
            </Button>
          </form>
          <Typography fontSize='13px' variant='body2' sx={styleSpan}>
            {t('accountSecurity.forgotPassword')}
          </Typography>
          <Typography fontSize='13px' variant='body2'>
            {t('accountSecurity.continueWith')}{' '}
            <span style={styleSpan}>{t('accountSecurity.termsOfService')}</span>{' '}
            {t('accountSecurity.and')}{' '}
            <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>
              {t('accountSecurity.privacyPolicy.')}
            </span>
          </Typography>
          <Divider />
          <Typography
            textAlign='center'
            fontSize='13px'
            variant='body2'
            marginBottom={3}
          >
            {t('accountSecurity.alreadySignedUp')}{' '}
            <span onClick={() => navigate('/auth/login')} style={styleSpan}>
              {t('accountSecurity.goToLogin')}
            </span>
          </Typography>
        </Stack>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Info
              src={UserImage}
              heading='30 million+'
              subHeading='app downloads'
            />
          </Grid>
          <Grid item xs={6}>
            <Info
              src={BusinessImage}
              heading='15 years+'
              subHeading='in business'
            />
          </Grid>
          <Grid item xs={6}>
            <Info
              src={TaskImage}
              heading='2 billion+'
              subHeading='tasks completed'
            />
          </Grid>
          <Grid item xs={6}>
            <Info
              src={ProUserImage}
              heading='1 million+'
              subHeading='Pro users'
            />
          </Grid>
        </Grid>
      </Stack>
    </AuthLayout>
  );
};

export default SignUp;
