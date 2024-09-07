import React, {useState} from "react";
import {Avatar, Layout, Space} from "antd";
import icon from "@/assets/yay.jpg";
import {Outlet} from "umi";

const { Header, Footer, Content } = Layout;


export default function HomePage() {

    const [appList,setAppList] = useState([]);

    return (
        <Layout>
            <Header style={{ display: 'flex', alignItems: 'center' }}>
                <Space wrap size={16}>
                    <Avatar size={64} src={icon} />
                    <span style={{color: "white"}}>Master</span>
                </Space>
            </Header>
            <Content>
                <Outlet/>
            </Content>
            <Footer style={{ textAlign: 'center' }}>
                Ant Design ©{new Date().getFullYear()} Created by Ant UED
            </Footer>
        </Layout>

    );
}
