import React, { useEffect, useState, useContext } from 'react'
import { Context } from '../../context'
import Breakpoint from 'react-socks';
import { Link } from "react-router-dom";
import { Colour, H1} from '../Components'
import {Layout, Row, Col} from 'antd';
import Web3 from 'web3'
import { maiAddr, maiAbi } from '../../client/web3.js'
import { convertFromWei } from '../utils'
import logotype from '../../assets/MAI-LOGO.svg';
const Header = (props) => {
  const context = useContext(Context)
  const [connected, setConnected] = useState(false)
  const [accountData, setAccountData] = useState(
    { address: '', maiBalance: '', ethBalance: ''})

  const color = Colour().white;
useEffect(() => {
  if(!connected){
    connect()
}
}, [])

const connect = async () => {
  ethEnabled()
  if (!ethEnabled()) {
  } else {
    const accounts = await window.web3.eth.getAccounts()
          const address = accounts[0]
          const contract = new window.web3.eth.Contract(maiAbi(), maiAddr())
          context.accountData ? getAccountData() : loadAccountData(contract, address)
          setConnected(true)
  }
}
const ethEnabled = () => {
  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum);
    window.ethereum.enable();
    return true;
  }
  return false;
}

const getAccountData = async () => {
  setAccountData(context.accountData)
}

const loadAccountData = async (contract_, address) => {
const ethBalance = convertFromWei(await window.web3.eth.getBalance(address))
const maiBalance = convertFromWei(await contract_.methods.balanceOf(address).call())
const accountData = {
address: address,
maiBalance: maiBalance,
ethBalance: ethBalance
}
  setAccountData(accountData)
context.setContext({'accountData':accountData})
}

const getAddrShort = () => {
  const addr = (context.accountData?.address)? context.accountData.address : '0x000000000'
  const addrShort = addr.substring(0,5) + '...' + addr?.substring(addr.length-3, addr.length)
  return addrShort
}

const logotypeStyles = {
  width: 148,
  height: 60,
  display: "flex",
  justifyContent: "flex-start",
  transform: "scale(0.9)"
}
const address = {
  position: "absolute",
  top: 0,
  right: 0,
  paddingRight: 30,
}
const headerStyles = {
  color: Colour().white,
  
}

const titleStyles ={
  fontSize: "24px",
  fontWeight:"bold",
  color:"#FFFFF"
}

  return (
    <div>
  <Breakpoint medium up>
                <Layout.Header style={headerStyles}>
                    <div>
                        <Row>
                          <Col xs={3} style={titleStyles}>
                          <div>Mai-Land</div>
                          </Col>
                            <Col xs={3} style={address}>
                                <div>
                                    {getAddrShort()}
                                </div>
                            </Col>
                        </Row>
                    </div>
                </Layout.Header>
            </Breakpoint>
            </div>
  )
}

export default Header
