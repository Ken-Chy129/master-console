import React, {useEffect, useState} from "react";
import { getAppList } from '../services/api'
import {Avatar, Card, Col, Layout, Row, Space} from "antd";


export default function HomePage() {

  const [appList,setAppList] = useState([]);

  useEffect(() => {
      getAppList().then((res: any) => {
          setAppList(res);
      })
  }, [])

  return (
      <div style={{margin: 25}}>
          <Row gutter={16}>
              <Col span={8}>
                  <Card title="Card title" bordered={false}>
                      Card content
                  </Card>
              </Col>
              <Col span={8}>
                  <Card title="Card title" bordered={false}>
                      Card content
                  </Card>
              </Col>
              <Col span={8}>
                  <Card title="Card title" bordered={false}>
                      Card content
                  </Card>
              </Col>
          </Row>
      </div>
  );
}
