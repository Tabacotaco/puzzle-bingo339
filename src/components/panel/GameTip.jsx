import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { useI18n } from '../../services/i18n';

import { BsContainer, BsRow, BsCol } from '../bs/Grid';
import GameCard from './GameCard';

import './GameTip.scss';


// TODO: Private Components
function ModalTip({ children }) {
  return (
    <div className="modal-tip d-flex justify-content-center">
      { children }
    </div>
  );
}

function CenterMessage({ icon, children, onClose = () => {}}) {
  const { get } = useI18n();

  return (
    <ModalTip>
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
    </ModalTip>
  );
};

function GetCard({ onGetCard = () => {}}) {
  const { get } = useI18n();

  return (
    <ModalTip>
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
    </ModalTip>
  );
}

function ChanceCard({ card }) {
  const [ showCard, setShowCard ] = useState(true);

  return (
    <ModalTip>
      <GameCard card={ card } />
    </ModalTip>
  );
}


// TODO: Main Component
export default function GameTip({
  status = 'NONE',
  step = 0,
  card,
  onCancelWaiting = () => {},
  onGetCard = () => {},
  onGameFinish = () => {}
}) {
  switch (status) {
    case 'WAITING': return (
      <CenterMessage icon={{ className: 'fa fa-spinner', align: 'right', animation: 'rotate' }} onClose={ onCancelWaiting }>
        <span className="waiting font-weight-bolder">
          Waiting
        </span>
      </CenterMessage>
    );
    case 'FINISH': return (<CenterMessage onClose={ onGameFinish } />);
    default: switch (step) {
      case 1  : return (<GetCard onGetCard={ onGetCard } />);
      case 2  : return (<ChanceCard card={ card } />);
      default : return null;
    }
  }
};

GameTip.propTypes = {
  status: PropTypes.oneOf([ 'NONE', 'WAITING', 'PLAYING', 'FINISH' ]),
  step: PropTypes.oneOf([ 0, 1, 2, 3 ]),
  card: PropTypes.exact({
    description: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    rangeX: PropTypes.oneOf([ 1, 3, 9 ]),
    rangeY: PropTypes.oneOf([ 1, 3, 9 ])
  }),
  onCancelWaiting: PropTypes.func,
  onGetCard: PropTypes.func,
  onGameFinish: PropTypes.func
};
