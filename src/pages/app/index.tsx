import React, { useEffect, useState } from "react";
import {getFieldListByNamespaceId, getNamespaceList, updateFieldValue} from "@/services/app";
import {Tabs, List, Spin, Table, Button, Modal, Layout, Menu, Form, Input, Select, Space, Radio, message} from "antd";
const { Option } = Select;
import {history} from "@umijs/max";
import {getMachineList} from "@/services/common";

const SwitchPage = () => {
    const basePath = '/app/'
    const { location } = history;
    const appId = location.pathname.replace(basePath, "");
    const [namespaceList, setNamespaceList] = useState<Namespace[]>([]);
    const [fieldList, setFieldList] = useState<Field[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedNamespace, setSelectedNamespace] = useState<Namespace>();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalTitle, setModalTitle] = useState<string>('');

    const [machineList, setMachineList] = useState<Machine[]>([]);
    const [selectedField, setSelectedField] = useState<Field>();
    const [selectedPushType, setSelectedPushType] = useState<string>();
    const [form] = Form.useForm();

    useEffect(() => {
        setLoading(true);
        setError(null);
        getNamespaceList(appId)
            .then((res: any) => {
                if (res.success === true) {
                    if (res.data === null || res.data.length === 0) {
                        setError('当前应用暂时没有命名空间，快去配置吧');
                        return;
                    }
                    setNamespaceList(res.data);
                    const namespace = res.data[0];
                    setSelectedNamespace(namespace);
                    queryFieldList(namespace.id);
                } else {
                    setError('获取应用命名空间失败:' + res.message);
                }
            })
            .finally(() => setLoading(false));
    }, []);

    const queryFieldList = (namespaceId: string) => {
        setLoading(true);
        setError(null);
        getFieldListByNamespaceId(namespaceId)
            .then((res: any) => {
                if (res.success === true) {
                    setFieldList(res.data);
                } else {
                    setError('获取字段列表失败:' + res.message);
                }
            })
            .catch(() => {
                setError('发生异常');
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleTabChange = (namespaceId: string) => {
        setSelectedNamespace(namespaceList.find(value => value.id == namespaceId));
        queryFieldList(namespaceId);
    };

    const handlePushClick = (fieldId: string) => {
        setSelectedField(fieldList.find(value => value.id === fieldId));
        setModalTitle("字段值推送");
        getMachineList({appId})
            .then((res: any) => {
                if (res.success === true) {
                    res.data.forEach((machine: any) => {machine.label = machine.ipAddress; machine.value = machine.ipAddress})
                    setMachineList(res.data);
                }
                setIsModalVisible(true);
            });
    };

    const handleDistributionClick = (details: string) => {
        setModalTitle("字段值分布情况");
        setIsModalVisible(true);
    };

    const handleValuePush = () => {
        const fieldId = selectedField?.id ?? '';
        const value = selectedField?.id ?? '';
        const machines = selectedField?.id ?? '';
        updateFieldValue({
            fieldId,
            value,
            machines
        }).then((res: any) => {
                if (res.success === true) {
                    message.success("推送成功");
                } else {
                    message.error("推送失败")
                }
                setIsModalVisible(false);
        });
    }

    const handleModalClose = () => {
        form.resetFields(); // 重置表单字段
        setIsModalVisible(false);
    };

    const columns = [
        {
            title: '字段名',
            dataIndex: 'name',
            key: 'name',
            width: '30%', // 设置列宽为30%
        },
        {
            title: '描述',
            dataIndex: 'description',
            key: 'description',
            width: '45%', // 设置列宽为30%
        },
        {
            title: '操作',
            key: 'action',
            render: (text: string, field: Field) => (
                <span>
                  <Button type="primary" onClick={() => handlePushClick(field.id)}>
                    推送
                  </Button>
                  <Button type="primary" style={{ marginLeft: 8 }} onClick={() => handleDistributionClick(field.id)}>
                    查看分布
                  </Button>
                  <Button type="primary" style={{ marginLeft: 8 }} onClick={() => handlePushClick(field.id)}>
                    查看日志
                  </Button>
                </span>
            ),
            width: '25%', // 设置列宽为30%
        },
    ];

    function onFinish() {

    }

    return (
        <div>
            <Tabs
                activeKey={selectedNamespace?.id}
                onChange={handleTabChange}
                items={namespaceList.map((namespace) => ({
                    key: namespace.id,
                    label: namespace.name,
                }))}
            />
            {loading ? (
                <div>
                    <Spin />
                </div>
            ) : error ? (
                <div>
                    <p>Error: {error}</p>
                    <button onClick={() => window.location.reload()}>
                        Retry
                    </button>
                </div>
            ) : (
                <Table
                    columns={columns}
                    dataSource={fieldList}
                    rowKey="name"
                />
            )}

            <Modal
                title={modalTitle}
                open={isModalVisible}
                onOk={handleModalClose}
                onCancel={handleModalClose}
                footer={[
                    <Space>
                        <Button key="back" onClick={handleValuePush}>
                            推送
                        </Button>
                        <Button key="back" onClick={handleModalClose}>
                            关闭
                        </Button>
                    </Space>
                ]}
            >
                <Form
                    form={form}
                    name="control-hooks"
                    onFinish={onFinish}
                    style={{ maxWidth: 600, marginTop: 30, marginBottom: 30}}
                >
                    <Form.Item name="fieldName" label="变量名">
                        {selectedField?.name}
                    </Form.Item>
                    <Form.Item name="namespace" label="命名空间">
                        {selectedNamespace?.name}
                    </Form.Item>
                    <Form.Item name="fieldDescription" label="变量描述">
                        {selectedField?.description}
                    </Form.Item>
                    <Form.Item
                        noStyle
                        shouldUpdate={(prevValues, currentValues) => prevValues.gender !== currentValues.gender}
                    >
                        {({ getFieldValue }) =>
                            getFieldValue('gender') === 'other' ? (
                                <Form.Item name="customizeGender" label="Customize Gender" rules={[{ required: true }]}>
                                    <Input />
                                </Form.Item>
                            ) : null
                        }
                    </Form.Item>
                    <Form.Item name="fieldValue" label="变量值">
                        <Input.TextArea rows={4} />
                    </Form.Item>
                    <Form.Item name="pushType" label="推送方式">
                        <Radio.Group defaultValue={"all"} value={selectedPushType} onChange={(e) => setSelectedPushType(e.target.value)}>
                            <Radio value={"all"}>所有机器</Radio>
                            <Radio value={"specific"}>指定机器</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item
                        noStyle
                        shouldUpdate={(prevValues, currentValues) => prevValues.pushType !== currentValues.pushType}
                    >
                        {({ getFieldValue }) => {
                            return getFieldValue('pushType') === 'specific' ? (
                                <Form.Item name="selectedMachines" label="推送机器">
                                    <Select
                                        mode="multiple"
                                        placeholder="Select a option and change input text above"
                                        allowClear
                                        options={machineList}
                                        notFoundContent={"暂无机器"}
                                    >
                                    </Select>
                                </Form.Item>
                            ) : null
                        }}
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default SwitchPage;