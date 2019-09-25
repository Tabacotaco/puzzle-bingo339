import React, { createContext, useReducer, useContext } from 'react';

import { StateReducer, ActionReducer } from './reducer';


// TODO: Basic
const defaultOptions = { gameID: '', status: '', owner: '', competitor: '', msg: [], rounds: [], bingoNums: [] };


// TODO: Components
const GameContext = createContext({ ...defaultOptions, dispatch: () => {}});

export function useGame() { return useContext(GameContext); }

export default function Game({ children }) {
  const state = useReducer(StateReducer, defaultOptions);
  const action = useReducer(ActionReducer, { dispatch: state[1] });

  return (
    <GameContext.Provider value={{ ...state[0], dispatch: action[1] }}>
      { children }
    </GameContext.Provider>
  );
};
