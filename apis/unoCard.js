import {get} from '../utils/http'

export const drawCard = (params, cookies, additionalHeaders) => get('/UNO/uno/card/draw/' + params.roomCode, null, cookies, additionalHeaders);
export const myCards = (params, cookies) => get('/UNO/uno/card/my/' + params.roomCode, null, cookies);
export const playCards = (params, cookies, additionalHeaders) => get('/UNO/uno/card/play/' + params.roomCode + '/' + params.uuid, {color: params.color}, cookies, additionalHeaders);
export const discardCards = (params, cookies) => get('/UNO/uno/card/discard/' + params.roomCode, null, cookies);
export const nextPlay = (params, cookies, additionalHeaders) => get('/UNO/uno/card/next/' + params.roomCode, null, cookies, additionalHeaders);
