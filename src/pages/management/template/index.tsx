import {Button, Col, Form, Input, message, Modal, Radio, Row, Space, Table, Tabs, Tooltip} from "antd";
import React, {useEffect, useState} from "react";
import {doGetRequest, doPostRequest} from "@/util/http";
import {TEMPLATE_API} from "@/services/management";
import {FieldSelect, MachineSelect, NamespaceSelect} from "@/components";

const TemplatePage = () => {
    const [conditionForm] = Form.useForm();
    const [modifiedModalForm] = Form.useForm();
    const [pushForm] = Form.useForm();

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
        queryTemplateFieldList();
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

    const queryTemplateFieldList = () => {
        const namespaceId = conditionForm.getFieldValue("namespaceId");
        const fieldName = conditionForm.getFieldValue("fieldName");
        doGetRequest(TEMPLATE_API.PAGE_FIELD_BY_CONDITION, {templateId: selectedTemplateId, namespaceId, fieldName, pageIndex, pageSize}, {
            onSuccess: res => {
                console.log(res.data);
                setTotal(res.total);
                setTemplateFieldList(res.data);
            }
        });
    }

    const handleModalClose = () => {
        modifiedModalForm.resetFields();
        setShowModifiedModal(false);
    }

    const handleOpenModifiedModal = (templateFieldId: string) => {
        modifiedModalForm.setFieldValue("templateFieldId", templateFieldId);
        setShowModifiedModal(true);
    }

    const handleUpdateTemplateField = () => {
        const id = modifiedModalForm.getFieldValue("templateFieldId");
        const fieldValue = modifiedModalForm.getFieldValue("value");
        doPostRequest(TEMPLATE_API.UPDATE_FIELD, {id, fieldValue}, {
            onSuccess: _ => {
                queryTemplateFieldList();
                handleModalClose();
                message.success("推送成功").then(_ => {});
            }
        });
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
        <Form form={conditionForm}>
            <Row>
                <Col span={4}>
                    <Form.Item name="namespaceId" label="命名空间">
                        <NamespaceSelect form={conditionForm}/>
                    </Form.Item>
                </Col>
                <Col span={4}>
                    <Form.Item name="fieldName" label="字段名">
                        <FieldSelect form={conditionForm}/>
                    </Form.Item>
                </Col>
                <Col>
                    <Form.Item style={{marginLeft: 30}}>
                        <Button type="primary" htmlType="submit" onClick={queryTemplateFieldList}>
                            查询
                        </Button>
                    </Form.Item>
                </Col>
                <Col>
                    <Form.Item style={{marginLeft: 30}}>
                        <Button type="primary" htmlType="reset" onClick={() => conditionForm.resetFields()}>
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
        {/*<Modal*/}
        {/*    title="字段值推送"*/}
        {/*    open={showModalIndex == 1}*/}
        {/*    onOk={handleModalClose}*/}
        {/*    onCancel={handleModalClose}*/}
        {/*    footer={[*/}
        {/*        <Space>*/}
        {/*            <Button key="back" onClick={handleValuePush}>*/}
        {/*                推送*/}
        {/*            </Button>*/}
        {/*            <Button key="back" onClick={handleModalClose}>*/}
        {/*                关闭*/}
        {/*            </Button>*/}
        {/*        </Space>*/}
        {/*    ]}*/}
        {/*>*/}
        {/*    <Form*/}
        {/*        form={pushForm}*/}
        {/*        style={{maxWidth: 600, marginTop: 30, marginBottom: 30}}*/}
        {/*    >*/}
        {/*        <Form.Item name="name" label="变量名">*/}
        {/*            {pushForm.getFieldValue("name")}*/}
        {/*        </Form.Item>*/}
        {/*        <Form.Item name="className" label="全类名">*/}
        {/*            {pushForm.getFieldValue("className")}*/}
        {/*        </Form.Item>*/}
        {/*        <Form.Item name="namespace" label="命名空间">*/}
        {/*            {pushForm.getFieldValue("namespace")}*/}
        {/*        </Form.Item>*/}
        {/*        <Form.Item name="description" label="变量描述">*/}
        {/*            {pushForm.getFieldValue("description")}*/}
        {/*        </Form.Item>*/}
        {/*        <Form.Item name="fieldValue" label="变量值">*/}
        {/*            <Input.TextArea value={pushForm.getFieldValue("fieldValue")} onChange={(e) => pushForm.setFieldValue("fieldValue", e.target.value)} rows={4}/>*/}
        {/*        </Form.Item>*/}
        {/*        <Form.Item name="pushType" label="推送方式">*/}
        {/*            <Radio.Group value={pushForm.getFieldValue("pushType")}>*/}
        {/*                <Radio value={"all"}>所有机器</Radio>*/}
        {/*                <Radio value={"specific"}>指定机器</Radio>*/}
        {/*            </Radio.Group>*/}
        {/*        </Form.Item>*/}
        {/*        <Form.Item*/}
        {/*            noStyle*/}
        {/*            shouldUpdate={(prevValues, currentValues) => prevValues.pushType !== currentValues.pushType}*/}
        {/*        >*/}
        {/*            {({getFieldValue}) => {*/}
        {/*                return getFieldValue('pushType') === 'specific' ? (*/}
        {/*                    <Form.Item name="machines" label="推送机器">*/}
        {/*                        <MachineSelect mode="multiple" form={pushForm}/>*/}
        {/*                    </Form.Item>*/}
        {/*                ) : null*/}
        {/*            }}*/}
        {/*        </Form.Item>*/}
        {/*        <Form.Item name="isUpdateTemplate" label="是否更新默认模板值">*/}
        {/*            <Radio.Group value={pushForm.getFieldValue("isUpdateTemplate")}>*/}
        {/*                <Radio value={true}>是</Radio>*/}
        {/*                <Radio value={false}>否</Radio>*/}
        {/*            </Radio.Group>*/}
        {/*        </Form.Item>*/}
        {/*    </Form>*/}
        {/*</Modal>*/}
    </>
}

export default TemplatePage;