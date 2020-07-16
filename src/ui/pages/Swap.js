import React, { useEffect, useState, useContext } from 'react'
import { Context } from '../../context'
import { Button, Row, Col,Alert } from 'antd';

import { BreadcrumbCombo, InputPane, PoolPane,InputPaneStatic } from '../components/common'
import '../../App.css';
import { Center, HR, Text,H2 } from '../components/elements';
import { paneStyles, colStyles } from '../components/styles'
import {formatBN, convertFromWei, convertToWei,  formatUSD,delay} from '../../utils'
import { getSwapOutput, getSwapSlip, getDoubleSwapOutput, getDoubleSwapSlip } from '../../math'
import { getPoolData, getMAIContract, getTokenSymbol, getWalletTokenData, filterTokensByPoolSelection,ETH_ADDRESS, MAI_ADDRESS, } from '../../client/web3'

const Swap = (props) => {
    const context = useContext(Context)
    const [retry, setRetry]= useState(0)
    const [account, setAccount] = useState(null)
    const [tokenList, setTokenList]= useState([])
    const [tokenAddress, setTokenAddress] = useState()
    const [mainPool, setMainPool] = useState({
        'symbol': 'ETH',
        'address': ETH_ADDRESS,
        'price': 0,
        'volume': 0,
        'depth': 0,
        'balance': 0,
        'txCount': 0,
        'roi': 0
    })
   
    const [buyData, setBuyData] = useState({
        address: MAI_ADDRESS,
        symbol:'MAI',
        balance: 0,
        input: 0,
        output: 0,
        outputSymbol: "XXX",
        slip: 0
    })
    const [sellData, setSellData] = useState({
        address: '',
        symbol:'',
        balance: 0,
        input: 0,
        output: 0,
        outputSymbol: "XXX",
        slip: 0
    })

    useEffect(() => {
        getData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [context.walletData, retry])

    const getData = async () => {
        if (context.walletData) {
        const address = context.walletData?.address
        const search = props.location.search; 
        const params = new URLSearchParams(search);
        const tokenAddress = params.get('token'); 
        setTokenList(filterTokensByPoolSelection(tokenAddress, context.arrayPools, context.walletData ))
        setMainPool(getPoolData(tokenAddress, context.PoolsData ))
        setTokenAddress(tokenAddress)
        setBuyData(getSwapData(0, MAI_ADDRESS, tokenAddress))
      
        setSellData(getSwapData(0, tokenAddress, MAI_ADDRESS))
        setAccount(address)
        }else{
            await delay(1000)
            setRetry(parseInt(retry)+1)
        }
    }

    const onBuyChange = async (e) => {
        // const amt = convertToWei(e.target.value) > buyData.balance ? buyData.balance : convertToWei(e.target.value)
        setBuyData(getSwapData(convertToWei(e.target.value), buyData.address, mainPool.address))
    }

    const changeBuyToken = async (token) => {
        const inputTokenData =  getWalletTokenData(token, context.walletData)
        setBuyData( getSwapData(inputTokenData.balance, token, mainPool?.address))
        // const outputTokenData =  getWalletTokenData(inputTokenData, context.walletData)
        // setSellData( getSwapData(outputTokenData.balance, inputTokenData, token))
    }

    const changeBuyAmount = async (amount) => {
        // const amt = amount > buyData.balance ? buyData.balance : amount
        const finalAmt = (amount * buyData?.balance) / 100
        setBuyData( getSwapData(finalAmt, buyData.address, ETH_ADDRESS))
    }

    // const changeSellToken = async (token) => {
    //     console.log("changing sell tokens not enabled yet")
    // }


    const onSellChange = async (e) => {
        setSellData(getSwapData(convertToWei(e.target.value), mainPool.address, MAI_ADDRESS))
    }

    const changeSellAmount = async (amount) => {
        const amt = amount > sellData.balance ? sellData.balance : amount
        const finalAmt = (amt * sellData?.balance) / 100
        setSellData( getSwapData(finalAmt, mainPool.address, MAI_ADDRESS))
    }

    const getSwapData = (input, inputAddress, outputAddress) => {
        const balance = (getWalletTokenData(inputAddress, context.walletData)).balance
        const inputSymbol = getTokenSymbol(inputAddress, context.walletData)
        const outputSymbol = getTokenSymbol(outputAddress, context.walletData)
        const mainPool_ = getPoolData(ETH_ADDRESS, context.PoolsData)
        
        var buyPool_
        if (inputAddress === MAI_ADDRESS) {
            buyPool_ =  getPoolData(ETH_ADDRESS, context.PoolsData)
           
        } else {
            buyPool_ =  getPoolData(inputAddress, context.PoolsData)
        }
        var sellPool_ 
        if(outputAddress === MAI_ADDRESS ){
            sellPool_ = getPoolData(ETH_ADDRESS, context.PoolsData)
        }else{
            sellPool_ = getPoolData(outputAddress, context.PoolsData)
        }
        var output; var slip
        if (inputAddress === MAI_ADDRESS && outputAddress === ETH_ADDRESS) {
            //single swap mai to ETH
            output = getSwapOutput(input, mainPool_, false)
            slip = getSwapSlip(input, mainPool_, false)
        }
        else if(inputAddress === MAI_ADDRESS && outputAddress !== ETH_ADDRESS){
            //single swap mai to token
            output = getSwapOutput(input, sellPool_, false)
            slip = getSwapSlip(input, sellPool_, false)
        }
        else if(inputAddress !== MAI_ADDRESS && inputAddress !== ETH_ADDRESS && outputAddress === MAI_ADDRESS){
            //single swap token to mai
            output = getSwapOutput(input, buyPool_, true)
            slip = getSwapSlip(input, buyPool_, true)
        }
        else if (inputAddress !== MAI_ADDRESS && outputAddress === ETH_ADDRESS) {
            // double token to ETH
            output = getDoubleSwapOutput(input, buyPool_, mainPool_)
            slip = getDoubleSwapSlip(input, buyPool_, mainPool_)
        } 
        else if (inputAddress === ETH_ADDRESS && outputAddress !== MAI_ADDRESS){
            // double eth to token
            output = getDoubleSwapOutput(input, mainPool_, sellPool_)
            slip = getDoubleSwapSlip(input, mainPool_, sellPool_)
        }
        else if (inputAddress === ETH_ADDRESS && outputAddress === MAI_ADDRESS){
            // double eth to mai
            
            output = getSwapOutput(input, mainPool_, true)
            slip = getSwapSlip(input, mainPool_, true)
        }
        else {
            // double token to token
            output = getDoubleSwapOutput(input, buyPool_, sellPool_)
            slip = getDoubleSwapSlip(input,buyPool_, sellPool_)
        }
        const swapData = {
            address: inputAddress,
            symbol: inputSymbol,
            balance: balance,
            input: input,
            output: formatBN(output),
            outputSymbol: outputSymbol,
            slip: slip
        }
        return swapData
    }
 
    const Buy = async ()=>{
        const contract = getMAIContract()
        const addressFrom = buyData.address
        const tokenTo = mainPool.address
        const input = (buyData.input).toFixed()
       // console.log(addressFrom, tokenTo, input)
       if(addressFrom === ETH_ADDRESS){
        const tx = await contract.methods.swapTokenToToken(addressFrom,tokenTo, input).send({ from: account, value:input})
        context.setContext({ transaction: tx })
       }else{
        const tx = await contract.methods.swapTokenToToken(addressFrom,tokenTo, input).send({ from: account})
        context.setContext({ transaction: tx })
       }
        
    }
    const Sell = async ()=>{
        const contract = getMAIContract()
        const addressFrom = mainPool.address
        const tokenTo = MAI_ADDRESS
        const input = (sellData.input).toFixed() 
     //console.log(addressFrom, tokenTo, input)
     if(addressFrom === ETH_ADDRESS){
        const tx = await contract.methods.swapTokenToToken(addressFrom,tokenTo, input).send({ from: account, value:input})
        context.setContext({ transaction: tx })
       }else{
        const tx = await contract.methods.swapTokenToToken(addressFrom,tokenTo, input).send({ from: account})
        context.setContext({ transaction: tx })
       }
    }

  
    const poolAttributes = {
        field1: {
            title: 'VOLUME',
            data: `${formatUSD(convertFromWei(mainPool?.volume))}`
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

    return (
        <div>
            <BreadcrumbCombo title={'SWAP'} parent={'POOLS'} link={'/pools'} child={'SWAP'}></BreadcrumbCombo>
            {context.walletData ? 
            <div style={{ marginTop: '-10px' }}>
                {tokenAddress ? 
                <Center><PoolPane
                    pool={getPoolData(tokenAddress, context.PoolsData)}
                    price={convertFromWei(context.maiPrice)}
                    symbol={mainPool?.symbol}
                    balance={mainPool?.balance}
                    data={poolAttributes} /></Center>
                    : <div></div> }
           </div> : <Alert type="error" message="Please Connect Your Wallet" banner />}

            <HR></HR>
            <br />
            {context.walletData ? 
            <Row style={paneStyles}>
                <Col xs={24} style={colStyles}>
                    <Row >
                        <Col xs={2}>
                        </Col>
                        <Col xs={9} style={{ marginRight: 30 }}>
                        <Center><H2> Buy {mainPool?.symbol} </H2></Center>
                            <InputPane
                                //mainPool={mainPool}
                                tokenList={tokenList}
                                paneData={buyData}
                                onInputChange={onBuyChange}
                                changeToken={changeBuyToken}
                                changeAmount={changeBuyAmount}
                            />
                            <Col xs= {24} style={{marginLeft:10}}>
                            <Text >Output: {convertFromWei(buyData.output)} ({buyData.outputSymbol})</Text>
                            <br />
                            <Text>Slip: {((buyData.slip) * 100).toFixed(2)}%</Text>
                            </Col>
                            <br /><br />
                            <Center><Button type={'primary'} onClick={Buy} >BUY {mainPool?.symbol}</Button></Center>
                        </Col>
                        <Col xs={9} style={{ marginLeft: 30 }}>
                        <Center><H2> Sell {mainPool?.symbol} </H2></Center>
                            <InputPaneStatic
                                tokenSymbol={mainPool}
                                paneData={sellData}
                                onInputChange={onSellChange}
                                changeAmount={changeSellAmount} />
                                <Col xs= {24} style={{marginLeft:10}}>
                            <Text>Output: {convertFromWei(sellData.output)} ({sellData.outputSymbol})</Text>
                            <br />
                            <Text>Slip: {((sellData.slip) * 100).toFixed(2)}%</Text>
                            </Col>
                            <br /><br />
                            <Center><Button type={'primary'} onClick={Sell} danger>SELL {mainPool?.symbol}</Button></Center>
                        </Col>

                        <Col xs={2}>
                        </Col>
                    </Row>
                </Col>
            </Row>
        : <div></div> }
             </div>
    )
}

export default Swap