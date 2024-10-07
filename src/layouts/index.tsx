import React, {useState} from "react";
import {Avatar, ConfigProvider, Layout, Space} from "antd";
import icon from "@/assets/yay.jpg";
import {Outlet} from "umi";

const { Header, Footer, Content } = Layout;


export default function HomePage() {

    const [appList,setAppList] = useState([]);

    return (
        <ConfigProvider
            theme={{
                token: {
                    // Seed Token，影响范围大
                    colorPrimary: '#00b96b',
                    borderRadius: 2,

                    // 派生变量，影响范围小
                    colorBgContainer: '#f6ffed',
                },
            }}
        >
            <Layout>
                <Header style={{ display: 'flex', alignItems: 'center', backgroundColor: 'lightblue' }}>
                    <Space wrap size={16}>
                        <Avatar size={64} src={icon} />
                        <span style={{color: "white"}}>Master</span>
                    </Space>
                </Header>
                <Content>
                    <Outlet/>
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                    Master ©{new Date().getFullYear()} Created by Ken
                </Footer>
            </Layout>
        </ConfigProvider>
    );
}
