import PropTypes from 'prop-types';

export const CardEffectType = PropTypes.exact({
  type        : PropTypes.oneOf([ 'DEFENSE' ]).isRequired,
  description : PropTypes.oneOf([ 'BOMB', 'FOG', 'LOCK', 'MIRROR' ]).isRequired
});

export const EffectsType = PropTypes.arrayOf(PropTypes.oneOfType([
  PropTypes.any,
  CardEffectType
]));

export const TerritoryZoneType = PropTypes.exact({
  bgClass : PropTypes.string.isRequired,
  numbers : PropTypes.arrayOf(PropTypes.exact({
    x       : PropTypes.number.isRequired,
    y       : PropTypes.number.isRequired,
    number  : PropTypes.number.isRequired,
    attacks : EffectsType
  }))
}).isRequired;
