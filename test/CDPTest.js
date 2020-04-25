var Mai = artifacts.require("./Mai.sol");
const assert = require("chai").assert;
const truffleAssert = require('truffle-assertions');
var BigNumber = require('bignumber.js');

var coin; var maiAddress
var acc0; var acc1; var acc2; var acc3;

var _1 = 1 * 10 ** 18; // 1 ETH
const _1BN = new BigNumber(_1)
var _dot01 = new BigNumber(1 * 10 ** 16)
const ethAddr = "0x0000000000000000000000000000000000000000"
const usdAddr = "0xA29713944a53ed8A220a4c96cA62EFfaa23BE812"
const etherPool = {"asset":(10*_1).toString(), "mai": (1500*_1).toString()}
const usdPool = {"asset": (1000*_1).toString(), "mai": (1100*_1).toString()}

contract('Mai', function (accounts) {

  constructor(accounts)
  //checkMath()
  //checkPrices()
  // openCDP(_1BN, acc0)
  // openCDP(_1BN, acc0)
  openCDP(_1BN, 99, acc0)
  // closeCDP(acc0, 5000)
  // openCDP(_1BN, acc0)
  // addCollateralToCDP(acc0)
  closeCDP(acc0, 10000)
})

function BN2Int(BN) { return +(new BigNumber(BN)).toFixed() }
function BN2Str(BN) { return (new BigNumber(BN)).toFixed() }
function int2BN(int) { return (new BigNumber(int)) }
function int2Str(int) { return ((int).toString()) }

function constructor(accounts) {

  acc0 = accounts[0]; acc1 = accounts[1]; acc2 = accounts[2]; acc3 = accounts[3]

  it("constructor events", async () => {
    let Mai = artifacts.require("Mai.sol");
    coin = await Mai.new();
    maiAddress = coin.address;
    console.log('CoinAddress: %s', maiAddress)
    console.log('Acc0: %s', acc0)
    const etherPool_asset = BN2Int((await coin.mapTokenExchangeData(ethAddr)).assetBalance);
    assert.equal(etherPool_asset, etherPool.asset)
    const etherPool_mai= BN2Int((await coin.mapTokenExchangeData(ethAddr)).maiBalance);
    assert.equal(etherPool_mai, etherPool.mai)
    const usdPool_asset = BN2Str((await coin.mapTokenExchangeData(usdAddr)).assetBalance);
    assert.equal(usdPool_asset, BN2Str(usdPool.asset))
    const usdPool_mai= BN2Str((await coin.mapTokenExchangeData(usdAddr)).maiBalance);
    assert.equal(usdPool_mai, BN2Str(usdPool.mai))
  });

}


function checkMath() {
  it("Checks core math", async () => {
    const output = BN2Int(await coin.getCLPSwap(int2Str(_1), int2Str(etherPool.asset), int2Str(etherPool.mai)))
    assert.equal(output, 37500000000000000000,"swap is correct")
    const fee = BN2Int(await coin.getCLPFee(int2Str(_1), int2Str(etherPool.asset), int2Str(etherPool.mai)))
    assert.equal(fee, 37500000000000000000,"fee is correct")
    const liquidation = BN2Int(await coin.getCLPLiquidation(int2Str(_dot01), int2Str(etherPool.asset), int2Str(etherPool.mai)))
    assert.equal(liquidation, 1455739633369277400,"liquidation is correct")
  })
}

function checkPrices() {
  it("Checks core logic", async () => {

    const ethValueInMai = BN2Int(await coin.getValueInMai(ethAddr))
    const usdValueInMai = BN2Int(await coin.getValueInMai(usdAddr))
    assert.equal(ethValueInMai, getValueInMai(ethAddr),"eth correct")
    assert.equal(usdValueInMai, getValueInMai(usdAddr),"usd correct")

    const maiValueInUsd = BN2Int(await coin.getValueInAsset(usdAddr))
    assert.equal(maiValueInUsd, getValueInAsset(usdAddr),"mai is correct")

    const ethPriceInUSD = BN2Int(await coin.getEtherPriceInUSD(int2Str(_1)))
    assert.equal(ethPriceInUSD, getEtherPriceInUSD(_1),"ether is correct")

    const ethPPInMAI = BN2Int(await coin.getEtherPPinMAI(int2Str(_1)))
    assert.equal(ethPPInMAI, getEtherPPinMAI(_1), "mai is correct")
    
    const maiPPInUSD = BN2Int(await coin.getMAIPPInUSD(int2Str(ethPPInMAI)))
    assert.equal(maiPPInUSD, getMAIPPInUSD(ethPPInMAI), "mai is correct")

    // const liquidationPoint = BN2Int(await coin.checkLiquidationPoint(int2Str(ethPPInMAI)))
    // assert.equal(liquidationPoint, 31880207704383530000,"mai is correct")
    // console.log(liquidationPoint)

  })
}


function openCDP(eth, _ratio, _acc) {

  var existingDebt; var existingCollateral; var CDP;
  var newDebt; var newCollateral;

  it("Allows opening CDP", async () => {

    CDP = BN2Int(await coin.mapAddressMemberData(_acc))
    existingDebt = BN2Int((await coin.mapCDPData(CDP)).debt)
    existingCollateral = new BigNumber((await coin.mapCDPData(CDP)).collateral)

    newCollateral = eth

    const ethPPInMAI = BN2Str(await coin.getEtherPPinMAI(int2Str(eth)))
    //console.log(logType(ethPPInMAI))

    const ethPP = getEtherPPinMAI(int2Str(eth)).toString()
    //console.log(logType(ethPP))
    
    assertLog(ethPPInMAI, ethPP, "etherPP is correct")
    //console.log(ethPPInMAI, ethPP)

    const mintAmount = (BN2Int(ethPPInMAI) * 100) / (_ratio);
    //console.log("mintAmount", mintAmount)
    newDebt = mintAmount
 
    var tx1;
    if (_ratio === 150) {
      tx1 = await coin.send(eth, { from: _acc });
    } else {
      tx1 = await coin.openCDP(_ratio, { from: _acc , value:eth});
    }
    
    //console.log(tx1.receipt)
    assert.equal(tx1.logs.length, 3, "one event was triggered");
    assert.equal(tx1.logs[0].event, "Transfer", "Transfer was called");
    assert.equal(tx1.logs[0].args.to, maiAddress, "To is correct");
    assertLog(tx1.logs[0].args.amount, int2Str(newDebt), "newDebt is correct")
    assert.equal(tx1.logs[1].event, "Transfer", "Transfer was called");
    assert.equal(tx1.logs[1].args.to, _acc, "To is correct");
    assertLog(tx1.logs[1].args.amount, int2Str(newDebt), "newDebt is correct")
    assert.equal(tx1.logs[2].event, "NewCDP", "New CDP event was called");
    assertLog(tx1.logs[2].args.debtIssued, int2Str(newDebt), "newDebt is correct")
    assert.equal(BN2Int(tx1.logs[2].args.collateralHeld), int2Str(newCollateral), "Collateral is correct");
  });

  //test balance of account 0 for mai has increased
  it("tests balances of MAI", async () => {
    let maiAddressBal = BN2Int(await coin.balanceOf(maiAddress))
    assert.equal(maiAddressBal, 0, "correct maiAddressBal bal");

    let acc0Bal = BN2Int(await coin.balanceOf(_acc))
    assertLog(acc0Bal, (newDebt + +existingDebt), "correct _acc bal");

    let maiSupply = BN2Int(await coin.totalSupply())
    assertLog(maiSupply, (newDebt + +existingDebt), "correct new supply")

    //console.log(maiAddressBal, acc0Bal, maiSupply)

  })

  // Test mappings
  it("Tests mappings", async () => {
    CDP = BN2Int(await coin.mapAddressMemberData(_acc))

    let countOfCDPs = await coin.countOfCDPs()
    assert.equal(countOfCDPs, CDP, "correct countOfCDPs");

    let _CDP = BN2Int(await coin.mapAddressMemberData(_acc))
    assert.equal(_CDP, CDP, "correct mapAddressMemberData");

    let mapCDPData = await coin.mapCDPData(_CDP);
    assertLog(mapCDPData.collateral, +newCollateral + +existingCollateral, "CDP Collateral")
    assertLog(mapCDPData.debt, newDebt + +existingDebt, "CDP Debt");
    assert.equal(mapCDPData.owner, _acc, "correct owner");
  })
}

function getValueInMai(token) {
  var result
  if (token == ethAddr) {
    const etherBal = new BigNumber(etherPool.asset)
    const maiBal = new BigNumber(etherPool.mai)
    result = (_1BN.times(maiBal)).div(etherBal) 
  } else {
    const usdBal = new BigNumber(usdPool.asset)
    const maiBal = new BigNumber(usdPool.mai)
    result = (_1BN.times(maiBal)).div(usdBal) 
  }
  return result.toFixed()
}

function getValueInAsset(token) {
  const usdBal = usdPool.asset
  const maiBal = usdPool.mai
  return ((_1BN.times(usdBal)).div(maiBal)).toFixed()
}

function getEtherPriceInUSD(amount) {
  const _amount = new BigNumber(amount)
  const etherPriceInMai = new BigNumber(getValueInMai(ethAddr))
  const maiPriceInUSD = new BigNumber(getValueInAsset(usdAddr))
  const ethPriceInUSD = (maiPriceInUSD.times(etherPriceInMai)).div(_1BN)
  return ((_amount.times(ethPriceInUSD)).div(_1BN)).toFixed()
}

function getEtherPPinMAI(amount){
  const etherBal = etherPool.asset
  const maiBal = etherPool.mai

  const outputMai = _getCLPSwap(amount, etherBal, maiBal);
  //console.log("outputMai", outputMai)
  return outputMai;
}

function getMAIPPInUSD(amount){
  const usdBal = usdPool.asset
  const maiBal = usdPool.mai

  const outputUSD = _getCLPSwap(amount.toString(), maiBal, usdBal);
  //console.log(maiBal, usdBal, outputUSD)
  return outputUSD;
}

function _getCLPSwap(x, X, Y){
  // y = (x * Y * X)/(x + X)^2
  const _x = new int2BN(x)
  const _X = new int2BN(X)
  const _Y = new int2BN(Y)
  // assume BN
  const numerator = _x.times(_Y).times(_X)
  const denominator = (_x.plus(_X)).times((_x.plus(_X)))
  const _y = numerator.div(denominator)
  const y = BN2Int(_y);
  // const numerator = x * Y * X;
  // const denominator = (x + X) * (x + X );
  // const y = numerator / denominator;
  //console.log("clpswap", _x, _X, _Y, numerator, denominator, y)
  return y;
}

function assertLog(number1, number2, test) {
  console.log(BN2Int(number1), BN2Int(number2), test)
}

function logType(thing) {
  console.log("%s type", thing, typeof thing)
}

function closeCDP(_acc, _bp) {

  var debtRemain; var collateralRemain;
  var CDP;

  it("Allows closing CDP", async () => {

    let accEth1 = BN2Int(await web3.eth.getBalance(_acc))
    CDP = BN2Int(await coin.mapAddressMemberData(_acc))
    //console.log("CDP", CDP)
    let existingDebt = BN2Int((await coin.mapCDPData(CDP)).debt)
    //console.log("existingDebt", existingDebt)
    let existingCollateral = new BigNumber((await coin.mapCDPData(CDP)).collateral)

    let debtClosed = existingDebt * (_bp / 10000)
    let collateralReturned = existingCollateral * (_bp / 10000)

    debtRemain = existingDebt - debtClosed
    collateralRemain = existingCollateral - collateralReturned

    let tx1 = await coin.closeCDP(_bp, { from: _acc });
    assert.equal(tx1.logs.length, 4, "Three events was triggered");
    assert.equal(tx1.logs[0].event, "Approval", "Correct event");
    assert.equal(tx1.logs[1].event, "Transfer", "Correct event");
    assert.equal(tx1.logs[2].event, "Transfer", "Correct event");
    assert.equal(tx1.logs[3].event, "CloseCDP", "Correct event");

    assert.equal(tx1.logs[3].args.CDP, 1, "CDP is correct");
    assert.equal(tx1.logs[3].args.owner, _acc, "Owner is correct");
    assert.equal(BN2Int(tx1.logs[3].args.debtPaid), debtClosed, "Debt is correct");
    assert.equal(BN2Int(tx1.logs[3].args.etherReturned), collateralReturned, "Collateral is correct");

    let accBal = await coin.balanceOf(_acc);
    assert.equal(BN2Int(accBal), debtRemain, "correct acc0 bal");

    let maiSupply = await coin.totalSupply()
    assert.equal(maiSupply, debtRemain, "correct new supply")

    const tx = await web3.eth.getTransaction(tx1.tx);
    const gasCost = tx.gasPrice * tx1.receipt.gasUsed;
    //console.log(accEth1, etherReturned, gasCost)
    //console.log((accEth1 + etherReturned) - gasCost)

    let accEth2 = await web3.eth.getBalance(_acc)
    assertLog(accEth2, (+accEth1 + +BN2Int(existingCollateral) - gasCost), "gas test")

    let accEthMAI = await web3.eth.getBalance(maiAddress)
    assertLog(accEthMAI, collateralRemain, "ethaccBal")
  
  })

  // Test mappings
  it("Tests mappings", async () => {

    let mapCDPData = await coin.mapCDPData(CDP);
    assert.equal(mapCDPData.collateral, collateralRemain, "correct collateral");
    assert.equal(mapCDPData.debt, debtRemain, "correct debt");

  })
}

function addCollateralToCDP(_acc) {

  it("Allows adding to  CDP", async () => {
    let eth = _dot01

    let CDP = BN2Int(await coin.mapAddressMemberData(_acc))
    //console.log("CDP", CDP)
    let existingDebt = BN2Int((await coin.mapCDPData(CDP)).debt)
    //console.log("existingDebt", existingDebt)
    let existingCollateral = new BigNumber((await coin.mapCDPData(CDP)).collateral)
    

    //open CDP
    let tx1 = await coin.addCollateralToCDP({ from: _acc, to: maiAddress, value: eth});
    assert.equal(tx1.logs.length, 1, "one event was triggered");
    assert.equal(tx1.logs[0].event, "UpdateCDP", "UpdateCDP was called");
    assert.equal(tx1.logs[0].args.CDP, CDP, "CDP is correct");
    //assert.equal(BN2Int(tx1.logs[1].args.time), issuedMai, "amount is correct");
    assert.equal(tx1.logs[0].args.owner, _acc, "owner is correct");
    assert.equal(BN2Int(tx1.logs[0].args.debtAdded), 0, "debt is correct");
    assert.equal(BN2Int(tx1.logs[0].args.collateralAdded), eth, "collateral is correct");

    let newCollateral = new BigNumber((await coin.mapCDPData(CDP)).collateral)
    assert.equal(BN2Int(newCollateral), BN2Int(existingCollateral.plus(eth)), "New collateral is correct")
  });

}