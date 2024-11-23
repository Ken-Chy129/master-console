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

export async function getFieldValue(fieldId: string) {
    return request('/api/management/field/', {
        method: 'GET',
        params: {
            fieldId
        }
    })
}

export async function updateFieldValue(body: {
    "fieldId": string,
    "namespace": string,
    "value": string,
    "pushType": string,
    "machineIds": string
}) {
    return request('/api/management/field/push', {
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