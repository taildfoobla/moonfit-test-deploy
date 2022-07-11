import React, {useContext, useState} from 'react'
import MFLogoNav from "../../assets/images/logo/logo.png"
import {Modal} from "antd"
import AuthContext from "../../contexts/AuthContext"
import {Link} from "react-router-dom"
import Paths from "../../routes/Paths"

const WebNavigation = ({isConnected}) => {
    const [isAccountModalVisible, setIsAccountModalVisible] = useState(false)

    const {user, onConnect, onDisconnect} = useContext(AuthContext)

    const getShortAddress = (address) => {
        return address.slice(0, 5) + "..." + address.slice(address.length - 5, address.length)
    }

    const showAccountModal = () => {
        setIsAccountModalVisible(true)
    }

    const hideAccountModal = () => {
        setIsAccountModalVisible(false)
    }

    return (
        <header id="header" className="header">
            <div className="container-full-gap-100">
                <div className="header-inner">
                    <div className="header-left">
                        <div className="site-branding">
                            <a href="/" id="logo">
                                <img loading="lazy"
                                     alt="MoonFit Whitelist - Web3 & NFT Lifestyle App"
                                     src={MFLogoNav}
                                />
                            </a>
                        </div>
                    </div>
                    <div className="header-center">
                        <nav id="primary-menu" className="primary-menu">
                            <ul className="nav">
                                <li className="nav-item">
                                    <Link className="nav-link" to={Paths.Home}>
                                        <span className="nav-text">Home</span>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to={Paths.PrivateSale}>
                                        <span className="nav-text">MFG Private Sale
                                        </span>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to={Paths.MintPassMinting}>
                                        <span className="nav-text">Mint Pass
                                        </span>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="https://whitepaper.moonfit.xyz/" target="_blank"
                                       rel="noreferrer">
                                        <span className="nav-text">Whitepaper</span>
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="https://litepaper.moonfit.xyz/" target="_blank"
                                       rel="noreferrer">
                                        <span className="nav-text">Litepaper</span>
                                    </a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                    <div className="header-right">
                        {
                            isConnected ? (
                                <button type="button"
                                        onClick={showAccountModal}
                                        className="header-button button button-primary">
                                    <svg className="inline w-5 h-5 mr-1" fill="none" stroke="currentColor"
                                         viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                    </svg>
                                    {getShortAddress(user.account)}
                                </button>
                            ) : (
                                <button type="button"
                                        onClick={onConnect}
                                        className="header-button button button-primary">
                                    Connect Wallet
                                </button>
                            )
                        }
                        <button className="navbar-toggler collapsed" type="button" data-bs-toggle="collapse"
                                data-bs-target="#mobile-menu" aria-controls="navbar" aria-expanded="false"
                                aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <nav id="mobile-menu" className="mobile-menu menu_scr collapse">
                            <ul className="nav">
                                <li className="nav-item">
                                    <a className="nav-link" href="/">
                                        <span className="nav-text">Homepage</span>
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="/litepaper/">
                                        <span className="nav-text">Litepaper</span>
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="https://whitepaper.moonfit.xyz/" target="_blank"
                                       rel="noreferrer">
                                        <span className="nav-text">Whitepaper</span>
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="/whitelist/">
                                        <span className="nav-text">WhiteList</span>
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="/how-to-play/">
                                        <span className="nav-text">How to play</span>
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="/nft-sale/">
                                        <span className="nav-text">Mint Map</span>
                                    </a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
            <Modal title="Account Information"
                   visible={isAccountModalVisible}
                // centered
                   wrapClassName={'account-modal'}
                   className={'account-modal-content'}
                   width={720}
                   footer={[
                       <button type="button"
                               key="1"
                               onClick={() => onDisconnect(() => setIsAccountModalVisible(false))}
                               className="button button-secondary">
                           Disconnect
                       </button>,
                       <button type="button"
                               key="2"
                               onClick={hideAccountModal}
                               className="button button-primary">
                           Done
                       </button>
                   ]}>
                <div>
                    <div className="flex justify-between">
                        <div className={'flex'}>Wallet address</div>
                        <div className={'flex'}>{user.account}</div>
                    </div>
                    <div className="flex justify-between mt-2">
                        <div className={'flex'}>Balance</div>
                        <div className={'flex'}>{user.balance} (GLMR)</div>
                    </div>
                    <div className="flex justify-between mt-2">
                        <div className={'flex'}>MFG Balance</div>
                        <div className={'flex'}>{user.mfgBalance ? user.mfgBalance : "Unknown"} (MFG)</div>
                    </div>
                    <div className="flex justify-between mt-2">
                        <div className={'flex'}>Chain ID</div>
                        <div className={'flex'}>{user.chainId}</div>
                    </div>
                </div>
            </Modal>
        </header>
    )
}

export default WebNavigation