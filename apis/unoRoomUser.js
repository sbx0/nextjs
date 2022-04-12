import {get} from '../utils/http'

export const listRoomUser = (params, cookies) => get('/UNO/uno/room/user/list/' + params.roomCode, null, cookies);
export const joinRoom = (params, cookies, additionalHeaders) => get('/UNO/uno/room/user/join/' + params.roomCode, null, cookies, additionalHeaders);
export const quitRoom = (params, cookies, additionalHeaders) => get('/UNO/uno/room/user/quit/' + params.roomCode, null, cookies, additionalHeaders);
