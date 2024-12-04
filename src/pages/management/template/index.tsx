import {Tabs} from "antd";
import React, {useEffect, useState} from "react";
import {doGetRequest} from "@/util/http";
import {TEMPLATE_API} from "@/services/management";

const TemplatePage = () => {
    const [templateList, setTemplateList] = useState();

    useEffect(() => {
        queryTemplateList();
    }, []);

    const queryTemplateList = () => {
        doGetRequest(TEMPLATE_API.LIST_BY_APPID, {}, {
            onSuccess: res => {
                res.data.forEach((template:any) => {template.label = template.name; template.key = template.id});
                console.log(res.data);
                setTemplateList(res.data);
            }
        })
    }

    const changeTemplate = (e: any) => {
        console.log(e);
    }

    return <>
        <Tabs defaultActiveKey="1" items={templateList} onChange={changeTemplate} />
    </>
}

export default TemplatePage;