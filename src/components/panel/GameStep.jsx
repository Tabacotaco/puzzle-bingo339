import React, { useMemo, useCallback, createElement } from 'react';
import PropTypes from 'prop-types';

import { useI18n } from '../../services/i18n';
import { GameCustom } from '../../services/game';

import { BsContainer, BsRow, BsCol } from '../bs/Grid';

import BingoCard from './BingoCard';
import Territories from './Territories';

import '../../assets/css/GameStep.scss';


// TODO: Custom Functions
function useStepName({ status, step = 0, card = {} }) {
  return useMemo(() => {
    switch (status) {
      case 'WAITING'  : return 'Waiting';
      case 'FINISH'   : return 'Finish';
      case 'PLAYING'  :
        switch (step) {
          case 0      : return 'Switch';
          case 1      : return 'GetCard';
          case 2      : return 'ShowCard';
          case 3      : return 'ATTACK' === card.type ? 'Attack' : null;
          default     : return null;
        }
      default         : return null;
    }
  }, [ status, step, card ]);
}


// TODO: Private Components
function CenterMessage({ icon, children, onClose = () => {} }) {
  const { get } = useI18n();

  return (
    <BsContainer className="center-message shadow-light" padding={ 3 } colors={{ bg: 'warning', text: 'dark' }}>
      <BsRow align="center" padding={{ x: 5 }}>
        <BsCol className="tip-content" width={{ def: 12, sm: 8, md: 4 }}>
          { !icon ? null : (
            <i className={`tip-icon ${ icon.className || icon } ${ icon.animation || '' } float-${ icon.align || 'none' }`} />
          )}

          { children }
        </BsCol>

        <BsCol className="text-center" width={ 12 }>
          <button type="button" className="btn btn-dark mt-2" onClick={ onClose }>
            <i className="fa fa-undo mr-2" />{ get('BTN_TO_MENU') }
          </button>
        </BsCol>
      </BsRow>
    </BsContainer>
  );
};

const Step = {
  Waiting({ onCancelWaiting = () => {} }) {
    return (
      <div className="step-modal d-flex justify-content-center">
        <CenterMessage icon={{ className: 'fa fa-spinner', align: 'right', animation: 'rotate' }} onClose={ onCancelWaiting }>
          <span className="waiting font-weight-bolder">
            Waiting
          </span>
        </CenterMessage>
      </div>
    );
  },
  
  Finish({ onGameFinish = () => {} }) {
    return (
      <div className="step-modal d-flex justify-content-center">
        <CenterMessage onClose={ onGameFinish }>
          Game Finished !
        </CenterMessage>
      </div>
    );
  },
  
  Switch() {
    const { get } = useI18n();
  
    return (
      <BsContainer className="switching-step" padding={ 3 } margin={{ t: 3 }} rounded colors={{ bg: 'warning', text: 'dark' }}>
        <BsRow align="center">
          <BsCol>
            { get('MSG_WAITING_COMPETITOR') }
          </BsCol>
        </BsRow>
      </BsContainer>
    );
  },
  
  GetCard() {
    const { get } = useI18n();
    const { dispatch } = GameCustom.useGame();
    const onGetCard = useCallback(() => dispatch({ step: 2 }), [ dispatch ]);
  
    return (
      <div className="step-modal d-flex justify-content-center">
        <BsContainer className="center-message shadow-light" padding={ 3 } colors={{ bg: 'warning', text: 'dark' }}>
          <BsRow align="center" padding={{ x: 2 }}>
            <BsCol className="text-center" width={ 12 }>
              { get('MSG_STEP_GET_CARD') }
            </BsCol>
  
            <BsCol className="text-center" width={ 12 } margin={{ t: 3 }}>
              <button type="button" className="btn btn-dark" onClick={ onGetCard }>
                <i className="fa fa-magic mr-2" />{ get('BTN_GET_CARD') }
              </button>
            </BsCol>
          </BsRow>
        </BsContainer>
      </div>
    );
  },
  
  ShowCard() {
    const { card = {}, dispatch } = GameCustom.useGame();
    const onUseCard = useCallback(() => dispatch({ step: 3 }), [ dispatch ]);
  
    return (
      <div className="step-modal d-flex justify-content-center">
        <BingoCard card={ card } onUseCard={ onUseCard } />
      </div>
    );
  },
  
  Attack() {
    const { get } = useI18n();
    const { card = {}, dispatch } = GameCustom.useGame();
    const hoverOn = GameCustom.useCardRange(card);
  
    const doAttack = useCallback(({ x, y, z }) => dispatch({
      action : 'ATTACK',
      target : hoverOn,
      card, x, y, z
    }), [ hoverOn, card, dispatch ]);
  
    return (
      <div className="step-modal d-flex justify-content-center">
        <div className="competitor-territories">
          <h3 className="text-center bg-warning text-dark font-weight-bolder mt-3 py-3">
            { get('MSG_ATTACK_COMPETITOR') }
          </h3>
  
          <Territories isSelecting mode="attack" {...{
            hoverOn,
            cursor     : GameCustom.useCardImage(card),
            onSelected : doAttack
          }} />
        </div>
      </div>
    );
  }
};


// TODO: Main Component
export default function GameStep(props) {
  const { status, step = 0, card = {} } = GameCustom.useGame();
  const name = useStepName({ status, step, card });

  return useMemo(() => !name ? null : createElement(Step[ name ], props), [ name, props ]);
};

GameStep.propTypes = {
  onCancelWaiting : PropTypes.func,
  onGameFinish    : PropTypes.func
};
