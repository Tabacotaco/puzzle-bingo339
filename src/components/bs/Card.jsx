import React, { createElement, useState, useCallback } from 'react';
import PropTypes from 'prop-types';

import { getContainerClasses } from './options.fn';

import {
  BsTagName,
  BsChildren,
  BsMargin,
  BsPadding,
  BsBorder,
  BsRounded,
  BsContainerColor
} from './options.type';


// TODO: Private Component
const BsCardExtends = ({ tagName, children, name, className = '' }) => createElement(tagName, {
  className: `${ name } ${ className }`
}, children);

const defaultPropTypes = {
  tagName   : BsTagName,
  children  : BsChildren,
  className : PropTypes.string
};

BsCardExtends.propTypes = {
  ...defaultPropTypes,
  tagName : BsTagName.isRequired,
  name    : PropTypes.string.isRequired
};


// TODO: Card Components
export const BsCardTitle = props => BsCardExtends({ ...props, name: 'card-title' });
BsCardTitle.defaultProps = { tagName: 'h5' };
BsCardTitle.propTypes = defaultPropTypes;

export const BsCardText = props => BsCardExtends({ ...props, name: 'card-text' });
BsCardText.defaultProps = { tagName: 'p' };
BsCardText.propTypes = defaultPropTypes;

export const BsCardHeader = props => BsCardExtends({
  ...props,
  name      : 'card-header rounded-top',
  className : getContainerClasses('block', props)
});

BsCardHeader.defaultProps = { tagName: 'div' };
BsCardHeader.propTypes = {
  ...defaultPropTypes,

  margin  : BsMargin,
  padding : BsPadding,
  border  : BsBorder,
  rounded : BsRounded,
  colors  : PropTypes.oneOfType([ PropTypes.oneOf([ false ]), BsContainerColor ])
};

export const BsCardBody = props => BsCardExtends({
  ...props,
  name      : 'card-body',
  className : getContainerClasses('block', props)
});

BsCardBody.defaultProps = { tagName: 'div' };
BsCardBody.propTypes = {
  ...defaultPropTypes,

  margin  : BsMargin,
  padding : BsPadding,
  border  : BsBorder,
  rounded : BsRounded,
  colors  : PropTypes.oneOfType([ PropTypes.oneOf([ false ]), BsContainerColor ])
};

export const BsCardFooter = props => BsCardExtends({
  ...props,
  name      : 'card-footer rounded-bottom',
  className : getContainerClasses('block', props)
});

BsCardFooter.defaultProps = { tagName: 'div' };
BsCardFooter.propTypes = {
  ...defaultPropTypes,

  margin  : BsMargin,
  padding : BsPadding,
  border  : BsBorder,
  rounded : BsRounded,
  colors  : PropTypes.oneOfType([ PropTypes.oneOf([ false ]), BsContainerColor ])
};


// TODO: Card Panel
function useCustomCard(image) {
  const [ visibled, setVisibled ] = useState(!image);

  return {
    visibled,
    onImageLoad: useCallback(() => setVisibled(true), [ setVisibled ])
  };
}

export default function BsCard(props) {
  const { children, image } = props;
  const { visibled, onImageLoad } = useCustomCard(image);

  return (
    <div className={`card ${ getContainerClasses(visibled ? 'flex' : 'none', props) }`}>
      { !image ? null : (
        <img className="card-img-top" alt="card-header" src={ image } onLoad={ onImageLoad } />
      )}

      { children }
    </div>
  );
};

BsCard.propTypes = {
  children  : BsChildren,
  className : PropTypes.string,
  image     : PropTypes.string,
  
  margin  : BsMargin,
  padding : BsPadding,
  border  : BsBorder,
  rounded : BsRounded,
  colors  : PropTypes.oneOfType([ PropTypes.oneOf([ false ]), BsContainerColor ])
};
