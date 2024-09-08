import request from "umi-request";

// axios.defaults.baseURL = 'http://localhost:8080/'

export async function getAppList() {
    return request('/app/list', {
        method: 'GET'
    })
}