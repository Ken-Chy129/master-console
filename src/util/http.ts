import {request} from "@@/exports";

const doGetRequest = (apiName: string, params: {}, handleResponse: any) => {
    request(apiName, {
        method: 'GET',
        params
    }).then((res) => {
        if (res.success) {
            handleResponse(res)
        }
    })
}

const doPostRequest = (apiName: string, data: {}, handleResponse: any) => {
    request(apiName, {
        method: 'POST',
        data
    }).then((res) => {
        if (res.success) {
            handleResponse(res)
        }
    })
}

export {doGetRequest, doPostRequest}