import React, {PropsWithChildren, useEffect, useState} from "react";
import {APP_API} from '@/services/app'
import {Button, Col, message, Modal, Row, Spin} from "antd";
import {LoadingOutlined, PlusCircleTwoTone} from "@ant-design/icons";

import {Footer, InfoCard} from '@/components';
import {PageContainer, ProDescriptionsItemProps, ProTable} from "@ant-design/pro-components";
import {doGetRequest, doPostRequest} from "@/util/http";


const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

interface CreateFormProps {
    modalVisible: boolean;
    onCancel: () => void;
}

const CreateForm: React.FC<PropsWithChildren<CreateFormProps>> = (props) => {
    const { modalVisible, onCancel } = props;
    return (
        <Modal
            destroyOnClose
            title="新建"
            width={420}
            open={modalVisible}
            onCancel={() => onCancel()}
            footer={null}
        >
            {props.children}
        </Modal>
    );
};

export default function AppPage() {
    const [appList, setAppList] = useState<App[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [createModalVisible, handleModalVisible] = useState<boolean>(false);

    useEffect(() => {
        setLoading(true);
        setError(null);

        doGetRequest(APP_API.LIST, {}, {
            onSuccess: (res) => setAppList(res.data),
            onFinally: () => setLoading(false)
        });
    }, []);

    const createApp = (app: {}) => {
        doPostRequest(APP_API.SAVE, {...app, status: 1}, {
            onSuccess: () => message.success("新建应用成功").then(_ => {})
        });
    }

    const columns: ProDescriptionsItemProps<App>[] = [
        {
            title: '应用名称',
            dataIndex: 'name',
            formItemProps: {
                rules: [
                    {
                        required: true,
                        message: '名称为必填项',
                    },
                ],
            },
        },
        {
            title: '应用描述',
            dataIndex: 'description',
        },
        {
            title: '操作',
            dataIndex: 'option',
            valueType: 'option',
            render: () => (
                <Button
                    type="primary"
                    onClick={() => {
                        handleModalVisible(false);
                    }}
                >
                    提交
                </Button>
            ),
        },
    ];

    return (
        <PageContainer>
            <div style={{margin: 25}}>
                {loading ? (
                    <Spin indicator={antIcon} style={{marginTop: '50px'}}/>
                ) : error ? (
                    <div style={{textAlign: 'center', marginTop: '50px'}}>
                        <p>Error: {error}</p>
                        <button onClick={() => window.location.reload()}>
                            Retry
                        </button>
                    </div>
                ) : (
                    <Row gutter={[16, 16]}>
                        {appList.map((app, index) => (
                            <Col span={8} key={app.id}>
                                <InfoCard
                                    index={String(index + 1)}
                                    path={'/home'}
                                    title={app.name}
                                    desc={app.description}
                                />
                            </Col>
                        ))}
                        <Col span={8}>
                            <PlusCircleTwoTone
                                onClick={() => {
                                    handleModalVisible(true);
                                }}
                                style={{
                                    // backgroundColor: token.colorBgContainer,
                                    // boxShadow: token.boxShadow,
                                    borderRadius: '8px',
                                    fontSize: '56px',
                                    // color: token.colorTextSecondary,
                                    lineHeight: '22px',
                                    padding: '16px 19px',
                                    minWidth: '220px',
                                    flex: 1,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: '100%',
                                    border: '1px dashed #d9d9d9',
                                    cursor: 'pointer',
                                }}
                            />
                        </Col>
                    </Row>
                )}
                <CreateForm
                    onCancel={() => handleModalVisible(false)}
                    modalVisible={createModalVisible}
                >
                    <ProTable<App, App>
                        onSubmit={createApp}
                        rowKey="id"
                        type="form"
                        columns={columns}
                    />
                </CreateForm>
            </div>
            <Footer/>
        </PageContainer>
    );
}
