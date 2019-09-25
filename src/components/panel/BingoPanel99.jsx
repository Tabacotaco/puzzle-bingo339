import React, { useCallback } from 'react';
import { useGame } from '../../services/game';
import { BsContainer, BsRow, BsCol } from '../bs/Grid';

import './BingoPanel99.scss';


function useSelectNumber(dispatch) {
  return useCallback(num => () => { console.log(num, dispatch); }, [ dispatch ]);
};

export default function BingoPanel99() {
  const { bingoNums, userID, status, rounds, dispatch } = useGame();
  const onSelectNumber = useSelectNumber(dispatch);
console.log(userID, status, rounds);
  return (
    <BsContainer className="bingo-99 text-white">
      <BsRow>
        <BsCol className="container numbers" width={{ def: 11, sm: 10, md: 8, lg: 6}}>
          <BsRow align="center">
            { Object.keys(bingoNums).map(zone => ({ ...bingoNums[zone], zone })).map(({ zone, numbers, color }) => (
              <BsCol key={`zone-${ zone }`} className={`container zone zone-${ zone }`} padding={ 0 } margin={ 0 } width={ 4 } border rounded>
                <BsRow margin={ 1 } options={{ style: { background: color }}}>
                  { numbers.map(num => (
                    <BsCol key={`number-${ num }`} tagName="button" className="bingo-number text-center"
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
