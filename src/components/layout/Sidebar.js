import React, { useState, useEffect } from 'react'
import { Link } from "react-router-dom";
import { Menu, Layout } from 'antd';
import { Text } from '../Components'

import Breakpoint from 'react-socks';

import Footer from './Footer'

const Sidebar = (props) => {

  const menu_items = [
    "overview",
    "cdps",
    "pools",
    "anchors",
    "about",
    "testing"
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
        {menu_items.map((item) => (
          <Menu.Item key={item} style={getStyles(item)}>
            <Link to={"/" + item}>             
            </Link>
          </Menu.Item>
        ))}
      </Menu>
      <Footer />
      </Breakpoint>

    <Breakpoint medium up>
      <Menu onClick={handleClick} mode="inline" theme="dark" selectedKeys={[page]}>
        {menu_items.map((item) => (
          <Menu.Item key={item} style={getStyles(item)}>
            <Link to={"/" + item}>             
                <span>{isSelected(item) ? <Text bold={true} color="#FFF">{item}</Text> : <Text bold={true} color="#848E9C">{item}</Text>}</span>
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
