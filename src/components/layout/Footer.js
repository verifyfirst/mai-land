import React from 'react'
import { Layout, Row, Col} from 'antd';

const Footer = (props) => {

  const footerStyles = {
    background: "#111122",
    textTransform: "uppercase",
    zIndex: 0,
    position: "absolute",
    left:0,
    bottom:0,
    right:0,
    fontSize: 10,
    paddingTop: 5,
    paddingBottom: 100,
    paddingLeft: 10,
    paddingRight: 5,
    textAlign: "left"
  }

  const linkStyles = {
    color:"#91ffff", 
    fontSize:16,
    fontWeight: "bold"
  }


  return (
    <Layout.Footer style={footerStyles}>
      <div>
        <Row>
          <Col>
          <span style={{marginLeft:20}}><a href="https://twitter.com/" rel="noopener noreferrer" title="Twitter Link" target="_blank" style={linkStyles}>TWITTER</a></span>
          </Col>
        </Row>
        <Row>
          <Col>
          <span style={{marginLeft:20}}><a href="https://github.com/" rel="noopener noreferrer" title="Github Link" target="_blank" style={linkStyles}>GITHUB</a></span>
          </Col>
        </Row>
        <Row>
          <Col>
          <span style={{marginLeft:20}}><a href="https://bitcointalk.com/" rel="noopener noreferrer" title="BitcoinTalk Link" target="_blank" style={linkStyles}>BITCOINTALK</a></span>
          </Col>
        </Row>
        <Row>
          <Col>
          <span style={{marginLeft:20}}><a href="https://reddit.com/" rel="noopener noreferrer" title="Reddit Link" target="_blank" style={linkStyles}>REDDIT</a></span>
          </Col>
        </Row>
      </div>
    </Layout.Footer>
  )
}

export default Footer
