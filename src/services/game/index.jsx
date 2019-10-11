import React, { createContext, useMemo, useReducer, useContext } from 'react';

import { StateReducer, ActionReducer } from './reducer';
import ServiceFn from './service.fn';


// TODO: Basic
const defaultOptions = {
  gameID     : ''     , zones  : {},
  status     : 'NONE' , rounds : [],
  userID     : ''     , msg    : [],
  owner      : ''     ,
  competitor : ''
};

// TODO: Components
const GameContext = createContext({ ...defaultOptions, dispatch: () => {}});

export const GameCustom = {
  useCardRange : ServiceFn.useCardRange,
  useCardImage : ServiceFn.getCardImage,
  useAllCards  : () => ServiceFn.getCards(),
  useGame      : () => {
    const { gameID, userID, status, zones, rounds, dispatch } = useContext(GameContext);
    const round = useMemo(() => rounds[rounds.length - 1] || {}, [ rounds ]);

    return { gameID, userID, status, zones, ...round, dispatch };
  }
};

export default function Game({ children }) {
  const state  = useReducer(StateReducer, defaultOptions);
  const action = useReducer(ActionReducer, { dispatch: state[1] });

  return (
    <GameContext.Provider value={{ ...state[0], dispatch: action[1] }}>
      { children }
    </GameContext.Provider>
  );
};
