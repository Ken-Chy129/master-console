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

export {APP_API, MACHINE_API}