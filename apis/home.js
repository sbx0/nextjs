import {get} from '../utils/http'

export const homeCommunitiesApi = (params, cookies) => get('/HOME/communities', params, cookies);
export const homeCommunityTableStructureApi = (params, cookies) => get('/HOME/community/table/structure', params, cookies);
