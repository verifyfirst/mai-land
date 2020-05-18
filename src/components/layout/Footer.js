import React from 'react'
import { Layout} from 'antd';
import { Menu} from 'antd';
import { TwitterOutlined, GithubOutlined, RedditOutlined} from '@ant-design/icons';

import Breakpoint from 'react-socks';
const Footer = (props) => {


  const linkStyles = {
    backgroundColor: "#111122",
    color:"#007892",
    fontSize:16
  }

  const footerStyles = {
    background: "#111122",
    textTransform: "uppercase",
    position: "absolute",
    left:0,
    bottom:0,
    right:0,
    width:200,
    fontSize:16,
    fontWeight: "bold",
    paddingBottom: 100,
  }
 
  return (
    <Layout.Sider style={footerStyles} trigger={null} collapsible breakpoint="md"
    collapsedWidth="80">

      <Breakpoint small down>
      <Menu style={linkStyles} mode="inline" theme="dark" >
          <Menu.Item style={linkStyles}>
          <a href="https://twitter.com/" rel="noopener noreferrer" title="Twitter Link" target="_blank" style={linkStyles}><TwitterOutlined /></a>
          </Menu.Item>
          <Menu.Item style={linkStyles}>
          <a href="https://github.com/" rel="noopener noreferrer" title="Github Link" target="_blank" style={linkStyles}> <GithubOutlined /></a>
          </Menu.Item>
          <Menu.Item style={linkStyles} >
          <a href="https://reddit.com/" rel="noopener noreferrer" title="Reddit Link" target="_blank" style={linkStyles}><RedditOutlined /></a>
          </Menu.Item>
      </Menu>
      </Breakpoint>


      <Breakpoint medium up>
      <Menu style={linkStyles} mode="inline" theme="dark" >
        
      <Menu.Item  style={linkStyles}>
        <span>
          <a href="https://twitter.com/" rel="noopener noreferrer" title="Twitter Link" target="_blank" style={linkStyles}>TWITTER</a>
          </span>
          </Menu.Item>
      <Menu.Item style={linkStyles}> 
        <span>
          <a href="https://github.com/" rel="noopener noreferrer" title="Github Link" target="_blank" style={linkStyles}>GITHUB</a>
       </span>
       </Menu.Item>
       <Menu.Item style={linkStyles}> 
       <span>
         <a href="https://reddit.com/" rel="noopener noreferrer" title="Reddit Link" target="_blank" style={linkStyles}>REDDIT</a>
       </span>     
       </Menu.Item>

      </Menu>
      </Breakpoint>
    </Layout.Sider>
  )
}

export default Footer
