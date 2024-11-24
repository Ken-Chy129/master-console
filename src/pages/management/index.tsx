import React, { useEffect, useState } from "react";
import {NAMESPACE_API, FIELD_API} from "@/services/management"
import {MACHINE_API} from "@/services/app"
import {Tabs, Spin, Table, Button, Modal, Form, Input, Select, Space, Radio, message, Row, Col} from "antd";
import {doGetRequest, doPostRequest} from "@/util/http";

const ManagementPage = () => {
    const appId = localStorage.getItem('appId')!

    const [namespaceList, setNamespaceList] = useState<Namespace[]>([]);
    const [fieldList, setFieldList] = useState<Field[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedNamespace, setSelectedNamespace] = useState<Namespace>();
    const [showModalIndex, setShowModalIndex] = useState(0)
    const [modalTitle, setModalTitle] = useState<string>('');

    const [machineList, setMachineList] = useState<Machine[]>([]);
    const [selectedMachineIds, setSelectedMachineIds] = useState<string[]>([])
    const [newValue, setNewValue] = useState<string>("")
    const [selectedField, setSelectedField] = useState<Field>();
    const [selectedPushType, setSelectedPushType] = useState<string>("all");
    const [fieldValue, setFieldValue] = useState<FieldValue>();
    const [machineFieldValue, setMachineFieldValue] = useState<MachineFieldValue[]>([]);
    const [form] = Form.useForm();
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        setLoading(true);
        setError(null);
        queryNamespace();
        queryManagementField();
        setLoading(false);
    }, []);

    useEffect(() => {
        setLoading(true);
        queryManagementField();
        setLoading(false);
    }, [pageIndex, pageSize]);

    const queryNamespace = () => {
        doGetRequest(NAMESPACE_API.LIST_BY_APPID, {}, {
            onSuccess: (res: any) => {
                res.data.forEach((namespace: any) => {namespace.label = namespace.name; namespace.value = namespace.id});
                setNamespaceList(res.data);
            }
        });
    }

    const queryManagementField = () => {
        const namespaceId = form.getFieldValue("namespace");
        const fieldName = form.getFieldValue("fieldName");
        doGetRequest(FIELD_API.PAGE_BY_CONDITION, {namespaceId, fieldName, pageIndex, pageSize}, {
            onSuccess: (res: any) => {
                setTotal(res.total)
                setFieldList(res.data);
            }
        });
    };

    const handlePushClick = (fieldId: string) => {
        setSelectedField(fieldList.find(value => value.id === fieldId));
        setModalTitle("字段值推送");
        doGetRequest(MACHINE_API.LIST, {}, {
            onSuccess: (res) => {
                res.data.forEach((machine: any) => {machine.label = machine.ipAddress + ":" + machine.port; machine.value = machine.ipAddress + ":" + machine.port});
                setMachineList(res.data);
            },
            onFinally: () => setShowModalIndex(1)
        });
    };

    const handleDistributionClick = (fieldId: string) => {
        setModalTitle("字段值分布情况");
        doGetRequest(FIELD_API.GET, {fieldId}, {
            onSuccess: (res: any) => {
                setFieldValue(res.data);
                const machineValueList: MachineFieldValue[] = [];
                const machineValueMap: { [key: string]: string } = res.data.machineValueMap;
                Object.entries(machineValueMap).forEach(([key, value]: [string, string]) => {
                    const [ipAddress, port] = key.split(':');
                    if (ipAddress && port) {
                        machineValueList.push({
                            ipAddress,
                            port,
                            value
                        });
                    }
                });
                setMachineFieldValue(machineValueList);
            },
            onFinally: () => setShowModalIndex(2)
        });
    };

    const handleValuePush = () => {
        if (selectedField?.id === null || selectedField?.id === undefined || selectedField?.id === '') {
            message.error("fieldId为空")
            return;
        }
        if (selectedNamespace?.name === null || selectedNamespace?.name === undefined || selectedNamespace?.name === '') {
            message.error("namespace为空")
            return;
        }
        const fieldId = selectedField.id;
        const namespace = selectedNamespace.name
        const value = newValue ?? '';
        const pushType = selectedPushType;
        const machineIds= selectedMachineIds.join(',');

        doPostRequest(FIELD_API.PUSH, {fieldId, namespace, value, pushType, machineIds}, {
            onSuccess: _ => message.success("推送成功").then(_ => {}),
            onFinally: () => handleModalClose()
        });
    }

    const handleModalClose = () => {
        form.resetFields(); // 重置表单字段
        setNewValue('')
        setShowModalIndex(0);
    };

    const columns = [
        {
            title: '命名空间',
            dataIndex: 'namespace',
            key: 'namespace',
            width: '20%'
        },
        {
            title: '字段名',
            dataIndex: 'name',
            key: 'name',
            width: '20%', // 设置列宽为30%
        },
        {
            title: '描述',
            dataIndex: 'description',
            key: 'description',
            width: '35%', // 设置列宽为30%
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

    const machineFieldValueColumns = [
        {
            title: 'ip地址',
            dataIndex: 'ipAddress',
            key: 'ipAddress'
        },
        {
            title: '端口号',
            dataIndex: 'port',
            key: 'port'
        },
        {
            title: '字段值',
            dataIndex: 'value',
            key: 'value'
        },
    ]

    function onFinish() {

    }


    const handleMachineChange = (_:any, chooseMachines:any) => {
        const ids: string[] = [];
        chooseMachines.forEach((machine: any) => ids.push(machine.id))
        setSelectedMachineIds(ids)
    };


    return (
        <div>
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
                <div>
                    <Form form={form}>
                        <Row>
                            <Col span={4}>
                                <Form.Item name="namespace" label="命名空间">
                                    <Select
                                        placeholder="请选择命名空间"
                                        allowClear
                                        style={{width: "90%"}}
                                        options={namespaceList}
                                        notFoundContent={"暂无命名空间"}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item name="fieldName" label="字段名">
                                    <Input/>
                                </Form.Item>
                            </Col>
                            <Form.Item style={{marginLeft: 30}}>
                                <Button type="primary" htmlType="submit" onClick={queryManagementField}>
                                    查询
                                </Button>
                            </Form.Item>
                            <Form.Item style={{marginLeft: 30}}>
                                <Button type="primary" htmlType="reset" onClick={() => form.resetFields()}>
                                    重置
                                </Button>
                            </Form.Item>
                        </Row>
                    </Form>
                    <Table
                        columns={columns}
                        dataSource={fieldList}
                        pagination={{
                            current: pageIndex,
                            pageSize: pageSize,
                            total: total,
                            showSizeChanger: true,
                            onChange: (current, pageSize) => {
                                setPageIndex(current);
                                setPageSize(pageSize);
                                console.log(current, pageSize);
                            }
                        }}
                        rowKey="name"
                    />
                </div>

            )}

            <Modal
                title={modalTitle}
                open={showModalIndex == 1}
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
                        <Input.TextArea value={newValue} onChange={(e) => setNewValue(e.target.value)} rows={4} />
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
                                        placeholder="请选择要变更字段值的机器"
                                        allowClear
                                        options={machineList}
                                        onChange={handleMachineChange}
                                        notFoundContent={"暂无机器"}
                                    >
                                    </Select>
                                </Form.Item>
                            ) : null
                        }}
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title={modalTitle}
                open={showModalIndex == 2}
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
                    onFinish={onFinish}
                    style={{ maxWidth: 600, marginTop: 30, marginBottom: 30}}
                >
                    <Form.Item name="className" label="全类名">
                        {fieldValue?.className}
                    </Form.Item>
                    <Form.Item name="namespace" label="命名空间">
                        {fieldValue?.namespace}
                    </Form.Item>
                    <Form.Item name="fieldName" label="变量名">
                        {fieldValue?.name}
                    </Form.Item>
                    <Form.Item name="description" label="变量描述">
                        {fieldValue?.description}
                    </Form.Item>
                    <Form.Item name="fieldValue" label="变量值">
                        <Table dataSource={machineFieldValue} columns={machineFieldValueColumns}/>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ManagementPage;