import React, { useState, useContext, useEffect } from 'react'
import { Context } from '../../context'
import { Tabs, Row, Col,Alert,Form,Input } from 'antd';
import {withRouter} from 'react-router-dom';
import { PlusCircleOutlined,LoadingOutlined, MinusCircleOutlined } from '@ant-design/icons';

import { BreadcrumbCombo, InputPaneStatic, PoolPane,PercentButtonRow } from '../components/common'
import '../../App.css';
import { Center, Button, LabelGroup,H2,Sublabel,H1 } from '../components/elements';
import { paneStyles, colStyles, rowStyles } from '../components/styles'

import { getStakeUnits, getPoolShare } from '../../math'
import { convertToWei, convertFromWei, bn, delay} from '../../utils'
import {  getWalletTokenData,getPoolData,getAccountStakeData,getTokenSymbol, getMAIContract,getTokenContract, MAI_ADDRESS, ETH_ADDRESS, getStakerData  } from '../../client/web3'

const { TabPane } = Tabs;

const Stake = (props) => {
    const context = useContext(Context)
    const [tokenStakeAddress, setTokenStakeAddress] = useState(null)
    const [retry, setRetry]= useState(0)
    const [account, setAccount] = useState(null)
    const [stakerData, setStakerData]= useState(null)
    const [mainPool, setMainPool] = useState({
        'symbol': '',
        'address': '',
        'price': 0,
        'volume': 0,
        'depth': 0,
        'balance': 0,
        'txCount': 0,
        'roi': 0,
        'units': 0
    })
    const [tokenStakeData, setTokenStakeData] = useState({
        address: '',
        symbol:'',
        balance: 0,
        input: 0,
    })
    const [baseStakeData, setBaseStakeData] = useState({
        address: '',
        symbol:'',
        balance: 0,
        input: 0,
    })
    const [unStakeData, setUnstakeData] = useState({
        address: '',
        input: 50
    })
    const [hideSubpane, setHideSubPane] = useState(true)
    const [stakeUnits, setStakeUnits] = useState(0)
    const [shareData, setShareData] = useState({
        base:0,
        token:0
    })

    useEffect(() => {
        getData()
       
    }, [context.walletData,retry])

    const getData = async () => {
        if(context.walletData && context.stakerData){
            const address = context.walletData?.address
            setAccount(address)
                const search = props.location.search; 
                const params = new URLSearchParams(search);
                const tokenAddress = params.get('token'); 
                setMainPool(getPoolData(tokenAddress, context.PoolsData))
                setTokenStakeAddress(tokenAddress)
                context.setContext({mainPool: getPoolData(tokenAddress, context.PoolsData ) })
                const inputTokenData = getWalletTokenData(tokenAddress, context.walletData)
                setTokenStakeData( getStakeData(inputTokenData.balance, tokenAddress))
                const inputBaseData =  getWalletTokenData(MAI_ADDRESS, context.walletData)
                setBaseStakeData( getStakeData(inputBaseData.balance, MAI_ADDRESS))
                setUnstakeData(getunStakeData(50, tokenAddress))
                const stake = {
                    token: inputTokenData.balance,
                    base: inputBaseData.balance
                }
                setStakerData(getAccountStakeData(tokenAddress,context.stakerData))
                setStakeUnits(0)
                const unitData =  {
                    stakeUnits:stakeUnits,
                    totalUnits:mainPool.units
                }
                const share = getPoolShare(unitData, mainPool)
                setShareData(0)
            
        }else{
            await delay(1000)
            setRetry(parseInt(retry)+1)
        }
    }


    const onTokenChange =  (e) => {
        const input = e.target.value
        setTokenStakeData( getStakeData(convertToWei(input), tokenStakeData.address))
        const stake = {
            token: convertToWei(input),
            base : baseStakeData.input
        }
        setStakeUnits(getStakeUnits(stake, context.mainPool))
    }

    // const changeTokenStake =  (token) => {
    //     const inputTokenData =  getWalletTokenData(token, context.walletData)
    //     setTokenStakeData( getStakeData(inputTokenData.balance, token))
    //     const stake = {
    //         token: inputTokenData.balance,
    //         base: baseStakeData.input
    //     }
    //     setStakeUnits(getStakeUnits(stake, context.mainPool))
    // }

    const changeStakeTokenAmount =  (amount) => {
        const finalAmt = (amount * tokenStakeData?.balance) / 100
        setTokenStakeData( getStakeData(finalAmt, tokenStakeData.address))
        const stake = {
            token: finalAmt,
            base: baseStakeData.input
        }
        setStakeUnits(getStakeUnits(stake, context.mainPool))
    }

    // const changeBaseStake = async (token) => {
    //     console.log("changing sell tokens not enabled yet")
    // }

    const onBaseChange = (e) => {
        const input = e.target.value
        setBaseStakeData( getStakeData(convertToWei(input), MAI_ADDRESS))
        const stake = {
            token: tokenStakeData.input,
            base: convertToWei(input)
        }
        setStakeUnits(getStakeUnits(stake, context.mainPool))
    }

    const changeStakeBaseAmount =  (amount) => {
        const finalAmt = (amount * baseStakeData?.balance) / 100
        setBaseStakeData( getStakeData(finalAmt, MAI_ADDRESS))
        const stake = {
            token: tokenStakeData.input,
            base: finalAmt
        }
        setStakeUnits(getStakeUnits(stake, context.mainPool))
    }

    const getStakeData =  (input, inputAddress) => {
        const balance = (getWalletTokenData(inputAddress, context.walletData)).balance
        const symbol = ( getTokenSymbol(inputAddress, context.walletData))
        const stakeData = {
            address: inputAddress,
            symbol:symbol,
            balance: balance,
            input: input,
        }
        return stakeData
    }
    const stakeAssets = async () => {
        const contract = getMAIContract()
        const contractToken = getTokenContract(tokenStakeAddress)
        const tokenAmount= tokenStakeData.input
        const baseAmount= baseStakeData.input
        //console.log(tokenStakeAddress,tokenAmount,baseAmount )
        if(tokenStakeAddress === ETH_ADDRESS){
            const tx = await contract.methods.addLiquidityToEtherPool(baseAmount).send({from: account, value:tokenAmount })
            context.setContext({ transaction: tx })
            props.history.push('/pools')
        }else{
            const tx = await contract.methods.addLiquidityToAssetPool(tokenStakeAddress, tokenAmount,baseAmount ).send({from: account})
            context.setContext({ transaction: tx })
            props.history.push('/pools')
        }
    }
    const getunStakeData = (input,tokenStakeAddress) => {
        const unStakeData = {
            address: tokenStakeAddress,
            input: input,
        }
        return unStakeData
    }

    const onUnStakeChange = (e) => {
        const input = e.target.value
        setUnstakeData(getunStakeData(input,tokenStakeAddress ))
        setStakeUnits((stakerData.units*input)/100)
    }
    const changeUnstakeAmount = (amount) => {
        setUnstakeData(getunStakeData(amount, tokenStakeAddress))
   
         setStakeUnits((stakerData.units*amount)/100)
        
    }

    const unStakeAssets = async () => {
        const contract = getMAIContract()
        const unStakeBP = unStakeData.input * 100
        const unStakePool = unStakeData.address
       // console.log(unStakeBP,unStakePool, account)
        const tx = await contract.methods.removeLiquidityPool(unStakePool, unStakeBP).send({from: account})
        context.setContext({ transaction: tx })
        props.history.push('/pools')
    
    }

    const getShare = () => {
        //console.log(mainPool.units, stakeUnits.toFixed() )
        const share = (bn(stakeUnits).div(bn(mainPool.units))).toFixed(2)
        return (share*100).toFixed(2)
    }
    

   const poolAttributes = {
        field1: {
            title: 'VOLUME',
            data: `${(convertFromWei(mainPool?.volume))}`
        },
        field2: {
            title: 'TX COUNT',
            data: mainPool?.txCount
        },
        field3: {
            title: 'PRICE',
            data: `$${convertFromWei((mainPool?.price))}`
        },
    }
    const refreshStyles = {
        fontSize: 40,
        paddingTop: 40,
        paddingBottom: 40
    }

    return (
        <div>
            <BreadcrumbCombo title={'STAKE'} parent={'POOLS'} link={'/pools'} child={'STAKE'}></BreadcrumbCombo>
            {context.stakerData ? 
            <div style={{ marginTop: '-10px' }}>
               <Center> <H1>{mainPool.symbol} Pool </H1></Center>
            <Center>
                {tokenStakeAddress ? 
                <PoolPane
                    symbol={mainPool?.symbol}
                    balance={mainPool?.balance}
                    pool={getPoolData(tokenStakeAddress, context.PoolsData)}
                    price={convertFromWei(context.maiPrice)}
                    data={poolAttributes}
                      hideSubpane={hideSubpane}
                     />
                     : <div style={refreshStyles}><Center><LoadingOutlined /></Center></div>}
                     </Center>
                     
            </div> : 
             <Alert type="error" message="Please Connect Your Wallet" banner />}
             {context.walletData ? <Tabs defaultActiveKey="1">
                <TabPane tab="STAKE" key="1">
                <Row style={paneStyles}>
                        <Col xs={24} style={colStyles}>
                            <Row >
                                <Col xs={3}>
                                </Col>
                                <Col xs={8} style={{ marginRight: 30 }}>
                                <Center><H2>1. Set {tokenStakeData.symbol} Amount</H2></Center>
                                    <InputPaneStatic
                                         paneData={tokenStakeData}
                                         tokenSymbol={tokenStakeData}
                                         onInputChange={onTokenChange}
                                         changeAmount={changeStakeTokenAmount}
                                    />
                                </Col>
                                <Col xs={2}>
                                </Col>
                                <Col xs={8} style={{ marginLeft: 30 }}>
                                <Center><H2>2. Set {baseStakeData.symbol} Amount</H2></Center>
                                    <InputPaneStatic
                                        paneData={baseStakeData}
                                        tokenSymbol={baseStakeData}
                                        onInputChange={onBaseChange}
                                        changeAmount={changeStakeBaseAmount} />

                                    <br />
                                </Col>

                                <Col xs={3}>
                                </Col>
                            </Row>
                            <Row style={rowStyles}>
                            <Col xs={2}></Col>
                                <Col xs={10}>
                                <Center><LabelGroup size={18} title={`${convertFromWei(stakeUnits.toFixed(0))}`} label={'ESTIMATED UNITS'} /></Center>
                                </Col>
                                <Col xs={10}>
                                <Center><LabelGroup size={18} title={`${getShare()}%`} label={'ESTIMATED SHARE'} /></Center>
                                </Col>
                                <Col xs={2}></Col>
                            </Row>
                            <br></br>
                            <Center><Button onClick={stakeAssets} type={'primary'}>STAKE IN POOL</Button></Center>

                        </Col>
                    </Row>
                </TabPane>
                <TabPane tab="WITHDRAW" key="2">
                <Row style={paneStyles}>
                        <Col xs={24} style={colStyles}>
                        <Center><H2>Set Withdraw Amount</H2></Center>
                            <Row>
                                <Col xs={8}>
                                </Col>
                                <Col xs={8}>
                                <Form>
                            
                                <Input size={'medium'} allowClear onChange={onUnStakeChange} placeholder={unStakeData.input} />
                        </Form>
                        <Sublabel>Default 50% </Sublabel>
                        <PercentButtonRow changeAmount={changeUnstakeAmount} />
                                </Col>
                                <Col xs={8}>
                                </Col>
                            </Row>
                            <Row style={rowStyles}>
                                <Col xs={5}></Col>
                                <Col xs={7}>
                                <Center><LabelGroup size={18} title={`${convertFromWei(stakeUnits.toFixed(0))}`} label={'ESTIMATED UNITS'} /></Center>
                                </Col>
                                <Col xs={7}>
                                <Center><LabelGroup size={18} title={`${getShare()}%`} label={'ESTIMATED POOL SHARE'} /></Center>
                                </Col>
                                <Col xs={5}></Col>
                            </Row>
                            <br></br>
                            <Center><Button onClick={unStakeAssets}type={'primary'}>WITHDRAW FROM POOL</Button></Center>
                        </Col>
                    </Row>
                </TabPane>
            </Tabs> : <div style={refreshStyles}></div>}
            
        </div>
    )
}

export default withRouter(Stake)

