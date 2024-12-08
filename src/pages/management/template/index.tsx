import {Button, Col, Form, Input, Modal, Row, Space, Table, Tabs, Tooltip} from "antd";
import React, {useEffect, useState} from "react";
import {doGetRequest} from "@/util/http";
import {TEMPLATE_API} from "@/services/management";
import {FieldSelect, NamespaceSelect} from "@/components";

const TemplatePage = () => {
    const [form] = Form.useForm();
    const [modifiedModalForm] = Form.useForm();

    const [templateList, setTemplateList] = useState<Template[]>([]);
    const [selectedTemplateId, setSelectedTemplateId] = useState<string>();
    const [templateFieldList, setTemplateFieldList] = useState<[]>([]);

    const [showModifiedModal, setShowModifiedModal] = useState<boolean>(false);

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


    const handleModalClose = () => {
        modifiedModalForm.resetFields();
        setShowModifiedModal(false);
    }

    const handleOpenModifiedModal = (templateFieldId: string) => {
        console.log(templateFieldId);
        setShowModifiedModal(true);

    }

    const handleUpdateTemplateField = () => {
        handleModalClose();
    }

    const columns = [
        {
            title: '命名空间',
            dataIndex: 'namespace',
            key: 'namespace',
            width: '25%'
        },
        {
            title: '字段名',
            dataIndex: 'fieldName',
            key: 'fieldName',
            width: '20%', // 设置列宽为30%
        },
        {
            title: '字段值',
            dataIndex: 'fieldValue',
            key: 'fieldValue',
            width: '30%', // 设置列宽为30%
        },
        {
            title: '操作',
            key: 'action',
            render: (text: string, templateField: {id: string}) => (
                <span>
                  <Button type="primary" onClick={() => handleOpenModifiedModal(templateField.id)}>
                    修改
                  </Button>
                </span>
            ),
            width: '25%', // 设置列宽为30%
        }
    ];

    return <>
        <Tabs onChange={(key) => setSelectedTemplateId(key as string)}>
            {templateList.map(template => (
                <Tabs.TabPane tab={<Tooltip title={template.description}>{template.label}</Tooltip>} key={template.key}/>
            ))}
        </Tabs>
        <Form form={form}>
            <Row>
                <Col span={4}>
                    <Form.Item name="namespaceId" label="命名空间">
                        <NamespaceSelect form={form}/>
                    </Form.Item>
                </Col>
                <Col span={4}>
                    <Form.Item name="fieldName" label="字段名">
                        <FieldSelect form={form}/>
                    </Form.Item>
                </Col>
                <Col span={4}>
                    <Form.Item style={{marginLeft: 30}}>
                        <Button type="primary" htmlType="submit">
                            查询
                        </Button>
                    </Form.Item>
                </Col>
                <Col span={4}>
                    <Form.Item style={{marginLeft: 30}}>
                        <Button type="primary" htmlType="reset" onClick={() => form.resetFields()}>
                            重置
                        </Button>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
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
        <Modal
            title="修改"
            open={showModifiedModal}
            onOk={handleModalClose}
            onCancel={handleModalClose}
            footer={[
                <Space>
                    <Button key="push" onClick={handleUpdateTemplateField}>
                        推送
                    </Button>
                    <Button key="close" onClick={handleModalClose}>
                        关闭
                    </Button>
                </Space>
            ]}
        >
            <Form form={modifiedModalForm} style={{maxWidth: 600, marginTop: 30, marginBottom: 30}}>
                <Form.Item name={"value"} label={"新值"}>
                    <Input.TextArea/>
                </Form.Item>
            </Form>
        </Modal>
    </>
}

export default TemplatePage;