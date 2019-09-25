// TODO: Private Methods
function isBreakPointOpts(options) {
  return Object.keys(options).filter(prop => [ 'def', 'sm', 'md', 'lg', 'xl' ].indexOf(prop) >= 0).length > 0;
}

function toFullArrow(arrow) {
  return 't' === arrow ? 'top' : 'b' === arrow ? 'bottom' : 'l' === arrow ? 'left' : 'right';
};

function getSpacingClass(kind, options) {
  const cls = [];

  Object.keys(options).forEach(breakpoint => {
    const value = options[breakpoint];

    if (value !== false) {
      if ('number' === typeof value)
        cls.push(getBsClass({ size: breakpoint, start: kind, end: value }));
      else Object.keys(value).forEach(on => {
        const $value = value[on] || '';

        if ($value || $value === 0)
          cls.push(getBsClass({ size: breakpoint, start: `${kind}${on}`, end: $value }));
      });
    }
  });
  return cls;
}

function getBorderClass(options) {
  const cls = [];

  if (options !== false) {
    if (options === true)
      cls.push('border');
    else Object.keys(options).forEach(on =>
      cls.push(`border-${ toFullArrow(on) }`)
    );
  }
  return cls;
}

function getRoundedClass(options) {
  const cls = [];

  if (options !== false) {
    if (options === true)
      cls.push('rounded');
    else Object.keys(options).forEach(prop => {
      const {[ prop ]: value } = options;

      if (value)
        cls.push(`rounded-${value}`);
    });
  }
  return cls;
}

function getDisplayClass(display, options) {
  const cls = [`d-${options === true ? 'none' : display}`];

  options = options === true ? 'def' : options;

  if (options !== false) {
    const hiddenOn = Array.isArray(options) ? options : [options];

    ['def', 'sm', 'md', 'lg', 'xl'].filter(breakpoint =>
      hiddenOn.indexOf(breakpoint) >= 0
    ).forEach(breakpoint => {
      cls.splice(cls.indexOf(getBsClass({ size: breakpoint, start: 'd', end: display })), 1);
      cls.push(getBsClass({ size: breakpoint, start: 'd', end: 'none' }));
    });
  }
  return cls;
}


// TODO: Export Functions
export const uniqueArray = arr => arr.filter((prop, i) => !!prop && arr.indexOf(prop) === i);

export const getBsClass = ({ size = '', start = '', end = '' } = {}) => [start, 'def' === size ? '' : size, end].filter(
  value => value === 0 || !!value
).join('-');

export const getColorClasses = ({ bg, border, text } = {}) => uniqueArray([
  bg ? `bg-${ bg }` : '',
  border ? `border-${ border }` : '',
  text ? `text-${ text }` : ''
]).join(' ');

export const getContainerClasses = (display, {
  className = '',
  margin    = false,
  padding   = false,
  border    = false,
  rounded   = false,
  hidden    = false,
  colors    = false
}) => uniqueArray([
  className,
  ...getSpacingClass('m', isBreakPointOpts(margin) ? margin : { def: margin }),
  ...getSpacingClass('p', isBreakPointOpts(padding) ? padding : { def: padding }),
  ...getBorderClass(border),
  ...getRoundedClass(rounded),
  ...getDisplayClass(display, hidden),
  getColorClasses(!colors ? {} : colors)
]).join(' ');
