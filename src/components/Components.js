import React from 'react'
import PropTypes from "prop-types";
import { Button as AntButton, Row, Col, Card } from "antd"

const defaultStyles = {
  color: "#222831",
  fontSize: "14px",
  letterSpacing: 1
}

export const H1 = (props) => {
  let styles = {...defaultStyles, ...props.style || {}}
  styles.fontSize = "24px"
  styles.fontWeight = "bold"
  styles.color = "#393e46"
  return (
    <span style={styles}>
      {props.children}
    </span>
  )
}
export const Colour = (alpha) => {
  var colour
  if(alpha){
    colour = {
      "yellow":'rgba(255, 206, 86, ' + alpha + ')'
    }
  } else {
    colour = {
      "black":"#110D01", 
      "white":"#FFF",
      "dgrey": "#2B2515",
      "grey": "#97948E",
      "lgrey": "#F4F4F2",
      "rust": "#795900",
      "gold":"#D09800",
      "yellow":'#FFCE56'
    }
  }
  
  return colour
}


export const H2 = (props) => {
  let styles = {...defaultStyles, ...props.style || {}}
  styles.fontSize = "20px"
  styles.fontWeight = "bold"
  styles.color = "#393e46"
  return (
    <span style={styles}>
      {props.children}
    </span>
  )
}

export const LabelGrey = (props) => {
  let styles = {...defaultStyles, ...props.style || {}}
  styles.fontSize = "14px"
  styles.fontWeight = "bold"
  styles.color = "#8b9796"
  return (
    <span style={styles}>
      {props.children}
    </span>
  )
}

export const LabelWrn = (props) => {
  let styles = {...defaultStyles, ...props.style || {}}
  styles.fontSize = "16px"
  styles.fontWeight = "bold"
  styles.color = "#D6733B"
  return (
    <span style={styles}>
      {props.children}
    </span>
  )
}

export const Label = (props) => {
  let styles = {...defaultStyles, ...props.style || {}}
  styles.fontSize = "14px"
  styles.fontWeight = "bold"
  styles.color = "#393e46"
  return (
    <span style={styles}>
      {props.children}
    </span>
  )
}

export const LabelLG = (props) => {
  let styles = {...defaultStyles, ...props.style || {}}
  styles.fontSize = "32px"
  styles.fontWeight = 100
  styles.color = "#222831"
  return (
    <span style={styles}>
      {props.children}
    </span>
  )
}

export const Click = (props) => {
  let styles = {...props.style || {}}
  styles.fontSize = "16px"
  styles.fontWeight = "bold"
  styles.color = "#29a19c"
  return (
    <span style={styles}>
      {props.children}
    </span>
  )
}

export const Text = (props) => {
    let styles = {...defaultStyles, ...props.style || {}}
    if (props.bold) {
      styles.fontWeight = "bold"
    }
    if (props.color) {
      styles.color = props.color
    }
    if (props.size) {
      styles.fontSize = props.size
    }
    return (
      <span style={styles}>
        {props.children}
      </span>
    )
  }

export const PillText = (props) => {
  let styles = {...defaultStyles, ...props.style || {}}
  styles.backgroundColor = "#ededed"
  styles.borderRadius = 28
  styles.padding = "8px 20px"
  styles.fontSize = "14px"
  return (
    <span style={styles}>
      {props.children}
    </span>
  )
}

export const Sublabel = (props) => {
  let styles = {...props.style || {}}
  styles.fontSize = "14px"
  styles.fontWeight = ""
  styles.color = Colour().white
  styles.margin = "20px 0px"

    if (props.margin) {
    styles.margin = props.margin
  }

  return (
    <span style={styles}>
      {props.children}
    </span>
  )
}


export const PillTextFill = (props) => {
  let styles = {...defaultStyles, ...props.style || {}}
  styles.backgroundColor = "#F0B90B"
  styles.borderRadius = 28
  styles.padding = "8px 20px"
  styles.fontSize = "14px"
  styles.color = "#FFF"
  return (
    <span style={styles}>
      {props.children}
    </span>
  )
}

export const Center = (props) => (
  <div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
    {props.children}
  </div>
)
export const Gap = () => (
  <div>
    <br></br><br></br>
  </div>
)
const Button = (props) => {
  let styles = {...defaultStyles, ...props.style || {}}
  styles.borderRadius = 9
  if (props.bold || props.bold === "true") {
    styles.fontFamily = "Helvetica-Bold"
  }
  if (props.fill) {
    styles.color = "#fff"
    styles.backgroundColor = "#29a19c"
    styles.borderColor = "#29a19c"
  } else {
    styles.color = "#29a19c"
    styles.backgroundColor = "#fff"
    styles.border = "1px solid #29a19c"
    styles.borderColor = "#29a19c"
  }
  return (
    <AntButton
      disabled={props.disabled}
      style={styles}
      onClick={props.onClick}
      onChange={props.onChange}
      type={props.type}
      loading={props.loading}
    >
      {props.children}
    </AntButton>
  )
}
Button.defaultProp = {
  disabled: false,
  fill: false,
  bold: false,
  loading: false,
}
Button.propTypes = {
  fill: PropTypes.bool,
  bold: PropTypes.bool,
  loading: PropTypes.bool,
}

export const PillTextFil = (props) => {
  let styles = {...defaultStyles, ...props.style || {}}
  styles.backgroundColor = "#F0B90B"
  styles.borderRadius = 28
  styles.padding = "8px 20px"
  styles.fontSize = "14px"
  styles.color = "#FFF"
  return (
    <span style={styles}>
      {props.children}
    </span>
  )
}

export const Subtitle = (props) => {
  let styles = {...props.style || {}}
  styles.fontSize = "14px"
  styles.color = Colour().black
  styles.margin = "20px 0px"

  if (props.margin) {
    styles.margin = props.margin
  }
  return (
    <span style={styles}>
      {props.children}
    </span>
  )
}

export const FloatCard = (props) => {

  let styles = {...defaultStyles, ...props.style || {}}
  styles.padding = "10px 40px 10px 40px"
  styles.margin= "20px 20px 0px 20px"
  styles.width="320px"
  styles.fontSize = "14px"
  styles.position = "relative"
  styles.top = "-50px"
  styles.left = "200px"
  styles.boxShadow =  "0 0px 8px 0 #A3F7BF"
  styles.borderRadius = "9px"
  

  if (props.left) {
    styles.left = props.left
  }

  return (
    <Card title={props.title} style={styles}>
        <Row>
        <Col xs={9}>
          <Label>12</Label><br />
          <LabelGrey> NUMBER</LabelGrey>
        </Col>
        <Col xs={9} style={{marginLeft:20, marginRight:20}}>
          <Label>12</Label><br />
          <LabelGrey> NUMBER</LabelGrey>
        </Col>
      </Row>
      <Row>
        <Col xs={9}>
          <Label>12</Label><br />
          <LabelGrey> NUMBER</LabelGrey>
        </Col>
        <Col xs={9} style={{marginLeft:20, marginRight:20}}>
          <Label>12</Label><br />
          <LabelGrey> NUMBER</LabelGrey>
        </Col>
      </Row>
    </Card>
  )
}


