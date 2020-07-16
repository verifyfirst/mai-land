import React, { useEffect, useContext, useState } from 'react'
import { Context } from '../../context'
import { Link } from 'react-router-dom'
import { Table, Alert, Row, Col,Tabs } from 'antd'
import { convertFromWei, delay } from '../../utils'
// import { getPrice } from '../../math'
import { PlusCircleOutlined, SwapOutlined, LoginOutlined, LoadingOutlined } from '@ant-design/icons';

import { H1, Button, Center,Label } from '../components/elements'
const { TabPane } = Tabs;
const Pools = (props) => {
    function callback(key) {
        console.log(key);
    }
    return (
        <>
            <H1>POOLS</H1>
            <br />
            <Tabs defaultActiveKey="1" onChange={callback}>
                <TabPane tab={<span> All POOLS
                </span>} key="1">
                <PoolTable />
                </TabPane>
                <TabPane tab="ANCHOR POOLS" key="2">
            <AnchorTable/>
            </TabPane>
                
            </Tabs>
           
            
        </>
    )
}

export default Pools

const PoolTable = (props) => {
    const context = useContext(Context)
    const [retry, setRetry] = useState(0)
    const [connected, setConnected] = useState(false)
    useEffect(() => {
        getData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [context.PoolsData, retry])

    const getData = async () => {
        if (context.PoolsData) {
            setConnected(true)
            // console.log(context.PoolsData)
            // console.log(context.stakerData)
            //setconnected
        } else {
            await delay(2000)
            setRetry(parseInt(retry) + 1)
        }
        

    }

    const columns = [
        {
            title: 'Pool',
            dataIndex: 'symbol',
            key: 'symbol',
            render: (symbol) => (
                <h3>{symbol}</h3>
            )
        },
        {
            title: 'Price (USD)',
            dataIndex: 'price',
            key: 'price',
            render: (price) => (
                <p>{'$' + convertFromWei(price)}</p>
            )
        },
        {
            title: 'Balance ',
            dataIndex: 'balance',
            key: 'balance',
            render: (balance) => (
                <p>{convertFromWei(balance)}</p>
            )
        },
        {
            title: 'Depth (MAI)',
            dataIndex: 'depth',
            key: 'depth',
            render: (depth) => (
                <p>{convertFromWei(depth)}</p>
            )
        },
        {
            title: 'Description',
            dataIndex: 'isAnchor',
            key: 'isAnchor',
            render: (isAnchor) => (
                <p>{isAnchor ? <Label>Anchor Pool</Label> : <Label>Pool</Label>}</p>
            )
        },
        
        // {
        //     title: 'Volume',
        //     dataIndex: 'volume',
        //     key: 'volume',
        //     render: (volume) => (
        //         <p>{formatUSD(convertFromWei(volume))}</p>
        //     )
        // },
        // {
        //     title: 'TX Count',
        //     dataIndex: 'txCount',
        //     key: 'txCount',
        //     render: (txCount) => (
        //         <p>{txCount.toLocaleString()}</p>
        //     )
        // },
        // {
        //     title: 'ROI',
        //     dataIndex: 'roi',
        //     key: 'roi',
        //     render: (roi) => (
        //         <p>{roi * 100}%</p>
        //     )
        // },
        {
            render: (record) => (
                
                        <div style={{ textAlign: 'right' }}>
                        <Row justify="end">
                            {/* <Col>
                            {context.walletData ? <div></div> : 
                            <Alert type="error" message="Please Connect Your Wallet" banner />
        }
                            </Col> */}
                        <Col  >
                            {context.walletData ?
                                <Link to={`/pool/stake?token=${record.address}`}>
                                    <Button icon={<LoginOutlined />}>STAKE</Button>
                                </Link> :
                                <Button disabled icon={<LoginOutlined />}>STAKE</Button>
                            }
                            
                            </Col>
                            <Col  >
                            {context.walletData ?
                                <Link to={`/pool/swap?token=${record.address}`}>
                                    <Button type='primary' icon={<SwapOutlined />}>SWAP</Button>
                                </Link> :
                                <Button type='primary' disabled icon={<SwapOutlined />} >SWAP</Button>

                            }
                            </Col>
                            
                            </Row>
                        </div>
                        
                 

                
            
            )
        }
    ]

    const tableStyles = {
        margin: 0,
        padding: 0
    }
    const refreshStyles = {
        fontSize: 40,
        paddingTop: 40,
        paddingBottom: 40
    }
    return (
        <>
            {connected ?
                <Table style={tableStyles} dataSource={context.PoolsData} columns={columns} rowKey="symbol" /> :
                <div style={refreshStyles}>
                    <Center><LoadingOutlined /></Center>
                </div>
            }
            <Link to={"/pool/create"}><Button type="primary" icon={<PlusCircleOutlined />}>CREATE POOL</Button>
            </Link>

        </>
    )
}

const AnchorTable = (props) => {
    const context = useContext(Context)
    const [retry, setRetry] = useState(0)
    const [connected, setConnected] = useState(false)
    useEffect(() => {
        getData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [context.AnchorPools, retry])

    const getData = async () => {
        if (context.AnchorPools) {
            setConnected(true)
            //setconnected
        } else {
            await delay(2000)
            setRetry(parseInt(retry) + 1)
        }
        

    }

    const columns = [
        {
            title: 'Pool',
            dataIndex: 'symbol',
            key: 'symbol',
            render: (symbol) => (
                <h3>{symbol}</h3>
            )
        },
        {
            title: 'Price (USD)',
            dataIndex: 'price',
            key: 'price',
            render: (price) => (
                <p>{'$' + convertFromWei(price)}</p>
            )
        },
        {
            title: 'Balance ',
            dataIndex: 'balance',
            key: 'balance',
            render: (balance) => (
                <p>{convertFromWei(balance)}</p>
            )
        },
        {
            title: 'Depth (MAI)',
            dataIndex: 'depth',
            key: 'depth',
            render: (depth) => (
                <p>{convertFromWei(depth)}</p>
            )
        },
        // {
        //     title: 'TX Count',
        //     dataIndex: 'txCount',
        //     key: 'txCount',
        //     render: (txCount) => (
        //         <p>{txCount.toLocaleString()}</p>
        //     )
        // },
        // {
        //     title: 'ROI',
        //     dataIndex: 'roi',
        //     key: 'roi',
        //     render: (roi) => (
        //         <p>{roi * 100}%</p>
        //     )
        // },
        {
            render: (record) => (
                
                        <div style={{ textAlign: 'right' }}>
                        <Row justify="end">
                          
                        <Col  >
                            {context.walletData ?
                                <Link to={`/pool/stake?token=${record.address}`}>
                                    <Button icon={<LoginOutlined />}>STAKE</Button>
                                </Link> :
                                <Button disabled icon={<LoginOutlined />}>STAKE</Button>
                            }
                            
                            </Col>
                            <Col  >
                            {context.walletData ?
                                <Link to={`/pool/swap?token=${record.address}`}>
                                    <Button type='primary' icon={<SwapOutlined />}>SWAP</Button>
                                </Link> :
                                <Button type='primary' disabled icon={<SwapOutlined />} >SWAP</Button>

                            }
                            </Col>
                            
                            </Row>
                        </div>
                        
                 

            
            )
        }
    ]

    const tableStyles = {
        margin: 0,
        padding: 0
    }
    const refreshStyles = {
        fontSize: 40,
        paddingTop: 40,
        paddingBottom: 40
    }
    return (
        <>
            {connected ?
                <Table style={tableStyles} dataSource={context.AnchorPools} columns={columns} rowKey="symbol" /> :
                <div style={refreshStyles}>
                    <Center><LoadingOutlined /></Center>
                </div>
            }
            <Link to={"/anchor/create"}><Button type="primary" icon={<PlusCircleOutlined />}>CREATE ANCHOR</Button>
            </Link>

        </>
    )
}