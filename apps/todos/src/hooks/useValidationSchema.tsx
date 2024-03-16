import { useTranslation } from '@op/i18n';
import * as yup from 'yup';

const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;

const useValidationSchema = () => {
  const { t } = useTranslation(['auth']);

  const validationSchema = yup
    .object({
      email: yup
        .string()
        .matches(emailRegex, t('validate.email.matches'))
        .required(t('validate.email.required')),
      password: yup
        .string()
        .min(8, t('validate.password.min'))
        .required(t('validate.password.required')),
    })
    .required();
  return {
    validationSchema,
  };
};

export default useValidationSchema;
