import {get} from '../utils/http'

export const sseSend = (params, cookies) => get('/UNO/sse/send', params, cookies);
