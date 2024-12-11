import {Button, Col, Form, Input, message, Modal, Radio, Row, Select, Space, Table, Tabs, Tooltip} from "antd";
import React, {useEffect, useState} from "react";
import {doGetRequest, doPostRequest} from "@/util/http";
import {TEMPLATE_API} from "@/services/management";
import {FieldSelect, MachineSelect, NamespaceSelect} from "@/components";

const TemplatePage = () => {
    const [conditionForm] = Form.useForm();
    const [modifiedModalForm] = Form.useForm();
    const [newTemplateForm] = Form.useForm();
    const [pushForm] = Form.useForm();

    const [templateList, setTemplateList] = useState<Template[]>([]);
    const [selectedTemplateId, setSelectedTemplateId] = useState<string>();
    const [templateFieldList, setTemplateFieldList] = useState<[]>([]);

    const [showNewTemplateModal, setShowNewTemplateModal] = useState<boolean>(false);
    const [showNewTemplateFieldModal, setShowNewTemplateFieldModal] = useState<boolean>(false);
    const [showTemplatePushModal, setShowTemplatePushModal] = useState<boolean>(false);
    const [showFieldPushModal, setShowFieldPushModal] = useState<boolean>(false);
    const [showFieldModifiedModal, setShowFieldModifiedModal] = useState<boolean>(false);
    const [showFieldDeleteModal, setShowFieldDeleteModal] = useState<boolean>(false);

    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        queryTemplateList();
    }, []);

    useEffect(() => {
        conditionForm.resetFields();
        queryTemplateFieldList();
    }, [selectedTemplateId, pageIndex, pageSize]);

    const queryTemplateList = () => {
        doGetRequest(TEMPLATE_API.LIST_BY_APPID, {}, {
            onSuccess: res => {
                res.data.forEach((template: any) => {
                    template.label = template.name;
                    template.key = template.id;
                    template.value = template.id
                });
                setTemplateList(res.data);
                setSelectedTemplateId(res.data[0].id);
            }
        });
    }

    const queryTemplateFieldList = () => {
        const namespaceId = conditionForm.getFieldValue("namespaceId");
        const fieldName = conditionForm.getFieldValue("fieldName");
        doGetRequest(TEMPLATE_API.PAGE_FIELD_BY_CONDITION, {
            templateId: selectedTemplateId,
            namespaceId,
            fieldName,
            pageIndex,
            pageSize
        }, {
            onSuccess: res => {
                console.log(res.data);
                setTotal(res.total);
                setTemplateFieldList(res.data);
            }
        });
    }

    const handleModalClose = () => {
        modifiedModalForm.resetFields();
        newTemplateForm.resetFields();
        pushForm.resetFields();
        setShowNewTemplateModal(false);
        setShowTemplatePushModal(false);
        setShowNewTemplateFieldModal(false);
        setShowFieldModifiedModal(false);
        setShowFieldPushModal(false);
        setShowFieldDeleteModal(false);
    }

    const handleFieldPushModal = (fieldId: string, fieldValue: string) => {
        modifiedModalForm.setFieldValue("fieldId", fieldId);
        modifiedModalForm.setFieldValue("fieldValue", fieldValue);
        setShowFieldPushModal(true);
    }

    const handleOpenFieldModifiedModal = (templateFieldId: string) => {
        modifiedModalForm.setFieldValue("templateFieldId", templateFieldId);
        setShowFieldModifiedModal(true);
    }

    const handleUpdateTemplateField = () => {
        const id = modifiedModalForm.getFieldValue("templateFieldId");
        const fieldValue = modifiedModalForm.getFieldValue("value");
        doPostRequest(TEMPLATE_API.UPDATE_FIELD, {id, fieldValue}, {
            onSuccess: _ => {
                queryTemplateFieldList();
                handleModalClose();
                message.success("推送成功").then(_ => {
                });
            }
        });
    }

    const handleNewTemplate = () => {
        const name = newTemplateForm.getFieldValue("name");
        const description = newTemplateForm.getFieldValue("description");
        const fromTemplate = newTemplateForm.getFieldValue("fromTemplate");
        console.log(name, description, fromTemplate);
        // doPostRequest("", {name, description, fromTemplate}, {
        //     onSuccess: res => {}
        // })
    }

    const handleValuePush = () => {
        const name = modifiedModalForm.getFieldValue("fieldId");
        const fieldValue = modifiedModalForm.getFieldValue("fieldValue");
        const pushType = pushForm.getFieldValue("pushType");
        const machines = pushForm.getFieldValue("machines");
        doPostRequest("", {name, fieldValue, pushType, machines}, {
            onSuccess: res => {
            }
        })
    }

    const columns = [
        {
            title: '命名空间',
            dataIndex: 'namespace',
            key: 'namespace',
            width: '22%'
        },
        {
            title: '字段名',
            dataIndex: 'fieldName',
            key: 'fieldName',
            width: '18%', // 设置列宽为30%
        },
        {
            title: '字段值',
            dataIndex: 'fieldValue',
            key: 'fieldValue',
            width: '23%', // 设置列宽为30%
        },
        {
            title: '上次修改时间',
            dataIndex: 'gmtModified',
            key: 'gmtModified',
            width: '15%', // 设置列宽为30%
        },
        {
            title: '操作',
            key: 'action',
            render: (text: string, templateField: { id: string, fieldId: string, fieldValue: string }) => (
                <span>
                  <Button type="primary" onClick={() => handleFieldPushModal(templateField.fieldId, templateField.fieldValue)}>
                    值推送
                  </Button>
                  <Button type="primary" style={{marginLeft: 20}} onClick={() => handleOpenFieldModifiedModal(templateField.id)}>
                    值修改
                  </Button>
                  <Button type="primary" key="delete" style={{marginLeft: 20}} onClick={handleModalClose}>
                    字段删除
                  </Button>
                </span>
            ),
            width: '22%', // 设置列宽为30%
        }
    ];

    return <>
        <Tabs onChange={(key) => setSelectedTemplateId(key as string)}>
            {templateList.map(template => (
                <Tabs.TabPane tab={<Tooltip title={template.description}>{template.label}</Tooltip>}
                              key={template.key}/>
            ))}
        </Tabs>
        <Form form={conditionForm}
              style={{display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "nowrap"}}>
            <div style={{display: "flex"}}>
                <Form.Item name="namespaceId" label="命名空间">
                    <NamespaceSelect form={conditionForm}/>
                </Form.Item>
                <Form.Item name="fieldName" label="字段名" style={{marginLeft: 20}}>
                    <FieldSelect form={conditionForm}/>
                </Form.Item>
                <Form.Item style={{marginLeft: 30}}>
                    <Button type="primary" htmlType="submit" onClick={queryTemplateFieldList}>
                        查询
                    </Button>
                </Form.Item>
                <Form.Item style={{marginLeft: 30}}>
                    <Button type="primary" htmlType="reset" onClick={() => conditionForm.resetFields()}>
                        重置
                    </Button>
                </Form.Item>
            </div>
            <div style={{display: "flex"}}>
                <Form.Item>
                    <Button htmlType="reset" onClick={() => setShowNewTemplateModal(true)}>
                        新建模板
                    </Button>
                </Form.Item>
                <Form.Item style={{marginLeft: 20}}>
                    <Button htmlType="reset" onClick={() => setShowNewTemplateFieldModal(true)}>
                        新增字段
                    </Button>
                </Form.Item>
                <Form.Item style={{marginLeft: 20, marginRight: 10}}>
                    <Button htmlType="reset" onClick={() => setShowTemplatePushModal(true)}>
                        模板推送
                    </Button>
                </Form.Item>
            </div>
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

        <Modal title="新建模板" open={showNewTemplateModal} onOk={handleModalClose} onCancel={handleModalClose}
               footer={[
                   <Space>
                       <Button key="save" onClick={handleNewTemplate}>
                           保存
                       </Button>
                       <Button key="close" onClick={handleModalClose}>
                           关闭
                       </Button>
                   </Space>
               ]}
               style={{maxWidth: 600}}
        >
            <Form form={newTemplateForm} style={{marginTop: 30}} labelCol={{span: 5}} wrapperCol={{span: 18}}>
                <Form.Item name={"name"} label={"模板名称"} required={true}>
                    <Input/>
                </Form.Item>
                <Form.Item name={"description"} label={"模板描述"}>
                    <Input.TextArea/>
                </Form.Item>
                <Form.Item name={"fromTemplate"} label={"来源模板"}>
                    <Select
                        placeholder="请选择模板"
                        allowClear
                        showSearch={true}
                        optionFilterProp={"label"}
                        options={templateList}
                        notFoundContent={"暂无命名空间"}
                    />
                </Form.Item>
            </Form>
        </Modal>
        <Modal title="新增字段" open={showNewTemplateFieldModal} onOk={handleModalClose} onCancel={handleModalClose}
               footer={[
                   <Space>
                       <Button key="save" onClick={handleNewTemplate}>
                           保存
                       </Button>
                       <Button key="close" onClick={handleModalClose}>
                           关闭
                       </Button>
                   </Space>
               ]}
               style={{maxWidth: 600}}
        >
            <Form form={newTemplateForm} style={{marginTop: 30}} labelCol={{span: 5}} wrapperCol={{span: 18}}>
                <Form.Item name={"fromTemplate"} label={"选择模板"}>
                    <Select
                        placeholder="请选择模板"
                        allowClear
                        options={templateList}
                        notFoundContent={"暂无命名空间"}
                    />
                </Form.Item>
                <Form.Item name={"name"} label={"选择字段"} required={true}>
                            <NamespaceSelect form={conditionForm}/>
                    <div style={{marginTop: 10}}>
                        <FieldSelect form={conditionForm}/>
                    </div>
                </Form.Item>
                <Form.Item name={"value"} label={"字段值"}>
                    <Input.TextArea/>
                </Form.Item>
            </Form>
        </Modal>
        <Modal title="模板推送" open={showTemplatePushModal} onOk={handleModalClose} onCancel={handleModalClose}
               footer={[
                   <Space>
                       <Button key="save" onClick={handleNewTemplate}>
                           保存
                       </Button>
                       <Button key="close" onClick={handleModalClose}>
                           关闭
                       </Button>
                   </Space>
               ]}
               style={{maxWidth: 600}}
        >
            <Form form={newTemplateForm} style={{marginTop: 30}} labelCol={{span: 5}} wrapperCol={{span: 18}}>
                <Form.Item name={"fromTemplate"} label={"选择模板"}>
                    <Select
                        placeholder="请选择模板"
                        allowClear
                        showSearch={true}
                        optionFilterProp={"label"}
                        options={templateList}
                        notFoundContent={"暂无命名空间"}
                    />
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
            </Form>
        </Modal>


        <Modal
            title="修改"
            open={showFieldModifiedModal}
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
            style={{maxWidth: 600}}
        >
            <Form form={modifiedModalForm} style={{margin: 30}}>
                <Form.Item name={"value"} label={"新值"}>
                    <Input.TextArea/>
                </Form.Item>
            </Form>
        </Modal>
        <Modal
            title="模板值推送"
            open={showFieldPushModal}
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
            style={{maxWidth: 600}}
        >
            <Form form={pushForm} style={{marginTop: 30}} labelCol={{span: 5}} wrapperCol={{span: 18}}>
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
            </Form>
        </Modal>

    </>
}

export default TemplatePage;