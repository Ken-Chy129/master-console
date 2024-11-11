import { theme } from 'antd';
import {history} from "@@/core/history";
import {useModel} from "@umijs/max";

/**
 * 每个单独的卡片，为了复用样式抽成了组件
 * @param param0
 * @returns
 */
const InfoCard: React.FC<{
    title: string;
    index: number;
    desc?: string;
    path: string;
}> = ({ title, path, index, desc }) => {
    const { useToken } = theme;
    const { setAppId } = useModel("model")
    const { token } = useToken();

    const click = () => {
        setAppId(index);
        history.push(path);
    }

    return (
        <div
            style={{
                backgroundColor: token.colorBgContainer,
                boxShadow: token.boxShadow,
                borderRadius: '8px',
                fontSize: '14px',
                color: token.colorTextSecondary,
                lineHeight: '22px',
                padding: '16px 19px',
                minWidth: '220px',
                flex: 1,
            }}
        >
            <div
                style={{
                    display: 'flex',
                    gap: '4px',
                    alignItems: 'center',
                }}
            >
                <div
                    style={{
                        width: 48,
                        height: 48,
                        lineHeight: '22px',
                        backgroundSize: '100%',
                        textAlign: 'center',
                        padding: '8px 16px 16px 12px',
                        color: '#FFF',
                        fontWeight: 'bold',
                        backgroundImage:
                            "url('https://gw.alipayobjects.com/zos/bmw-prod/daaf8d50-8e6d-4251-905d-676a24ddfa12.svg')",
                    }}
                >
                    {index}
                </div>
                <div
                    style={{
                        fontSize: '16px',
                        color: token.colorText,
                        paddingBottom: 8,
                    }}
                >
                    {title}
                </div>
            </div>
            <div
                style={{
                    fontSize: '14px',
                    color: token.colorTextSecondary,
                    textAlign: 'justify',
                    lineHeight: '22px',
                    marginBottom: 8,
                }}
            >
                {desc}
            </div>
            <a onClick={click} target="_blank" rel="noreferrer">
                查看详情 {'>'}
            </a>
            <a onClick={click} target="_blank" rel="noreferrer">
                查看机器 {'>'}
            </a>
        </div>
    );
};

export default InfoCard;