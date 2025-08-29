export const DEFAULT_LOCALE = 'tr';

const messages: Record<string, Record<string, string>> = {
  tr: {
    decisions: 'Resmi Kararlar',
    about: 'Hakkında',
    contact: 'İletişim',
    login: 'Giriş',
    register: 'Kayıt Ol',
    showcase: 'Multimodal arama • AI destekli',
  },
  en: {
    decisions: 'Official Decisions',
    about: 'About',
    contact: 'Contact',
    login: 'Login',
    register: 'Register',
    showcase: 'Multimodal search • AI powered',
  },
  de: {
    decisions: 'Offizielle Entscheidungen',
    about: 'Über',
    contact: 'Kontakt',
    login: 'Anmelden',
    register: 'Registrieren',
    showcase: 'Multimodale Suche • KI-unterstützt',
  },
  fr: {
    decisions: 'Décisions Officielles',
    about: 'À propos',
    contact: 'Contact',
    login: 'Connexion',
    register: 'Inscription',
    showcase: 'Recherche multimodale • Propulsé par l’IA',
  }
};

export function t(key: string, locale?: string) {
  const lang = (locale || DEFAULT_LOCALE).split(/[-_]/)[0];
  return (messages[lang] && messages[lang][key]) || messages[DEFAULT_LOCALE][key] || key;
}
