import {get, post} from '../utils/http'

export const homeCommunitiesApi = (params, cookies) => post('/HOME/communities', params, cookies);
export const homeCommunityTableStructureApi = (params, cookies) => get('/HOME/community/table/structure', params, cookies);
export const homeCommunityUpdateOneByIdApi = (params, cookies) => post('/HOME/community/updateOneById', params, cookies);
export const homeCommunityAddOneApi = (params, cookies) => post('/HOME/community/addOne', params, cookies);
