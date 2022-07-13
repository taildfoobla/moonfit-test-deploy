import React, {useContext, useState} from 'react'
import MFLogoNav from "../../assets/images/logo/logo.png"
import {Drawer, Modal, Typography} from "antd"
import WalletAuthContext from "../../contexts/WalletAuthContext"
import {Link} from "react-router-dom"
import Paths from "../../routes/Paths"
import MFAccountButton from "../MFAccountButton"
import {getShortAddress} from "../../utils/blockchain"
import {MenuOutlined} from "@ant-design/icons"
import {getReactEnv} from "../../utils/env"
import {AppRoutes} from "../../routes/AppRoutes"

const ENV = getReactEnv('ENV')
const {Paragraph} = Typography

const WebNavigation = (props) => {
    const [isWalletModalVisible, setIsWalletModalVisible] = useState(false)
    const [visible, setVisible] = useState(false)

    const {wallet, onConnect, onDisconnect, isConnected} = useContext(WalletAuthContext)
    // const {user, isAuthenticated} = useContext(MoonFitAuthContext)

    const showWalletModal = () => {
        setIsWalletModalVisible(true)
    }

    const hideWalletModal = () => {
        setIsWalletModalVisible(false)
    }

    const mfDrawerLogo = (
        <div>
            <img loading="lazy"
                 alt="MoonFit Whitelist - Web3 & NFT Lifestyle App"
                 src={MFLogoNav}
                 width={150}
            />
        </div>
    )

    const renderLinks = () => {
        return AppRoutes.map((item, index) => {
            return item.env.includes(ENV) && (
                <li className="nav-item" key={index}>
                    {
                        item.external ? (
                            <a className="nav-link" href={item.path} target="_blank"
                               rel="noreferrer">
                                <span className="nav-text">{item.title}</span>
                            </a>
                        ) : (
                            <Link className="nav-link" to={item.path}>
                                <span className="nav-text">{item.title}</span>
                            </Link>
                        )
                    }
                </li>
            )
        })
    }

    return (
        <header id="header" className="header">
            <div className="flex justify-center items-center container-full-gap-100">
                <div className="header-inner">
                    <div className="flex items-center header-left">
                        <div className={'cursor-pointer mr-4'} onClick={() => setVisible(true)}>
                            <MenuOutlined style={{fontSize: 30, color: "#FFF"}}/>
                        </div>
                        <div className="site-branding">
                            <Link to={Paths.Home.path}>
                                <img loading="lazy"
                                     alt="MoonFit Whitelist - Web3 & NFT Lifestyle App"
                                     src={MFLogoNav}
                                />
                                {/*<svg className="inline" width="50" height="27"*/}
                                {/*     viewBox="0 0 16 9" fill="none" xmlns="http://www.w3.org/2000/svg">*/}
                                {/*    <path*/}
                                {/*        d="M13.3256 3.12612L13.3326 3.02567L13.5598 0.160645H11.0963L8.57798 3.68064L8.81882 0.248042L6.13542 0.162319L3.12149 4.64938C3.12149 4.64938 2.34524 5.87227 1.04333 5.61477L0.197266 8.11681H2.03425C2.03425 8.11681 3.43807 8.09035 4.58012 6.82962C5.71553 5.56856 6.0733 4.79638 6.0733 4.79638V7.81979H8.44116L10.6841 4.79638L10.3951 7.81979H14.9151L15.5894 5.53574H13.1329L13.3256 3.12612Z"*/}
                                {/*        fill="white"/>*/}
                                {/*</svg>*/}
                            </Link>
                        </div>
                    </div>
                    <div className="header-center">
                    </div>
                    <div className="header-right">
                        {
                            isConnected ? (
                                <button type="button"
                                        onClick={showWalletModal}
                                        className="header-button button button-primary">
                                    <svg className="inline w-5 h-5 mr-1" style={{marginTop: 2}} fill="none"
                                         stroke="currentColor" viewBox="0 0 24 24"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
                                    </svg>
                                    {getShortAddress(wallet.account)}
                                </button>
                            ) : (
                                <button type="button"
                                        onClick={onConnect}
                                        className="header-button button button-primary">
                                    <svg className="inline w-5 h-5 mr-1" style={{marginTop: 2}} fill="none"
                                         stroke="currentColor" viewBox="0 0 24 24"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
                                    </svg>
                                    Connect Wallet
                                </button>
                            )
                        }
                        <MFAccountButton/>
                    </div>
                </div>
            </div>
            <Drawer title={mfDrawerLogo}
                    placement={'left'}
                    closable={false}
                    onClose={() => setVisible(false)}
                    visible={visible}
                    key="left"
                    width={350}
            >
                <nav className="primary-menu">
                    <ul className="nav">
                        {renderLinks()}
                    </ul>
                </nav>
            </Drawer>
            <Modal title="Wallet Information"
                   visible={isWalletModalVisible}
                   wrapClassName={'mf-modal account-modal'}
                   className={'mf-modal-content account-modal-content'}
                   footer={[
                       <button type="button"
                               key="1"
                               onClick={() => onDisconnect(() => setIsWalletModalVisible(false))}
                               className="button button-secondary">
                           Disconnect
                       </button>,
                       <button type="button"
                               key="2"
                               onClick={hideWalletModal}
                               className="button button-primary">
                           Done
                       </button>
                   ]}>
                <div>
                    <div className="flex flex-col">
                        <div className={'flex'}>Wallet address</div>
                        <Paragraph className={'flex text-green-500'}
                                   copyable={{text: wallet.account, format: 'text/plain'}}>
                            {getShortAddress(wallet.account, 14)}
                        </Paragraph>
                    </div>
                    <div className="flex flex-col mt-2">
                        <div className={'flex'}>Balance</div>
                        <div className={'flex text-green-500'}>{wallet.balance} (GLMR)</div>
                    </div>
                    <div className="flex flex-col mt-2">
                        <div className={'flex'}>MFG Balance</div>
                        <div className={'flex text-green-500'}>{wallet.mfgBalance ? wallet.mfgBalance : "Unknown"} (MFG)
                        </div>
                    </div>
                    <div className="flex flex-col mt-2">
                        <div className={'flex'}>Chain ID</div>
                        <div className={'flex text-green-500'}>{wallet.chainId}</div>
                    </div>
                </div>
            </Modal>
        </header>
    )
}

export default WebNavigation