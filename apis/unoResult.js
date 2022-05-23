import {get} from '../utils/http'

export const listByGameRoom = (params, cookies, additionalHeaders) => get('/UNO/result/list/' + params.roomCode, null, cookies, additionalHeaders);
