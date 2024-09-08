import request from "umi-request";

export async function getAppList() {
    return request('/app/list', {
        method: 'GET'
    })
}