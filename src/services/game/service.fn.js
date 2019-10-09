import { useMemo } from 'react';
import CamelCase from 'camelcase';

import { CARDS } from '../../assets/config/chance-cards.json';

import attack_bomb from '../../assets/imgs/attack-bomb.png';
import attack_fog from '../../assets/imgs/attack-fog.png';
import attack_lock from '../../assets/imgs/attack-lock.png';
import defense_bomb from '../../assets/imgs/defense-bomb.png';
import defense_fog from '../../assets/imgs/defense-fog.png';
import defense_lock from '../../assets/imgs/defense-lock.png';
import defense_mirror from '../../assets/imgs/defense-mirror.png';


function emptyFn() {};

const imgs = {
  defense_bomb , attack_bomb ,
  defense_fog  , attack_fog  ,
  defense_lock , attack_lock ,
  defense_mirror
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

const getZIndex = (x, y) => Math.floor(x / 3) % 3 + Math.floor(y / 3) * 3;


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

  getNumbers: () => {
    const nums = [];
  
    while (nums.length < 81)
      nums.push(nums.length + 1);
  
    return nums
      .sort(() => Math.floor(Math.random() * 12) % 3 - 2)
      .sort(() => Math.floor(Math.random() * 12) % 3 - 2)
      .map((num, i) => ({
        num,
        zone: Math.floor(i / 9)
      }))
      .reduce((result, { num, zone }) => {
        const numbers = (result[ zone ] || { numbers: []}).numbers;

        return {
          ...result,
          [ zone ]   : {
            bgClass  : `zone-bg-${ zone + 1 }`,
            numbers  : [ ...numbers, {
              number : num,
              x      : parseFloat(zone) % 3 * 3 + numbers.length % 3,
              y      : Math.floor(parseFloat(zone) / 3) * 3 + Math.floor(numbers.length / 3)
            }]
          }
        };
      }, {});
  },

  getNumbersWithAttack: ({ ranges, type, description }, zones) => ranges.reduce((result, { x, y, z }) => {
    const { bgClass, numbers } = result[z];

    return {
      ...result,
      [ z ]: {
        bgClass,
        numbers: numbers.map(({ x: $x, y: $y, number, attacks = [] }) => ({
          x: $x,
          y: $y,
          number,
          attacks: $x !== x || $y !== y ? attacks : [
            ...attacks,
            ...(attacks.filter(
              card => JSON.stringify(card) === JSON.stringify({ type, description })
            ).length > 0 ? [] : [{ type, description }])
          ]
        }))
      }
    };
  }, zones),

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
    [ 'rounds' === type ? 'round' : 'attacks' === type ? 'attack' : type ]: value,
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

  doDefense: ({ dispatch, defenses = {} }, { type, description, ranges }) => ({
    dispatch,
    defenses: ranges.reduce((result, { x, y }) => {
      const key = `${ x }-${ y }`;
      const effects = Array.isArray(result[key]) ? result[key] : [];

      return {
        ...result,
        [ key ]: [
          ...effects,
          ...(effects.filter(
            card => JSON.stringify(card) === JSON.stringify({ type, description })
          ).length > 0 ? [] : [{ type, description }])
        ]
      };
    }, defenses)
  }),

  useCardRange: (card = {}) => useMemo(() => card.rangeX === 1 && card.rangeY === 1 ? 'cell'
    : card.rangeX === 9 && card.rangeY === 1 ? 'line-y'
      : card.rangeX === 1 && card.rangeY === 9 ? 'line-x' : 'zone', [ card ])
}