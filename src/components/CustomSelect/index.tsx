import {Select} from "antd";
import React, {useEffect, useState} from "react";
import {doGetRequest} from "@/util/http";
import {FIELD_API, NAMESPACE_API} from "@/services/management";
import {MACHINE_API} from "@/services/app";

export const NamespaceSelect: React.FC<{onChange: (value: any) => void}> = ({onChange}) => {
    const [namespaceList, setNamespaceList] = useState<Namespace[]>([]);

    useEffect(() => {
        queryNamespace();
    }, []);

    const queryNamespace = () => {
        doGetRequest(NAMESPACE_API.LIST_BY_APPID, {}, {
            onSuccess: (res: any) => {
                res.data.forEach((namespace: any) => {namespace.label = namespace.name; namespace.value = namespace.id});
                setNamespaceList(res.data);
            }
        });
    }

    return (
        <Select
            placeholder="请选择命名空间"
            allowClear
            style={{width: "90%"}}
            options={namespaceList}
            onChange={onChange}
            notFoundContent={"暂无命名空间"}
        />
    )
}

export const FieldSelect: React.FC<{namespaceId: string}> = ({namespaceId}) => {
    const [fieldList, setFieldList] = useState<Field[]>([]);

    useEffect(() => {
        if (namespaceId) {
            queryNamespaceField();
        }
    }, [namespaceId]);

    const queryNamespaceField = () => {
        doGetRequest(FIELD_API.LIST_BY_NAMESPACE_ID, {namespaceId}, {
            onSuccess: (res: any) => {
                res.data.forEach((field: any) => {field.label = field.name; field.value = field.name});
                setFieldList(res.data);
            }
        });
    }

    return (
        <Select
            placeholder="请选择字段"
            allowClear
            style={{width: "90%"}}
            options={fieldList}
            notFoundContent={"该命名空间下暂无字段"}
        />
    )
}

export const MachineSelect: React.FC<{onChange: (value: any) => void}> = ({onChange}) => {
    const [machineList, setMachineList] = useState<[]>([]);

    useEffect(() => {
        queryMachineList();
    }, []);

    const queryMachineList = () => {
        doGetRequest(MACHINE_API.LIST, {}, {
            onSuccess: (res: any) => {
                res.data.forEach((machine: any) => {machine.label = machine.ipAddress + ":" + machine.port; machine.value = machine.ipAddress + ":" + machine.port});
                setMachineList(res.data);
            }
        });
    }

    return (
        <Select
            placeholder="请选择要变更字段值的机器"
            allowClear
            style={{width: "90%"}}
            options={machineList}
            onChange={onChange}
            notFoundContent={"暂无机器"}
        />
    )
}