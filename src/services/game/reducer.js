import GameBase from './firebase';
import ServiceFn from './service.fn';


// TODO: Reducers
export function StateReducer(state, {
  status , gameID     = state.gameID     ,
  msg    , userID     = state.userID     ,
  round  , owner      = state.owner      ,
  step   , competitor = state.competitor ,
  effect , zones      = state.zones
}) {
  return {
    gameID     , status : status || state.status,
    userID     , msg    : msg ? [ ...state.msg, msg ] : state.msg,
    owner      , rounds : ServiceFn.getRounds(state, round, step, effect),
    competitor , zones  : ServiceFn.getNumbers(status, zones, effect)
  };
};

export function ActionReducer(state, params) {
  const { dispatch } = state;
  const { action, gameID, step, msg } = ServiceFn.getAction(params);

  switch (action) {
    case 'SEARCH_GAME':
      GameBase.doSearch(gameID).then(ServiceFn.doResponse(state, params));
      break;

    case 'NEW_GAME':
      GameBase.doCreate(ServiceFn.doWebsocket(dispatch)).then(ServiceFn.doResponse(state, params));
      break;

    case 'JOIN_GAME':
      GameBase.doJoin(gameID, ServiceFn.doWebsocket(dispatch)).then(ServiceFn.doResponse(state, params));
      break;

    case 'SEND_MSG':
      GameBase.doSay(msg).then(ServiceFn.doResponse(state, params, { msg }));
      break;

    case 'ATTACK':
      GameBase.doAttack(ServiceFn.getEffectParams(params), dispatch).then(ServiceFn.doResponse(state, params));
      break;

    case 'DEFENSE':
      dispatch({ step: 4, effect: ServiceFn.getEffectParams(params) });
      break;

    case 'BUILD':
      GameBase.doBuild(params).then(ServiceFn.doResponse(state, params, {
        step: 0,
        effect: ServiceFn.getEffectParams(params)
      }));
      break;

    default:
      if ('number' === typeof step && !isNaN(step))
        dispatch({ step });
      else
        throw new Error('Invalid action name: ', action);
  }
  return state;
};
