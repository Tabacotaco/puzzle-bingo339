import { useMemo } from 'react';
import CamelCase from 'camelcase';

import { CARDS } from '../../assets/config/chance-cards.json';

import build_number from '../../assets/imgs/build-number.png';
import attack_bomb from '../../assets/imgs/attack-bomb.png';
import attack_fog from '../../assets/imgs/attack-fog.png';
import attack_lock from '../../assets/imgs/attack-lock.png';
import defense_bomb from '../../assets/imgs/defense-bomb.png';
import defense_fog from '../../assets/imgs/defense-fog.png';
import defense_lock from '../../assets/imgs/defense-lock.png';
import defense_mirror from '../../assets/imgs/defense-mirror.png';


function emptyFn() {};

const imgs = {
  build_number ,
  defense_bomb , attack_bomb ,
  defense_fog  , attack_fog  ,
  defense_lock , attack_lock ,
  defense_mirror
};

const getZIndex = (x, y) => Math.floor(x / 3) % 3 + Math.floor(y / 3) * 3;

const getNumbers = () => {
  const nums = [];

  while (nums.length < 81) nums.push(nums.length + 1);

  return nums
    .sort(() => Math.floor(Math.random() * 12) % 3 - 2)
    .map((number, i) => ({ number, zone: Math.floor(i / 9) }))
    .reduce((result, { number, zone }) => {
      const numbers = (result[ zone ] || { numbers: []}).numbers;

      return {
        ...result,
        [ zone ]   : {
          bgClass  : `zone-bg-${ zone + 1 }`,
          numbers  : [ ...numbers, {
            number,
            x: parseFloat(zone) % 3 * 3 + numbers.length % 3,
            y: Math.floor(parseFloat(zone) / 3) * 3 + Math.floor(numbers.length / 3)
          }]
        }
      };
    }, {});
};

const getEffects = (effects = {}, { type, description, ignoreMirror = false }) => {
  const { built = false, stong = false, mirror = false } = effects;
  const isAttack  = 'ATTACK' === type;
  const validAtt  = ignoreMirror || !mirror;
  const newMirror = isAttack && !ignoreMirror ? false : mirror;

  switch (description) {
    case 'MIRROR' : return { ...effects, mirror: 'DEFENSE' === type };
    case 'LOCK'   : return { ...effects, mirror: newMirror, occupied: isAttack && !built && validAtt };
    case 'FOG'    : return { ...effects, mirror: newMirror, fog: isAttack };
    case 'BOMB'   : return {
      ...effects,
      mirror : newMirror,
      built  : isAttack && !stong && validAtt ? false : built,
      stong  : 'DEFENSE' === type && built
    };
    default       : return { ...effects, built: 'BUILD' === type };
  }
};

const getCards = () => CARDS.map(card => Object.keys(card).reduce(
  (ccResult, name) => ({ ...ccResult, [ CamelCase(name) ]: card[name] }), {}
));

const getRoundCard = (function() {
  const cards = getCards().reduce((list, { description, type, rangeX, rangeY, count }) => {
    const i = list.length + count;

    while (list.length < i) list.splice(Math.ceil(Math.random() * list.length), 0, {
      description, type, rangeX, rangeY
    });
    return list;
  }, [])
  .sort(() => Math.floor(Math.random() * 12) % 3 - 2)
  .reverse()
  .sort(() => Math.floor(Math.random() * 12) % 3 - 2);

  console.log(cards[0]);

  return i => cards[i];
})();


// TODO: Export Functions
export default {

  getAction: params => 'object' === typeof params ? params : { action: params },

  getRounds: ({ userID = '', rounds }, newRound, step) => {
    const isMyTurn = (newRound || rounds[rounds.length - 1] || {}).caller === userID;
  
    if (newRound) return [ ...rounds, !isMyTurn ? newRound : {
      ...newRound,
      step: 1,
      card: getRoundCard(Math.floor(rounds.length / 2))
    }];
    return !isMyTurn || (!step && step !== 0) ? rounds : [ ...rounds.slice(0, rounds.length - 1), {
      ...rounds[ rounds.length - 1 ],
      step
    }]
  },

  getNumbers: (status, zones, effect) => 'PLAYING' === status && Object.keys(zones).length === 0 ? getNumbers()
    : !effect ? zones : (({ ranges, type, description, ignoreMirror = false }) => ranges.reduce((newZones, { x, y, z }) => {
      const { bgClass, numbers } = newZones[z];

      return {
        ...newZones,
        [z]: {
          bgClass,
          numbers: numbers.map(land => land.x !== x || land.y !== y ? land : {
            ...land,
            effects: getEffects(land.effects, { type, description, ignoreMirror })
          })
        }
      };
    }, zones))(effect),

  getCards,

  getCardImage: ({ type, description }) => imgs[`${ type.toLowerCase() }_${ description.toLowerCase() }`],

  getCardParams: ({ target, x, y, z, card: { type, description }}) => {
    switch (target) {
      case 'zone'   : return { type, description, ranges: [{ z }] };
      case 'cell'   : return { type, description, ranges: [{ x, y, z }] };
      case 'line-x' : return { type, description, ranges: (ranges => {
        while (ranges.length < 9) ranges.push({ x, y: ranges.length, z: getZIndex(x, ranges.length) });
        return ranges;
      })([]) };
      case 'line-y' : return { type, description, ranges: (ranges => {
        while (ranges.length < 9) ranges.push({ y, x: ranges.length, z: getZIndex(ranges.length, y) });
        return ranges;
      })([]) };
      default:
        throw new Error('Error target type, it must be "cell" / "line-x" / "line-y" / "zone".');
    }
  },

  doWebsocket: dispatch => ({ gameID, type, value }) => dispatch({
    [ 'rounds' === type ? 'round' : 'attacks' === type ? 'effect' : type ]: value,
    gameID,
    ...('competitor' === type ? { status: 'PLAYING' } : {})
  }),

  doResponse: ({ dispatch }, { onSuccess = emptyFn, onFail = emptyFn }, params) => ({ status, content }) => {
    if (status !== 200)
      onFail(params || content)
    else {
      dispatch(params || content);
      onSuccess(params || content);
    }
  },

  useCardRange: (card = {}) => useMemo(() => card.rangeX === 1 && card.rangeY === 1 ? 'cell'
    : card.rangeX === 9 && card.rangeY === 1 ? 'line-y'
      : card.rangeX === 1 && card.rangeY === 9 ? 'line-x' : 'zone', [ card ])
}