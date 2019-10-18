import React, { useState, useMemo, useCallback } from 'react';

import { useI18n } from '../services/i18n';
import { GameCustom } from '../services/game';

import { BsContainer, BsRow, BsCol } from './bs/Grid';

import IntroModal from './panel/IntroModal';
import GameStep from './panel/GameStep';
import Territories from './panel/Territories';

import '../assets/css/App.scss';


// TODO: Custom Function
function useCustom({ step, card, dispatch }) {
  const defenseRange = GameCustom.useCardRange(card);
  const { roundUID } = GameCustom.useGame();

  return {
    isSelecting: useMemo(() => step === 4 || (step === 3 && 'DEFENSE' === card.type), [ step, card ]),

    mode: useMemo(() => step === 4 ? 'build' : step === 3 && 'DEFENSE' === card.type ? 'defense' : 'switch', [ step, card ]),

    hoverOn: useMemo(() => step === 4 ? 'cell' : step === 3 && 'DEFENSE' === card.type ? defenseRange : 'zone', [ step, card, defenseRange ]),

    onBackToMenu: useCallback(() => window.location.reload(), []),

    onSelected: useCallback(({ x, y, z, number }) => {
      if (step === 4) dispatch({
        action : 'BUILD',
        target : 'cell',
        card   : { type: 'BUILD', description: 'CALL_NUMBER' },
        roundUID, number
      });
      else if (step === 3 && 'DEFENSE' === card.type) dispatch({
        action : 'DEFENSE',
        target : defenseRange,
        roundUID, card, x, y, z
      });
    }, [ roundUID, card, step, dispatch, defenseRange ])
  };
}


// TODO: Component
export default function App() {
  const { get } = useI18n();
  const show = useState(true);
  const { zones, step, card, score: { lines = 0 }, dispatch } = GameCustom.useGame();

  const {
    isSelecting,
    mode,
    hoverOn,

    onBackToMenu,
    onSelected
  } = useCustom({ step, card, dispatch });

  return (
    <div className="p-3">
      <IntroModal show={ show } />

      <BsContainer padding={ 0 }>
        <BsRow>
          <BsCol padding={ 0 }>
            <h4>{ get('LABEL_LINE_COUNT') }: { lines }</h4>

            <BsContainer className="app text-white">
              <BsRow align="center">
                <BsCol width={{ def: 11, sm: 10, md: 8, lg: 6}}>
                  <Territories isMime cursor={ 'defense' === mode ? GameCustom.useCardImage(card) : undefined } {...{
                    mode,
                    hoverOn,
                    isSelecting,
                    zones,
                    onSelected
                  }} />
                </BsCol>
              </BsRow>

              <GameStep onCancelWaiting={ onBackToMenu } />
            </BsContainer>
          </BsCol>
        </BsRow>
      </BsContainer>
    </div>
  );
}
