import React, { useCallback } from 'react';

import { useI18n } from '../../services/i18n';
import { useGame } from '../../services/game';

import { BsContainer, BsRow, BsCol } from '../bs/Grid';

import './BingoPanel99.scss';


// TODO: Custom Functions
function getMessage(isMyTurn) {
  return !isMyTurn ? 'MSG_WAITING_COMPETITOR' : 'MSG_IS_MY_TURN_1';
}

function useCustom() {
  const { bingoNums, userID, status, rounds, dispatch } = useGame();
  const { caller, card } = rounds[rounds.length - 1] || {};

  return {
    status,
    card,
    numZone  : bingoNums,
    isMyTurn : caller === userID,

    onBackToMenu: useCallback(() => window.location.reload(), []),

    onSelectNumber: useCallback(num => () => { console.log(num, dispatch); }, [ dispatch ])
  };
}


// TODO: Component
export default function BingoPanel99() {
  const { get } = useI18n();
  const { status, card, numZone, isMyTurn, onBackToMenu, onSelectNumber } = useCustom();

  return (
    <BsContainer className="bingo-99 text-white">
      <BsRow>
        <BsCol className="container numbers" width={{ def: 11, sm: 10, md: 8, lg: 6}}>
          <BsRow align="center">
            { Object.keys(numZone).map(zone => ({ ...numZone[zone], zone })).map(({ zone, numbers, color }) => (
              <BsCol key={`zone-${ zone }`} className={`container zone zone-${ zone }`} padding={ 0 } margin={ 0 } width={ 4 } border rounded>
                <BsRow margin={ 1 } options={{ style: { background: color, opacity: isMyTurn && card ? 1 : .6 }}}>
                  { numbers.map(num => (
                    <BsCol key={`number-${ num }`} tagName={ isMyTurn && card ? 'button' : 'div' } className="bingo-number text-center"
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

      {/* TODO: Waiting Message */}
      { 'WAITING' !== status ? null : (
        <BsRow className="shadow-light alert-message">
          <BsCol className="alert bg-primary text-white rounded-0 waiting-tip" margin={ 0 }>
            <button type="button" className="btn btn-secondary mt-2" onClick={ onBackToMenu }>
              <i className="fa fa-undo mr-2" />{ get('BTN_TO_MENU') }
            </button>
          </BsCol>
        </BsRow>
      )}

      {/* TODO: Game Tip */}
      { 'WAITING' === status || card ? null : (
        <BsRow className="shadow-light alert-message">
          <BsCol className="alert bg-warning text-dark rounded-0" margin={ 0 }>
            <div className="modal-body p-0">
              { get(getMessage(isMyTurn)) }
            </div>

            <div className="modal-footer p-0 mt-3 border-0 justify-content-center">
              <button type="button" className="btn btn-dark">
                <i className="fa fa-magic mr-2" />{ get('BTN_GET_CARD') }
              </button>
            </div>
          </BsCol>
        </BsRow>
      )}
    </BsContainer>
  );
};
