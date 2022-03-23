import {get} from '../utils/http'

export const drawCard = (params, cookies) => get('/UNO/uno/card/draw/begin/' + params.roomCode, null, cookies);
export const myCards = (params, cookies) => get('/UNO/uno/card/my/' + params.roomCode, null, cookies);
export const playCards = (params, cookies) => get('/UNO/uno/card/play/' + params.roomCode + '/' + params.uuid, null, cookies);
