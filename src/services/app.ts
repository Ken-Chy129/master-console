import request from "umi-request";

export async function getAppList() {
    return request('/api/app/list', {
        method: 'GET'
    })
}