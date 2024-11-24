import {request} from "@@/exports";
import {message} from "antd";

// 函数重载签名
function doGetRequest(apiName: string, params: {}, onSuccess: (response: any) => void, onFinally: () => void): void;
function doGetRequest(
    apiName: string,
    params: {},
    onSuccess: (response: any) => void,
    onError?: (response: any) => void,
    onFinally?: () => void
): void;

// 实现
function doGetRequest(
    apiName: string,
    params: {},
    onSuccess: (response: any) => void,
    onError?: (response: any) => void,
    onFinally?: () => void
) {
    request(apiName, {
        method: 'GET',
        params
    }).then((res) => {
        if (res.success) {
            onSuccess(res);
        } else {
            if (onError) {
                onError(res);
            } else {
                message.error(res.errorMsg).then(() => {});
            }
        }
    }).catch(() => {
        message.error("系统异常").then(() => {});
    }).finally(() => {
        if (onFinally) {
            onFinally();
        }
    });
}

// 函数重载签名
function doPostRequest(apiName: string, data: {}, onSuccess: (response: any) => void, onFinally: () => void): void;
function doPostRequest(
    apiName: string,
    data: {},
    onSuccess: (response: any) => void,
    onError?: (response: any) => void,
    onFinally?: () => void
): void;

// 实现
function doPostRequest(
    apiName: string,
    data: {},
    onSuccess: (response: any) => void,
    onError?: (response: any) => void,
    onFinally?: () => void
) {
    request(apiName, {
        method: 'POST',
        data
    }).then((res) => {
        if (res.success) {
            onSuccess(res);
        } else {
            if (onError) {
                onError(res);
            } else {
                message.error(res.errorMsg).then(() => {});
            }
        }
    }).catch(() => {
        message.error("系统异常").then(() => {});
    }).finally(() => {
        if (onFinally) {
            onFinally();
        }
    });
}

export {doGetRequest, doPostRequest}