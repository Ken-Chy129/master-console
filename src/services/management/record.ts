import {request} from "@@/exports";

export async function getManagementLog(params: {}) {
    return request('/api/management/log', {
        method: 'GET',
        params
    })
}