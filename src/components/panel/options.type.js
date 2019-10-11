import PropTypes from 'prop-types';


export const EmptyNumbers = [{}, {}, {}, {}, {}, {}, {}, {}, {}];

export const DefaultZones = {
  0: { bgClass: 'zone-bg-1' },
  1: { bgClass: 'zone-bg-2' },
  2: { bgClass: 'zone-bg-3' },
  3: { bgClass: 'zone-bg-4' },
  4: { bgClass: 'zone-bg-5' },
  5: { bgClass: 'zone-bg-6' },
  6: { bgClass: 'zone-bg-7' },
  7: { bgClass: 'zone-bg-8' },
  8: { bgClass: 'zone-bg-9' }
};

export const TerritoryZoneType = PropTypes.exact({
  bgClass : PropTypes.string.isRequired,
  numbers : PropTypes.arrayOf(PropTypes.exact({
    x       : PropTypes.number.isRequired,
    y       : PropTypes.number.isRequired,
    number  : PropTypes.number.isRequired,
    effects : PropTypes.exact({
      built    : PropTypes.bool,
      stong    : PropTypes.bool, // true is defensing
      fog      : PropTypes.bool, // true was attacked
      occupied : PropTypes.bool, // true was attacked
      mirror   : PropTypes.bool  // true is defensing
    })
  }))
}).isRequired;
