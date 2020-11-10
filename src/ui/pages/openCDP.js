import React, { useEffect, useState, useContext } from 'react'
import { Context } from '../../context'
import { Button, Row, Col, Form, Input } from 'antd';
import { withRouter } from 'react-router-dom'
import { BreadcrumbCombo, InputPaneStatic, PoolPane, CLTButtonRow } from '../components/common'
import '../../App.css';
import { Center, HR, Text, Label,H2,Sublabel } from '../components/elements';
import { paneStyles, colStyles } from '../components/styles'
import {formatBN, convertFromWei, convertToWei, formatUSD} from '../../utils'
import { getSwapOutput, getSwapSlip, getDoubleSwapOutput, getDoubleSwapSlip } from '../../math'
import { getAccountCDP,getMAIContract, getWalletTokenData, getWeb3, ETH_ADDRESS, MAI_ADDRESS  } from '../../client/web3'
import { PlusCircleOutlined, AlertFilled } from '@ant-design/icons';

const OpenCDP = (props) => {
const context = useContext(Context)
const [account, setAccount] = useState(null)

const [collateralData, setCollateralData] = useState({
    symbol:'ETH',
    balance: '',
    input: 1,
})

const [setCR, setCollaterisation] = useState('150')
useEffect(() => {
    getData()
}, [context.walletData, context.ETHData])

const getData = () =>{
    const address = context.walletData?.address
        setCollateralData(getCollateralData(convertToWei(0.1)))
        setAccount(address)
}
const getCollateralData = (input) => {
    const balance = context.ETHData?.balance 
    const symbol = context.ETHData?.symbol
    const CollateralData = {
        symbol: symbol,
        balance: balance,
        input: input,
    }
    return CollateralData
}

 const onEthAmountChange = (e) => {
    const input = e.target.value
    setCollateralData(getCollateralData(convertToWei(input)))
}

 const changeAddCollateralAmount = (amount) => {
    const input = (amount * collateralData?.balance) / 100
    setCollateralData(getCollateralData(input))
}

 const onRatioAmountChange = e => {
     setCollaterisation(e.target.value)
 }

 const onChange =  (amount) => {
     setCollaterisation(amount)
 }
 const openCDP = async () => {
       const contract = getMAIContract()
       const amount = collateralData.input
       const cltRatio = setCR
       //console.log(cltRatio,amount )
       const tx = await contract.methods.openCDP(cltRatio).send({ from: account, value: amount })
      context.setContext({transaction : tx})
      props.history.push('/CDPs')
 }

    return ( 
        <div>
            
            <BreadcrumbCombo title={'Open CDP'} parent={'CDPs'} link={'/cdps'} child={'Open CDP'}></BreadcrumbCombo>
            <br />
            <div >
            <Row style={paneStyles}>
                        <Col xs={24} style={colStyles}>
                            <Row>
                                <Col xs={2}>
                                </Col>
                                <Col xs={8}>
                                <Center><H2>1. Set Collateral Amount</H2></Center>
                                <InputPaneStatic
                            tokenSymbol={collateralData}
                            paneData={collateralData}
                            onInputChange={onEthAmountChange}
                            changeAmount={changeAddCollateralAmount} />
                            </Col>
                            <Col xs={4}>
                                </Col>
                            <Col xs={8}>
                            <Center><H2>2. Set Collateralisation</H2></Center>
                            <Form>
                                <Input size={'medium'} allowClear onChange={onRatioAmountChange} placeholder={setCR} />
                        </Form>
                        
                        <Sublabel>Default 150% </Sublabel>
                       
                    <CLTButtonRow changeAmount={onChange}/>
                    
                    </Col>
                                <Col xs={2}>
                                </Col>
                            </Row>
                            {/* <Row style={rowStyles}>
                                <Col xs={8}>
                                
                                </Col>
                                <Col xs={8}>
                                <Center><LabelGroup size={18} title={`${convertFromWei()}`} label={'Estimated FEE'} /></Center>
                                </Col>
                                <Col xs={8}>
                                
                                </Col>
                            </Row> */}
                            <br></br>
                            <Center><Button onClick={openCDP} type ="primary" icon={<PlusCircleOutlined/>}>Open CDP</Button></Center>
                        </Col>
                    </Row>


            
            </div>
        </div>
    )
}

export default withRouter(OpenCDP)


