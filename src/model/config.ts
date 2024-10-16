type Category = {
    id: string;
    key: string;
    label: string;
    children: Category[];
    linkUrl?: string;
    icon?: string;
    disabled: boolean;
};

export interface MenuDataItem {
    authority?: string[] | string;
    children?: MenuDataItem[];
    hideChildrenInMenu?: boolean;
    hideInMenu?: boolean;
    icon?: string;
    locale?: string;
    name?: string;
    path: string;

    [key: string]: any;
}