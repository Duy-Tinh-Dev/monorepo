import { defaultNS } from '@op/i18n';
import { en } from '../../public/locales';

declare module '@op/i18n' {
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS;
    resources: typeof en;
  }
}
