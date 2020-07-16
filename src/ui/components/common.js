import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import { Context } from '../../context'
import { Row, Col, Breadcrumb, Button, Input, Dropdown, Menu, Divider } from 'antd'
import { DownOutlined,RedoOutlined } from '@ant-design/icons';
// PlusCircleOutlined, MinusCircleOutlined, Tooltip
import {
  rainbowStop, getIntFromName,
  convertFromWei, formatUSD, } from '../../utils'
import {MAI_ADDRESS, getTokenSymbol, getPoolsData, getWalletData, getAccountCDP, getWalletTokenData, getContractAddrs, getPoolsArray, getPoolData} from '../../client/web3'
 import { getSwapOutput, getDoubleSwapOutput,getPoolValue } from '../../math'
import { H1, HR, Colour, Text, Center, Label, Sublabel } from '../components/elements'

export const BreadcrumbCombo = (props) => {

  return (
    <div>
      <H1>{props.title}</H1>
      <Breadcrumb>
        <Breadcrumb.Item><Link to={props.link}>{props.parent}</Link></Breadcrumb.Item>
        <Breadcrumb.Item>{props.child}</Breadcrumb.Item>
      </Breadcrumb>
    </div>
  )
}

export const InputPane = (props) => {
  const styles = {
    marginLeft: 10
  }

  return (
    <div style={styles}>
      <Row>
        <Col xs={24}>
          <Input onChange={props.onInputChange}
            placeholder={convertFromWei(props.paneData?.input)}
            //defaultValue={convertFromWei(props.paneData?.input)}
            allowClear={true}
           addonAfter={
            <TokenDropDown 
            changeToken={props.changeToken}
            tokenList={props.tokenList} />}
          ></Input>
          <Sublabel>Balance:
            {convertFromWei(props.paneData?.balance)} ({ (props.paneData?.symbol)})</Sublabel>
        </Col>
      </Row>
      <PercentButtonRow changeAmount={props.changeAmount} />
    </div>
  )
}
export const InputCheck = (props) => {

  const styles = {
    marginLeft: 10
  }

  return (
    <div style={styles}>
      <Row>
        <Col xs={24}>
          <Input onChange={props.onInputChange}
            placeholder={props.paneData?.address}
            // defaultValue={convertFromWei(props.paneData?.input)}
            allowClear={true}
            addonAfter={<TokenDropDown 
              changeToken={props.onInputChange}
              tokenList={props.tokenList} />}
          ></Input>
  
        </Col>
      </Row>
    </div>
  )
}

export const InputPaneStatic = (props) => {
  //tokenList
  //paneData: {address, input, balance}
  //inputChange, changeToken, changeAmount
  const styles = {
    marginLeft: 10
  }
  return (
    <div style={styles}>
      <Row>
        <Col xs={24}>
          <Input onChange={props.onInputChange}
            placeholder={convertFromWei(props.paneData?.input)}
            // defaultValue={convertFromWei(props.paneData?.input)}
            allowClear={true}
            addonAfter={
              <TokenSymbol
                symbol={props.tokenSymbol?.symbol} />}
          ></Input>
          <Sublabel>Balance:
            {convertFromWei(props.paneData?.balance)} ({props.tokenSymbol?.symbol})</Sublabel>
        </Col>
      </Row>
      <PercentButtonRow changeAmount={props.changeAmount} />
    </div>
  )
}

export const OutputPane = (props) => {

  // const [secondToken, setSecondToken] = useState(false)

  // const handleSecondToken = () => {
  //   secondToken ? setSecondToken(false) : setSecondToken(true)
  // }

  return (
    <div style={{ margin: 0 }}>
      <Center>
        <Row>
          <Col xs={24}>
            <PercentButtonRow changeAmount={props.changeAmount} />
          </Col>
        </Row>
      </Center>
      {/* <Center>
        {!secondToken &&
          <div>
            <Row>
              <Col xs={18}>
                <TokenDropDown />
              </Col>
              <Col xs={6}>
                <Tooltip title="Withdraw simultaneously to a second token">
                  <Button style={{ marginLeft: 10 }} onClick={handleSecondToken} icon={<PlusCircleOutlined />}></Button>
                </Tooltip>
              </Col>
            </Row>
          </div>
        }
        {secondToken &&
          <div>
            <Row>
              <Col xs={8} style={{ marginLeft: 10 }}>
                <TokenDropDown />
              </Col>
              <Col xs={8} style={{ marginLeft: 10 }}>
                <TokenDropDown />
              </Col>
              <Col xs={4} style={{ marginLeft: 10 }}>
                <Button onClick={handleSecondToken} icon={<MinusCircleOutlined />}></Button>
              </Col>
            </Row>
          </div>
        }
      </Center> */}
      <br />
    </div >
  )
}

export const PercentButtonRow = (props) => {

  const change25 = () => { props.changeAmount(25) }
  const change50 = () => { props.changeAmount(50) }
  const change75 = () => { props.changeAmount(75) }
  const change100 = () => { props.changeAmount(100) }

  const btnStyle = {
    marginRight: 3.5,
    marginTop: 10,
  }
  return (
    <>
      <Row style={{ marginBottom: 10 }}>
        <Col xs={24}>
          <Button type="dashed" style={btnStyle} onClick={change25}>25%</Button>
          <Button type="dashed" style={btnStyle} onClick={change50}>50%</Button>
          <Button type="dashed" style={btnStyle} onClick={change75}>75%</Button>
          <Button style={btnStyle} onClick={change100}>ALL</Button>
        </Col>
      </Row>
    </>
  )
}
export const LiquidButtonRow = (props) => {

  const change10 = () => { props.changeAmount(10) }
  const change15 = () => { props.changeAmount(15) }
  const change25 = () => { props.changeAmount(25) }
  const change33 = () => { props.changeAmount(33) }

  const btnStyle = {
    marginRight: 5,
    marginTop: 10,
  }
  return (
    <>
      <Row style={{ marginBottom: 10 }}>
        <Col xs={24}>
          <Button type="dashed" style={btnStyle} onClick={change10}>10%</Button>
          <Button type="dashed" style={btnStyle} onClick={change15}>15%</Button>
          <Button type="dashed" style={btnStyle} onClick={change25}>25%</Button>
          <Button style={btnStyle} onClick={change33}>MAX 33%</Button>
        </Col>
      </Row>
    </>
  )
}

export const TokenDropDown = (props) => {
   const context = useContext(Context)
  const [symbol, setSymbol] = useState()
  const [arraySymbols, setArraySymbols] = useState([])
  useEffect(() => {
    buildArray()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.tokenList])

  const buildArray = () => {
    if (props.tokenList) {
      setSymbol(getTokenSymbol(MAI_ADDRESS, context.walletData))
      const symbols = []
      for (let i = 0; i < props.tokenList.length; i++) {
          const symbol = getTokenSymbol(props.tokenList[i],context.walletData)
          symbols.push(symbol)
      }
      setArraySymbols(symbols)
    }
  }

  const handleMenuClick = async (e) => {
    console.log(props.tokenList[e.key])
    setSymbol( getTokenSymbol(props.tokenList[e.key], context.walletData))
    
    props.changeToken(props.tokenList[e.key])
  }

  const style = {
    width: 100,
    // background: Colour().white,
    // padding:'-20px'
  }

  const menu = (
    <Menu>
      {arraySymbols.map((item, index) => (
        <Menu.Item key={index} onClick={handleMenuClick}>
          <Row >
            <Col xs={8} style={{ paddingLeft: 2 }}>
              <ColourCoin symbol={item} size={22} />
            </Col>
            <Col xs={8} style={{ paddingLeft: 2 }}>
              {item}
            </Col>
          </Row>
        </Menu.Item>
      ))}
    </Menu>
  );
  return (
    <div>
      <Dropdown overlay={menu}>
        {/* <Button style={{ width: 120 }}> */}
        <Row style={style}>
          <Col xs={8} style={{ paddingLeft: 2 }}>
            <ColourCoin symbol={symbol} size={22} />
          </Col>
          <Col xs={8} style={{ paddingLeft: 2 }}>
            {symbol}
          </Col>
          <Col xs={8} style={{ paddingLeft: 2 }}>
            <DownOutlined />
          </Col>
        </Row>
        {/* </Button> */}
      </Dropdown>
    </div>

  )

}
export const TokenSymbol = (props) => {

  useEffect(() => {

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.symbol])

  const style = {
    width: 80,
    // background: Colour().white,
    // padding:'-20px'
  }
  return (
    <div>
      <Row style={style}>
        <Col xs={8} style={{ paddingLeft: 2 }}>
          <ColourCoin symbol={props.symbol} size={22} />
        </Col>
        <Col xs={8} style={{ paddingLeft: 2 }}>
          {props.symbol}
        </Col>
        <Col xs={8} style={{ paddingLeft: 2 }}>

        </Col>
      </Row>
    </div>

  )

}

export const PoolPane = (props) => {

  const poolStyles = {
    borderWidth: '1px',
    borderStyle: 'solid',
    borderRadius: 5,
    borderColor: Colour().grey,
    margin: 20,
    padding: 10,
    width: 400
  }

  const colStyles = {
    display: 'flex',
    textAlign: 'center'
  }

  return (
    <div>
      <Col xs={24} sm={24} xl={24} style={poolStyles}>
        <Row>
          <Col xs={24}>
            <ColourCoin symbol={props.symbol} size={40} />
            <Center><Text size={30} margin={"-40px 0px 5px 0px"}>{convertFromWei(props?.balance) +" "+ props.pool.symbol}</Text></Center>
            <Center><Label margin={"0px 0px 0px 0px"}>${convertFromWei(getPoolValue(props?.pool, props?.price))}</Label></Center>
            <Center><Sublabel margin={"0px 0px 5px 0px"}>Pool Value</Sublabel></Center>

            {!props.hideSubpane &&
              <div>
                <HR />
                <Row style={colStyles}>
                  <Col xs={8}>
                    <Label>{props.data.field1.data}</Label><br />
                    <Sublabel>{props.data.field1.title}</Sublabel>
                  </Col>
                  <Col xs={8}>
                    <Label>{props.data.field2.data}</Label><br />
                    <Sublabel>{props.data.field2.title}</Sublabel>
                  </Col>
                  <Col xs={8}>
                    <Label>{props.data.field3.data}</Label><br />
                    <Sublabel>{props.data.field3.title}</Sublabel>
                  </Col>
                </Row>
              </div>
            }
          </Col>
        </Row>
      </Col>
    </div>
  )
}

const ColourCoin = (props) => {
  const symbol = props.symbol ? props.symbol : 'XXX'
  const numbers = getIntFromName(symbol)
  const startCol = rainbowStop(numbers[0])
  const stopCol = rainbowStop(numbers[1])
  const coinName = symbol.length > 4 ? symbol.substr(0, 4) : symbol

  const coinStyle = {
    fontWeight: '500',
    letterSpacing: '0.3px',
    textTransform: 'uppercase',
    color: Colour().white,
    fontSize: props.size / 3,
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '50%',
    width: props.size,
    height: props.size,
    background: `linear-gradient(45deg, ${startCol}, ${stopCol})`,
  }

  return (
    <div >
      <Row style={coinStyle}>
        <Col>
          <span>{coinName}</span>
        </Col>
      </Row>
    </div>
  )
}

export const CoinRow = (props) => {

  const rowStyles = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }

  return (
    <div>
      <Row style={rowStyles}>
        <Col xs={4}>
          <ColourCoin symbol={props.symbol} size={props.size} />
        </Col>
        <Col xs={13}>
          <Label size={props.size / 2.2}>{props.name}</Label><br />
        </Col>
        <Col xs={7}>
          <Text size={props.size / 2}>{convertFromWei(props.balance)}</Text><br />
         
        </Col>
      </Row>
    </div>
  )
}
export const CDPDetails = (props) => {

  const rowStyles = {
    display: 'flex',
    marginTop: 15,
    justifyContent: 'center',
    alignItems: 'center',

  }

  return (
    <div>
      <Row style={rowStyles}>
        <Col span={4}>
          <ColourCoin symbol={props.symbol} size={props.size} />
        </Col>
        <Col span={12}>
          <Label size={props.size / 2.2}>{props.name}</Label><br />
        </Col>
        <Col span={6}>
          <Text size={props.size / 2}>{convertFromWei(props.balance)}</Text><br />
  
        </Col>

      </Row>
    </div>
  )
}

export const CLTButtonRow = (props) => {

  const change110 = () => { props.changeAmount(110) }
  const change125 = () => { props.changeAmount(125) }
  const change150 = () => { props.changeAmount(150) }
  const change200 = () => { props.changeAmount(200) }

  const btnStyle = {
    marginRight: 3.5,
    marginTop: 10
  }
  return (
    <>
      <Row style={{ marginBottom: 10 }}>
        <Col xs={24}>
          <Button type="dashed" style={btnStyle} onClick={change110}>110%</Button>
          <Button type="dashed" style={btnStyle} onClick={change125}>125%</Button>
          <Button type="dashed" style={btnStyle} onClick={change150}>150%</Button>
          <Button type="dashed" style={btnStyle} onClick={change200}>200%</Button>
        </Col>
      </Row>
    </>
  )
}
export const CDPPane = (props) => {

  const poolStyles = {
    borderWidth: '1px',
    borderStyle: 'solid',
    borderRadius: 5,
    borderColor: Colour().grey,
    margin: 20,
    padding: 10,
    width: 400
  }

  const colStyles = {
    display: 'flex',
    textAlign: 'center'
  }

  return (
    <div>
      <Col xs={24} sm={24} xl={24} style={poolStyles}>
        <Row>
          <Col xs={24}>
            <Divider><Label size={20}>{props.name}</Label> </Divider>
            <ColourCoin symbol={props.symbol} size={40} />
            <Center><Text size={30} margin={"-40px 0px 5px 0px"}>{convertFromWei(props?.balance)}</Text></Center>
          
          </Col>
        </Row>
      </Col>
    </div>
  )
}
export const RefreshComponent = () =>{
  const context = useContext(Context)
  function refreshPage() {
    window.location.reload(false);
    context.setContext({update:true})
  }
  const refreshStyle = {
    fontSize: 30,
  }

  return(<div style={refreshStyle}>
      <Button type="link" size={'Large'} onClick={refreshPage} icon={<RedoOutlined />}>Refresh </Button>
  </div>)
}
