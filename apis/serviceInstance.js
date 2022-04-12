import {get} from '../utils/http'

export const serviceInstanceChoose = (params, cookies) => get('/UNO/service/instance/choose', null, cookies);
