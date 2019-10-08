import React, { useCallback, useMemo, useState } from 'react';

import { useGame } from '../../services/game';
import { useCurrentRound } from '../../services/custom/game';

import { BsContainer, BsRow, BsCol } from '../bs/Grid';

import GameStep from './GameStep';
import Territories from './Territories';

import '../../assets/css/Playboard.scss';


// TODO: Custom Functions
function useCustom() {
  const { zones, userID, dispatch } = useGame();
  const { caller, attack = false } = useCurrentRound();

  const isMyTurn = useMemo(() => caller === userID, [ caller, userID ]);
  const [ isSelecting, setSelecting ] = useState(false);

  return {
    zones,
    attack,
    isMyTurn,
    isSelecting,

    onBackToMenu: useCallback(() => window.location.reload(), []),

    onTipVisibledChange: useCallback(isShown => setSelecting(isShown), [ setSelecting ]),

    onSelected: useCallback(num => () => { console.log(num, dispatch); }, [ dispatch ])
  };
}


// TODO: Component
export default function Playboard() {
  const { zones, attack, isMyTurn, isSelecting, onBackToMenu, onTipVisibledChange, onSelected } = useCustom();

  console.log(zones, isMyTurn, attack);

  return (
    <BsContainer className="playboard text-white">
      <BsRow align="center">
        <BsCol width={{ def: 11, sm: 10, md: 8, lg: 6}}>
          <Territories mode="switch" isSelecting={ isSelecting } zones={ zones } onSelected={ onSelected } />
        </BsCol>
      </BsRow>

      <GameStep {...{
        onTipVisibledChange,
        onCancelWaiting: onBackToMenu
      }} />
    </BsContainer>
  );
};
