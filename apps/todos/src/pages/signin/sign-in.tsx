import {
  Button,
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useTranslation } from '@op/i18n';
import backgroundLogin from '@/assets/background-login.png';
import { useNavigate } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { signInWithEmailAndPassword } from 'firebase/auth';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CircularProgress from '@mui/material/CircularProgress';
import { useAuth } from '@/contexts/auth-context';
import {useValidationSchema} from '@/hooks';
import { useState } from 'react';
import { AuthLayout } from '@/layouts/auth-layout';
import { SignInMethod } from '@/components/sign-in-method';
import { FormData } from '@/components/todo-list/types';
import { auth } from '@/config/firebase';

const SignIn = () => {
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
      const res = await signInWithEmailAndPassword(auth, email, password);
      setCurrentUser(res.user);
      navigate('/');
    } catch (error) {
      setError('password', {
        type: 'custom',
        message: t('validate.password.noMatches'),
      });
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
    <AuthLayout title={t('actions.signin')}>
      <Stack direction='row' gap={2} alignItems='center'>
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
              variant='contained'
              sx={{
                '&.MuiButtonBase-root': {
                  height: '48px',
                  fontWeight: 500,
                  fontSize: '16px',
                  borderRadius: 2.5,
                },
              }}
              type='submit'
              disabled={!isValid}
            >
              {isSubmitting ? (
                <CircularProgress color='info' />
              ) : (
                t('actions.signin')
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
            {t('accountSecurity.noAccount')}{' '}
            <span onClick={() => navigate('/auth/signup')} style={styleSpan}>
              {t('actions.signup')}
            </span>
          </Typography>
        </Stack>
        <img src={backgroundLogin} alt='sign-in' width={450} />
      </Stack>
    </AuthLayout>
  );
};

export default SignIn;
