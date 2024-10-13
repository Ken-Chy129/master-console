type App = {
    id: string;
    gmtCreate: string;
    gmtModified: string;
    name: string;
    description?: string;
    status: string;
};

type Namespace = {
    id: string;
    gmtCreate: string;
    gmtModified: string;
    appId: string;
    name: string;
    description?: string;
}

type Field = {
    id: string;
    gmtCreate: string;
    gmtModified: string;
    appId: string;
    namespaceId: string;
    name: string;
    description?: string;
};