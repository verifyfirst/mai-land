import React, { useState, useEffect, useContext } from 'react'
import { Context } from '../../context'
import { getAddressShort,delay} from '../../utils'
import { Link } from "react-router-dom";
import { Row, Col, Button, Layout, Menu, Drawer } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import WalletDrawer from './WalletDrawer'
import '../../App.css';

import {MAI_ADDRESS, ETH_ADDRESS,getMAIPrice, getAllCDPs,getAnchors,getMemberData, getPoolsData,getStakerData, getWalletData, getAccountCDP, getWalletTokenData, getPoolsArray, getPoolData} from '../../client/web3'

const { Header } = Layout;

const Headbar = (props) => {
    const context = useContext(Context)
    const [visible, setVisible] = useState(false)
    const [metamask, setMetaMask] =useState(false)
    const [retry, setRetry]= useState(0)
    useEffect(() => {
        getData()
    }, [context.transaction, metamask])


     const getData = async () =>{
            console.log('new Transaction')
            let allCDPData = await getAllCDPs()
           context.setContext({AllCDPData: allCDPData})
           let ArrayPools = await getPoolsArray()
           context.setContext({arrayPools : ArrayPools })
           let PoolsData = await getPoolsData(ArrayPools)
           context.setContext({PoolsData: PoolsData})
           context.setContext({AnchorPools: getAnchors(PoolsData)})
           let maiPrice = await getMAIPrice()
           context.setContext({maiPrice : maiPrice})
           context.setContext({MemberData : await getMemberData()})
           context.setContext({mainPool: getPoolData(ETH_ADDRESS, PoolsData)})
           if(metamask){
           let walletData = await getWalletData(ArrayPools)
           context.setContext({walletData: walletData})
           let address = walletData.address
           let stakerData = await getStakerData(address, PoolsData)
           // context.setContext({chainData: await getChainData()})
           context.setContext({stakerData: stakerData})
           context.setContext({ETHData:  getWalletTokenData(ETH_ADDRESS, walletData)})
           context.setContext({BASEData:  getWalletTokenData(MAI_ADDRESS, walletData)})
           context.setContext({accountCDP: getAccountCDP(address, allCDPData) })
         }
         
        
    }

    const addr = () => {
        return getAddressShort(context.walletData?.address)
    }
    
    const ConnectWallet = async ()=>
    {   if (window.ethereum) {
        try {
          // Request account access if needed
          let web3 = await window.ethereum.enable();
          // Acccounts now exposed
          if(web3){
            setMetaMask(true)
          }
          
        } catch (error) {
          // User denied account access...
        }
    }
        
        
    }

    const showDrawer = () => {
        setVisible(true);
    };
    const onClose = () => {
        setVisible(false);
    };

    return (
        <Header>
            <Row>
                <Col xs={20}>
                    <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
                        <Menu.Item key='1'>
                            <Link to={"/overview"}>OVERVIEW</Link>
                        </Menu.Item>
                        {/* <Menu.Item key="4">
                            <Link to={"/anchor"}>PRICE ANCHOR</Link>
                        </Menu.Item>  */}
                        <Menu.Item key='2'>
                            <Link to={"/pools"}>POOLS</Link>
                        </Menu.Item>
                        <Menu.Item key="3">
                            <Link to={"/cdps"}>CDPs</Link>
                        </Menu.Item>
                        {/* <Menu.Item key="5">
                            <Link to={"/about"}>ABOUT</Link>
                        </Menu.Item> */}
                    </Menu>
                </Col>
                <Col xs={4} style={{ textAlign: 'right' }}>
                    {metamask ? 
                    <Button type="primary" icon={<UserOutlined />} onClick={showDrawer}>{addr()}</Button> :  
                     <Button type="primary" icon={<UserOutlined />} onClick={ConnectWallet}>Connect</Button>}
                </Col>
            </Row>
            <Drawer
                title={context.wallet?.address}
                placement="right"
                closable={false}
                onClose={onClose}
                visible={visible}
                width={300}
            >
                <WalletDrawer />
            </Drawer>

        </Header>
    )
}

export default Headbar