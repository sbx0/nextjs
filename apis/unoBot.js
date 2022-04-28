import {get} from '../utils/http'

export const addUnoBot = (params, cookies, additionalHeaders) => get('/UNO/bot/add/' + params.roomCode, null, cookies, additionalHeaders);
export const removeUnoBot = (params, cookies, additionalHeaders) => get('/UNO/bot/remove/' + params.roomCode, null, cookies, additionalHeaders);
