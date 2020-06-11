import React, { useState, useEffect } from 'react'
import { Link } from "react-router-dom";
import { Menu, Layout } from 'antd';
import { Text } from '../Components'
import { HomeOutlined, WalletOutlined, DeploymentUnitOutlined, ForkOutlined, QuestionOutlined, EditOutlined} from '@ant-design/icons';
import Breakpoint from 'react-socks';

import Footer from './Footer'

const Sidebar = (props) => {
  
  const menu_items = [
  {"Title" : "overview", "Icon": <HomeOutlined />},
   {"Title" : "cdps", "Icon":<WalletOutlined />},
    {"Title" : "pools", "Icon":<DeploymentUnitOutlined />},
    {"Title" : "anchors", "Icon":<ForkOutlined />},
    {"Title" : "about", "Icon":<QuestionOutlined />},
    {"Title" : "testing", "Icon":<EditOutlined />}
  ]

  const [page, setPage] = useState(null)

  useEffect(() => {
    let pathname = window.location.pathname.split("/")[1]
    if (menu_items.includes(pathname)) {
      setPage(pathname)
    }
  }, [menu_items])


  const selected_styles = {
    backgroundColor: "#29A19C",
    color: "#fff",
  }
 
  const getStyles = (key) => {
    if (key === page) {
      return selected_styles
    } else {
      return {}
    }
  }

  const isSelected = (key) => {
    return key === page
  }

  const handleClick = ({ key }) => {
    setPage(key)
  }

  const sidebarStyles = {
    paddingTop:0,
    width: 200,
    background: "#111122",
    textTransform: "uppercase",
    zIndex: 1,
    position: "relative",
  }

  return (
    <Layout.Sider style={sidebarStyles} trigger={null} collapsible breakpoint="md"
    collapsedWidth="80">

  <Breakpoint small down>
  
      <Menu onClick={handleClick} mode="inline" theme="dark" selectedKeys={[page]}>
        {menu_items.map(({Title, Icon}) => (
          <Menu.Item key={Title} style={getStyles(Title)}>
            <Link to={"/" + Title}>
              {Icon}
            </Link>
          </Menu.Item>
        ))}
      </Menu>
      <Footer />
      </Breakpoint>

    <Breakpoint medium up>
      <Menu onClick={handleClick} mode="inline" theme="dark" selectedKeys={[page]}>
        {menu_items.map(({Title}) => (
          <Menu.Item key={Title} style={getStyles(Title)}>
            <Link to={"/" + Title}>             
                <span>{isSelected(Title) ? <Text bold={true} color="#FFF">{Title}</Text> : <Text bold={true} color="#848E9C">{Title}</Text>}</span>
            </Link>
          </Menu.Item>
        ))}
      </Menu>
      <Footer />
      </Breakpoint>

    </Layout.Sider>
  )
}

export default Sidebar
