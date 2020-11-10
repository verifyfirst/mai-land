import React, { useEffect, useContext, useState } from 'react';
import { Context } from '../../context'
import { Link } from 'react-router-dom'

import { getSafeCDPs, getUnSafeCDPs,} from '../../client/web3'
import { convertFromWei,getAddressShort,delay } from '../../utils'
// import { getLiquidationFee } from '../../math'

import { BreadcrumbCombo} from '../components/common'
import { H1} from '../components/elements'

import { EditOutlined, PlusCircleOutlined, AimOutlined,WarningOutlined,LoadingOutlined } from '@ant-design/icons';
import { Row, Col, Card, Divider, Button, Table, Form, Input, Tabs,Tag, Alert } from "antd"

const { TabPane } = Tabs;
const CDPs = () => {
    const context = useContext(Context)
    const [visible, setVisible] = useState(false);
    const [connected, setConnected] = useState(false)
    const [CDPExist, setCDPExist] = useState(null)

    useEffect(() => {
        checkConnected()
        checkForCDP()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [context.walletData, context.accountCDP])

    const checkConnected = async () => {
        if(context.walletData){
            setConnected(true) 
        } else {
            setConnected(false)
        }
    }
    const checkForCDP = () => {
        if(context.accountCDP){
            setCDPExist(true)
        }
    }
const alert = () => {
    setVisible(true)
}
    function callback(key) {
        console.log(key);
    }
    return (
        <div>
            <H1>CDPs</H1>
            <br />
            <Tabs defaultActiveKey="1" onChange={callback}>
                <TabPane tab={<span> All CDPs
                </span>} key="1">
                    <CDPTable />
                </TabPane>
                
            </Tabs>
            {connected && 
            <Row>
            {CDPExist && 
            <Link to={"/cdp/manageCDP"}><Button type="primary"icon={< EditOutlined/>}>Manage Your CDP</Button>
            </Link>
            }
            {!CDPExist && 
            <Link to={"/cdp/openCDP"}><Button type="primary"icon={<PlusCircleOutlined />}>Open CDP</Button>
            </Link>
            }
            </Row>
            }
            {!connected && 
                <Row>
                <Button onClick={alert} type="primary" icon={<PlusCircleOutlined />}>Open CDP</Button> 
                {visible && 
                    <Alert type="error" message="Please Connect Your Wallet" banner />
                    }
                  </Row>  
            }
            

        </div>
    )
}
export default CDPs

export const CDPTable = () => {
    const context = useContext(Context)
    const [retry, setRetry]= useState(0)
    const [connected, setConnected] = useState(false)
    //const [liquidFee, setLiquidFee] = useState(null)

    useEffect(() => {
        getData()
    }, [context.AllCDPData, retry])

    const getData = async () => {
        if(context.AllCDPData){
            setConnected(true)
        //setconnected
        }else{
            await delay(1000)
            setRetry(parseInt(retry) + 1)
        }
        
    }
    
    const columns = [
        {
            title: 'CDP ',
            dataIndex: 'cdp',
            key: 'cdp',
            render: (cdp) => (
                <h3>{cdp}</h3>
            )
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
            render: (address) => (
                <p>{getAddressShort(address)}</p>
            )
        },
        {
            title: 'Collateral Size (ETH)',
            dataIndex: 'collateral',
            key: 'Collateral',
            render: (collateral) => (
                <p>{convertFromWei(collateral)}</p>
            )
        }, {
            title: 'Amount Owing (MAI)',
            dataIndex: 'debt',
            key: 'debt',
            render: (debt) => (
                <p>{convertFromWei(debt)}</p>
            )
        },
        {
            title: 'Status',
            key: 'canLiquidate',
            dataIndex: 'canLiquidate',
            render: (canLiquidate) => (
                <Tag color={canLiquidate === true ? 'red' : 'green'} key={canLiquidate}>
                {canLiquidate ? "UNSAFE": "SAFE"}
              </Tag>
            )
          },
          {
            title: 'Action',
            
            render: (record) => (
              <Link to={`/cdp/Liquidate?CDP=${record.cdp}`}>
              {record.canLiquidate ? 
              <Button icon={<AimOutlined />}>Liquidate CDP</Button>: <div></div>}</Link> 
            )
          }
          
    ]
    const tableStyles = {
        marginRight: 30,
        padding: 0
    }

    return (
        <div>
            {!connected && 
        <LoadingOutlined />
        }
        {connected && 
            <Table style={tableStyles} dataSource={context.AllCDPData} columns={columns} rowKey="cdp" />
            }
        
            </div>
    )
}
