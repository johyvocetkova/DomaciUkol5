import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import translationEN from './locales/en/translation.json';
import translationCS from './locales/cs/translation.json';

// Define the resources
const resources = {
  en: {
    translation: translationEN,
  },
  cs: {
    translation: translationCS,
  },
};

i18n
  .use(initReactI18next) // Passes i18n down to react-i18next
  .init({
    resources,
    fallbackLng: 'en', // Default language
    debug: true,
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });

export default i18n;