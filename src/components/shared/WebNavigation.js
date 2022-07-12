import React, {useContext, useState} from 'react'
import MFLogoNav from "../../assets/images/logo/logo.png"
import {Modal} from "antd"
import WalletAuthContext from "../../contexts/WalletAuthContext"
import MoonFitAuthContext from "../../contexts/MoonFitAuthContext"
import {Link} from "react-router-dom"
import Paths from "../../routes/Paths"
import MFAccountButton from "../MFAccountButton"
import {getShortAddress} from "../../utils/blockchain"

const WebNavigation = (props) => {
    const [isWalletModalVisible, setIsWalletModalVisible] = useState(false)

    const {wallet, onConnect, onDisconnect, isConnected} = useContext(WalletAuthContext)
    const {user, isAuthenticated} = useContext(MoonFitAuthContext)

    const showWalletModal = () => {
        setIsWalletModalVisible(true)
    }

    const hideWalletModal = () => {
        setIsWalletModalVisible(false)
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
            <Modal title="Wallet Information"
                   visible={isWalletModalVisible}
                // centered
                   wrapClassName={'mf-modal account-modal'}
                   className={'mf-modal-content account-modal-content'}
                // width={720}
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
                        <div className={'flex text-green-500 normal-case'}>{getShortAddress(wallet.account, 12)}</div>
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