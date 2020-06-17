import Web3 from 'web3'
import MAI from '../artifacts/MAI.json'

export const maiAbi = () => {
	return MAI.abi
}
export const maiAddr = () => {
 return '0x689398Ef4B3826876fd6E088506A99A7c15BfDDA'
}

export const getWeb3 = () => {
    return new Web3(Web3.givenProvider || "http://localhost:7545") 
}
function convertFromWei(number) {
    return number / 1000000000000000000
}
export const getEtherscanURL = () => {
        return "https://etherscan.io/"
}
export const getAccounts = async (i) => {
    var web3_ = getWeb3()
    var accounts = await web3_.eth.getAccounts()
    return accounts[i]
}

export const getBalance = async (acc) => {
    var bal_ = await getWeb3().eth.getBalance(acc)
    return bal_
}

export const maiContract = () => {
    var abi_ = maiAbi()
    var addr_ = maiAddr() 
    var web3_ = getWeb3()
    return new web3_.eth.Contract(abi_, addr_)
}

export const getMAIBalance = async (acc) => {
    var bal_ = await maiContract().methods.balanceOf(acc).call()
    
    return bal_
}