import React from 'react'
import { Link } from "react-router-dom"
import { Layout, Row, Col } from 'antd';

const Header = (props) => {

  return (
    <Layout.Header className="header-container">
      <Row>
    
      <Link to="/">
        <h1>MAI-LAND</h1>
      </Link>
     

      </Row>
    </Layout.Header>
  )
}

export default Header
