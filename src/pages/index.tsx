import React, {PropsWithChildren, useEffect, useState} from "react";
import {getAppList, saveApp} from '@/services/app'
import {Button, Col, Modal, Row, Spin} from "antd";
import {LoadingOutlined, PlusCircleTwoTone} from "@ant-design/icons";

import {Footer, InfoCard} from '@/components';
import {PageContainer, ProDescriptionsItemProps, ProTable} from "@ant-design/pro-components";


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

        getAppList()
            .then((res: any) => {
                if (res.success === true) {
                    setAppList(res.data);
                } else {
                    setError('Failed to fetch app list.');
                }
            })
            .catch((err) => {
                setError('An error occurred while fetching app list.');
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const columns: ProDescriptionsItemProps<App>[] = [
        {
            title: '应用名称',
            dataIndex: 'name',
            tip: '名称是唯一的 key',
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
                        {appList.map((app, index) => (
                            <Col span={8} key={app.id}>
                                <InfoCard
                                    index={String(index + 1)}
                                    path={'/home'}
                                    title={app.name}
                                    desc={app.description}
                                />
                                {/*<Card*/}
                                {/*    title={app.name}*/}
                                {/*    bordered={false}*/}
                                {/*    style={{ marginBottom: 16 }}*/}
                                {/*    actions={[*/}
                                {/*        <Space>*/}
                                {/*            <a onClick={() => history.push('/app/' + app.id)}>ccccc</a>*/}
                                {/*            <a href="#">Action 2</a>*/}
                                {/*        </Space>,*/}
                                {/*    ]}*/}
                                {/*>*/}
                                {/*    <p>{app.description}</p>*/}
                                {/*</Card>*/}
                            </Col>
                        ))}
                    </Row>
                )}
            </div>
            <CreateForm
                onCancel={() => handleModalVisible(false)}
                modalVisible={createModalVisible}
            >
                <ProTable<App, App>
                    onSubmit={async (value) => {
                        const success = await saveApp(value);
                        if (success) {
                            handleModalVisible(false);
                            window.location.reload();
                        }
                    }}
                    rowKey="id"
                    type="form"
                    columns={columns}
                />
            </CreateForm>
            <Footer/>
        </PageContainer>
    );
}
