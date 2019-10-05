import React, { useCallback, useMemo } from 'react';

import { useGame } from '../../services/game';

import { BsContainer, BsRow, BsCol } from '../bs/Grid';
import GameTip from './GameTip';

import './BingoPanel99.scss';


// TODO: Custom Functions
function useCustom() {
  const { zones, userID, status, rounds, dispatch } = useGame();
  const { caller, step = 0, card } = rounds[rounds.length - 1] || {};
  const isMyTurn = useMemo(() => caller === userID, [ caller, userID ]);

  return {
    status,
    step,
    card,
    zones,
    isMyTurn,

    onBackToMenu: useCallback(() => window.location.reload(), []),

    onGetCard: useCallback(() => dispatch({ step: step + 1 }), [ step, dispatch ]),

    onSelectNumber: useCallback(num => () => { console.log(num, dispatch); }, [ dispatch ])
  };
}


// TODO: Component
export default function BingoPanel99() {
  const { status, step, card, zones, isMyTurn, onBackToMenu, onGetCard, onSelectNumber } = useCustom();
  const isNumberSelecting = useMemo(() => isMyTurn && step === 3, [ isMyTurn, step ]);

  return (
    <BsContainer className="bingo-99 text-white">
      <GameTip {...{
        status,
        step,
        card,
        onGetCard,
        onCancelWaiting: onBackToMenu
      }} />

      <BsRow>
        <BsCol className="container numbers" width={{ def: 11, sm: 10, md: 8, lg: 6}}>
          <BsRow align="center">
            { Object.keys(zones).map(zone => ({ ...zones[zone], zone })).map(({ zone, numbers, color }) => (
              <BsCol key={`zone-${ zone }`} className={`container zone zone-${ zone }`} padding={ 0 } margin={ 0 } width={ 4 } border rounded>
                <BsRow margin={ 1 } options={{ style: { background: color, opacity: isNumberSelecting ? 1 : .6 }}}>
                  { numbers.map(num => (
                    <BsCol rounded border {...{
                      key       : `number-${ num }`,
                      tagName   : isNumberSelecting ? 'button' : 'div',
                      className : 'bingo-number text-center',
                      width     : 4,
                      padding   : 0,
                      ...(isNumberSelecting ? { onClick: onSelectNumber(num) } : {})
                    }}>
                      { num }
                    </BsCol>
                  ))}
                </BsRow>
              </BsCol>
            ))}
          </BsRow>
        </BsCol>
      </BsRow>
    </BsContainer>
  );
};
