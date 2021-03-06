import Firebase from 'firebase/app';
import uuidv4 from 'uuid';

import 'firebase/database';

import {
  FIREBASE_OPTIONS,
  DECODE_NAME,
  DECODE_COUNT,

  STORAGE_USER_ID,
  STORAGE_GAME_ID
} from '../../assets/config/api.json';


// TODO: Export Class
function connectWebsocket(gameRoom, fn) {
  gameRoom.on('child_changed', snapshot => {
    if ('competitor' === snapshot.key && snapshot.val() !== GameRoom.userID)
      fn({ gameID: gameRoom.key, type: 'competitor', value: snapshot.val() });
  });

  gameRoom.child('msg').on('child_added', snapshot =>
    fn({ gameID: gameRoom.key, type: 'msg', value: snapshot.val() })
  );

  gameRoom.child('attacks').on('child_added', snapshot =>
    snapshot.val().launcher === GameRoom.userID ? null : fn({
      gameID : gameRoom.key,
      type   : 'attacks',
      value  : snapshot.val()
    })
  );

  gameRoom.child('rounds').on('child_added', snapshot => {
    const roundUID = snapshot.key;
    const { caller } = snapshot.val();

    fn({ gameID: gameRoom.key, type: 'rounds', value: { ...snapshot.val(), roundUID: snapshot.key }});

    if (GameRoom.userID !== caller) gameRoom.child('rounds').once('child_changed', snapshot => fn({
      gameID: gameRoom.key,
      type: 'effect',
      value: {
        roundUID,
        type        : 'BUILD',
        description : 'CALL_NUMBER',
        number      : snapshot.val().number
      }
    }));
  });
}

class GameRoom {
  static database = Firebase.initializeApp(JSON.parse((function generate(opts, count) {
    return count > 0 ? generate(window[DECODE_NAME](opts), --count) : opts;
  })(FIREBASE_OPTIONS, DECODE_COUNT))).database();

  static userID = (() => {
    if (!localStorage.getItem(STORAGE_USER_ID))
      localStorage.setItem(STORAGE_USER_ID, uuidv4());

    return localStorage.getItem(STORAGE_USER_ID);
  })();

  static uid = localStorage.getItem(STORAGE_GAME_ID);

  ref = null;

  constructor() {
    if (!!GameRoom.uid) GameRoom.database.ref('GameRoom').child(GameRoom.uid).once('value',
      snapshot => !snapshot.exists() ? null : snapshot.ref.remove()
    );
  }

  get uid() { return (this.ref || {}).key || ''; }

  get snapshot() { return new Promise(resolve => this.ref.once('value', snapshot => resolve(snapshot))); }

  create(websocketFn) {
    return GameRoom.database.ref('GameRoom')
      .push({ owner: GameRoom.userID, status: 'WAITING', competitor: '' })
      .then(newGame => {
        this.ref = newGame;
        localStorage.setItem(STORAGE_GAME_ID, newGame.key);
        connectWebsocket(newGame, websocketFn);

        return {
          status   : 200,
          content  : {
            gameID : newGame.key,
            userID : GameRoom.userID,
            status : 'WAITING',
            owner  : GameRoom.userID
          }
        }
      });
  }

  search(uid) {
    return new Promise((resolve, reject) => GameRoom.database.ref('GameRoom').child(uid).once('value', snapshot => {
      const { owner, competitor, status } = snapshot.val() || {};

      if (!snapshot.exists() || !owner)
        return reject('MSG_INVALID_GAME_ID');
      else if (owner === GameRoom.userID || !!competitor || 'WAITING' !== status)
        return reject('MSG_UNALLOWED_VISIT');

      resolve(snapshot);
    }));
  }

  join(uid, websocketFn) {
    let values;

    return this.search(uid).then(snapshot => {
      values   = snapshot.val();
      this.ref = snapshot.ref;

      localStorage.setItem(STORAGE_GAME_ID, snapshot.key);
      connectWebsocket(snapshot.ref, websocketFn);

      return snapshot;
    }).then(snapshot => snapshot.ref.update({
      ...snapshot.val(),
      status     : 'PLAYING',
      competitor : GameRoom.userID
    })).then(() => this.ref.child('rounds').push({
      caller: values.owner
    })).then(() => new Promise(resolve => this.ref.once('value', snapshot => resolve({
      status  : 200,
      content : { ...snapshot.val(), userID: GameRoom.userID, rounds: undefined }
    }))));
  }
}


// TODO: Export Methods
export default (bingo => ({

  doSearch : key => bingo.search(key)
    .then(() => ({ status: 200, content: true }))
    .catch(err => ({ status: 500, content: err })),

  doCreate : websocketFn => bingo.create(websocketFn).catch(err => ({ status: 500, content: err })),

  doJoin   : (key, websocketFn) => bingo.join(key, websocketFn).catch(err => ({ status: 500, content: err })),

  doSay    : msg => bingo.ref.child('msg')
    .push({ sender: GameRoom.userID, msg })
    .then(() => ({ status: 200, content: true }))
    .catch(err => ({ status: 500, content: err })),

  doBuild  : ({ roundUID, number }) => new Promise(resolve => bingo.ref.once('value', snapshot => {
    const { owner, competitor } = snapshot.val();

    snapshot.ref.child('rounds').child(roundUID).once('value', snapshot => snapshot.ref
      .update({ ...snapshot.val(), number })
      .then(() => bingo.ref.child('rounds').push({ caller: competitor === GameRoom.userID ? owner : competitor }))
      .then(() => resolve({ status: 200, content: true }))
      .catch(err => ({ status: 500, content: err }))
    )
  })),

  doAttack : (attack, dispatch) => bingo.ref.child('attacks')
    .push({ ...attack, launcher: GameRoom.userID })
    .then(newAttack => new Promise(resolve => bingo.ref.child('attacks').once('child_changed', snapshot => {
      if (newAttack.key === snapshot.key) {
        const { isReflection = false, type, description, ranges } = snapshot.val();
  
        if (!isReflection)
          dispatch({ step: 4 });
        else dispatch({
          step    : 4,
          effects : { type, description, ranges, ignoreMirror: true }
        });
        resolve({ status: 200, content: true });
      }
    })))
    .catch(err => ({ status: 500, content: err })),

  doReflection : isValidAttack => bingo.ref.child('attacks').once('value', snapshot => {
    const attackIDs = Object.keys(snapshot.val());
    const lastID = attackIDs[attackIDs.length - 1];

    snapshot.ref.child(lastID).update({
      ...snapshot.val()[lastID],
      isReflection: !isValidAttack
    });
  })
}))(new GameRoom());
