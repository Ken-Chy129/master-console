import {request} from "@@/exports";


// 获取应用下所有的命名空间
export async function getNamespaceList(appId: string) {
    return request('/api/namespace/' + appId, {
        method: 'GET'
    })
}


// 变更日志
export async function getManagementLog(params: {}) {
    return request('/api/management/log/selectByCondition', {
        method: 'GET',
        params
    })
}