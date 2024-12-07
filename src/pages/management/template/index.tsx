import {Button, Table, Tabs} from "antd";
import React, {useEffect, useState} from "react";
import {doGetRequest} from "@/util/http";
import {TEMPLATE_API} from "@/services/management";

const TemplatePage = () => {
    const [templateList, setTemplateList] = useState<Template[]>([]);
    const [selectedTemplateId, setSelectedTemplateId] = useState<string>();
    const [templateFieldList, setTemplateFieldList] = useState<[]>([]);

    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        queryTemplateList();
    }, []);

    useEffect(() => {
        queryTemplateFieldList(selectedTemplateId!, pageIndex, pageSize);
    }, [selectedTemplateId, pageIndex, pageSize]);

    const queryTemplateList = () => {
        doGetRequest(TEMPLATE_API.LIST_BY_APPID, {}, {
            onSuccess: res => {
                res.data.forEach((template:any) => {template.label = template.name; template.key = template.id});
                setTemplateList(res.data);
                setSelectedTemplateId(res.data[0].id);
            }
        });
    }

    const queryTemplateFieldList = (templateId: string, pageIndex: number, pageSize: number) => {
        doGetRequest(TEMPLATE_API.PAGE_FIELD_BY_CONDITION, {templateId, pageIndex, pageSize}, {
            onSuccess: res => {
                console.log(res.data);
                setTotal(res.total);
                setTemplateFieldList(res.data);
            }
        });
    }

    const changeTemplate = (e: any) => {
        console.log(e);
    }

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
        }
    ];

    return <>
        <Tabs items={templateList} onChange={(key) => setSelectedTemplateId(key as string)}/>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <span>{templateList!.find(template => template.id === selectedTemplateId)?.description}</span>
            <div style={{display: 'flex', gap: '8px'}}>
                <Button type="primary">推送</Button>
                <Button type="primary">查看分布</Button>
            </div>
        </div>
        <Table
            columns={columns}
            dataSource={templateFieldList}
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
    </>
}

export default TemplatePage;