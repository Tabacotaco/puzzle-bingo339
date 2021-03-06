import React, { useState, useEffect, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';

import { useI18n } from '../../services/i18n';
import { GameCustom } from '../../services/game';

import { useChange, useCancelEvent, isInvalidDisabled } from '../../services/custom/events';

import BsModal from '../bs/Modal';
import BsCollapse from '../bs/Collapse';
import { BsContainer, BsRow, BsCol } from '../bs/Grid';

import logo from '../../assets/imgs/logo-bingo.png';
import '../../assets/css/IntroModal.scss';


// TODO: Custom Functions
function useGameID(dispatch) {
  return useChange(
    useState((new URL(window.location.href).searchParams.get('gameID') || '').replace('#/', '')),
    useCallback(id => !id ? 'MSG_REQUIRED_GAME_ID' : new Promise(resolve => dispatch({
      action: 'SEARCH_GAME',
      gameID: id,
      onSuccess: () => resolve(true),
      onFail: err => resolve(err)
    })), [ dispatch ])
  );
}

function useIntroModal({ setShow }) {
  const { dispatch } = GameCustom.useGame();
  const [ gameID, onChangeID, invalidID ] = useGameID(dispatch);
  const [ expand, setExpand ] = useState(useMemo(() => gameID ? 'join' : 'main', [ gameID ]));
  const doSwitch = useCallback(collapseID => setExpand(collapseID), [ setExpand ]);

  useEffect(() => 'main' === expand ? window.history.replaceState({}, document.title, '/puzzle-bingo339') : undefined);

  return {
    gameID,
    expand,
    invalidID,
    onChangeID,

    onSubmit: useCancelEvent(),

    onSwitch: useCallback(options => () => doSwitch(options), [ doSwitch ]),

    onNewGame: useCallback(() => dispatch({
      action    : 'NEW_GAME',
      onSuccess : ({ gameID }) => {
        setShow(false);

        window.open(`https://social-plugins.line.me/lineit/share?url=${ encodeURIComponent(
          `https://tabacotaco.github.io/puzzle-bingo339?gameID=${ gameID }`
        )}`);
      }
    }), [ dispatch, setShow ]),

    onJoinGame: useCallback(() => dispatch({
      action    : 'JOIN_GAME',
      gameID    : gameID,
      onSuccess : () => {
        setShow(false);
        window.history.replaceState({}, document.title, '/puzzle-bingo339');
      },
      onFail    : err => console.log(err)
    }), [ gameID, dispatch, setShow ])
  };
}


// TODO: Component
export default function IntroModal({ show: [ show, setShow ] }) {
  const { get } = useI18n();
  const { gameID, expand, invalidID, onSubmit, onSwitch, onChangeID, onNewGame, onJoinGame } = useIntroModal({ setShow });

  return (
    <BsModal show={[ show, setShow ]} backdrop="static" size="lg" colors={{ bg: 'dark', text: 'white' }}>
      <BsCollapse isShow={ 'main' === expand }>
        <BsContainer className="intro-container" border rounded padding={{ x: 2, y: 5 }} colors={{ border: 'warning' }}>
          <h4 className="welcome-title text-center text-warning font-weight-light font-italic text-shadow-sm-light">
            Welcome To
          </h4>

          <h1 className="text-center game-title my-5 text-shadow-sm-light font-weight-bolder">
            <span className="title-head text-primary font-italic">Puzzle</span>
            <span className="title-body text-danger">Bingo</span>

            <img alt="Logo" src={ logo } />
          </h1>

          <BsRow className="intro-dashboard" align="center">
            <BsCol width={{ def: 10, sm: 8, md: 6 }}>
              <button type="button" className="btn btn-link btn-lg btn-block text-secondary" onClick={ onNewGame }>
                <i className="fa fa-gamepad mr-2 text-warning" />{ get('NEW_GAME') }
              </button>

              <button type="button" className="btn btn-link btn-lg btn-block text-secondary" onClick={ onSwitch('join') }>
                <i className="fa fa-sign-in mr-2 text-warning" />{ get('JOIN_GAME') }
              </button>
            </BsCol>
          </BsRow>
        </BsContainer>
      </BsCollapse>

      <BsCollapse isShow={ 'join' === expand }>
        <form onSubmit={ onSubmit }>
          <div className="modal-body">
            <BsContainer>
              <BsRow>
                <BsCol className="form-group">
                  <input type="text" className="form-control" value={ gameID } onChange={ onChangeID } />

                  { !invalidID ? null : (
                    <div className="py-2 px-3 my-1 text-warning">
                      <i className="fa fa-exclamation mr-2" />{ get(invalidID) }
                    </div>
                  )}
                </BsCol>
              </BsRow>
            </BsContainer>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={ onSwitch('main') }>
              <i className="fa fa-undo mr-2" /> Back
            </button>

            <button type="submit" className="btn btn-danger" disabled={ isInvalidDisabled(invalidID) } onClick={ onJoinGame }>
              <i className="fa fa-undo mr-2" /> Join
            </button>
          </div>
        </form>
      </BsCollapse>
    </BsModal>
  );
};

IntroModal.propTypes = {
  show: PropTypes.array.isRequired
};
