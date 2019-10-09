import GameBase from './firebase';
import ServiceFn from './service.fn';


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

    msg    : msg ? [ ...state.msg, msg ] : state.msg,
    status : status || state.status,
    rounds : ServiceFn.getRounds(state, round, step),
    zones  : 'PLAYING' === status && Object.keys(state.zones).length === 0 ? ServiceFn.getNumbers()
      : !attack ? zones : ServiceFn.getNumbersWithAttack(attack, zones)
  };
};

export function ActionReducer(state, params) {
  const { dispatch } = state;
  const { action, gameID, msg, step, onSuccess = () => {} } = ServiceFn.getAction(params);

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
      GameBase.doAttack(ServiceFn.getCardParams(params)).then(ServiceFn.doResponse(state, params));
      break;

    case 'DEFENSE':
      const defenseState = ServiceFn.doDefense(state, ServiceFn.getCardParams(params));

      dispatch({ step: 4 });
      onSuccess({ defenses: defenseState.defenses });
      
      return defenseState;

    case 'BUILD':
      break;
    default:
      if ((step !== 0 && !step && isNaN(step)) || step < 0 || step > 3) throw new Error(
        `The step number is wrong(${ step }).`
      );
      dispatch({ step });
  }
  return state;
};
