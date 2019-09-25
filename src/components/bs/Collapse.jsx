import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { getColorClasses } from './options.fn';
import { BsContainerColor, BsChildren } from './options.type';


export default function BsCollapse({
  children,
  className = '',
  isShow,
  colors,
  onShow = () => {}
}) {
  useEffect(() => { if (isShow) onShow(); });

  return !isShow ? null : (
    <div className={ `collapse show ${ className } ${ getColorClasses(colors) }` }>
      { children }
    </div>
  );
};

BsCollapse.propTypes = {
  children  : BsChildren,
  className : PropTypes.string,
  isShow    : PropTypes.bool.isRequired,
  colors    : BsContainerColor,
  onShow    : PropTypes.func
};
