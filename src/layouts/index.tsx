import React, {useEffect, useState} from "react";
import {Avatar, ConfigProvider, Layout, Menu, Space} from "antd";
import icon from "@/assets/yay.jpg";
import {Link, Outlet} from "umi";
import {getNamespaceList} from "@/services/app";

const { Header, Footer, Content, Sider } = Layout;


export default function HomePage() {

    const [appList,setAppList] = useState([]);
    const [tabList, setTabList] = useState<Tab[]>([
        {
            name: '开关',
            key: 'switch',
            id: '1',
        },
        {
            name: '机器列表',
            key: 'machines',
            id: '2',
        },
        {
            name: '日志',
            key: 'log',
            id: '3',
        },
        {
            name: '配置',
            key: 'setting',
            id: '4',
        }
    ]);
    const [activeTab, setActiveTab] = useState('');

    useEffect(() => {
        setActiveTab(tabList[0].key)
    }, []);

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
                <Layout>
                    <Sider>
                        <Menu
                            style={{height: '100%'}}
                            mode="inline"
                            selectedKeys={[activeTab || '']}
                            onClick={({ key }) => setActiveTab(key)}
                        >
                            {tabList.map((page) => (
                                <Menu.Item key={page.key} title={page.name}>
                                    <Link to={`/app/${page.id}`}>
                                        {page.name}
                                    </Link>
                                </Menu.Item>
                            ))}
                        </Menu>
                    </Sider>
                    <Layout style={{ padding: '0 24px 24px' }}>
                        <Content style={{ minHeight: 1000 }}>
                            <Outlet/>
                        </Content>
                        <Footer style={{ textAlign: 'center' }}>
                            Master ©{new Date().getFullYear()} Created by Ken
                        </Footer>
                    </Layout>
                </Layout>
            </Layout>
        </ConfigProvider>
    );
}
