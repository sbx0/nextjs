import {get} from '../utils/http'

export const gameInfoApi = (params, cookies) => get('/UNO/game/info/' + params.code, null, cookies);
