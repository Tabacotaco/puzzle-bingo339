import React, { useCallback } from 'react';
import { useGame } from '../../services/game';
import { BsContainer, BsRow, BsCol } from '../bs/Grid';

import './BingoPanel99.scss';


function useSelectNumber(dispatch) {
  return useCallback(num => () => { console.log(num, dispatch); }, [ dispatch ]);
};

export default function BingoPanel99() {
  const { bingoNums, dispatch } = useGame();
  const onSelectNumber = useSelectNumber(dispatch);

  return (
    <BsContainer className="bingo-99">
      <BsRow>
        { Object.keys(bingoNums).map(zone => ({ ...bingoNums[zone], zone })).map(({ zone, numbers, color: { bg, text } }) => (
          <BsCol key={`zone-${ zone }`} className={`zone-${ zone }`} padding={ 1 } width={ 4 } border rounded>
            <BsContainer padding={ 0 }>
              <BsRow margin={ 0 } options={{ style: { background: bg, color: text }}}>
                { numbers.map(num => (
                  <BsCol key={`number-${ num }`} tagName="button" className="bingo-number text-center"
                    rounded border width={ 4 } padding={ 2 } options={{ onClick: onSelectNumber(num) }}>
                    { num }
                  </BsCol>
                ))}
              </BsRow>
            </BsContainer>
          </BsCol>
        ))}
      </BsRow>
    </BsContainer>
  );
};
