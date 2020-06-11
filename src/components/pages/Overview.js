import React from 'react'

import { Row, Col } from 'antd'

import { H1, H2, Text, LabelLG, LabelGrey, Label, LabelWrn, Click, FloatCard } from '../Components'
import { Logo } from '../Content'

const Overview = (props) => {

    return (
        <div>
            
            <Row style={{paddingLeft:20, backgroundColor:"#E3EAE5", paddingBottom:100}}>

                <Col xs={17} style={{marginTop:20}}>
                <H1>MAI Stablecoin</H1>
                <br></br>
                <H2>A decentralised stablecoin with built-in liquidity</H2>
                <br></br>
                <Text>MAI is a stablecoin that uses collaterised debt positions as the buyer and seller of last resort. 
                MAI is anchored to $1.00 by a system of incentives in liquidity pools of other USD assets.
                MAI is the settlement asset in token pools to drive MAI liquidity and demand.
                The liquidity pools are used for liquidations, which ensure sustainable, deterministic and permissionless liquidation of unhealthy CDPs. 
                MAI is governance-minimal, letting staked capital drive all decision-making. </Text>
                <br></br>
                </Col>
                <Col xs={2} style={{marginLeft:50}}>
                    <Row>
                        <Col>
                            <br></br><br></br><br></br>
                            <LabelLG>$1.01</LabelLG>
                            <br></br>
                            <Label>MAI PRICE (USD)</Label>
                        </Col>
                        
                    </Row>
                </Col>

                <Col xs={2}>
                <br></br><br></br><br></br>
                    <Logo/>
                </Col> 
            </Row>
            <Row >
                    <Col>
                       <FloatCard left="20px" title="CDPS"></FloatCard>
                       </Col>
                       <Col>
                       <FloatCard left="20px" title="POOLS"></FloatCard>
                       </Col>
                       <Col>
                       <FloatCard left="20px" title="ANCHORS"></FloatCard>
                       </Col>
            </Row>

            <Row style={{paddingLeft:20, marginTop:50}}>
                <H2>Collaterised Debt Positions</H2>
            </Row>
            <Row style={{paddingLeft:20}}>
                <br></br><br></br>
                <Col xs={6}>
                    <Click>OPEN A CDP</Click>
                    <br />
                    <LabelGrey>Mint MAI by opening a CDP</LabelGrey>
                </Col>
                <Col xs={6}>
                    <Click>OPEN A CDP</Click>
                    <br />
                    <LabelGrey>Mint MAI by opening a CDP</LabelGrey>
                </Col>
                <Col xs={6}>
                    <Click>OPEN A CDP</Click>
                    <br />
                    <LabelGrey>Mint MAI by opening a CDP</LabelGrey>
                </Col>
                <Col xs={6}>
                    <LabelWrn>OPEN A CDP</LabelWrn>
                    <br />
                    <LabelGrey>Mint MAI by opening a CDP</LabelGrey>
                </Col>
            </Row>

            <Row style={{paddingLeft:20, marginTop:100}}>
                <H2>Liquidity Pools</H2>
                <br></br>
            </Row>
            <Row style={{paddingLeft:20}}>
                <Col xs={6}>
                    <Click>SWAP</Click>
                    <br />
                    <LabelGrey>Swap between assets</LabelGrey>
                </Col>
                <Col xs={6}>
                    <Click>STAKE</Click>
                    <br />
                    <LabelGrey>Stake in a liquidity pool</LabelGrey>
                </Col>
                <Col xs={6}>
                    <Click>WITHDRAW</Click>
                    <br />
                    <LabelGrey>Withdraw liquidity from a pool</LabelGrey>
                </Col>
                <Col xs={6}>
                    
                </Col>
            </Row>

            <Row style={{paddingLeft:20, marginTop:100}}>
                <H2>Liquidity Pools</H2>
                <br></br>
            </Row>
            <Row style={{paddingLeft:20}}>
                <Col xs={6}>
                    <LabelWrn>REPLACE</LabelWrn>
                    <br />
                    <LabelGrey>Replace a Price Anchor</LabelGrey>
                </Col>
                <Col xs={6}>
 
                </Col>
                <Col xs={6}>
  
                </Col>
                <Col xs={6}>
                    
                </Col>
            </Row>
            
        </div>  
    )
}

export default Overview