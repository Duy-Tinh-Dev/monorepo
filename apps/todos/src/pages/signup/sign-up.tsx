import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import UserImage from '@/assets/user.jpg';
import BusinessImage from '@/assets/business.jpg';
import ProUserImage from '@/assets/pro-user.jpg';
import TaskImage from '@/assets/task.jpg';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CircularProgress from '@mui/material/CircularProgress';
import UserAvatar from '@/assets/user-avatar.png';
import { useState } from 'react';
import { useTranslation } from '@op/i18n';
import { Info } from '@/components/info';
import { SignInMethod } from '@/components/sign-in-method';
import { useAuth } from '@/contexts/auth-context';
import { useValidationSchema } from '@/hooks';
import { auth } from '@/config/firebase';
import { FormData } from '@/components/todo-list/types';
import { ROUTES } from '@/constants';
import { useMediaQuery, useTheme } from '@mui/material';
const SignUp = () => {
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
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const displayName = email.split('@')[0];

      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName,
          photoURL: UserAvatar,
        });
        setCurrentUser(res.user);
        navigate(ROUTES.home);
      }
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

  return (
    <Stack
      gap={6}
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
          {t('actions.signup')}
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
                size={isMobile ? 'small' : 'medium'}
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
                size={isMobile ? 'small' : 'medium'}
              />
            )}
          />
          <Button
            type='submit'
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
          {t('accountSecurity.alreadySignedUp')}{' '}
          <span onClick={() => navigate(ROUTES.signin)} style={styleSpan}>
            {t('accountSecurity.goToLogin')}
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
      </Box>
    </Stack>
  );
};

export default SignUp;
