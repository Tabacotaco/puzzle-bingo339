import React from 'react';
import { BsChildren } from '../bs/options.type';

import '../../assets/css/StepModal.scss';


export default function StepModal({ children }) {
  return (
    <div className="step-modal d-flex justify-content-center">
      { children }
    </div>
  );
};

StepModal.propTypes = {
  children: BsChildren
};
