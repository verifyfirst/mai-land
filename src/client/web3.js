import Web3 from 'web3'
import baseContract from '../artifacts/MAI.json'
import ERC20 from '../artifacts/ERC20.json'

export const MAI_ADDRESS = '0x3125f10CFd45e819dEFd0132f8Bb348b43C2f55a'
export const ETH_ADDRESS = '0x0000000000000000000000000000000000000000'

//================########  Web3 RPC Construction ##########================
export const getWeb3 = () => {
    return new Web3(Web3.givenProvider || "http://localhost:7545")
   //return new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/v3/75295055d9ac44588fafa61561fa45f8"));
}
export const getEtherscanURL = () => {
    return "https://etherscan.io/"
}
export const getAccountArray = async () => {
    var web3_ = getWeb3()
    var accounts = await web3_.eth.getAccounts()
    return accounts
}
export const getETHBalance = async (acc) => {
    var web3_ = getWeb3()
    var bal_ = await web3_.eth.getBalance(acc)
    return bal_
}
export const getMAIContract = () => {
    var web3_ = getWeb3()
    return new web3_.eth.Contract(baseContract.abi, MAI_ADDRESS)
}
export const getTokenContract = (address) => {
    var web3_ = getWeb3()
    return new web3_.eth.Contract(ERC20.abi, address)
}
export const getTokenSupply = async (address) =>{
    var contract = getTokenContract(address)
    return await contract.methods.totalSupply().call()
}


//================########  Header Data Collection  ##########================
export const getMAIPrice =async()=>{
let maiPrice =  await getMAIContract().methods.medianMAIValue().call()
return maiPrice
}
export const getAllCDPs = async() => {
    var CDPCount = await getMAIContract().methods.countOfCDPs().call()
    var CDPData = []
    //console.log(CDPCount)
    for(var i = 1; i <= CDPCount; i++){
        var allCDPs = await getMAIContract().methods.mapCDP_Data(i).call()
        var cdp = await getMAIContract().methods.mapAddress_MemberData(allCDPs.owner).call()
        var checkLiquidation = await getMAIContract().methods.checkLiquidationPoint(i).call()
         CDPData.push({
             'cdp': cdp,
             'debt': allCDPs.debt,
             'collateral': allCDPs.collateral,
             'address' : allCDPs.owner,
             'canLiquidate': checkLiquidation
            })
    }
    return CDPData
}
export const getPoolsArray = async () =>{
    let poolCount = await getMAIContract().methods.getExhangesCount().call()
    let pools = []
    for(let i = 0; i<poolCount; i++){
        let address = await getMAIContract().methods.exchanges(i).call()
        pools.push(
            address
        )
    }
    //console.log('poolArray',pools )
    return pools
}
export const getPoolsData = async (poolArray) => {
    let PoolData = []
    for(let i = 0; i < poolArray.length; i++){
         let poolAddress = poolArray[i]
         let getPools = await getMAIContract().methods.mapAsset_ExchangeData(poolAddress).call()
         let price = await getMAIContract().methods.calcValueInMAI(poolAddress).call()
         let stakersArray = await getStakeArray(poolAddress)
         if(poolAddress === ETH_ADDRESS){
           var symbol = 'ETH'
           var name = 'ethereum'
         }else{
            var symbol = await getTokenContract(poolAddress).methods.symbol().call()
            var name = await getTokenContract(poolAddress).methods.name().call()
         }
        PoolData.push({
            'symbol': symbol,
            'address': poolAddress,
            'name': name,
            'price':price,
            'depth': getPools.balanceMAI,
            'balance': getPools.balanceAsset,
            'units': getPools.poolUnits,
            'isAnchor': getPools.isAnchor,
            'stakers': stakersArray
            })
    }
    //console.log('poolData', PoolData)
    return PoolData
}
export const getWalletData = async (poolArray) => {
    let account = await getAccountArray()
    let address = account[0]
    let ethBalance = await getETHBalance(address)
    let maiBalance = await getMAIContract().methods.balanceOf(address).call()
   
    let tokens = []
    let accountData = {
        'address': address,
        'tokens': tokens
    }
    tokens.push({
        'symbol':'ETH',
        'name':'etherum',
        'balance': ethBalance,
        'address': ETH_ADDRESS
    },{
        'symbol':'MAI',
        'name':'mai',
        'balance': maiBalance,
        'address': MAI_ADDRESS
    }
)
    for(let i = 1; i < poolArray.length; i++){
        //console.log(arrayPools[i].poolAddress)
        let poolAddress = poolArray[i]
        let tokenSymbol = await getTokenContract(poolAddress).methods.symbol().call()
        let tokenName = await getTokenContract(poolAddress).methods.name().call()
        let tokenBalance = await getTokenContract(poolAddress).methods.balanceOf(address).call()
        let tokenAddress = poolAddress

        tokens.push({
            'symbol':tokenSymbol,
            'name':tokenName, 
            'balance':tokenBalance,
            'address': tokenAddress })
    }
    
    return accountData
}
export const getStakeArray = async (poolAddress)=>{
    let stakersCount = await getMAIContract().methods.calcStakerCount(poolAddress).call()
    let stakeArray = []
    for(let i = 0; i < stakersCount; i++){
        let stakerAddress = await getMAIContract().methods.calcStakerAddress(poolAddress, i).call()
        stakeArray.push(stakerAddress)
    }  
    //console.log('stakeArray',stakeArray )
return stakeArray  
}
export const getStakerData = async (address, poolsData) => {
    let memberPoolCount = await getMAIContract().methods.getMemberExchangeCount(address).call()
    let stakerData = []

    for(let i = 0; i < memberPoolCount; i++){
        const addressPool = await getMAIContract().methods.getStakerExchanges(address, i).call()
        const poolData = poolsData.find((item) => item.address === addressPool)
        const stakerUnits = await getMAIContract().methods.calcStakerUnits(addressPool, address).call()
        stakerData.push({
            'symbol':poolData.symbol,
            'name':poolData.name,
            'stakedPool': addressPool,
            'units':stakerUnits
        })
        }
       //console.log('stakerData', stakerData)
    return stakerData
}
export const getMemberData = async()=>{
    let memberCount = await getMAIContract().methods.getMembersCount().call()
   return memberCount
}

//================########  get Wallet Data  ##########================
export const getWalletTokenData = (address, walletData) => {
    const tokenData = walletData.tokens.find((item) => item.address === address)
    return (tokenData)
}
export const getTokenSymbol = (address, walletData) => {
    const token = walletData.tokens.find((item) => item.address === address)
    return (token.symbol) 
}
export const filterWalletByPools = (arrayPools, walletData) => {
    const pools = arrayPools.map((item) => item)
    const wallet = walletData.tokens.map((item) => item.address)
    const tokens = wallet.filter((item) => pools.includes(item) || item === MAI_ADDRESS)
    return tokens
}
export const filterWalletNotPools = (arrayPools, walletData) => {
    const pools = arrayPools.map((item) => item.address)
    const wallet = walletData.tokens.map((item) => item.address)
    const tokens = wallet.filter((item) => wallet.includes(item) && !pools.includes(item) )
    //console.log(tokens)
    return tokens
}
export const filterTokensByPoolSelection = (address, arrayPools, walletData) =>{
    const tokens =  filterWalletByPools(arrayPools,walletData)
    const tokensNotPool = tokens.filter((item) => item !== address)
    return tokensNotPool
}
export const filterTokensNotPoolSelection = (address, arrayPools, walletData) =>{
    const tokens =  filterWalletByPools(arrayPools,walletData)
    const tokensNotPool = tokens.filter((item) => item !== address)
    return tokensNotPool
}

//================########  get CDP Data  ##########================
export const getAccountCDP = (address, CDPData) =>{
    const cdp = CDPData.find((item) => item.address === address)
    return (cdp)
}
export const getUnSafeCDPs = (CDPData) =>{
    const unSafeCDP = CDPData.filter((item) => item.canLiquidate === true)
    return (unSafeCDP)
}
export const getSafeCDPs = (CDPData) =>{
    //console.log(CDPData)
    const SafeCDP = CDPData.filter((item) => item.canLiquidate === false)
    return (SafeCDP)
}
export const getCDPData = (cdpNumber, AllCDPData)=>{
    const CDPData = AllCDPData.find((item) => item.cdp === cdpNumber)
    return (CDPData)
}

//================########  get Pool Data  ##########================
export const getPoolData = (address, poolsData) =>{
    //console.log(address, poolsData)
    const pool = poolsData.find((item) => item.address === address)
    return (pool)
}
export const getPoolCount = (arrayPools) =>{
    var count = 0; var i;

for (i in arrayPools) {
    if (arrayPools.hasOwnProperty(i)) {
        count++;
    }
}

   return count
    
}
export const getAnchors = (poolsData) =>{
    const anchors = poolsData.filter((item) => item.isAnchor === true)
    return (anchors)
}


//================####### get Stake Data ###########=================
export const getAccountStakeData = (poolAddress, stakerData)=>{
    //console.log(poolAddress, stakerData)
    const stakeData = stakerData.find((item) => item.stakedPool === poolAddress)
    return (stakeData)

}


// let tokenSymbol = await getTokenContract('0xdD04AC682c9c3507088D5dD272A8f335C41e996e').methods.symbol().call()
// let tokenName = await getTokenContract('0xdD04AC682c9c3507088D5dD272A8f335C41e996e').methods.name().call()
// let tokenBalance = await getTokenContract('0xdD04AC682c9c3507088D5dD272A8f335C41e996e').methods.balanceOf(address).call()
// let tokenAddress = '0xdD04AC682c9c3507088D5dD272A8f335C41e996e'
// let tokenSymbol2 = await getTokenContract('0x8E1Df8FA70f7b6D80Eb79b9F3b1133f90150ca89').methods.symbol().call()
// let tokenName2 = await getTokenContract('0x8E1Df8FA70f7b6D80Eb79b9F3b1133f90150ca89').methods.name().call()
// let tokenBalance2 = await getTokenContract('0x8E1Df8FA70f7b6D80Eb79b9F3b1133f90150ca89').methods.balanceOf(address).call()
// let tokenAddress2 = '0x8E1Df8FA70f7b6D80Eb79b9F3b1133f90150ca89'
// ,{
//     'symbol':tokenSymbol,
//     'name':tokenName,
//     'balance': tokenBalance,
//     'address': tokenAddress
// },{
//     'symbol':tokenSymbol2,
//     'name':tokenName2,
//     'balance': tokenBalance2,
//     'address': tokenAddress2
// }
