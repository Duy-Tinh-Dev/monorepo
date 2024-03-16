import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend, { HttpBackendOptions } from 'i18next-http-backend';
export { useTranslation, Trans } from 'react-i18next';
export type * from 'i18next';

export const defaultNS = 'common' as const;
export const supportedLngs = ['en'] as const;

export default i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init<HttpBackendOptions>({
    defaultNS,
    supportedLngs,
    lng: 'en',
    load: 'languageOnly',
    ns: [defaultNS],
    debug: process.env.NODE_ENV !== 'production',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
  });
