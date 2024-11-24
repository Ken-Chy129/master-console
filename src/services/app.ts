import { request } from '@umijs/max';

export async function getCategoryList() {
    return request('/api/master/categories', {
        method: 'GET'
    })
}

enum APP_API {
    SAVE = '/api/master/save',
    LIST = '/api/master/apps',
}

enum MACHINE_API {
    LIST = '/api/master/machines',
}

export async function getMachineList(params: {
    appId: string
}, options?: { [key: string]: any }) {
    return request<API.LoginResult>('/api/master/machines', {
        method: 'GET',
        params: {
            ...params,
        },
        ...(options || {}),
    });
}

export {APP_API, MACHINE_API}