import CamelCase from 'camelcase';

import GameBase from './firebase';

import { CARDS } from '../../assets/config/chance-cards.json'; 


// TODO: Basic && Functions
const emptyFn = () => {};

const convert2Action = params => 'object' === typeof params ? params : { action: params };

const listenerFn = dispatch => ({ gameID, type, value }) => dispatch({
  [ 'rounds' === type ? 'round' : 'attacks' === type ? 'attack' : type ]: value,
  gameID,
  ...('competitor' === type ? { status: 'PLAYING' } : {})
});

const doResponse = ({ dispatch }, { onSuccess = emptyFn, onFail = emptyFn }, params) => ({ status, content }) => {
  if (status !== 200)
    onFail(params || content)
  else {
    dispatch(params || content);
    onSuccess(params || content);
  }
};

const getRounds = ({ userID = '', rounds }, newRound, step) => {
  const isMyTurn = (newRound || rounds[rounds.length - 1] || {}).caller === userID;

  if (newRound) return [ ...rounds, !isMyTurn ? newRound : {
    ...newRound,
    step: 1,
    card: getCard(Math.floor(rounds.length / 2))
  }];
  return !isMyTurn || (!step && step !== 0) ? rounds : [ ...rounds.slice(0, rounds.length - 1), {
    ...rounds[ rounds.length - 1 ],
    step
  }]
};

const getNumbers = () => {
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
    .reduce((res, { num, zone }) => ({
      ...res,
      [ zone ]: {
        bgClass: `zone-bg-${ zone + 1 }`,
        numbers: [ ...(res[ zone ] || { numbers: []}).numbers, num ]
      }
    }), {});
};

export const getCards = () => CARDS.map(card => Object.keys(card).reduce(
  (ccResult, name) => ({ ...ccResult, [ CamelCase(name) ]: card[name] }), {}
));

const getCard = (() => {
  const cards = getCards().reduce((list, { description, type, rangeX, rangeY, count }) => {
    const i = list.length + count;

    while (list.length < i) list.push({
      description, type, rangeX, rangeY
    });
    return list;
  }, []).sort(() => Math.floor(Math.random() * 12) % 3 - 1).sort(() => Math.floor(Math.random() * 12) % 3 - 1);

  return i => cards[i];
})();

const getAttackParams = ({ target, x, y, z, card: { type, description }}) => {
  switch (target) {
    case 'zone'   : return { type, description, ranges: [{ z }] };
    case 'cell'   : return { type, description, ranges: [{ x, y }] };
    case 'line-x' : return { type, description, ranges: (ranges => {
      while (ranges.length < 9) ranges.push({ x, y: ranges.length });
      return ranges;
    })([]) };
    case 'line-y' : return { type, description, ranges: (ranges => {
      while (ranges.length < 9) ranges.push({ y, x: ranges.length });
      return ranges;
    })([]) };
    default:
      throw new Error('Error target type, it must be "cell" / "line-x" / "line-y" / "zone".');
  }
};


// TODO: Reducers
export function StateReducer(state, {
  gameID      = state.gameID      , status ,
  userID      = state.userID      , msg    ,
  owner       = state.owner       , round  ,
  competitor  = state.competitor  , step   ,
  zones       = state.zones       , attack
}) {
  return {
    gameID , userID     ,
    owner  , competitor , 

    msg     : msg ? [ ...state.msg, msg ] : state.msg,
    attacks : attack ? [ ...state.attacks, attack ] : state.attacks,
    status  : status || state.status,
    rounds  : getRounds(state, round, step),
    zones   : status !== 'PLAYING' || status === state.status ? zones : getNumbers()
  };
};

export function ActionReducer(state, params) {
  const { dispatch } = state;
  const { action, gameID, msg, step } = convert2Action(params);

  switch (action) {
    case 'DESTROY_GAME':
      GameBase.doDestroyGame().then(doResponse(state, params));
      break;

    case 'SEARCH_GAME':
      GameBase.doSearchGame(gameID).then(doResponse(state, params));
      break;

    case 'NEW_GAME':
      GameBase.doDestroyGame().then(() => GameBase.doNewGame(listenerFn(dispatch))).then(doResponse(state, params));
      break;

    case 'JOIN_GAME':
      GameBase.doJoinGame(gameID, listenerFn(dispatch)).then(doResponse(state, params));
      break;

    case 'SEND_MSG':
      GameBase.doSendMessage(gameID, msg).then(doResponse(state, params, { msg }));
      break;

    case 'LAUNCH_ATTACK':
      GameBase.doLaunchAttack(gameID, getAttackParams(params)).then(doResponse(state, params));
      break;

    case 'CALL_NUMBER':
      break;
    default:
      if ((step !== 0 && !step && isNaN(step)) || step < 0 || step > 3) throw new Error(
        `The step number is wrong(${ step }).`
      );
      dispatch({ step });
  }
  return state;
};
