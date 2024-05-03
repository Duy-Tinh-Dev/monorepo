import {
  Button,
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  Box,
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
import { useValidationSchema } from '@/hooks';
import { useState } from 'react';
import { SignInMethod } from '@/components/sign-in-method';
import { FormData } from '@/components/todo-list/types';
import { auth } from '@/config/firebase';
import { ROUTES } from '@/constants';
import { useMediaQuery, useTheme } from '@mui/material';

const DEFAULT_USER = {
  EMAIL: 'test@gmail.com',
  PASSWORD: '123456789',
};

const SignIn = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { t } = useTranslation(['auth']);
  const { setCurrentUser } = useAuth();
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

  return (
    <Stack
      gap={2}
      alignItems='center'
      sx={{
        flexDirection: {
          xs: 'column',
          md: 'row',
        },
      }}
    >
      <Stack
        gap={2}
        sx={{
          width: {
            xs: '100%',
            sm: 500,
          },
        }}
      >
        <Typography
          fontWeight='bold'
          component='h1'
          sx={{
            fontSize: {
              xs: '24px',
              md: '32px',
            },
          }}
        >
          {t('actions.signin')}
        </Typography>
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
            defaultValue={DEFAULT_USER.EMAIL}
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
                size={isMobile ? 'small' : 'medium'}
              />
            )}
          />
          <Controller
            name='password'
            control={control}
            defaultValue={DEFAULT_USER.PASSWORD}
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
                size={isMobile ? 'small' : 'medium'}
              />
            )}
          />
          <Button
            variant='contained'
            sx={{
              '&.MuiButtonBase-root': {
                fontWeight: 500,
                fontSize: '16px',
                borderRadius: 2.5,
                height: {
                  xs: 40,
                  sm: 56,
                },
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
        <Typography fontSize='13px' variant='body2' textAlign='justify'>
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
          <span onClick={() => navigate(ROUTES.signup)} style={styleSpan}>
            {t('actions.signup')}
          </span>
        </Typography>
      </Stack>
      <Box
        sx={{
          display: {
            xs: 'none',
            md: 'block',
          },
        }}
      >
        <img src={backgroundLogin} alt='sign-in' width={450} />
      </Box>
    </Stack>
  );
};

export default SignIn;
