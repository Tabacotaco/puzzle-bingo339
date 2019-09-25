import { Language } from './type';

export const StateStore = (state, { locale, messages } = state) => ({ locale, messages });

export const ActionStore = (state, action) => {
  getI18n(action).then(intl => state.dispatch(intl));

  return state;
};

export default function getI18n(lang) {
  switch (lang) {
    case Language.ZH:
      return import('../../assets/i18n/zh.json').then(({ default: messages }) => ({
        locale: 'zh',
        messages
      }));

    default:
      return import('../../assets/i18n/en.json').then(({ default: messages }) => ({
        locale: 'en',
        messages
      }));
  }
};
