import {Button, Form, Pagination, Table} from "antd";
import React, {useState} from "react";

const ManagementLogPage = () => {


    const columns = [
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

    return <>
        <Form></Form>
        <Table
            columns={columns}
            dataSource={fieldList}
            rowKey="name"
        />
        <Pagination></Pagination>
    </>
}

export default ManagementLogPage;