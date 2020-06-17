import React, { useState, useEffect, useContext } from 'react'
import { Context } from '../../context'

import Web3 from 'web3';
import { maiAddr, maiAbi, getEtherscanURL } from '../../client/web3.js'
import { convertFromWei, getBN, prettify} from '../utils'
import { Button as AntButton, Input, Form, Row, Col, Card, Divider, Title } from "antd"
import { LoadingOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Label, Text, Gap, Center, H2 } from '../Components'

export const CDPAccountDetails = () => {

    const context = useContext(Context)
    const [account, setAccount] = useState(
        { address: '', maiBalance: '', ethBalance: '', cdp: '', })
    const [walletFlag, setWalletFlag] = useState(null)
    const [cdpDetails, setCDPData] = useState ({debt: '', collateral:''})


    useEffect(() => {
        connect()
    }, [])

    const connect = async () => {
        setWalletFlag('TRUE')
        ethEnabled()
        if (!ethEnabled()) {
        } else {
            var accounts = await window.web3.eth.getAccounts()
            const address = accounts[0]
            const contract = new window.web3.eth.Contract(maiAbi(), maiAddr())
            context.accountData ? getAccountData() : loadAccountData(contract, address)
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
        setAccount(context.accountData)
    }

    const loadAccountData = async (contract_, address) => {
        var cdpExist = 'FALSE'
        const ethBalance = convertFromWei(await window.web3.eth.getBalance(address))
        const maiBalance = convertFromWei(await contract_.methods.balanceOf(address).call())
        const cdp = await contract_.methods.mapAddress_MemberData(address).call()
        
        if(!cdp == 0 ){
            cdpExist = 'TRUE'
            const mapCDP = await contract_.methods.mapCDP_Data(cdp).call()
            const debt = convertFromWei(mapCDP.debt)
            const collateral = convertFromWei(mapCDP.collateral)
            const cdpData ={
                debt: debt,
                collateral: collateral
            }
            setCDPData(cdpData)
            context.setContext({ 'cdpData': cdpData })
        }
        const accountData = {
            address: address,
            maiBalance: maiBalance,
            ethBalance: ethBalance,
            cdp: cdpExist
        }
        
        setAccount(accountData)
        context.setContext({ 'accountData': accountData })
    }

    const accountStyles = {
        width : 500,
        marginLeft: '40px'
    }

    return (
        <div>
            {!walletFlag &&
                <div>
                    <AntButton onClick={connect}> Connect Wallet &lt;</AntButton>
                </div>
            }
            {walletFlag &&

                <div>
                    <Gap />
                 
                        <Card style={accountStyles}>
                            <h4>Balances</h4>
                            <Text> ETH Balance: {account.ethBalance} </Text>
                            <br />
                            <Text> MAI Balance: {prettify(account.maiBalance)} </Text>
                            <br />

                            </Card>
                            <Card style={accountStyles}>
                            {account.cdp && 
                            <div>
                            <h4>CDP Details</h4>
                            <Text> Debt : {prettify(cdpDetails.debt)} </Text>
                            <br />
                            <Text> Collateral : {prettify(cdpDetails.collateral)} </Text>
                            <br />
                            </div>
                            }
                            
                           
                        </Card>

               

                </div>
            }
        </div>
    )
}