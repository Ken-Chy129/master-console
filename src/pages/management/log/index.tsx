import {Button, Col, Form, Input, message, Pagination, Radio, Row, Select, Table} from "antd";
import React, {useEffect, useState} from "react";
import {getManagementLog} from "@/services/management/record";
import {useModel} from "@umijs/max";
import {getFieldListByNamespaceId, getNamespaceList} from "@/services/app";
import {getMachineList} from "@/services/common";

const ManagementLogPage = () => {

    const columns = [
        {
            title: '命名空间',
            dataIndex: 'namespace',
            key: 'namespace',
            // width: '10%', // 设置列宽为30%
        },
        {
            title: '字段名',
            dataIndex: 'fieldName',
            key: 'fieldName',
            // width: '10%', // 设置列宽为30%
        },
        {
            title: '变更前旧值',
            dataIndex: 'beforeValue',
            key: 'beforeValue',
            // width: '45%', // 设置列宽为30%
        },
        {
            title: '变更后新值',
            dataIndex: 'afterValue',
            key: 'afterValue',
            // width: '45%', // 设置列宽为30%
        },
        {
            title: '推送机器',
            dataIndex: 'machine',
            key: 'machine',
            // width: '45%', // 设置列宽为30%
        },
        {
            title: '操作时间',
            dataIndex: 'gmtModified',
            key: 'gmtModified',
            // width: '45%', // 设置列宽为30%
        },
        {
            title: '变更人',
            dataIndex: 'modifier',
            key: 'modifier',
            // width: '45%', // 设置列宽为30%
        },
        {
            title: '操作',
            key: 'action',
            render: (text: string, field: Field) => (
                <span>

                </span>
            ),
            // width: '25%', // 设置列宽为30%
        },
    ];

    const appId = localStorage.getItem('appId')!;
    const [messageApi, contextHolder] = message.useMessage();

    const [managementLog, setManagementLog] = useState<[]>([]);
    const [namespaceList, setNamespaceList] = useState<[]>([]);
    const [machineList, setMachineList] = useState<[]>([]);
    const [fieldList, setFieldList] = useState<[]>([]);
    const [form] = Form.useForm();
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        queryManagementLog();
        queryNamespace();
        queryMachineList();
    }, []);

    useEffect(() => {
        queryManagementLog();
    }, [pageIndex, pageSize]);

    const clear = () => {
        form.resetFields();
    }

    const queryNamespace = () => {
        getNamespaceList(appId)
            .then((res: any) => {
                if (res.success === true) {
                    res.data.forEach((namespace: any) => {namespace.label = namespace.name; namespace.value = namespace.name});
                    setNamespaceList(res.data);
                }
            });
    }

    const queryManagementLog = () => {
        const namespace = form.getFieldValue("namespace");
        const name = form.getFieldValue("name");
        const machines = form.getFieldValue("machines");
        const modifier = form.getFieldValue("modifier");
        getManagementLog({appId, namespace, name, machines, modifier, pageIndex, pageSize}).then((res: any) => {
            if (res.success === true) {
                console.log(res);
                setTotal(res.total);
                setManagementLog(res.data);
            }
        });
    }

    const queryMachineList = () => {
        if (appId === null || appId === undefined) {
            return;
        }
        getMachineList({appId})
            .then((res: any) => {
                if (res.success === true) {
                    res.data.forEach((machine: any) => {machine.label = machine.ipAddress + ":" + machine.port; machine.value = machine.ipAddress + ":" + machine.port});
                    setMachineList(res.data);
                }
            });
    }

    const queryFieldNameList = (namespaceId: any) => {
        getFieldListByNamespaceId(namespaceId)
            .then((res: any) => {
                if (res.success === true) {
                    res.data.forEach((field: any) => {field.label = field.name; field.value = field.name});
                    setFieldList(res.data);
                }
            });
    }

    const handleNamespaceChange = (_:any, selectedNamespace:any) => {
        if (selectedNamespace === null || selectedNamespace === undefined) {
            return;
        }
        queryFieldNameList(selectedNamespace?.id);
    };

    return <>
        {contextHolder}
        <Form
            form={form}
            // style={{ maxWidth: 600, marginTop: 30, marginBottom: 30}}
        >
            <Row>
                <Col span={4}>
                    <Form.Item name="namespace" label="命名空间">
                        <Select
                            placeholder="请选择命名空间"
                            allowClear
                            style={{width: "90%"}}
                            options={namespaceList}
                            notFoundContent={"暂无命名空间"}
                            onChange={handleNamespaceChange}
                        />
                    </Form.Item>
                </Col>
                <Col span={4}>
                    <Form.Item name="name" label="字段名">
                        <Select
                            placeholder="请选择字段"
                            allowClear
                            style={{width: "90%"}}
                            options={fieldList}
                            notFoundContent={"该命名空间下暂无字段"}
                        />
                    </Form.Item>
                </Col>
                <Col span={4}>
                    <Form.Item name="machines" label="机器列表">
                        <Select
                            placeholder="请选择要变更字段值的机器"
                            allowClear
                            style={{width: "90%"}}
                            options={machineList}
                            notFoundContent={"暂无机器"}
                        />
                    </Form.Item>
                </Col>
                <Col span={4}>
                    <Form.Item name="modifier" label="变更人">
                        <Input style={{width: "90%"}}/>
                    </Form.Item>
                </Col>
                <Form.Item style={{marginLeft: 30}}>
                    <Button type="primary" htmlType="submit" onClick={queryManagementLog}>
                        查询
                    </Button>
                </Form.Item>
                <Form.Item style={{marginLeft: 30}}>
                    <Button type="primary" htmlType="reset" onClick={clear}>
                        重置
                    </Button>
                </Form.Item>
            </Row>
        </Form>
        <Table
            columns={columns}
            dataSource={managementLog}
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
    </>
}

export default ManagementLogPage;