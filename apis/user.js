import {get, post} from '../utils/http'

export const loginApi = (params) => post('/ACCOUNT/login', params);
export const logoutApi = (params) => post('/ACCOUNT/logout', params);
export const getSysUserInfo = (params) => get('/ACCOUNT/loginInfo', params);
