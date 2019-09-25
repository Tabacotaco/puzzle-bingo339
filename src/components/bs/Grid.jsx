import { createElement } from 'react';
import PropTypes from 'prop-types';

import { uniqueArray, getBsClass, getContainerClasses } from './options.fn';

import {
  BsContainerColor,
  BsChildren,
  BreakPoint,
  BsMargin,
  BsPadding,
  BsBorder,
  BsRounded,
  BsHidden,
  BsColWidth,
  BsColOffset,
  BsColOrder
} from './options.type';


// TODO: Container
export const BsContainer = props => createElement(
  props.tagName || 'div',
  { ...(props.options || {}), className: `container ${ getContainerClasses('block', props) }` },
  props.children
);

BsContainer.propTypes = {
  children  : BsChildren,
  tagName   : PropTypes.string,
  className : PropTypes.string,

  margin  : BsMargin,
  padding : BsPadding,
  border  : BsBorder,
  rounded : BsRounded,
  colors  : PropTypes.oneOfType([ PropTypes.oneOf([ false ]), BsContainerColor ]),
  hidden  : BsHidden,
  options : PropTypes.object
};


// TODO: Row
export const BsRow = props => createElement(
  props.tagName || 'div', {
    ...(props.options || {}),
    className: `row ${ getContainerClasses('flex', props) } ${ uniqueArray([
      (props.gutters || true) === true ? '' : 'no-gutters',
      (props.align || false) === false ? '' : `justify-content-${ getBsClass({ size: props.alignable, end: props.align }) }`
    ]).join(' ')}`
  },
  props.children
);

BsRow.propTypes = {
  children  : BsChildren,
  tagName   : PropTypes.string,
  className : PropTypes.string,

  margin  : BsMargin,
  padding : BsPadding,
  border  : BsBorder,
  rounded : BsRounded,
  colors  : PropTypes.oneOfType([ PropTypes.oneOf([ false ]), BsContainerColor ]),
  hidden  : BsHidden,

  gutters   : PropTypes.bool,
  align     : PropTypes.oneOf([ false, 'start', 'center', 'end', 'around', 'between' ]),
  alignable : BreakPoint,
  options   : PropTypes.object
};


// TODO: Column
function getColOptions(options, fn) {
  const opts = options instanceof Object ? options : { def: options };

  Object.keys(opts).forEach(size => opts[size] === false ? null : fn(size, opts[size]));
}

function getColClasses({ width = 'auto', offset = false, order = false }) {
  return [ width, offset, order ].reduce((cls, option, i) => {
    switch (i) {
      case 0: getColOptions(option, (size, opts) =>
        cls.push(getBsClass({ size, start: 'col', end: 'auto' === opts ? '' : opts }))
      ); break;
      case 1: getColOptions(option, (size, opts) =>
        cls.push(getBsClass({ size, start: 'offset', end: opts }))
      ); break;
      case 2: getColOptions(option, (size, opts) =>
        cls.push(getBsClass({ size, start: 'order', end: opts }))
      ); break;
      default:
    }
    return [ ...cls ];
  }, []);
}

export const BsCol = props => createElement(
  props.tagName || 'div', {
    ...(props.options || {}),
    className: `${ getContainerClasses('block', props) } ${ uniqueArray(['col', ...getColClasses(props)]).join(' ')}`
  },
  props.children
);

BsCol.propTypes = {
  children  : BsChildren,
  tagName   : PropTypes.string,
  className : PropTypes.string,

  margin  : BsMargin,
  padding : BsPadding,
  border  : BsBorder,
  rounded : BsRounded,
  colors  : PropTypes.oneOfType([ PropTypes.oneOf([ false ]), BsContainerColor ]),
  hidden  : BsHidden,

  width   : BsColWidth,
  offset  : BsColOffset,
  order   : BsColOrder,
  options : PropTypes.object
};
