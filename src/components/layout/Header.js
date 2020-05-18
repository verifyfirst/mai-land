import React from 'react'
import { Link } from "react-router-dom"
import { Layout } from 'antd';
import { PageHeader } from 'antd';

const Header = (props) => {

  return (
    <Link to={"/"}>
    <PageHeader
    className="site-page-header"
    title="MAI-LAND"
  />
  </Link>
  )
}

export default Header
