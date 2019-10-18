import { useMemo } from 'react';
import CamelCase from 'camelcase';
import GameBase from './firebase';

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

const isBuildCase = ({ type, description, number }) => 'BUILD' === type && 'CALL_NUMBER' === description && 'number' === typeof number && !isNaN(number);

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

  if (isAttack && !ignoreMirror) GameBase.doReflection(isAttack && validAtt);

  switch (description) {
    case 'MIRROR' : return { ...effects, mirror: 'DEFENSE' === type };
    case 'LOCK'   : return { ...effects, mirror: newMirror, occupied: isAttack && !built && validAtt };
    case 'FOG'    : return { ...effects, mirror: newMirror, fog: isAttack && validAtt };
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

  getRounds: ({ userID = '', rounds }, newRound, step, effect) => {
    const isMyTurn = (newRound || rounds[rounds.length - 1] || {}).caller === userID;

    if (newRound) return [ ...rounds, !isMyTurn ? { ...newRound, step: 0 } : {
      ...newRound,
      step: 1,
      card: getRoundCard(Math.floor(rounds.length / 2))
    }];

    return (!isMyTurn || (!step && step !== 0) ? rounds : [ ...rounds.slice(0, rounds.length - 1), {
      ...rounds[ rounds.length - 1 ],
      step
    }]).map(round => !effect || effect.roundUID !== round.roundUID ? round : {
      ...round,
      number: effect.number
    })
  },

  getNumbers: (status, zones, effect) => {
    if ('PLAYING' === status && Object.keys(zones).length === 0)
      return getNumbers();
    else if (!effect)
      return zones;

    const { number, ranges, type, description, ignoreMirror = false } = effect;

    return isBuildCase(effect) ? Object.keys(zones).map(z => ({ zone: z, options: zones[z] })).reduce((newZones, { zone, options }) => ({
      ...newZones,
      [zone]: {
        ...options,
        numbers: options.numbers.map(land => land.number !== number ? land : {
          ...land,
          effects: getEffects(land.effects, { type, description })
        })
      }
    }), {}) : ranges.reduce((newZones, { x, y, z }) => {
      const { bgClass, numbers } = newZones[z];

      return { ...newZones, [z]: {
        bgClass,
        numbers: numbers.map(land => (land.x === x && land.y === y) || (!x && !y) ? {
          ...land,
          effects: getEffects(land.effects, { type, description, ignoreMirror })
        } : land)
      }};
    }, zones);
  },

  getCards,

  getCardImage: ({ type, description }) => imgs[`${ type.toLowerCase() }_${ description.toLowerCase() }`],

  getEffectParams: ({ roundUID, target, x, y, z, number, card: { type, description }}) => {
    if ('BUILD' === type && 'CALL_NUMBER' === description && 'number' === typeof number && !isNaN(number))
      return { roundUID, type, description, number };
    switch (target) {
      case 'zone'   : return { roundUID, type, description, ranges: [{ z }] };
      case 'cell'   : return { roundUID, type, description, ranges: [{ x, y, z }] };
      case 'line-x' : return { roundUID, type, description, ranges: (ranges => {
        while (ranges.length < 9) ranges.push({ x, y: ranges.length, z: getZIndex(x, ranges.length) });
        return ranges;
      })([]) };
      case 'line-y' : return { roundUID, type, description, ranges: (ranges => {
        while (ranges.length < 9) ranges.push({ y, x: ranges.length, z: getZIndex(ranges.length, y) });
        return ranges;
      })([]) };
      default:
        throw new Error('Error target type, it must be "cell" / "line-x" / "line-y" / "zone".');
    }
  },

  getScore: zones => {
    let   lines  = 0;
    const builts = Object.keys(zones).reduce((result, z) => [
      ...result,
      zones[z].numbers.filter(n => (n.effects || {}).built === true).map(({ x, y }) => ({ x, y }))
    ], []);

    for (let i = 0; i < 9; i++) {
      lines += builts.filter(({ x }) => x === i).length === 9 ? 1 : 0;
      lines += builts.filter(({ y }) => y === i).length === 9 ? 1 : 0;
    }
    lines += builts.filter(({ x, y }) => x === y).length === 9 ? 1 : 0;
    lines += builts.filter(({ x, y }) => (x + y) === 8).length === 9 ? 1 : 0;

    return {
      lines,
      readyHand: lines >= 2
    };
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