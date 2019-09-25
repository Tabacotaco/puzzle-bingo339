import GameBase from './firebase';


// TODO: Basic && Functions
const ZoneColors = [
  { bg: '#20c997', text: '#fff' },
  { bg: '#fd7e14', text: '#fff' },
  { bg: '#e83e8c', text: '#fff' },
  { bg: '#6610f2', text: '#fff' },
  { bg: '#6c757d', text: '#fff' },
  { bg: '#ffc107', text: '#fff' },
  { bg: '#dc3545', text: '#fff' },
  { bg: '#28a745', text: '#fff' },
  { bg: '#007bff', text: '#fff' }
];

function emptyFn() {}

function convert2Action(params) {
  return 'object' === typeof params ? params : { action: params };
}

function listenerFn(dispatch) {
  return ({ gameID, type, value }) => dispatch({
    [ type ]: value,
    gameID,
    status: 'competitor' === type ? 'PLAYING' : null
  });
}

function doResponse({ dispatch }, { onSuccess = emptyFn, onFail = emptyFn }, params) {
  return ({ status, content }) => {
    if (status !== 200)
      onFail(params || content)
    else {
      dispatch(params || content);
      onSuccess(params || content);
    }
  };
}


// TODO: Reducers
export function StateReducer(state, {
  gameID     = state.gameID     , status,
  owner      = state.owner      , msg,
  competitor = state.competitor , rounds,
  bingoNums  = state.bingoNums
}) {
  return {
    gameID     , status : status || state.status,
    owner      , msg    : msg ? [ ...state.msg, msg ] : state.msg,
    competitor , rounds : rounds ? [ ...state.rounds, rounds ] : state.rounds,
    bingoNums  : status !== 'PLAYING' || status === state.status ? bingoNums : (() => {
      const nums = [];

      while (nums.length < 81)
        nums.push(nums.length + 1);

      return nums.sort(() => Math.round(Math.random() * 12) % 3 - 2).map((num, i) => ({
        num,
        zone: Math.floor(i / 9)
      })).reduce((res, { num, zone }) => ({
        ...res,
        [ zone ]: {
          color: ZoneColors[ zone ],
          numbers: [ ...(res[ zone ] || { numbers: []}).numbers, num ]
        }
      }), {});
    })()
  };
};

export function ActionReducer(state, params) {
  const { dispatch } = state;
  const { action, gameID, msg /*, rounds */ } = convert2Action(params);

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

    default:
  }
  return state;
};