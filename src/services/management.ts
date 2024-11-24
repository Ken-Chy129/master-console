enum NAMESPACE_API {
    LIST_BY_APPID = '/api/management/namespace/selectByAppId',
}

enum FIELD_API {
    LIST_BY_NAMESPACE_ID = '/api/management/field/selectByNamespaceId',
    PAGE_BY_CONDITION = '/api/management/field/selectByCondition',
    GET = '/api/management/field/get',
    PUSH = '/api/management/field/push',
}

enum LOG_API {
    PAGE_BY_CONDITION = '/api/management/log/selectByCondition',
}

export {NAMESPACE_API, FIELD_API, LOG_API}
