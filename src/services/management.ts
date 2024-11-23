import {request} from "@@/exports";


// 获取应用下所有的命名空间
export async function getNamespaceListByAppId() {
    return request('/api/management/namespace/selectByAppId', {
        method: 'GET',
    })
}

// ====================== field ======================

// export function getFieldListByNamespaceId(namespaceId: string, callback: any) {
//     doGetRequest('/api/management/field/selectByNamespaceId', {namespaceId}, callback);
// }


// 变更日志
export async function getManagementLog(params: {}) {
    return request('/api/management/log/selectByCondition', {
        method: 'GET',
        params
    })
}

enum FIELD_API {
    LIST_BY_NAMESPACE_ID = '/api/management/field/selectByNamespaceId',

}

export {FIELD_API}
