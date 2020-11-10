import React, { useEffect, useState, useContext } from 'react'
import { Context } from '../../context'
import { Button, Row, Col, Tabs, Input, Form, Alert } from 'antd';
import {withRouter} from 'react-router-dom';
//import { LoadingOutlined } from '@ant-design/icons';
import { BreadcrumbCombo, LiquidButtonRow} from '../components/common'
import '../../App.css';
import { Center, LabelGroup } from '../components/elements';
import { paneStyles, colStyles, rowStyles } from '../components/styles'
import {  convertFromWei, convertToWei,  delay } from '../../utils'
import { getLiquidationFee } from '../../math'
import {  getMAIContract,getCDPData } from '../../client/web3'
import { LeftCircleFilled } from '@ant-design/icons';

//import { symbol } from 'prop-types';


const Liquidate = (props) => {
    const context = useContext(Context)
      const [retry, setRetry]= useState(0)
    const [account, setAccount] = useState(null)
    const [cdp, setCDP] = useState(null)
    const [liquidationData, setSetLiquidationData] = useState({
        cdp: '',
        input: 0
    })
    const[cdpData, setCDPData] = useState({
        debt:'',
        collateral:''
    })
    const [fee, setFee]= useState(0)
    useEffect(() => {
        getData()
       
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [context.walletData, retry])

    const getData = async () => {
        const address = context.walletData?.address
        setAccount(address)
            const search = props.location.search; 
            const params = new URLSearchParams(search);
            const CDP = params.get('CDP'); 
             setCDP(CDP)
             setSetLiquidationData(getLiquidationData(33))
             if(context.AllCDPData){
             let cdpData = getCDPData(CDP,context.AllCDPData)
             context.setContext({cdpData:cdpData})
                 setCDPData(getSelectedCDPData(cdpData))
             }else{
                 await delay(1000)
                 setRetry(parseInt(retry)+1)
             }
            
    }
    const getSelectedCDPData = (cdp ) => {
        const CDPData = {
            debt:cdp.debt,
            collateral:cdp.collateral
        }
        return CDPData
    }

    const getLiquidationData = (input) => {
        const liquidationData = {
            cdp: cdp,
            input: input,
        }
        return liquidationData
    }
    const liquidationChange = (e) => {
        const input = e.target.value
        setSetLiquidationData(getLiquidationData(input))
        setFee(getLiquidationFee(cdpData.debt, cdpData.collateral, context.mainPool,(input *100)))
    }
    const changeLiquidationAmount = (amount) => {
        setSetLiquidationData(getLiquidationData(amount, cdp))
      // console.log(cdpData.debt, cdpData.collateral)
        setFee(getLiquidationFee(cdpData.debt, cdpData.collateral, context.mainPool,(amount *100)))
    }

    const LiquidateCDP = async () => {
        const contract = getMAIContract()
        const liquidationAmount = liquidationData.input * 100
        const unSafeCDP = liquidationData.cdp
        //console.log(unSafeCDP,liquidationAmount, account)
        const tx = await contract.methods.liquidateCDP(unSafeCDP, liquidationAmount).send({from: account})
        context.setContext({ transaction: tx })
        props.history.push('/cdps')
    
    }
 
    return (
        <div>
            <BreadcrumbCombo title={'Liquidate CDP'} parent={'CDPs'} link={'/cdps'} child={'Liquidate CDP'}></BreadcrumbCombo>
            <br />
            {context.walletData ? 
            <Row style={paneStyles}>
                        <Col xs={24} style={colStyles}>
                            <Row>
                                <Col xs={6}>
                                </Col>
                                <Col xs={12}>
                                <Form>
                            <Form.Item label="Liquidation %" >
                                <Input size={'medium'} allowClear onChange={liquidationChange} placeholder={liquidationData.input} />
                            </Form.Item>
                            <Center> <LiquidButtonRow changeAmount={changeLiquidationAmount} /></Center>
                        </Form>
                                </Col>
                                <Col xs={6}>
                                </Col>
                            </Row>
                            <Row style={rowStyles}>
                                <Col xs={8}>
                                
                                </Col>
                                <Col xs={8}>
                                <Center><LabelGroup size={18} title={`${convertFromWei(fee)}`} label={'Estimated FEE'} /></Center>
                                </Col>
                                <Col xs={8}>
                                
                                </Col>
                            </Row>
                            <br></br>
                            <Center><Button onClick={LiquidateCDP} type={'primary'}>LIQUIDATE CDP</Button></Center>
                        </Col>
                    </Row> : <Alert type="error" message="Please Connect Your Wallet" banner />}
            
        </div>
    )
}

export default withRouter(Liquidate)