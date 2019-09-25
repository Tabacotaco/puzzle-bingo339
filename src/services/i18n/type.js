export const Language = {
  EN: Symbol('English'),
  ZH: Symbol('繁體中文')
};

const DEFAULT_LANG = (lang =>
  lang.substring(0, lang.indexOf('-') > 0 ? lang.indexOf('-') : undefined)
)(localStorage.getItem('CASH_MAP_LANG') || navigator.language.toLowerCase());

export default DEFAULT_LANG;
