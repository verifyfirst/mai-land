import React, { useState, useEffect, useContext } from 'react'
import { Context } from '../../context'

import Web3 from 'web3';
import { maiAddr, maiAbi, getEtherscanURL } from '../../client/web3.js'
import { convertFromWei, getBN } from '../utils'
import { Button as AntButton, Input, Form, Row, Col } from "antd"
import { LoadingOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Label, Text, Gap, Center } from '../Components'

export const OpenCDP = () => {

	const context = useContext(Context)
	const [account, setAccount] = useState(
		{ address: '', maiBalance: '', ethBalance: '' })
	const [loaded, setLoaded] = useState(null)
	const [openCDPFlag, setOpenCDPFlag] = useState(null)
	const [CDPFlag, SetCDPFlag] = useState(null)
	const [ethTx, setEthTx] = useState(null)
	const [walletFlag, setWalletFlag] = useState(null)
	const [ethAmount, setEthAmount] = useState(null)
	const [collaterisation, setCollaterisation] = useState(null)

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
		setEthAmount(context.accountData.ethBalance - 0.1)
	}

	const loadAccountData = async (contract_, address) => {
		const ethBalance = convertFromWei(await window.web3.eth.getBalance(address))
		const maiBalance = convertFromWei(await contract_.methods.balanceOf(address).call())
		const cdpExist = await contract_.methods.mapAddress_MemberData(address).call()
		if(!cdpExist == 0){
			SetCDPFlag('TRUE')
		}
		const accountData = {
			address: address,
			maiBalance: maiBalance,
			ethBalance: ethBalance,
		}
		setAccount(accountData)
		context.setContext({ 'accountData': accountData })
		setEthAmount(ethBalance - 0.1)
	}


	const onEthAmountChange = e => {
		setEthAmount(e.target.value)
	}
	const onRatioAmountChange = e => {
		setCollaterisation(e.target.value)
	}

	const getLink = (tx) => {
		console.log(getEtherscanURL().concat('tx/').concat(tx))
		return getEtherscanURL().concat('tx/').concat(tx)
	}

	const openCDP = async () => {
		const contract = new window.web3.eth.Contract(maiAbi(), maiAddr())
		const amount = ethAmount * 1000000000000000000
		const cltRatio = collaterisation
		const tx = await contract.methods.openCDP(cltRatio).send({ from: account.address, value: amount })
		setEthTx(tx.transactionHash)
		setLoaded(true)
		loadAccountData(contract, account.address)
		setOpenCDPFlag('TRUE')
	}

	const formItemLayout = {
		labelCol: {
			xs: { span: 14 },
			sm: { span: 8 },
		},
		wrapperCol: {
			xs: { span: 10 },
			sm: { span: 10 },
		},
	};

	return (
		<div>
			{!walletFlag &&
				<div>
					<AntButton onClick={connect}> Connect Wallet &lt;</AntButton>
					<Gap />
				</div>
			}
			{walletFlag &&
				<div>
					<br/>
					

					{/* {!CDPFlag && 
					<Form {...formItemLayout} >

					<Form.Item label="ETH Amount" >
						<Input size={'large'} allowClear onChange={onEthAmountChange} placeholder={account.ethBalance - 0.1} />
					</Form.Item>
					<Form.Item label="Collaterisation Percentage" >
						<Input size={'large'} allowClear onChange={onRatioAmountChange} placeholder={"Minimum 101% Collaterisation"} />
					</Form.Item>
					<Form.Item
						wrapperCol={{
							xs: { span: 24, offset: 0 },
							sm: { span: 16, offset: 8 },
						}}
					>
						<AntButton onClick={openCDP} type="dashed">Open CDP</AntButton>

					</Form.Item>
				</Form>
					}
                    {CDPFlag &&
						<div>no CDP opened</div>
					} */}
					{openCDPFlag &&
						<div>
							{!loaded &&
								<LoadingOutlined style={{ marginLeft: 20, fontSize: 15 }} />
							}
							{loaded &&
								<div>
									<a href={getLink(ethTx)} rel="noopener noreferrer" title="Transaction Link" target="_blank" style={{ fontSize: 12 }}> VIEW TRANSACTION </a>
								</div>
							}
						</div>
					}

				</div>
			}
		</div>
	)
}