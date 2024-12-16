import React, { useEffect, useState } from "react";
import {FIELD_API} from "@/services/management"
import {Table, Button, Modal, Form, Input, Space, Radio, message, Row, Col} from "antd";
import {doGetRequest, doPostRequest} from "@/util/http";
import {history} from "@@/core/history";
import {FieldSelect, Loading, MachineSelect, NamespaceSelect} from "@/components"


const ManagementPage = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [fieldList, setFieldList] = useState<Field[]>([]);
    const [showModalIndex, setShowModalIndex] = useState(0);

    const [conditionForm] = Form.useForm();
    const [pushForm] = Form.useForm();
    const [fieldValueForm] = Form.useForm();

    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        setLoading(true);
        setError(null);
        queryManagementField();
        setLoading(false);
    }, []);

    useEffect(() => {
        setLoading(true);
        queryManagementField();
        setLoading(false);
    }, [pageIndex, pageSize]);

    const queryManagementField = () => {
        const namespaceId = conditionForm.getFieldValue("namespaceId");
        const fieldId = conditionForm.getFieldValue("field");
        doGetRequest(FIELD_API.PAGE_BY_CONDITION, {namespaceId, fieldId, pageIndex, pageSize}, {
            onSuccess: (res: any) => {
                setTotal(res.total);
                setFieldList(res.data);
            }
        });
    };

    const handlePushClick = (fieldId: string) => {
        const field = fieldList.find(value => value.id === fieldId);
        pushForm.setFieldsValue({
            ...field,
            pushType: "all",
            isUpdateTemplate: true
        });
        setShowModalIndex(1);
    };

    const handleDistributionClick = (fieldId: string) => {
        doGetRequest(FIELD_API.GET, {fieldId}, {
            onSuccess: (res: any) => {
                fieldValueForm.setFieldsValue(res.data);
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
                fieldValueForm.setFieldValue("machineValueList", machineValueList);
            },
            onFinally: () => setShowModalIndex(2)
        });
    };

    const handleShowLog = (field: Field) => {
        const fieldId = field.id;
        const namespaceId = field.namespaceId;
        history.push({
            pathname: '/management/log',
        }, {
            fieldId, namespaceId
        });
    }

    const handleValuePush = () => {
        const fieldId = pushForm.getFieldValue("id");
        const namespace = pushForm.getFieldValue("namespace")
        const value = pushForm.getFieldValue("fieldValue");
        const pushType = pushForm.getFieldValue("pushType");
        const machines = pushForm.getFieldValue("machines")?.join(',');
        const isUpdateTemplate = pushForm.getFieldValue("isUpdateTemplate");

        doPostRequest(FIELD_API.PUSH, {fieldId, namespace, value, pushType, machines, isUpdateTemplate}, {
            onSuccess: _ => message.success("推送成功").then(_ => {}),
            onFinally: () => handleModalClose()
        });
    }

    const handleModalClose = () => {
        pushForm.resetFields();
        fieldValueForm.resetFields();
        setShowModalIndex(0);
    };

    const columns = [
        {
            title: '命名空间',
            dataIndex: 'namespace',
            key: 'namespace',
            width: '23%'
        },
        {
            title: '字段名',
            dataIndex: 'name',
            key: 'name',
            width: '22%', // 设置列宽为30%
        },
        {
            title: '描述',
            dataIndex: 'description',
            key: 'description',
            width: '30%', // 设置列宽为30%
        },
        {
            title: '操作',
            key: 'action',
            render: (text: string, field: Field) => (
                <span>
                  <Button type="primary" onClick={() => handlePushClick(field.id)}>
                    推送
                  </Button>
                  <Button type="primary" style={{ marginLeft: 20 }} onClick={() => handleDistributionClick(field.id)}>
                    查看分布
                  </Button>
                  <Button type="primary" style={{ marginLeft: 20 }} onClick={() => handleShowLog(field)}>
                    查看日志
                  </Button>
                </span>
            ),
            width: '25%', // 设置列宽为30%
        },
    ];

    return (
        <div>
            <Loading loading={loading} error={error} content={
                <div>
                    <Form form={conditionForm} style={{display: "flex"}}>
                        <Form.Item name="namespaceId" label="命名空间">
                            <NamespaceSelect form={conditionForm}/>
                        </Form.Item>
                        <Form.Item name="field" label="字段" style={{marginLeft: 20}}>
                            <FieldSelect form={conditionForm}/>
                        </Form.Item>
                        <Form.Item style={{marginLeft: 30}}>
                            <Button type="primary" htmlType="submit" onClick={queryManagementField}>
                                查询
                            </Button>
                        </Form.Item>
                        <Form.Item style={{marginLeft: 30}}>
                            <Button type="primary" htmlType="reset" onClick={() => conditionForm.resetFields()}>
                                重置
                            </Button>
                        </Form.Item>
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
                            }
                        }}
                        rowKey="id"
                    />
                </div>
            }/>

            <Modal
                title="字段值推送"
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
                style={{minWidth: 600}}
            >
                <Form
                    form={pushForm}
                    style={{marginTop: 30}}
                    labelCol={{span: 7}} wrapperCol={{span: 15}}
                >
                    <Form.Item name="name" label="变量名">
                        {pushForm.getFieldValue("name")}
                    </Form.Item>
                    <Form.Item name="className" label="全类名">
                        {pushForm.getFieldValue("className")}
                    </Form.Item>
                    <Form.Item name="namespace" label="命名空间">
                        {pushForm.getFieldValue("namespace")}
                    </Form.Item>
                    <Form.Item name="description" label="变量描述">
                        {pushForm.getFieldValue("description")}
                    </Form.Item>
                    <Form.Item name="fieldValue" label="变量值">
                        <Input.TextArea value={pushForm.getFieldValue("fieldValue")} onChange={(e) => pushForm.setFieldValue("fieldValue", e.target.value)} rows={4}/>
                    </Form.Item>
                    <Form.Item name="pushType" label="推送方式">
                        <Radio.Group value={pushForm.getFieldValue("pushType")}>
                            <Radio value={"all"}>所有机器</Radio>
                            <Radio value={"specific"}>指定机器</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item
                        noStyle
                        shouldUpdate={(prevValues, currentValues) => prevValues.pushType !== currentValues.pushType}
                    >
                        {({getFieldValue}) => {
                            return getFieldValue('pushType') === 'specific' ? (
                                <Form.Item name="machines" label="推送机器">
                                    <MachineSelect mode="multiple" form={pushForm}/>
                                </Form.Item>
                            ) : null
                        }}
                    </Form.Item>
                    <Form.Item name="isUpdateTemplate" label="是否更新默认模板">
                        <Radio.Group value={pushForm.getFieldValue("isUpdateTemplate")}>
                            <Radio value={true}>是</Radio>
                            <Radio value={false}>否</Radio>
                        </Radio.Group>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="字段值分布情况"
                open={showModalIndex == 2}
                onOk={handleModalClose}
                onCancel={handleModalClose}
                footer={[]}
                style={{minWidth: 800}}
            >
                <Form
                    form={fieldValueForm}
                    style={{marginTop: 30}}
                    labelCol={{span: 4}} wrapperCol={{span: 18}}
                >
                    <Form.Item name="name" label="变量名">
                        {fieldValueForm.getFieldValue("name")}
                    </Form.Item>
                    <Form.Item name="className" label="全类名">
                        {fieldValueForm.getFieldValue("className")}
                    </Form.Item>
                    <Form.Item name="namespace" label="命名空间">
                        {fieldValueForm.getFieldValue("namespace")}
                    </Form.Item>
                    <Form.Item name="description" label="变量描述">
                        {fieldValueForm.getFieldValue("description")}
                    </Form.Item>
                    <Form.Item name="fieldValue" label="变量值" colon={false}>
                        <Table dataSource={fieldValueForm.getFieldValue("machineValueList")} columns={
                            [
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
                        }/>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ManagementPage;