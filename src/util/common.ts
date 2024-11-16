import type {MessageInstance} from "antd/es/message/interface";

export const showErrorTips = (messageApi: MessageInstance, content: string) => {
    messageApi.open({
        type: 'error',
        content: content,
    }).then(() => {});
};