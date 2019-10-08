import React, { createContext, useMemo, useReducer, useContext } from 'react';

import { StateReducer, ActionReducer, getCards } from './reducer';


// TODO: Basic
const defaultOptions = {
  gameID     : ''     , zones   : {},
  status     : 'NONE' , rounds  : [],
  userID     : ''     , attacks : [],
  owner      : ''     , msg     : [],
  competitor : ''
};

// TODO: Components
const GameContext = createContext({ ...defaultOptions, dispatch: () => {}});

export function useGame() { return useContext(GameContext); }

export const useAttackRange = card => useMemo(() => card.rangeX === 1 && card.rangeY === 1 ? 'cell'
  : card.rangeX === 9 && card.rangeY === 1 ? 'line-y'
    : card.rangeX === 1 && card.rangeY === 9 ? 'line-x' : 'zone', [ card ]);

export const cards = getCards();

export default function Game({ children }) {
  const state = useReducer(StateReducer, defaultOptions);
  const action = useReducer(ActionReducer, { dispatch: state[1] });

  return (
    <GameContext.Provider value={{ ...state[0], dispatch: action[1] }}>
      { children }
    </GameContext.Provider>
  );
};
