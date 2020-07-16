import React, { useEffect,useState, useContext} from 'react'
import { Context } from '../../context'
import {Link} from 'react-router-dom'
import { Row, Col } from 'antd'
import { HR, H1, H2, Text, LabelGroup, Button, Gap,LabelLG,Label,Logo  } from '../components/elements';
import { rowStyles} from '../components/styles'
import { formatUSD, convertFromWei } from '../../utils'
import {getPoolCount} from '../../client/web3'

const Overview = (props) => {
    const context = useContext(Context)
    const [poolCount, setPoolCount] = useState(0)
    const [stakersCount, setStakersCount] = useState(0)
    const [maiPrice, setMaiPrice] = useState(0)

    useEffect(() => {
        getData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[context.arrayPools, context.MemberData, context.maiPrice])

    const getData = () => {
         setPoolCount( getPoolCount(context.arrayPools))
         setStakersCount(context.MemberData)
         setMaiPrice(context.maiPrice)
    }

    // const volume = () => {
    //     return `$${().toFixed(2)}`
    // }
    return (
        <div>
            
            <Row style={{marginBottom:50}}>
                <Col xs={17} >
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
                        <Col style={{marginTop:60}}>
    <LabelLG>${convertFromWei(maiPrice)}</LabelLG>
                            <br></br>
                            <Label>MAI PRICE (USD)</Label>
                        </Col>
                        
                    </Row>
                </Col>

                <Col xs={2} style={{marginTop:60}}>
                
                <Logo/>
                </Col> 
            </Row>
            
            <Row  style={rowStyles} >
                <Col xs={3}>
                    <LabelGroup size={32} label={'POOLS'} title={poolCount} />
                </Col>
                <Col xs={9}>
                    <LabelGroup size={32}  label={'VOLUME'} title={formatUSD(convertFromWei(context.networkData?.volume))} />
                </Col>
                <Col xs={3}>
                    <LabelGroup size={32}  label={'USERS'} title={context.networkData?.users}/>
                </Col>
                <Col xs={9}>
                    <LabelGroup size={32}  label={'TOTAL STAKERS'} title={stakersCount} />
                </Col>
            </Row>
            <Gap/>
            <H2>POOLS</H2><br></br>
            <Text>You can provide liquidity and trade across pools</Text><br/>
            <Link to={"/pools"}><Button type="primary">POOLS</Button></Link>
            <Gap></Gap>
            {/* <H2>CDPs</H2><br></br>
            <Text>You can create debt from pooled assets</Text><br/>
            <Link to={"/pools"}><Button type="primary">CDPS</Button></Link> */}

        </div>
    )
}

export default Overview