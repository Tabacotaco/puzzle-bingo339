import React, { createContext, useReducer, useContext } from 'react';

import { StateReducer, ActionReducer, getCards } from './reducer';


// TODO: Basic
const defaultOptions = {
  gameID     : '', status : 'NONE',
  userID     : '', zones  : [],
  owner      : '', rounds : [],
  competitor : '', msg    : []
};

// TODO: Components
const GameContext = createContext({ ...defaultOptions, dispatch: () => {}});

export function useGame() { return useContext(GameContext); }

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
