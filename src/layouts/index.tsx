import React, {useEffect, useState} from "react";
import {Avatar, ConfigProvider, Layout, Menu, Space} from "antd";
import icon from "@/assets/yay.jpg";
import {Link, Outlet} from "umi";
import {getCategoryList, getNamespaceList} from "@/services/app";

const { Header, Footer, Content, Sider } = Layout;


export default function HomePage() {

    const [appList,setAppList] = useState([]);
    const [categoryList, setCategoryList] = useState<Category[]>([]);
    const [activeTab, setActiveTab] = useState('');

    useEffect(() => {
        getCategoryList()
            .then((res: any) => {
                if (res.success === true) {
                    setCategoryList(res.data);
                }
            });

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
                            items={categoryList}
                        >
                        </Menu>
                    </Sider>
                    <Layout style={{ padding: '0 24px 24px' }}>
                        <Content style={{ minHeight: 1200 }}>
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
