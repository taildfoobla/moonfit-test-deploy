import React, {useContext, useEffect, useState} from 'react'
import MFLogoNav from "../../assets/images/logo/logo.png"
import {Drawer, Modal, Typography} from "antd"
import WalletAuthContext from "../../contexts/WalletAuthContext"
import {Link, withRouter} from "react-router-dom"
import Paths from "../../routes/Paths"
import MFAccountButton from "../MFAccountButton"
import {getShortAddress} from "../../utils/blockchain"
import {getReactEnv} from "../../utils/env"
import {AppRoutes} from "../../routes/AppRoutes"
import CopyIcon from "./CopyIcon"
import {CHAIN_ID_MAPPING} from "../../constants/blockchain"
import classNames from "classnames"

const ENV = getReactEnv('ENV')
const {Paragraph} = Typography

const WebNavigation = (props) => {
    const [isWalletModalVisible, setIsWalletModalVisible] = useState(false)
    const [visible, setVisible] = useState(false)
    const [colorChange, setColorChange] = useState(false)
    // const [isMobileMenuVisible, setIsMobileMenuVisible] = useState(false)

    const {wallet, onConnect, onDisconnect, isConnected, onAuthorizeMoreWallet} = useContext(WalletAuthContext)

    useEffect(() => {
        // adding the event when scroll change Logo
        window.addEventListener("scroll", changeNavbarColor)
        return () => window.removeEventListener("scroll", changeNavbarColor)
    }, [])

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

    const onToggleMobileMenu = () => {
        // setIsMobileMenuVisible(!isMobileMenuVisible)
        setVisible(true)
    }

    const changeNavbarColor = () => {
        if (window.scrollY >= 80) {
            setColorChange(true)
        } else {
            setColorChange(false)
        }
    }
    const renderLinks = () => {
        return AppRoutes.map((item, index) => {
            const currentPath = props.location.pathname
            const isActive = currentPath === item.path
            return item.env.includes(ENV) && (
                <li className={classNames('nav-item', {'active-item': isActive})} key={index}>
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

    const onConnectMoreWallet = () => {
        onAuthorizeMoreWallet()
    }

    return (
        <header id="header" className={classNames('header', {'bg-[#120838]': colorChange})}>
            <div className="flex justify-between items-center px-12">
                <div className="header-inner w-full">
                    <div className="flex items-center header-left">
                        {/*<div className={'cursor-pointer mr-4'} onClick={() => setVisible(true)}>*/}
                        {/*    <MenuOutlined style={{fontSize: 30, color: "#FFF"}}/>*/}
                        {/*</div>*/}
                        <div className="site-branding">
                            <Link to={Paths.Home.path}>
                                <img loading="lazy"
                                     alt="MoonFit Whitelist - Web3 & NFT Lifestyle App"
                                     src={MFLogoNav}
                                />
                            </Link>
                        </div>
                    </div>
                    <div className="header-center">
                        <nav id="primary-menu" className="primary-menu">
                            <ul className="nav">
                                {renderLinks()}
                            </ul>
                        </nav>
                    </div>
                    <div className="header-right">
                        {
                            isConnected ? (
                                <button type="button"
                                        onClick={showWalletModal}
                                        className="header-button button button-primary mr-4">
                                    <svg className="inline w-5 h-5 mr-1" style={{marginTop: 2}} width="24" height="24"
                                         viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M20.25 6.75H5.25C5.05109 6.75 4.86032 6.67098 4.71967 6.53033C4.57902 6.38968 4.5 6.19891 4.5 6C4.5 5.80109 4.57902 5.61032 4.71967 5.46967C4.86032 5.32902 5.05109 5.25 5.25 5.25H18C18.1989 5.25 18.3897 5.17098 18.5303 5.03033C18.671 4.88968 18.75 4.69891 18.75 4.5C18.75 4.30109 18.671 4.11032 18.5303 3.96967C18.3897 3.82902 18.1989 3.75 18 3.75H5.25C4.65402 3.75247 4.08316 3.99031 3.66174 4.41174C3.24031 4.83316 3.00247 5.40402 3 6V18C3.00247 18.596 3.24031 19.1668 3.66174 19.5883C4.08316 20.0097 4.65402 20.2475 5.25 20.25H20.25C20.6478 20.25 21.0294 20.092 21.3107 19.8107C21.592 19.5294 21.75 19.1478 21.75 18.75V8.25C21.75 7.85218 21.592 7.47064 21.3107 7.18934C21.0294 6.90804 20.6478 6.75 20.25 6.75ZM16.875 14.625C16.6525 14.625 16.435 14.559 16.25 14.4354C16.065 14.3118 15.9208 14.1361 15.8356 13.9305C15.7505 13.725 15.7282 13.4988 15.7716 13.2805C15.815 13.0623 15.9222 12.8618 16.0795 12.7045C16.2368 12.5472 16.4373 12.44 16.6555 12.3966C16.8738 12.3532 17.1 12.3755 17.3055 12.4606C17.5111 12.5458 17.6868 12.69 17.8104 12.875C17.934 13.06 18 13.2775 18 13.5C18 13.7984 17.8815 14.0845 17.6705 14.2955C17.4595 14.5065 17.1734 14.625 16.875 14.625Z"
                                            fill="#020722"/>
                                    </svg>

                                    {getShortAddress(wallet.account, 6)}
                                </button>
                            ) : (
                                <button type="button"
                                        onClick={onConnect}
                                        className="header-button button button-primary mr-4">
                                    <svg className="inline w-5 h-5 mr-1" style={{marginTop: 2}} width="24" height="24"
                                         viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M20.25 6.75H5.25C5.05109 6.75 4.86032 6.67098 4.71967 6.53033C4.57902 6.38968 4.5 6.19891 4.5 6C4.5 5.80109 4.57902 5.61032 4.71967 5.46967C4.86032 5.32902 5.05109 5.25 5.25 5.25H18C18.1989 5.25 18.3897 5.17098 18.5303 5.03033C18.671 4.88968 18.75 4.69891 18.75 4.5C18.75 4.30109 18.671 4.11032 18.5303 3.96967C18.3897 3.82902 18.1989 3.75 18 3.75H5.25C4.65402 3.75247 4.08316 3.99031 3.66174 4.41174C3.24031 4.83316 3.00247 5.40402 3 6V18C3.00247 18.596 3.24031 19.1668 3.66174 19.5883C4.08316 20.0097 4.65402 20.2475 5.25 20.25H20.25C20.6478 20.25 21.0294 20.092 21.3107 19.8107C21.592 19.5294 21.75 19.1478 21.75 18.75V8.25C21.75 7.85218 21.592 7.47064 21.3107 7.18934C21.0294 6.90804 20.6478 6.75 20.25 6.75ZM16.875 14.625C16.6525 14.625 16.435 14.559 16.25 14.4354C16.065 14.3118 15.9208 14.1361 15.8356 13.9305C15.7505 13.725 15.7282 13.4988 15.7716 13.2805C15.815 13.0623 15.9222 12.8618 16.0795 12.7045C16.2368 12.5472 16.4373 12.44 16.6555 12.3966C16.8738 12.3532 17.1 12.3755 17.3055 12.4606C17.5111 12.5458 17.6868 12.69 17.8104 12.875C17.934 13.06 18 13.2775 18 13.5C18 13.7984 17.8815 14.0845 17.6705 14.2955C17.4595 14.5065 17.1734 14.625 16.875 14.625Z"
                                            fill="#020722"/>
                                    </svg>
                                    Connect Wallet
                                </button>
                            )
                        }
                        <MFAccountButton/>
                        <button className="navbar-toggler collapsed" type="button" data-bs-toggle="collapse"
                                data-bs-target="#mobile-menu" aria-controls="navbar" aria-expanded="false"
                                aria-label="Toggle navigation" onClick={onToggleMobileMenu}>
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        {/*<nav id="mobile-menu" className={CN('mobile-menu menu_scr', {'hidden': !isMobileMenuVisible})}>*/}
                        {/*    <ul className="nav">*/}
                        {/*        {renderLinks()}*/}
                        {/*    </ul>*/}
                        {/*</nav>*/}
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
                <div className={'flex w-full'}>
                    {
                        isConnected ? (
                            <button type="button"
                                    onClick={showWalletModal}
                                    className="header-button w-fit button button-primary">
                                <svg className="inline w-5 h-5 mr-1" style={{marginTop: 2}} width="24" height="24"
                                     viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M20.25 6.75H5.25C5.05109 6.75 4.86032 6.67098 4.71967 6.53033C4.57902 6.38968 4.5 6.19891 4.5 6C4.5 5.80109 4.57902 5.61032 4.71967 5.46967C4.86032 5.32902 5.05109 5.25 5.25 5.25H18C18.1989 5.25 18.3897 5.17098 18.5303 5.03033C18.671 4.88968 18.75 4.69891 18.75 4.5C18.75 4.30109 18.671 4.11032 18.5303 3.96967C18.3897 3.82902 18.1989 3.75 18 3.75H5.25C4.65402 3.75247 4.08316 3.99031 3.66174 4.41174C3.24031 4.83316 3.00247 5.40402 3 6V18C3.00247 18.596 3.24031 19.1668 3.66174 19.5883C4.08316 20.0097 4.65402 20.2475 5.25 20.25H20.25C20.6478 20.25 21.0294 20.092 21.3107 19.8107C21.592 19.5294 21.75 19.1478 21.75 18.75V8.25C21.75 7.85218 21.592 7.47064 21.3107 7.18934C21.0294 6.90804 20.6478 6.75 20.25 6.75ZM16.875 14.625C16.6525 14.625 16.435 14.559 16.25 14.4354C16.065 14.3118 15.9208 14.1361 15.8356 13.9305C15.7505 13.725 15.7282 13.4988 15.7716 13.2805C15.815 13.0623 15.9222 12.8618 16.0795 12.7045C16.2368 12.5472 16.4373 12.44 16.6555 12.3966C16.8738 12.3532 17.1 12.3755 17.3055 12.4606C17.5111 12.5458 17.6868 12.69 17.8104 12.875C17.934 13.06 18 13.2775 18 13.5C18 13.7984 17.8815 14.0845 17.6705 14.2955C17.4595 14.5065 17.1734 14.625 16.875 14.625Z"
                                        fill="#020722"/>
                                </svg>

                                {getShortAddress(wallet.account, 6)}
                            </button>
                        ) : (
                            <button type="button"
                                    onClick={onConnect}
                                    className="header-button w-fit button button-primary">
                                <svg className="inline w-5 h-5 mr-1" style={{marginTop: 2}} width="24" height="24"
                                     viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M20.25 6.75H5.25C5.05109 6.75 4.86032 6.67098 4.71967 6.53033C4.57902 6.38968 4.5 6.19891 4.5 6C4.5 5.80109 4.57902 5.61032 4.71967 5.46967C4.86032 5.32902 5.05109 5.25 5.25 5.25H18C18.1989 5.25 18.3897 5.17098 18.5303 5.03033C18.671 4.88968 18.75 4.69891 18.75 4.5C18.75 4.30109 18.671 4.11032 18.5303 3.96967C18.3897 3.82902 18.1989 3.75 18 3.75H5.25C4.65402 3.75247 4.08316 3.99031 3.66174 4.41174C3.24031 4.83316 3.00247 5.40402 3 6V18C3.00247 18.596 3.24031 19.1668 3.66174 19.5883C4.08316 20.0097 4.65402 20.2475 5.25 20.25H20.25C20.6478 20.25 21.0294 20.092 21.3107 19.8107C21.592 19.5294 21.75 19.1478 21.75 18.75V8.25C21.75 7.85218 21.592 7.47064 21.3107 7.18934C21.0294 6.90804 20.6478 6.75 20.25 6.75ZM16.875 14.625C16.6525 14.625 16.435 14.559 16.25 14.4354C16.065 14.3118 15.9208 14.1361 15.8356 13.9305C15.7505 13.725 15.7282 13.4988 15.7716 13.2805C15.815 13.0623 15.9222 12.8618 16.0795 12.7045C16.2368 12.5472 16.4373 12.44 16.6555 12.3966C16.8738 12.3532 17.1 12.3755 17.3055 12.4606C17.5111 12.5458 17.6868 12.69 17.8104 12.875C17.934 13.06 18 13.2775 18 13.5C18 13.7984 17.8815 14.0845 17.6705 14.2955C17.4595 14.5065 17.1734 14.625 16.875 14.625Z"
                                        fill="#020722"/>
                                </svg>
                                Connect Wallet
                            </button>
                        )
                    }
                    <MFAccountButton btnClassName={'w-fit'}/>
                </div>
                <hr className={'mt-5 mb-3'}/>
                <nav className="primary-menu">
                    <ul className="nav">
                        {renderLinks()}
                    </ul>
                </nav>
            </Drawer>
            <Modal title={'Wallet Information'}
                   visible={isWalletModalVisible}
                   onCancel={hideWalletModal}
                   closeIcon={(
                       <svg className={'cursor-pointer'} width="32" height="32" viewBox="0 0 32 32" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                           <rect x="1" y="1" width="30" height="30" rx="6" stroke="white" strokeOpacity="0.2"
                                 strokeWidth="2"/>
                           <path d="M21.0625 10.9375L10.9375 21.0625" stroke="white" strokeWidth="2"
                                 strokeLinecap="round" strokeLinejoin="round"/>
                           <path d="M21.0625 21.0625L10.9375 10.9375" stroke="white" strokeWidth="2"
                                 strokeLinecap="round" strokeLinejoin="round"/>
                       </svg>
                   )}
                   wrapClassName={'mf-modal account-modal'}
                   className={'mf-modal-content account-modal-content'}
                   footer={[
                       <div className={'flex w-full'} key={'account-modal-footer'}>
                           <button type="button"
                                   onClick={() => onDisconnect(() => setIsWalletModalVisible(false))}
                                   className="w-1/2 button button-dark">
                               Disconnect
                           </button>
                           <button type="button"
                                   onClick={hideWalletModal}
                                   className="w-1/2 button button-secondary">
                               Done
                           </button>
                       </div>
                   ]}>
                <div>
                    <div className="flex flex-col modal-body-row">
                        <div className={'flex modal-body-row-title'}>Wallet address</div>
                        <Paragraph className={'flex text-white'}
                                   copyable={{text: wallet.account, format: 'text/plain', icon: [<CopyIcon/>]}}>
                            {getShortAddress(wallet.account, 12)}
                        </Paragraph>
                        <div className={'normal-case mt-2 text-base cursor-pointer text-[#A16BD8] hover:text-blue-600'}
                            onClick={onConnectMoreWallet}>
                            Connect more wallets
                        </div>
                    </div>
                    <div className="flex flex-col modal-body-row mt-3">
                        <div className={'flex modal-body-row-title'}>Balance</div>
                        <div className={'flex text-white'}>{wallet.balance} (GLMR)</div>
                    </div>
                    <div className="flex flex-col modal-body-row mt-3">
                        <div className={'flex modal-body-row-title'}>MFG Balance</div>
                        <div className={'flex text-white'}>{wallet.mfgBalance ? wallet.mfgBalance : "Unknown"} (MFG)
                        </div>
                    </div>
                    <div className="flex flex-col modal-body-row mt-3">
                        <div className={'flex modal-body-row-title'}>Network</div>
                        <div className={'flex text-white'}>{CHAIN_ID_MAPPING[wallet.chainId]}</div>
                    </div>
                </div>
            </Modal>
        </header>
    )
}

export default withRouter(WebNavigation)