import React, { useCallback } from 'react';

import { useI18n } from '../../services/i18n';
import { useGame } from '../../services/game';

import { BsContainer, BsRow, BsCol } from '../bs/Grid';

import './BingoPanel99.scss';


// TODO: Custom Functions
function useCustom() {
  const { bingoNums, userID, status, rounds, dispatch } = useGame();
  const { caller } = rounds[rounds.length - 1] || {};

  return {
    status,
    numZone  : bingoNums,
    isMyTurn : caller === userID,

    onBackToMenu: useCallback(() => window.location.reload(), []),

    onSelectNumber: useCallback(num => () => { console.log(num, dispatch); }, [ dispatch ])
  };
}


// TODO: Component
export default function BingoPanel99() {
  const { get } = useI18n();
  const { status, numZone, isMyTurn, onBackToMenu, onSelectNumber } = useCustom();

  return (
    <BsContainer className="bingo-99 text-white">
      <BsRow>
        { 'WAITING' === status ? (
          <BsCol className="alert alert-info waiting-tip">
            <button type="button" className="btn btn-info" onClick={ onBackToMenu }>
              <i className="fa fa-undo mr-2" />{ get('BTN_TO_MENU') }
            </button>
          </BsCol>
        ) : (
          <BsCol>
            TEST
          </BsCol>
        )}
      </BsRow>

      <BsRow>
        <BsCol className="container numbers" width={{ def: 11, sm: 10, md: 8, lg: 6}}>
          <BsRow align="center">
            { Object.keys(numZone).map(zone => ({ ...numZone[zone], zone })).map(({ zone, numbers, color }) => (
              <BsCol key={`zone-${ zone }`} className={`container zone zone-${ zone }`} padding={ 0 } margin={ 0 } width={ 4 } border rounded>
                <BsRow margin={ 1 } options={{ style: { background: color, opacity: isMyTurn ? 1 : .6 }}}>
                  { numbers.map(num => (
                    <BsCol key={`number-${ num }`} tagName={ isMyTurn ? 'button' : 'div' } className="bingo-number text-center"
                      rounded border width={ 4 } padding={ 0 } options={{ onClick: onSelectNumber(num) }}>
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
