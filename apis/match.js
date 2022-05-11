import {get, post} from '../utils/http'

export const joinMatch = (params, cookies) => post('/UNO/match/join', params, cookies);
export const quitMatch = (params, cookies) => post('/UNO/match/quit', params, cookies);
export const infoMatch = (params, cookies) => get('/UNO/match/info', params, cookies);