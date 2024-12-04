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

enum TEMPLATE_API {
    LIST_BY_APPID = '/api/management/template/selectByAppId',
    PAGE_FIELD_BY_CONDITION = '/api/management/template/selectFieldPageByCondition',
}

export {NAMESPACE_API, FIELD_API, LOG_API, TEMPLATE_API}
