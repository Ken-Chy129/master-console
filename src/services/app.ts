import { request } from '@umijs/max';

export async function saveApp(app: App) {
    return request('/api/master/save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: app
    })
}

export async function getAppList() {
    return request('/api/master/apps', {
        method: 'GET'
    })
}

export function getFieldListByNamespaceId(namespaceId: string, callback: any) {
    request('/api/management/field/selectByNamespaceId', {
        method: 'GET',
        params: {
            namespaceId
        }
    }).then((res: any) => {
        if (res.success) {
            callback(res);
        }
    });
}

export async function getFieldValue(fieldId: string) {
    return request('/api/field/' + fieldId, {
        method: 'GET'
    })
}

export async function updateFieldValue(body: {
    "fieldId": string,
    "namespace": string,
    "value": string,
    "pushType": string,
    "machineIds": string
}) {
    return request('/api/field/push', {
        method: 'POST',
        data: body
    })
}

export async function getCategoryList() {
    return request('/api/master/categories', {
        method: 'GET'
    })
}

export async function getManagementField(params: {}) {
    return request('/api/management/field/selectByCondition', {
        method: 'GET',
        params
    })
}