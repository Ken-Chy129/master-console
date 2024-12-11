import {Button, Col, Form, Input, Row, Table} from "antd";
import React, {useEffect, useState} from "react";
import {LOG_API} from "@/services/management";
import {doGetRequest} from "@/util/http"
import {FieldSelect, MachineSelect, NamespaceSelect} from "@/components";

const ManagementLogPage = () => {

    const columns = [
        {
            title: '命名空间',
            dataIndex: 'namespace',
            key: 'namespace',
            width: '20%', // 设置列宽为30%
        },
        {
            title: '字段名',
            dataIndex: 'fieldName',
            key: 'fieldName',
            width: '15%', // 设置列宽为30%
        },
        {
            title: '变更前旧值',
            dataIndex: 'beforeValue',
            key: 'beforeValue',
            width: '15%', // 设置列宽为30%
        },
        {
            title: '变更后新值',
            dataIndex: 'afterValue',
            key: 'afterValue',
            width: '15%', // 设置列宽为30%
        },
        {
            title: '推送机器',
            dataIndex: 'machine',
            key: 'machine',
            width: '12%', // 设置列宽为30%
        },
        {
            title: '操作时间',
            dataIndex: 'gmtModified',
            key: 'gmtModified',
            width: '14%', // 设置列宽为30%
        },
        {
            title: '变更人',
            dataIndex: 'modifier',
            key: 'modifier',
            width: '14%', // 设置列宽为30%
        }
    ];

    const [managementLog, setManagementLog] = useState<[]>([]);
    const [form] = Form.useForm();
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        if (history.state.usr) {
            form.setFieldValue("namespaceId", history.state.usr.namespaceId);
            form.setFieldValue("fieldName", history.state.usr.fieldName);
        }
        queryManagementLog();
    }, []);

    useEffect(() => {
        queryManagementLog();
    }, [pageIndex, pageSize]);

    const clear = () => {
        form.resetFields();
    }

    const queryManagementLog = () => {
        const namespaceId = form.getFieldValue("namespaceId");
        const name = form.getFieldValue("fieldName");
        const machines = form.getFieldValue("machines");
        const modifier = form.getFieldValue("modifier");
        doGetRequest(LOG_API.PAGE_BY_CONDITION, {namespaceId, name, machines, modifier, pageIndex, pageSize}, {
            onSuccess:  (res: any) => {
                setTotal(res.total);
                setManagementLog(res.data);
            }
        });
    }

    return <>
        <Form form={form} style={{display: "flex"}}>
            <Form.Item name="namespaceId" label="命名空间">
                <NamespaceSelect form={form}/>
            </Form.Item>
            <Form.Item name="fieldName" label="字段名" style={{marginLeft: 20}}>
                <FieldSelect form={form}/>
            </Form.Item>
            <Form.Item name="machines" label="机器列表" style={{marginLeft: 20}}>
                <MachineSelect form={form}/>
            </Form.Item>
            <Form.Item name="modifier" label="变更人" style={{marginLeft: 20}}>
                <Input placeholder={"请输入变更人名称"} style={{minWidth: 250}}/>
            </Form.Item>
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