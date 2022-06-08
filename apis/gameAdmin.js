import {get} from '../utils/http'

export const gameAdminRoomsApi = (params, cookies) => get('/UNO/game/admin/rooms', params, cookies);
