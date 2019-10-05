import React, { useCallback, useMemo, useState } from 'react';

import { useGame } from '../../services/game';
import { useCurrentRound } from '../../services/custom/game';

import { BsContainer, BsRow, BsCol } from '../bs/Grid';
import GameStep from './GameStep';

import '../../assets/css/Territory.scss';


// TODO: Custom Functions
function useCustom() {
  const { zones, userID, dispatch } = useGame();
  const { caller } = useCurrentRound();

  const isMyTurn = useMemo(() => caller === userID, [ caller, userID ]);
  const [ isSelecting, setSelecting ] = useState(false);

  return {
    zones,
    isMyTurn,
    isSelecting,

    onBackToMenu: useCallback(() => window.location.reload(), []),

    onTipVisibledChange: useCallback(isShown => setSelecting(isShown), [ setSelecting ]),

    onSelectNumber: useCallback(num => () => { console.log(num, dispatch); }, [ dispatch ])
  };
}


// TODO: Component
export default function Territory() {
  const { zones, isMyTurn, isSelecting, onBackToMenu, onTipVisibledChange, onSelectNumber } = useCustom();

  console.log(isMyTurn);

  return (
    <BsContainer className="territory text-white">
      <GameStep {...{
        onTipVisibledChange,
        onCancelWaiting: onBackToMenu
      }} />

      <BsRow>
        <BsCol className="container numbers" width={{ def: 11, sm: 10, md: 8, lg: 6}}>
          <BsRow align="center">
            { Object.keys(zones).map(zone => ({ ...zones[zone], zone })).map(({ zone, numbers, color }) => (
              <BsCol key={`zone-${ zone }`} className={`container zone zone-${ zone }`} padding={ 0 } margin={ 0 } width={ 4 } border rounded>
                <BsRow margin={ 1 } options={{ style: { background: color, opacity: isSelecting ? 1 : .6 }}}>
                  { numbers.map(num => (
                    <BsCol rounded border {...{
                      key       : `number-${ num }`,
                      tagName   : isSelecting ? 'button' : 'div',
                      className : 'bingo-number text-center',
                      width     : 4,
                      padding   : 0,
                      ...(isSelecting ? { onClick: onSelectNumber(num) } : {})
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
