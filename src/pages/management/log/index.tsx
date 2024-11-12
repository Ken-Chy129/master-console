import {Button, Col, Form, Input, message, Pagination, Radio, Row, Select, Table} from "antd";
import React, {useState} from "react";
import {getManagementLog} from "@/services/management/record";

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
            dataIndex: 'name',
            key: 'name',
            // width: '10%', // 设置列宽为30%
        },
        {
            title: '变更前旧值',
            dataIndex: 'oldValue',
            key: 'oldValue',
            // width: '45%', // 设置列宽为30%
        },
        {
            title: '变更后新值',
            dataIndex: 'newValue',
            key: 'newValue',
            // width: '45%', // 设置列宽为30%
        },
        {
            title: '推送机器',
            dataIndex: 'machineIds',
            key: 'machineIds',
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
            dataIndex: 'user',
            key: 'user',
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

    const [fieldList, setFieldList] = useState<Field[]>([]);
    const [form] = Form.useForm();

    const clear = () => {
        form.resetFields();
    }

    const queryManagementLog = () => {
        const namespace = form.getFieldValue("namespace");
        const name = form.getFieldValue("name");
        const machines = form.getFieldValue("machines");
        const modifier = form.getFieldValue("modifier");
        console.log(namespace, name, machines, modifier);
        getManagementLog({namespace, name, machines, modifier}).then((res: any) => {
            console.log(res)
            if (res.success === true) {
                message.success("推送成功");
            } else {
                message.error("推送失败")
            }
        });
    }

    return <>
        <Form
            form={form}
            // style={{ maxWidth: 600, marginTop: 30, marginBottom: 30}}
        >
            <Row>
                <Col span={4}>
                    <Form.Item name="namespace" label="命名空间">
                        <Input style={{width: "90%"}}/>
                    </Form.Item>
                </Col>
                <Col span={4}>
                    <Form.Item name="name" label="字段名">
                        <Input style={{width: "90%"}}/>
                    </Form.Item>
                </Col>
                <Col span={4}>
                    <Form.Item name="machines" label="机器列表">
                        <Select
                            mode="multiple"
                            placeholder="请选择要变更字段值的机器"
                            allowClear
                            style={{width: "90%"}}
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
                    <Button type="primary" htmlType="reset" onClick={clear}>
                        重置
                    </Button>
                </Form.Item>
                <Form.Item style={{marginLeft: 30}}>
                    <Button type="primary" htmlType="submit" onClick={getManagementLog}>
                        查询
                    </Button>
                </Form.Item>
            </Row>
        </Form>
        <Table
            columns={columns}
            dataSource={fieldList}
            rowKey="name"
        />
        <Pagination></Pagination>
    </>
}

export default ManagementLogPage;