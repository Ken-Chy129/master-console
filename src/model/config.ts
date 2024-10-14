type Category = {
    id: string;
    key: string;
    label: string;
    children: Category[];
    linkUrl?: string;
    icon?: string;
    disabled: boolean;
};