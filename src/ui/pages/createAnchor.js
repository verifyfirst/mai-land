import React, { useState, useEffect, useContext } from 'react'
import { withRouter } from 'react-router-dom'
import { Row, Col, Alert } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Context } from '../../context'
import { BreadcrumbCombo, InputPaneStatic, CoinRow, InputCheck } from '../components/common'
import { Center, Button, LabelGroup } from '../components/elements'
import { paneStyles, rowStyles, colStyles } from '../components/styles'

import { getStakeUnits } from '../../math'
import { filterWalletNotPools, getTokenSymbol, getTokenSupply, getWalletTokenData, ETH_ADDRESS, MAI_ADDRESS, getMAIContract, getTokenContract } from '../../client/web3'

import { convertFromWei, convertToWei, } from '../../utils'


const CreateAnchor = (props) => {
    const context = useContext(Context)
    const [tokenList, setTokenList] = useState([])
    const [checkFlag, setCheckFlag] = useState(false)
    const [tokenData, setTokenData] = useState(null)
    const [visible, setVisible] = useState(false);
    const [connected, setConnected] = useState(false)
 
    const [tokenStakeData, setTokenStakeData] = useState({
        address: '',
        symbol: '',
        balance: 0,
        input: 0,
    })
    const [baseStakeData, setBaseStake2Data] = useState({
        address: '',
        symbol: '',
        balance: 0,
        input: 0,
    })
    const [selectAddress, setCheckToken] = useState({
        address: ETH_ADDRESS
    })

    const [account, setAccount] = useState(null)

    useEffect(() => {
        getData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [context.walletData])
    const getData = () => {
        if (context.walletData) {
            const tokens = filterWalletNotPools(context.arrayPools, context.walletData)
            setTokenList(tokens)
            
            const baseData = getWalletTokenData(MAI_ADDRESS, context.walletData)
            setBaseStake2Data(getStakeData(baseData.balance, MAI_ADDRESS))
            setConnected(true)
        } else {
            setConnected(false)
        }
    }
    const alert = () => {
        setVisible(true)
    }
    const checkToken = () => {
        const address = context.walletData?.address
        setAccount(address)
        setTokenData(getWalletTokenData(selectAddress.address, context.walletData))
        const token = getWalletTokenData(selectAddress.address, context.walletData)
        console.log(token.balance)
        setTokenStakeData(getStakeData(token.balance, selectAddress.address))
        setCheckFlag(true)
    }
    const onCheckChange = (input) => {
        setCheckToken(getCheckData(input))

    }

    const getPoolData = (depth, balance) => {
        const poolState = {
            depth: depth,
            balance: balance
        }
        return poolState
    }
    const getCheckData = (input) => {
        const checkData = {
            address: input,
        }
        return checkData
    }
    const onTokenChange = (e) => {
        const input = e.target.value
        setTokenStakeData(getStakeData(convertToWei(input), tokenStakeData.address))
        const stake = {
            token: convertToWei(input),
            base: baseStakeData.input
        }

    }
    // const changeTokenStake = (token) => {
    //     const inputTokenData =  getWalletTokenData(token, context.walletData)
    //     setTokenStakeData( getStakeData(inputTokenData.balance, token))
    //     const stake = {
    //         token: inputTokenData.balance,
    //         base: baseStakeData.input
    //     }
    //     setStakeUnits(getStakeUnits(stake, newPool))
    // }
    const changeStakeTokenAmount = (amount) => {
        const finalAmt = (amount * tokenStakeData?.balance) / 100
        console.log(finalAmt)
        setTokenStakeData(getStakeData(finalAmt, tokenStakeData.address))
        const stake = {
            token: finalAmt,
            base: baseStakeData.input
        }
        
    }
    // const changeBaseStake = (token) => {
    //     console.log("changing sell tokens not enabled yet")
    // }
    const onBaseChange = (e) => {
        const input = e.target.value
        setBaseStake2Data(getStakeData(convertToWei(input), MAI_ADDRESS))
        const stake = {
            token: tokenStakeData.input,
            base: convertToWei(input)
        }
        
    }
    const changeStakeBaseAmount = (amount) => {
        const finalAmt = (amount * baseStakeData?.balance) / 100
        console.log(finalAmt)
        setBaseStake2Data(getStakeData(finalAmt, MAI_ADDRESS))
        const stake = {
            token: tokenStakeData.input,
            base: finalAmt
        }
        
    }
    const getStakeData = (input, inputAddress) => {
        const balance = (getWalletTokenData(inputAddress, context.walletData)).balance
        const symbol = (getTokenSymbol(inputAddress, context.walletData))
        const stakeData = {
            address: inputAddress,
            symbol: symbol,
            balance: balance,
            input: input,
        }
        return stakeData
    }

    // const getShare = () => {
    //     const share = (bn(stakeUnits).div(bn(mainPool.units))).toFixed(2)
    //     return (share*100).toFixed(2)
    // }

    const getValueOfShare = () => {
        return '$1234.54'
    }
    // (address asset, uint amountAsset, uint amountMAI) public payable returns (bool success){
    const createAnchorPool = async () => {
        const contract = getMAIContract()
        const contractToken = getTokenContract(selectAddress.address)
        const tokenAddress = selectAddress.address
        const BaseAmount = baseStakeData.input
        const TokenAmount = tokenStakeData.input
        const TokenApprove = await getTokenSupply(selectAddress.address)
        await contractToken.methods.approve(MAI_ADDRESS, TokenApprove).send({ from: account })
        const tx = await contract.methods.addAnchor(tokenAddress, TokenAmount, BaseAmount).send({ from: account })
        context.setContext({ transaction: tx })
        props.history.push('/anchor')
    }

    return (
        <div>
            <BreadcrumbCombo title={'CREATE ANCHOR'} parent={'ANCHOR'} link={'/anchor'} child={'CREATE'}></BreadcrumbCombo>
            <br />
            <Row style={rowStyles}>
                <Col xs={12}>
                    <InputCheck
                        tokenList={tokenList}
                        paneData={selectAddress}
                        onInputChange={onCheckChange}
                    />
                </Col>
                {!connected &&
                    <Row>
                        <Button icon={<QuestionCircleOutlined />}
                            onClick={alert}
                            type="outline">CHECK</Button>
                        {visible &&
                            <Alert type="error" message="Please Connect Your Wallet" banner />
                        }
                    </Row>
                }
                {connected &&
                    <Col xs={4}>
                        <Button icon={<QuestionCircleOutlined />}
                            onClick={checkToken}
                            type="outline">CHECK</Button>

                    </Col>
                }
                {checkFlag &&
                    <Col xs={8}>
                        <CoinRow
                            symbol={tokenData.symbol}
                            name={tokenData.name}
                            balance={tokenData.balance}
                            size={40} />
                    </Col>
                }
            </Row>
            {checkFlag &&
                <div>
                    <Row style={paneStyles}>
                        <Col xs={24} style={colStyles}>
                            <Row >
                                <Col xs={12}>
                                    <InputPaneStatic
                                        tokenSymbol={tokenStakeData}
                                        paneData={tokenStakeData}
                                        onInputChange={onTokenChange}
                                        changeAmount={changeStakeTokenAmount}
                                    />
                                </Col>
                                <Col xs={12}>
                                    <InputPaneStatic
                                        tokenSymbol={baseStakeData}
                                        paneData={baseStakeData}
                                        onInputChange={onBaseChange}
                                        changeAmount={changeStakeBaseAmount} />
                                </Col>

                            </Row>
                            {/* <Row style={rowStyles}>
                                <Col xs={8}>
                                    <Center><LabelGroup size={18} title={`${convertFromWei(stakeUnits.toFixed(0))}`} label={'ESTIMATED UNITS'} /></Center>
                                    
                                </Col>
                                <Col xs={8}>
                                    <Center><LabelGroup size={18} title={`100%`} label={'SHARE'} /></Center>
                                </Col>
                                <Col xs={8}>
                                    <Center><LabelGroup size={18} title={`${getValueOfShare()}`} label={'STAKED VALUE'} /></Center>
                                </Col>
                            </Row> */}
                            <br></br>
                            <Center><Button type={'primary'} onClick={createAnchorPool}>CREATE ANCHOR POOL</Button></Center>
                        </Col>
                    </Row>
                </div>
            }
        </div>
    )
}

export default withRouter(CreateAnchor)