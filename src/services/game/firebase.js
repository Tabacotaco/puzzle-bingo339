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


// TODO: Basic
const database = Firebase.initializeApp(JSON.parse((function generate(opts, count) {
  return count > 0 ? generate(window[DECODE_NAME](opts), --count) : opts;
})(FIREBASE_OPTIONS, DECODE_COUNT))).database();

function getUserUID() {
  if (!localStorage.getItem(STORAGE_USER_ID))
    localStorage.setItem(STORAGE_USER_ID, uuidv4());

  return localStorage.getItem(STORAGE_USER_ID);
}

function gameID(id = localStorage.getItem(STORAGE_GAME_ID)) {
  localStorage.setItem(STORAGE_GAME_ID, id);

  return id;
}

function getRoom(key, userUID) {
  return new Promise((resolve, reject) => database.ref('GameRoom').child(key).on('value', snapshot => {
    const { owner, competitor } = snapshot.val() || {};

    if (!owner)
      reject('MSG_INVALID_GAME_ID');
    else if ((userUID && [ owner, competitor ].indexOf(userUID) < 0) || (!userUID && competitor))
      reject('MSG_UNALLOWED_VISIT');
    else
      resolve(snapshot);
  }));
}

function connectWS(gameRoom, doFn = () => {}) {
  gameRoom.on('child_changed', snapshot => {
    if ('competitor' === snapshot.key && snapshot.val() !== getUserUID())
      doFn({ gameID: gameRoom.key, type: 'competitor', value: snapshot.val() });
  });

  gameRoom.child('msg').on('child_added', snapshot =>
    doFn({ gameID: gameRoom.key, type: 'msg', value: snapshot.val() })
  );

  gameRoom.child('rounds').on('child_added', snapshot =>
    doFn({ gameID: gameRoom.key, type: 'rounds', value: snapshot.val() })
  );
}


// TODO: Export Methods
export default {

  // TODO: To destroy the Game Room
  doDestroyGame: () => new Promise((resolve, reject) => !gameID() ? resolve({ status: 200, content: true })
    : database.ref('GameRoom').child(gameID()).once('value', snapshot =>
      !snapshot.exists() ? resolve({ status: 200, content: true }) : snapshot.ref.remove()
        .then(() => localStorage.removeItem(STORAGE_GAME_ID) || resolve({ status: 200, content: true }))
        .catch(() => reject({ status: 500, content: 'MSG_REQUEST_ERROR' }))
    )),

  // TODO: To search the specific Game Room
  doSearchGame: key => getRoom(key)
    .then(() => ({ status: 200, content: true }))
    .catch(err => ({ status: 500, content: err })),

  // TODO: To create a new game
  doNewGame: (listenerFn = () => {}) => database.ref('GameRoom')
    .push({ owner: getUserUID(), status: 'WAITING', competitor: '', rounds: [], msg: [] })
    .then(gameRoom => connectWS(gameRoom, listenerFn) || {
      status: 200,
      content: { gameID: gameID(gameRoom.key), status: 'WAITING', owner: getUserUID() }
    })
    .catch(err => ({ status: 500, content: err.message })),

  // TODO: To join a game by specific GAME KEY
  doJoinGame: (key, listenerFn = () => {}) => getRoom(key)
    .then(snapshot => {
      const values = snapshot.val();
      const { owner, status } = values;

      if (owner === getUserUID())
        throw new Error('MSG_PLAYER_DUPLICATED');
      else if ('WAITING' !== status)
        throw new Error('MSG_UNALLOWED_VISIT');

      connectWS(snapshot.ref, listenerFn);

      return snapshot.ref.update({ ...values, status: 'PLAYING', competitor: getUserUID() }).then(() => ({
        status  : 200,
        content : { ...values, gameID: gameID(key), status: 'PLAYING', competitor: getUserUID() }
      }));
    })
    .catch(err => ({ status: 500, content: err.message })),

  // TODO: Send messages
  doSendMessage: (key, msg) => getRoom(key, getUserUID())
    .then(snapshot => snapshot.ref.child('msg').push({ sender: getUserUID(), msg }))
    .then(() => ({ status: 200, content: true }))
    .catch(err => ({ status: 500, content: err.message })),
};
