import { Footer, Question, SelectLang, AvatarDropdown, AvatarName } from '@/components';
import { LinkOutlined } from '@ant-design/icons';
import type {Settings as LayoutSettings} from '@ant-design/pro-components';
import { SettingDrawer } from '@ant-design/pro-components';
import type { RunTimeLayoutConfig } from '@umijs/max';
import { history, Link } from '@umijs/max';
import defaultSettings from '../config/defaultSettings';
import { errorConfig } from './requestErrorConfig';
import { currentUser as queryCurrentUser } from '@/services/common';
import React from 'react';
import {message} from "antd";
import {doGetRequest} from "@/util/http";
import {USER_API} from "@/services/user";

const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  loading?: boolean;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
  const fetchUserInfo = async () => {
    let msg;
    doGetRequest(USER_API.CURRENT, {}, {
      onSuccess: res => msg = res.data,
      onError: _ => history.push(loginPath)
    })
    return msg
  };
  // 如果不是登录页面，执行
  const { location } = history;
  if (location.pathname !== loginPath) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: defaultSettings as Partial<LayoutSettings>,
    };
  }
  return {
    fetchUserInfo,
    settings: defaultSettings as Partial<LayoutSettings>,
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {

  return {
    title: "Master",
    openKeys: false,
    actionsRender: () => [<Question key="doc" />, <SelectLang key="SelectLang" />],
    avatarProps: {
      src: initialState?.currentUser?.avatar,
      title: <AvatarName />,
      render: (_, avatarChildren) => {
        return <AvatarDropdown>{avatarChildren}</AvatarDropdown>;
      },
    },
    waterMarkProps: {
      content: initialState?.currentUser?.name,
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      const appId = localStorage.getItem('appId');
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
      // 如果不是登录页页不是应用列表页，则检查是否有appId，如果没有则重定向到应用列表页
      if (location.pathname !== loginPath && location.pathname !== '/' && (appId === null || appId === undefined)) {
        // 临时逻辑，避免每次刷新都需要重新进入，后续移除
        // setAppId(1);
        message.error("当前没有选择对应的应用，已为你跳转至应用列表页").then(() => {})
        history.push('/')
      }
    },
    bgLayoutImgList: [
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/D2LWSqNny4sAAAAAAAAAAAAAFl94AQBr',
        left: 85,
        bottom: 100,
        height: '303px',
      },
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/C2TWRpJpiC0AAAAAAAAAAAAAFl94AQBr',
        bottom: -68,
        right: -45,
        height: '303px',
      },
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/F6vSTbj8KpYAAAAAAAAAAAAAFl94AQBr',
        bottom: 0,
        left: 0,
        width: '331px',
      },
    ],
    links: isDev
      ? [
          <a href="https://github.com/Ken-Chy129" target="_blank">
            <LinkOutlined />
            <span>联系作者</span>
          </a>,
        ]
      : [],
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    breakpoint: false,
    postMenuData: () => {
      const data = [
        {
          "name": "首页",
          "path": "home",
        },
        {
          "name": "应用运维",
          "path": "app",
          "children": [
            {
              "name": "机器列表",
              "path": "app/machine"
            },
            {
              "name": "应用状态",
              "path": "app/status"
            },
            {
              "name": "应用配置",
              "path": "app/setting"
            },
          ]
        },
        {
          "name": "变量管控",
          "children": [
            {
              "name": "查看列表",
              "path": "management"
            },
            {
              "name": "场景模板",
              "path": "management/template"
            },
            {
              "name": "查看日志",
              "path": "management/log"
            },
          ]
        },
        {
          "name": "任务调度",
          "path": "task"
        },
        {
          "name": "流量控制",
          "path": "flow"
        },
        {
          "name": "动态线程池",
          "path": "dynamicPool"
        },
        {
          "name": "告警",
          "path": "alarm"
        },
        {
          "name": "监控",
          "path": "monitor"
        },
        {
          "name": "日志",
          "path": "log"
        },
        {
          "name": "权限控制",
          "path": "permission",
          "children": [
            {
              "name": "用户",
              "path": "permission/user"
            },
            {
              "name": "审批记录",
              "path": "permission/approval"
            },
          ]
        },
      ]
      return data;
    },
    childrenRender: (children) => {
      // if (initialState?.loading) return <PageLoading />;
      return (
        <>
          {children}
          {isDev && (
            <SettingDrawer
              disableUrlParams
              enableDarkTheme
              settings={initialState?.settings}
              onSettingChange={(settings) => {
                setInitialState((preInitialState) => ({
                  ...preInitialState,
                  settings,
                }));
              }}
            />
          )}
        </>
      );
    },
    ...initialState?.settings,
  };
};

/**
 * @name request 配置，可以配置错误处理
 * 它基于 axios 和 ahooks 的 useRequest 提供了一套统一的网络请求和错误处理方案。
 * @doc https://umijs.org/docs/max/request#配置
 */
export const request = {
  ...errorConfig,
};

