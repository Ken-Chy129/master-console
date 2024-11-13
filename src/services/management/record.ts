import {request} from "@@/exports";

export async function getManagementLog(params: {}) {
    return request('/api/management/log/selectByCondition', {
        method: 'GET',
        params
    })
}