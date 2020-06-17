import React, { useEffect, useState, useContext } from 'react'
import { Context } from '../../context'
import { H2, Subtitle,Gap, LabelGrey, Click, Center } from '../Components'
import { OpenCDP } from './cdp-web3.js'
import { CDPAccountDetails } from'./cdp-account.js'
import { Row } from 'antd'
const CDPs = () => {
    const context = useContext(Context)
    const [safari, setSafari] = useState(null)
    const [loaded, setLoaded] = useState(false)


    useEffect(() => {
        var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        setSafari(isSafari)
        let pathname = window.location.pathname.split("/")[1]
        if (pathname === 'claim' && !loaded) {
            setLoaded(true)
        }
        // eslint-disable-next-line
    }, [])



    return (
        <div >
          
            <Center><H2>Collateral Debt Positions</H2><br /></Center>
            
            {safari &&
                <div>
                    <br />
                    <LabelGrey>Sending Ethereum transactions requires Chrome and Metamask</LabelGrey>
                    <br />
                    <Click><a href='https://metamask.io' rel="noopener noreferrer" title="Metamask Link" target="_blank" style={{ color: "#e7893c", fontSize: 12 }}>Download Metamask</a></Click>
                </div>
            }
            {!safari &&
            <div>
                <CDPAccountDetails></CDPAccountDetails>
          <br/>
				<OpenCDP></OpenCDP>
				</div>
			}
            
        </div>
    )

}

export default CDPs