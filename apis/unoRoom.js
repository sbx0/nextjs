import {get, post} from '../utils/http'

export const pagingUnoRoomsApi = (params, cookies) => get('/UNO/uno/room/list', params, cookies);
export const createUnoRoom = (params, cookies) => post('/UNO/uno/room/create', params, cookies);
export const infoUnoRoom = (params, cookies) => get('/UNO/uno/room/info/' + params.roomCode, null, cookies);
