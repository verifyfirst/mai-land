import React, {useState, useEffect} from 'react'
import './App.css'

import { MAI_ABI, MAI_ADDR } from './contract-abi'
import Web3 from 'web3'

const Mai_land = (props) => {

  const [contract, setContract] = useState(null)
  const [account, setAccount] = useState(null)
  const [accounts, setAccounts] = useState ({account:''})
  const [balanceOf, setBalanceOf]=useState({balanceOf:''})
  const [tokenData, setTokenData] = useState({name:'', symbol:'', totalSupply:'', decimals:''})
  const [transfer, setTransferFrom] = useState('')
  const [toAddress, setToAddress] = useState('')
  const [sendValue, setSendValue] = useState('')

  const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'));
  const contract_ = new web3.eth.Contract(MAI_ABI, MAI_ADDR)

  useEffect(() => {
      const loadBlockchainData = async () => {
      setContract(contract_)
      const accounts = await web3.eth.getAccounts()
      setAccounts({
        account1:accounts[1],
        account2:accounts[2]
      })

      setAccount(accounts[0])
      const name_ = await contract_.methods.name().call()
      const symbol_ = await contract_.methods.symbol().call()
      const totalSupply_ = await contract_.methods.totalSupply().call()
      const decimals_ = await contract_.methods.decimals().call()

      updateBalances()

      setTokenData({
        name: name_,
        symbol:symbol_,
        totalSupply: convertToNumber(totalSupply_),
        decimals:decimals_
      })
    }

    loadBlockchainData()

  }, [])

  const transferFrom = async e => {
      e.preventDefault();
      const accounts = await window.ethereum.enable();
      const account = accounts[0];
      const gas = await contract_.methods.transfer(toAddress, sendValue).estimateGas();
      const transfer = await contract_.methods.transfer(toAddress, sendValue).send({ from: account, gas });
      console.log(transfer);
      updateBalances()
  };

  function convertToNumber(number){
    var num = number / 1
    return num
  }

  const updateBalances = async () => {

    const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'));
    const contract_ = new web3.eth.Contract(MAI_ABI, MAI_ADDR)
    const accounts = await web3.eth.getAccounts()

    const bal1 = await contract_.methods.balanceOf(accounts[1]).call()
    const bal2 = await contract_.methods.balanceOf(accounts[2]).call()

    setBalanceOf({
      balanceOf1:bal1,
      balanceOf2:bal2
    })

  }

  return (

    <div className="MAI App">
      <header className="Header">
        <p>Your account: {accounts.account2}</p>
        <p>Token Name: {tokenData.name}</p>
        <p>Token Symbol: {tokenData.symbol}</p>
        <p>Token Supply: {tokenData.totalSupply.toLocaleString()}</p>
        <p>Token Decimals: {tokenData.decimals}</p>
        <h3>Available Accounts:</h3>
        <ul>
        <li><p>{accounts.account1}</p><p>Mai:{balanceOf.balanceOf1}</p></li>
        <li><p>{accounts.account2}</p><p>Mai:{balanceOf.balanceOf2}</p></li>
        </ul>
        <form onSubmit={transferFrom}>
        <label>
        <input type="text" name="to" value={toAddress} placeholder= "To Address"onChange={e => setToAddress(e.target.value)}/>
        <input type="number" name="value" value={sendValue} placeholder= "Amount"onChange={e => setSendValue(e.target.value)}/>
        </label>
        <input type="submit" value="Send" />
        </form>
      </header>
    </div>
  );

}

export default Mai_land
