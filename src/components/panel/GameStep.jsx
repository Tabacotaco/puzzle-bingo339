import React, { useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';

import { useI18n } from '../../services/i18n';
import { useGame } from '../../services/game';
import { useCurrentRound } from '../../services/custom/game';

import { BsContainer, BsRow, BsCol } from '../bs/Grid';
import StepModal from './StepModal';
import { CardDashboard } from './BingoCard';

import '../../assets/css/GameStep.scss';


// TODO: Private Components
function CenterMessage({ icon, children, onClose = () => {}}) {
  const { get } = useI18n();

  return (
    <BsContainer className="center-message shadow-light" padding={ 3 } colors={{ bg: 'primary', text: 'white' }}>
      <BsRow align="center" padding={{ x: 5 }}>
        <BsCol className="tip-content" width={{ def: 12, sm: 8, md: 4 }}>
          { !icon ? null : (
            <i className={`tip-icon ${ icon.className || icon } ${ icon.animation || '' } float-${ icon.align || 'none' }`} />
          )}

          { children }
        </BsCol>

        <BsCol className="text-center" width={ 12 }>
          <button type="button" className="btn btn-secondary mt-2" onClick={ onClose }>
            <i className="fa fa-undo mr-2" />{ get('BTN_TO_MENU') }
          </button>
        </BsCol>
      </BsRow>
    </BsContainer>
  );
};


// TODO: Main Component
export default function GameStep({
  onCancelWaiting = () => {},
  onVisibledChange = () => {},
  onGameFinish = () => {}
}) {
  const { status } = useGame();
  const { step = 0, card = {} } = useCurrentRound();

  const isVisibled = useMemo(
    () => [ 'WAITING', 'FINISH' ].indexOf(status) >= 0
      || ('PLAYING' === status && ([ 1, 2 ].indexOf(step) >= 0 || (step === 3 && 'ATTACK' === card.type))),
    [ status, step, card ]
  );

  useEffect(() => onVisibledChange(isVisibled));

  return !isVisibled ? null : (
    <StepModal>
      {(() => {
        switch (status) {
          case 'WAITING': return (
            <CenterMessage icon={{ className: 'fa fa-spinner', align: 'right', animation: 'rotate' }} onClose={ onCancelWaiting }>
              <span className="waiting font-weight-bolder">
                Waiting
              </span>
            </CenterMessage>
          );

          case 'FINISH': return (
            <CenterMessage onClose={ onGameFinish }>
              Game Finished !
            </CenterMessage>
          );

          case 'PLAYING': return (
            <CardDashboard />
          );
          
          default: return null;
        }
      })()}
    </StepModal>
  );
};

GameStep.propTypes = {
  onCancelWaiting  : PropTypes.func,
  onVisibledChange : PropTypes.func,
  onGameFinish     : PropTypes.func
};
