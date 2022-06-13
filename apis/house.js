import {get, post} from '../utils/http'

export const homeCommunityHouseApi = (params, cookies) => post('/HOME/communityHouses', params, cookies);
export const homeCommunityHouseTableStructureApi = (params, cookies) => get('/HOME/house/table/structure', params, cookies);
export const homeCommunityHouseUpdateOneByIdApi = (params, cookies) => post('/HOME/house/updateOneById', params, cookies);
export const homeCommunityHouseAddOneApi = (params, cookies) => post('/HOME/house/addOne', params, cookies);
