import PropTypes from 'prop-types';


// TODO: Colors
export const BsColors = PropTypes.oneOf([
  'primary',
  'info',
  'success',
  'warning',
  'danger',
  'white',
  'light',
  'secondary',
  'dark'
]);

export const BsBtnColors = PropTypes.oneOf([
  'primary',
  'info',
  'success',
  'warning',
  'danger',
  'light',
  'secondary',
  'dark'
]);

export const BsContainerColor = PropTypes.exact({
  bg: BsColors,
  border: BsColors,
  text: BsColors
});


// TODO: Spacing
const Spacing = PropTypes.oneOf([ 0, 1, 2, 3, 4, 5 ]);
const MarginAuto = PropTypes.oneOf([ 0, 1, 2, 3, 4, 5, 'auto' ]);

const Margin = PropTypes.oneOfType([
  PropTypes.oneOf([ false ]),
  Spacing,
  PropTypes.exact({ t: Spacing, b: Spacing, y: Spacing, l: MarginAuto, r: MarginAuto, x: MarginAuto })
]);

const Padding = PropTypes.oneOfType([
  PropTypes.oneOf([ false ]),
  Spacing,
  PropTypes.exact({ t: Spacing, b: Spacing, y: Spacing, l: Spacing, r: Spacing, x: Spacing })
]);

export const BsMargin = PropTypes.oneOfType([
  Margin,
  PropTypes.exact({
    def : Margin,
    sm  : PropTypes.oneOfType([ PropTypes.oneOf([ false ]), Margin ]),
    md  : PropTypes.oneOfType([ PropTypes.oneOf([ false ]), Margin ]),
    lg  : PropTypes.oneOfType([ PropTypes.oneOf([ false ]), Margin ]),
    xl  : PropTypes.oneOfType([ PropTypes.oneOf([ false ]), Margin ])
  })
]);

export const BsPadding = PropTypes.oneOfType([
  Padding,
  PropTypes.exact({
    def : Padding,
    sm  : PropTypes.oneOfType([ PropTypes.oneOf([ false ]), Padding ]),
    md  : PropTypes.oneOfType([ PropTypes.oneOf([ false ]), Padding ]),
    lg  : PropTypes.oneOfType([ PropTypes.oneOf([ false ]), Padding ]),
    xl  : PropTypes.oneOfType([ PropTypes.oneOf([ false ]), Padding ])
  })
]);


// TODO: Border
export const BsBorder = PropTypes.oneOfType([
  PropTypes.bool,
  PropTypes.exact({ t: PropTypes.bool, b: PropTypes.bool, l: PropTypes.bool, r: PropTypes.bool })
]);

export const BsRounded = PropTypes.oneOfType([
  PropTypes.bool,
  PropTypes.exact({
    size: PropTypes.oneOf([ 'sm', 'lg' ]),
    type: PropTypes.oneOf([ 'top', 'bottom', 'left', 'right', 'circle', 'pill' ])
  })
]);


// TODO: Display
const Col12 = PropTypes.oneOf([ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 ]);
const ColWidth = PropTypes.oneOfType([ Col12, PropTypes.oneOf([ 'auto' ])]);
const ColOrder = PropTypes.oneOfType([ Col12, PropTypes.oneOf([ 'first', 'last' ])]);

export const BreakPoint = PropTypes.oneOf([ 'def', 'sm', 'md', 'lg', 'xl' ]);

export const BsHidden = PropTypes.oneOfType([
  PropTypes.bool,
  BreakPoint,
  PropTypes.arrayOf(BreakPoint)
]);

export const BsColWidth = PropTypes.oneOfType([
  ColWidth,
  PropTypes.exact({
    def : ColWidth,
    sm  : PropTypes.oneOfType([ PropTypes.oneOf([ false ]), ColWidth ]),
    md  : PropTypes.oneOfType([ PropTypes.oneOf([ false ]), ColWidth ]),
    lg  : PropTypes.oneOfType([ PropTypes.oneOf([ false ]), ColWidth ]),
    xl  : PropTypes.oneOfType([ PropTypes.oneOf([ false ]), ColWidth ])
  })
]);

export const BsColOffset = PropTypes.oneOfType([
  PropTypes.oneOf([ false ]),
  Col12,
  PropTypes.exact({
    def : Col12,
    sm  : PropTypes.oneOfType([ PropTypes.oneOf([ false ]), Col12 ]),
    md  : PropTypes.oneOfType([ PropTypes.oneOf([ false ]), Col12 ]),
    lg  : PropTypes.oneOfType([ PropTypes.oneOf([ false ]), Col12 ]),
    xl  : PropTypes.oneOfType([ PropTypes.oneOf([ false ]), Col12 ])
  })
]);

export const BsColOrder = PropTypes.oneOfType([
  PropTypes.oneOf([ false ]),
  ColOrder,
  PropTypes.exact({
    def : ColOrder,
    sm  : PropTypes.oneOfType([ PropTypes.oneOf([ false ]), ColOrder ]),
    md  : PropTypes.oneOfType([ PropTypes.oneOf([ false ]), ColOrder ]),
    lg  : PropTypes.oneOfType([ PropTypes.oneOf([ false ]), ColOrder ]),
    xl  : PropTypes.oneOfType([ PropTypes.oneOf([ false ]), ColOrder ])
  })
]);


// TODO: Bootstrap Tag Name & Children
export const BsTagName = PropTypes.oneOfType([ PropTypes.string, PropTypes.elementType ]);

export const BsChildren = PropTypes.any.isRequired;


// TODO: Button Code
export const CLOSE_MODAL = Symbol('CLOSE_MODAL');
