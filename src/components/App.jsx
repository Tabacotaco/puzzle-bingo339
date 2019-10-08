import React, { useState } from 'react';

import { BsContainer, BsRow, BsCol } from './bs/Grid';

import IntroModal from './panel/IntroModal';
import Playboard from './panel/Playboard';


// TODO: Component
export default function App() {
  const show = useState(true);

  return (
    <div className="puzzle-bingo p-3">
      <IntroModal show={ show } />

      <BsContainer padding={ 0 }>
        <BsRow>
          <BsCol padding={ 0 }>
            <Playboard />
          </BsCol>
        </BsRow>
      </BsContainer>
    </div>
  );
}
