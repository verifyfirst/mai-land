import React, { useEffect, useState, useContext } from 'react'
import { Context } from '../../context'
import { Button, Row, Col, Tabs, Input, Form, Alert } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { BreadcrumbCombo,  PercentButtonRow, InputPaneStatic, CDPPane,CLTButtonRow} from '../components/common'
import '../../App.css';
import { Center, LabelGroup,H2,Sublabel,Text } from '../components/elements';
import { paneStyles, colStyles, rowStyles } from '../components/styles'
import {  convertFromWei, convertToWei,  delay } from '../../utils'
import { getMAXMINT } from '../../math'
import { getPoolData, getMAIContract, ETH_ADDRESS, MAI_ADDRESS } from '../../client/web3'
//import { symbol } from 'prop-types';

const { TabPane } = Tabs;
const ManageCDP = (props) => {
    const context = useContext(Context)
     const [retry, setRetry]= useState(0)
    const [connected, setConnected] = useState(false)
    useEffect(() => {
        getData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [context.accountCDP, retry])

    const getData = async () => {
        if(context.accountCDP){
            context.setContext({ mainPool: getPoolData(ETH_ADDRESS, context.PoolsData) })
            setConnected(true) 
        }else{
            await delay(2000)
            setRetry(parseInt(retry) +1)
            setConnected(false)
        }
        
    }
  
    return (
        <div>
            <BreadcrumbCombo title={'Manage CDP'} parent={'CDPs'} link={'/cdps'} child={'Manage CDP'}></BreadcrumbCombo>
            <br />
            
            <div style={{ marginTop: '-30px' }}>
                {connected ? 
                <CDPDETAILS /> :  
                <div> 
                <LoadingOutlined />
                <Alert type="error" message="Please Connect Your Wallet" banner />
                </div> }
            </div>
            <Tabs defaultActiveKey="1">
                <TabPane tab="Add Collateral" key="1">
                {connected ? <AddCollateralTab /> :  <LoadingOutlined />}
                </TabPane>
                <TabPane tab="Close Debt" key="2">
                {connected ?  <CloseDebtTab/> :  <LoadingOutlined />}
                </TabPane>
                <TabPane tab="Remint MAI" key="3">
                {connected ?  <RemintTab /> :  <LoadingOutlined />}
                </TabPane>
            </Tabs>

        </div>
    )
}

export default ManageCDP

export const CDPDETAILS = () => {
    const context = useContext(Context)
    useEffect(() => {

    }, [context.accountCDP])

    return (<div>
        <Center>
            <Row>
                <CDPPane
                    name={"Collateral"}
                    symbol={"ETH"}
                    balance={context.accountCDP?.collateral}
                />
                <CDPPane
                    name={"Debt"}
                    symbol={"MAI"}
                    balance={context.accountCDP?.debt}
                />
            </Row>
        </Center>
    </div>)

}
export const AddCollateralTab = () => {
    const context = useContext(Context)
    const [account, setAccount] = useState(null)
    const [update, setUpdate]= useState(false)
    const [addCollateralData, setAddCollateralData] = useState({
        address: context.ETHData?.address,
        symbol: context.ETHData?.symbol,
        balance: context.ETHData?.balance,
        collateral: context.accountCDP?.collateral,
        input: 0
    })
    const [mainPool, setMainPool] = useState({
        symbol: '',
        address: '',
        depth: '',
        balance: '',
    })
    useEffect(() => {
        getData()
    }, [context.accountCDP])

 

    const getData = async () => {
        const address = context.walletData?.address
        setAddCollateralData(getCollateralData(context.ETHData?.balance, context.ETHData?.address))
        setMainPool({
            symbol: context.mainPool?.symbol,
            address: context.mainPool?.address,
            depth: context.mainPool?.depth,
            balance: context.mainPool?.balance
        })
        setAccount(address)
     
    }

    const getCollateralData = (input, inputAddress) => {
        const balance = context.ETHData?.balance
        const symbol = context.ETHData?.symbol
        const collateral = parseInt(context.accountCDP?.collateral) + parseInt(input)
        const CollateralData = {
            address: inputAddress,
            symbol: symbol,
            balance: balance,
            collateral: collateral,
            input: input,
        }
        return CollateralData
    }
    const onAddCollateralChange = (e) => {
        const input = e.target.value
        setAddCollateralData(getCollateralData(convertToWei(input), context.ETHData?.address))
    }
    const addCollateral = async () => {
        const contract = getMAIContract()
        const amount = addCollateralData.input
        const tx = await contract.methods.addCollateralToCDP().send({ from: account, to: MAI_ADDRESS, value: amount })
        context.setContext({ transaction: tx })
        setUpdate(true)
    }
    const changeAddCollateralAmount = (amount) => {
        const finalAmt = (amount * addCollateralData?.balance) / 100
        setAddCollateralData(getCollateralData(finalAmt, context.ETHData?.address))
    }


    return (<div>
        <Row style={paneStyles}>
            <Col xs={24} style={colStyles}>
                <Row >
                    <Col xs={8}></Col>
                    <Col xs={8}>
                    <Center><H2> Set Collateral Amount</H2></Center>
                        <InputPaneStatic
                            tokenSymbol={addCollateralData}
                            paneData={addCollateralData}
                            onInputChange={onAddCollateralChange}
                            changeAmount={changeAddCollateralAmount} />
                        <br />
                    </Col>
                    <Col xs={8}>
                    </Col>
                </Row>
                <Row style={rowStyles}>
                    <Col xs={6}></Col>
                    <Col xs={6}>
                        <Center><LabelGroup size={18} title={`${convertFromWei(addCollateralData.collateral)}`} label={'ESTIMATED TOTAL COLLATERAL'} /></Center>
                    </Col>
                    <Col xs={6}>
                        <Center><LabelGroup size={18} title={`${convertFromWei(parseInt(getMAXMINT(addCollateralData.collateral, mainPool, 101)) - parseInt(context.accountCDP?.debt))}`} label={'ESTIMATED MAX MINTABLE'} /></Center>
                    </Col>
                    <Col xs={6}></Col>
                </Row>
                <br></br>
                <Center><Button onClick={addCollateral} type={'primary'}>Add Collateral</Button></Center>

            </Col>
        </Row>
    </div>)

}

export const RemintTab = () => {
    const context = useContext(Context)
    const [account, setAccount] = useState(null)
    const [setCR, setCollaterisation] = useState('150')
    useEffect(() => {
        getData()
    }, [context.accountCDP])

    const getData = async () => {
        const address = context.walletData?.address
        setAccount(address)

    }
    const onChange = async (amount) => {
        setCollaterisation(amount)
    }

    const onRatioAmountChange = e => {
        setCollaterisation(e.target.value)
    }

    const remintTOKEN = async () => {
        const contract = getMAIContract()
        const collateralisation = setCR
        const tx = await contract.methods.remintMAIFromCDP(collateralisation).send({from: account, to: MAI_ADDRESS})
        context.setContext({ transaction: tx })
    }


    return (<div>
        <Row style={paneStyles}>
            <Col xs={24} style={colStyles}>
            <Center><H2>Set Collateralisation</H2></Center>
                <Row style={rowStyles}>
                    <Col xs={6}></Col>
                    <Col xs={6}>
                        <Center><LabelGroup size={18} title={`${convertFromWei(context.accountCDP?.collateral)}`} label={'COLLATERAL'} /></Center>
                    </Col>
                    <Col xs={6}>
                        <Center><LabelGroup size={18} title={`${convertFromWei(parseInt(getMAXMINT(context.accountCDP?.collateral, context.mainPool, 102)) - parseInt(context.accountCDP?.debt))}`} label={'MAX MINTABLE'} /></Center>
                    </Col>
                    <Col xs={6}></Col>
                </Row>
                <br />
                <Row>
                    <Col xs={8}></Col>
                    
                    <Col xs={8}>
                        <Form>
                                <Input size={'medium'} allowClear onChange={onRatioAmountChange} placeholder={setCR} />
                        </Form>
                        <Sublabel>Default 150% </Sublabel>
                        <CLTButtonRow changeAmount={onChange} />
                    </Col>
                    <Col xs={8}>
                    </Col>
                </Row>

                <Row style={rowStyles}>
                    
                    <Col xs={24}>
                        <Center><LabelGroup size={18} title={`${convertFromWei(getMAXMINT(context.accountCDP?.collateral, context.mainPool, setCR))}`} label={'ESTIMATED FINAL DEBT'} /></Center>
                    </Col>
                    
                </Row>
                <br></br>
                <Center><Button onClick={remintTOKEN} type={'primary'}>MINT MAI </Button></Center>
            </Col>
        </Row>
    </div>)

}

export const CloseDebtTab = () => {
    const context = useContext(Context)
    const [account, setAccount] = useState(null)
    //const [closeDebt, setCloseDebt] = useState(null)

    const [closeDebtData, setCloseDebtData] = useState({
        symbol: context.BASEData?.symbol,
        balance: context.BASEData?.balance,
        debt: context.accountCDP?.debt,
        input: 0
    })
    useEffect(() => {
        getData()
    }, [context.accountCDP])


    const getData = async () => {
        const address = context.walletData?.address
        setCloseDebtData(getDebtData(50))
        setAccount(address)

    }

    const getDebtData = (input) => {
        const balance = context.BASEData?.balance
        const symbol = context.BASEData?.symbol
        const debt = (input * context.accountCDP?.debt)/100
        const DebtData = {
            symbol: symbol,
            balance: balance,
            debt: debt,
            input: input,
        }
        return DebtData
    }
    const onAddDebtChange = (e) => {
        const input = e.target.value
        setCloseDebtData(getDebtData(input))
    }
    const closeDebt = async () => {
        const contract = getMAIContract()
        const liquidation = (closeDebtData.input *100)
        console.log(liquidation)
        const tx = await contract.methods.closeCDP(liquidation).send({ from: account, to: MAI_ADDRESS })
        context.setContext({ transaction: tx })
    }
    const changeCloseDebtAmount = (amount) => {
        //const finalAmt = (amount * closeDebtData?.balance) / 100
        console.log(amount)
        setCloseDebtData(getDebtData(amount, context.BASEData?.address))
    }
const precise = (x) => {
    return Number.parseFloat(x).toPrecision(3);
  }



    return (<div>
        <Row style={paneStyles}>
            <Col xs={24} style={colStyles}>
            <Center><H2> Set Closing Amount</H2></Center>
            <Row style={rowStyles}>
            
                </Row>
               
                <Row >
                <Col xs={8}></Col>
                    <Col xs={8}>
                     <Form>
                        <Input size={'medium'} allowClear onChange={onAddDebtChange} placeholder={closeDebtData.input} />
                        </Form>
                        <Sublabel>Default 50% </Sublabel>
                        <PercentButtonRow changeAmount={changeCloseDebtAmount} />
                        <br />
                    </Col>
                    <Col xs={8}></Col>
                </Row>
                
                <Row style={rowStyles}>

                <Col xs={6}></Col>
                 <Col xs={6}>
                        <Center><LabelGroup size={18} title={`${precise(convertFromWei((context.accountCDP?.collateral)*closeDebtData.input)/100)}`} label={'ESTIMATED COLLATERAL RECIEVING'} /></Center>
                    </Col>
                    
                    <Col xs={6}>
                        <Center><LabelGroup size={18} title={`${precise(convertFromWei((context.accountCDP?.debt)*closeDebtData.input)/100)}`} label={'ESTIMATED DEBT SENDING'} /></Center>
                    </Col>
                <Col xs={6}></Col>
                </Row>
                <br></br>
                <Center><Button onClick={closeDebt} type={'primary'}>Close Debt</Button></Center>

            </Col>
        </Row>
    </div>)

}
