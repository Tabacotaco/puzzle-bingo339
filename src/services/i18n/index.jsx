import React, { createContext, useReducer, useContext, useCallback } from 'react';
import { IntlProvider } from 'react-intl';

import DEFAULT_LANG, { Language } from './type';
import getI18n, { StateStore, ActionStore } from './reducer';


// TODO: Custom Functions
export const useI18n = () => useContext(Context);

// TODO: Components
const Context = createContext({
  locale: DEFAULT_LANG,
  get: () => '',
  set: () => {}
});

export default function I18n({ children }) {
  const [{ locale, messages }, $dispatch] = useReducer(StateStore, { locale: 'en', messages: {}});
  const getMessage = useCallback(code => !code ? null : (code in messages) ? messages[ code ] : code, [ messages ]);

  const dispatch = useReducer(ActionStore, { dispatch: $dispatch }, () =>
    getI18n(Language[DEFAULT_LANG.toUpperCase()]).then(intl => $dispatch(intl))
  );

  return (
    <Context.Provider value={{ locale, messages, set: dispatch[1], get: getMessage }}>
      <IntlProvider {...{ locale, messages }}>
        { children }
      </IntlProvider>
    </Context.Provider>
  );
};
