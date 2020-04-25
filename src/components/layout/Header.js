import React from 'react'
import { Link } from "react-router-dom"
import { Layout, Row, Col } from 'antd';

const Header = (props) => {

  return (
    <Layout.Header className="header-container">
      <Row>
      <Col xs={4}>
      <Link to="/">
        <h1>MAI-LAND</h1>
      </Link>
      </Col>
      <Col xs={16}>
      </Col>
      
        <Col xs={4}>
      </Col>

      </Row>
    </Layout.Header>
  )
}

export default Header
