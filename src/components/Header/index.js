import React, {Fragment, useEffect, useState} from "react"
import "./styles.less"
import {Button, Col, Image, Row, Typography, message as AntdMessage, Dropdown} from "antd"
import logo from "../../assets/images/logo.png"
import logo2 from "../../assets/images/logo2.png"
import logoDark from "../../assets/images/logo-dark.png"
import logoSummer2 from "../../assets/images/summer/logo2.png"
import SITE_MENU from "../../core/utils/constants/site-menu"
import {Link, NavLink} from "react-router-dom"
import {ReactComponent as IconWallet} from "@svgPath/wallet.svg"
import {ReactComponent as IconBars} from "@svgPath/bars.svg"
import classNames from "classnames"
import {useAuth} from "../../core/contexts/auth"
import {getShortAddress} from "../../core/utils/helpers/blockchain"
import MFModal from "../MFModal"
import {CHAIN_ID_MAPPING, EVM_WALLETS} from "../../core/utils/constants/blockchain"
import {isMobileOrTablet} from "../../core/utils/helpers/device"
import iconWallet from "@imgPath/wallet-address.png"
import DOMEventServices from "../../core/services/dom-event"
import Jdenticon from "../Jdenticon"
import {useLocation, useParams} from "react-router-dom"
import {getLocalStorage, LOCALSTORAGE_KEY, removeLocalStorage, setLocalStorage} from "../../core/utils/helpers/storage"
import DeviceMobile from "../../assets/images/device-mobile-speaker.png"
import QRCode from "../../assets/images/qr-code.png"
import ModalQr from "../ModalQr"
import SelectMenuPopup from "../SelectMenuPopup"
import {useNavigate} from "react-router-dom"
import ChangeMintNetwork from "../ChangeMintNetwork"
import ChangeMintPage from "../ChangeMintPage"
import {signInWithGooglePopup, signOutAllPlatform, signInWithApplePopup} from "../../core/utils/helpers/firebase"
import {GoogleAuthProvider, OAuthProvider} from "firebase/auth"
import emailIcon from "../../assets/images/email-1.png"
import {renderEmail} from "../../core/utils/helpers/render-email"
import {checkApi} from "../../core/utils/helpers/check-api"
import {check2faAPI} from "../../core/services/2fa"
import {useWalletConnect} from "../../core/contexts/wallet-connect"

const {Paragraph} = Typography

const Header = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const params = useParams()
    const [isTop, setIsTop] = useState(true)
    const [toggleMenu, setToggleMenu] = useState(false)
    const [winners, setWinners] = useState([])
    const [isWalletModalVisible, setIsWalletModalVisible] = useState(false)
    const [isOpenMobiQrCode, setIsOpenMobiQrCode] = useState(false)
    const [isOpenSelectMenu, setIsOpenSelectMenu] = useState(false)
    const [isHave2FA, setIsHave2FA] = useState(false)

    const {
        auth,
        walletExtKey,
        showConnectModal,
        onDisconnect,
        onAuthorizeMoreWallet,
        setIsOpenModalChooseAccount,
        connectToCyber,
        isLoginSocial,
        setIsLoginSocial,
        setIsOpenModalSocial,
    } = useAuth()

    const {walletConnect,handleDisConnected} = useWalletConnect()
    console.log("walletConnect", walletConnect)

    const {isConnected, user} = auth

    const socialEmail = JSON.parse(getLocalStorage(LOCALSTORAGE_KEY.SOCIAL_ACOUNT))?.email

    useEffect(() => {
        if (isLoginSocial) {
            checkTwoFA()
        }
    }, [isLoginSocial])

    const checkTwoFA = async () => {
        const res = await checkApi(check2faAPI)
        const {success, message, data} = res
        if (success) {
            const enable = data?.enable
            if (enable) {
                setIsHave2FA(true)
            } else {
                setIsHave2FA(false)
            }
        } else {
            return AntdMessage.error({
                key: "err",
                content: message,
                className: "message-error",
                duration: 5,
            })
        }
    }
    const showWalletModal = () => {
        setIsWalletModalVisible(true)
    }

    const hideWalletModal = () => {
        setIsWalletModalVisible(false)
    }

    const onShowMessage = () => {
        // message.error({
        //     key: "comming-soon",
        //     content: "Please wait",
        //     className: "message-error",
        // })

        AntdMessage.error({
            key: "err",
            content: "Comming soon",
            className: "message-error",
        })
        // setTimeout(() => {
        //     message.error({
        //         key: "comming-soon",
        //         content: "Comming soon",
        //         className: "message-error",
        //     })
        // }, 1000)
    }

    const renderAccountExtra = () => {
        if (!walletExtKey) return <div />
        const walletExt = EVM_WALLETS.find((w) => w.extensionName === walletExtKey)
        return (
            <Row justify="space-between">
                <div className={"mr-3 pr-2 inline-flex normal-case text-base"}>
                    <span className={"mr-2"}>Connected with</span>{" "}
                    <img src={walletExt.logo.src} alt={walletExt.logo.alt} width={25} />
                </div>
                {!isMobileOrTablet() && (
                    <div className="connect-more-wallets" onClick={onAuthorizeMoreWallet}>
                        Connect more wallets
                    </div>
                )}
            </Row>
        )
    }

    useEffect(() => {
        const handleScroll = () => {
            if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
                setIsTop(false)
            } else {
                setIsTop(true)
            }
        }

        window.addEventListener("scroll", handleScroll)

        return () => {
            window.removeEventListener("scroll", handleScroll)
        }
    }, [])

    useEffect(() => {
        DOMEventServices.subscribe("openLoginModal", () => {
            showConnectModal()
        })

        return () => {
            DOMEventServices.unsubscribe("openLoginModal")
        }
    }, [])

    const {pathname} = useLocation()

    const renderIconByEvent = () => {
        let output = null
        switch (params.id) {
            case "valentine-event":
                output = <span>&hearts;</span>
                break
            case "christmas-event":
                output = <span>&#10052;</span>
                break
            case "summer-fitsnap-challenge":
                output = <span>&#x2600;</span>
                break
            default:
                break
        }
        return output
    }

    const getChristmasWinner = (history = []) => {
        let winners = []
        if (history && history.length) {
            history.forEach((item, index) => {
                if (["MFR", "MFG", "GLMR"].includes(item?.metadata?.type)) {
                    winners.push(
                        <a
                            key={`token_${index}`}
                            href={`https://moonscan.io/address/${item?.wallet_address}`}
                            target="_blank"
                            rel="noreferrer"
                        >
                            Congratulations,{" "}
                            <span style={{color: "#4DFFF6"}}>{getShortAddress(item?.wallet_address, 4)}</span>, on
                            winning {item?.metadata?.value} {item?.metadata.type} {renderIconByEvent()}{" "}
                        </a>
                    )
                } else {
                    winners.push(
                        <a
                            key={`item_${index}`}
                            href={`https://moonscan.io/address/${item?.wallet_address}`}
                            target="_blank"
                            rel="noreferrer"
                        >
                            Congratulations,{" "}
                            <span style={{color: "#4DFFF6"}}>{getShortAddress(item?.wallet_address, 4)}</span>, on
                            winning {item?.metadata.type} {renderIconByEvent()}{" "}
                        </a>
                    )
                }
            })
        }
        return winners
    }

    window.addEventListener("checkWinner", () => {
        const specialEventWinners = getLocalStorage(LOCALSTORAGE_KEY.SPECIAL_EVENT_WINNERS)
        if (specialEventWinners) {
            const winners = getChristmasWinner(JSON.parse(specialEventWinners))
            setWinners(winners)
        }
    })

    const _renderMarquee = () => {
        let output = (
            <div className="event-winner">
                <marquee className="scroll-text" scrollamount="8">
                    <a
                        href="https://moonscan.io/address/0xE0850282Fa00b3F07D5f5D5837AA9bFFc2A69f4C"
                        target="_blank"
                        rel="noreferrer"
                    >
                        Congratulate
                        <span style={{color: "#4DFFF6"}}> 0xE085...9f4C </span>
                        on winning the 5th weekly raffle game.
                    </a>
                </marquee>
            </div>
        )
        if (pathname.includes("/special-event")) {
            output = (
                <div className={`event-winner ${params.id === "valentine-event" ? "valentine" : "christmas"}`}>
                    <marquee className="scroll-text" scrollamount="8">
                        {winners}
                    </marquee>
                </div>
            )
        }
        return output
    }

    const getHeaderClassName = () => {
        let className = ""
        switch (params.id) {
            case "valentine-event":
                className = "valentine"
                break
            case "summer-fitsnap-challenge":
                className = "summer-event"
                break
            case "moonfit-x-hashkey-did-challenge":
                className = "hashkey-did"
                break
            case "moonfit-x-starfish-finance-challenge":
                className = "starfish"
                break
            case "lunar-gaming-festival-thanksgiving-challenge":
                className = "lunar-event"
                break
            case "moonfit-x-cyberconnect-challenge":
                className = "advent-onchain"
                break
            case "christmas-challenge":
                className = "christmas-challenge"
                break
            case "valentine-challenge-2024":
                className = "valentine-challenge"
                break
            default:
                break
        }
        return className
    }

    const getLogoByEvent = () => {
        let image = logo
        switch (params.id) {
            case "valentine-event":
                image = !isTop ? logo2 : logo
                break
            case "summer-fitsnap-challenge":
                image = !isTop ? logo : logoSummer2
                break
            case "moonfit-x-hashkey-did-challenge":
            case "moonfit-x-starfish-finance-challenge":
                image = !isTop ? logo : logoDark
                break
            default:
                break
        }
        return image
    }

    const openMobiQrCode = () => {
        setIsOpenMobiQrCode(true)
    }

    const openSelectMenu = () => {
        setIsOpenSelectMenu(true)
    }

    const handleCloseMobileMenu = () => {
        setToggleMenu(false)
        document.body.classList.remove("toggle-menu")
    }

    const handleSignOut = async () => {
        try {
            await signOutAllPlatform()
            setIsLoginSocial(false)
            removeLocalStorage(LOCALSTORAGE_KEY.ACCESS_TOKEN)
            removeLocalStorage(LOCALSTORAGE_KEY.REFRESH_TOKEN)
            removeLocalStorage(LOCALSTORAGE_KEY.SOCIAL_ACOUNT)
        } catch (err) {
            console.log("signout err", err)
        }
    }

    const handlePreventPassThrough = (e, title) => {
        if (!isConnected) {
            if (title === "Deposit") {
                e.preventDefault()
                return AntdMessage.error({
                    key: "err",
                    content: "Please connect wallet first",
                    className: "message-error",
                    duration: 5,
                })
            }
        }
        if (!isLoginSocial) {
            if (title === "Withdraw" || title === "Deposit" || title === "Asset" || title === "2FA") {
                e.preventDefault()
                return AntdMessage.error({
                    key: "err",
                    content: "Please login social first",
                    className: "message-error",
                    duration: 5,
                })
            }
        }
    }

    const socialAccount = JSON.parse(getLocalStorage(LOCALSTORAGE_KEY.SOCIAL_ACOUNT)) || {}
    const items = [
        {
            label: (
                <div className="download-app-qr">
                    <h3>Download app</h3>
                    <div className="qr-code">
                        <img src={QRCode} alt="" />
                    </div>
                    <div className="download-app-qr-text">
                        <p>Scan To Download</p>
                        <p>Get MoonFit For Any Devices</p>
                    </div>
                </div>
            ),
            key: "f",
        },
    ]
    let itemsMenu = []
    if (connectToCyber.isConnected) {
        if (isLoginSocial) {
            itemsMenu = [
                {
                    label: <Link to="/manage-assets">Asset Management</Link>,
                    key: "2",
                },
                {
                    label: <Link to="/deposit">Deposit Assets</Link>,
                    key: "1",
                },
                {
                    label: <Link to="/deposit">Withdraw Assets</Link>,
                    key: "5",
                },

                {
                    label: <Link to="/two-fa">{isHave2FA ? "Change 2FA" : "Setup 2FA"}</Link>,
                    key: "3",
                },
                {
                    label: (
                        <div
                            className="open-account"
                            onClick={() => {
                                handleSignOut()
                            }}
                        >
                            logout <span>{`(${renderEmail(socialAccount?.email, 10)})`}</span>
                        </div>
                    ),
                    key: "4",
                },
            ]
        } else {
            itemsMenu = [
                {
                    label: (
                        <Link
                            to="/deposit"
                            onClick={(e) => {
                                handlePreventPassThrough(e, "Deposit")
                            }}
                        >
                            Deposit Assets
                        </Link>
                    ),
                    key: "1",
                },
                {
                    label: (
                        <Link
                            to="/manage-assets"
                            onClick={(e) => {
                                handlePreventPassThrough(e, "Asset")
                            }}
                        >
                            Asset Management
                        </Link>
                    ),
                    key: "2",
                },
                // {
                //     label: (
                //         <Link
                //             to="/two-fa"
                //             onClick={(e) => {
                //                 handlePreventPassThrough(e, "2FA")
                //             }}
                //         >
                //             2FA
                //         </Link>
                //     ),
                //     key: "3",
                // },
                {
                    label: (
                        <div
                            className="open-account"
                            onClick={() => {
                                setIsOpenModalSocial(true)
                            }}
                        >
                            social login
                        </div>
                    ),
                    key: "4",
                },
            ]
        }
    } else {
        if (isLoginSocial) {
            itemsMenu = [
                {
                    label: <Link to="/manage-assets">Asset Management</Link>,
                    key: "2",
                },
                {
                    label: (
                        <Link
                            to="/deposit"
                            onClick={(e) => {
                                handlePreventPassThrough(e, "Deposit")
                            }}
                        >
                            Deposit Assets
                        </Link>
                    ),
                    key: "1",
                },
                {
                    label: (
                        <Link
                            to="/withdraw"
                            onClick={(e) => {
                                handlePreventPassThrough(e, "Withdraw")
                            }}
                        >
                            Withdraw Assets
                        </Link>
                    ),
                    key: "6",
                },

                {
                    label: <Link to="/two-fa">{isHave2FA ? "Change 2FA" : "Setup 2FA"}</Link>,
                    key: "3",
                },
                {
                    label: (
                        <div
                            className="open-account"
                            onClick={() => {
                                handleSignOut()
                            }}
                        >
                            logout <span>{`(${renderEmail(socialAccount?.email, 10)})`}</span>
                        </div>
                    ),
                    key: "4",
                },

                {
                    label: (
                        <div
                            className="disconnect"
                            onClick={() => {
                                onDisconnect()
                                handleDisConnected()
                            }}
                        >
                            Disconnect Wallet
                        </div>
                    ),
                    key: "5",
                },
            ]
        } else {
            itemsMenu = [
                {
                    label: (
                        <div
                            className="open-account"
                            onClick={() => {
                                setIsOpenModalSocial(true)
                            }}
                        >
                            social login
                        </div>
                    ),
                    key: "5",
                },
                {
                    label: (
                        <Link
                            to="/manage-assets"
                            onClick={(e) => {
                                handlePreventPassThrough(e, "Asset")
                            }}
                        >
                            Asset Management
                        </Link>
                    ),
                    key: "2",
                },
                {
                    label: (
                        <Link
                            to="/deposit"
                            onClick={(e) => {
                                handlePreventPassThrough(e, "Deposit")
                            }}
                        >
                            Deposit Assets
                        </Link>
                    ),
                    key: "1",
                },
                {
                    label: (
                        <Link
                            to="/withdraw"
                            onClick={(e) => {
                                handlePreventPassThrough(e, "Withdraw")
                            }}
                        >
                            Withdraw Assets
                        </Link>
                    ),
                    key: "6",
                },
                // {
                //     label: (
                //         <Link
                //             to="/two-fa"
                //             onClick={(e) => {
                //                 handlePreventPassThrough(e, "2FA")
                //             }}
                //         >
                //             2-FA
                //         </Link>
                //     ),
                //     key: "3",
                // },

                {
                    label: (
                        <div
                            className="disconnect"
                            onClick={() => {
                                onDisconnect()
                                handleDisConnected()
                            }}
                        >
                            Disconnect Wallet
                        </div>
                    ),
                    key: "4",
                },
            ]
        }
    }

    let itemsMenuEmail = []
    if (connectToCyber.isConnected) {
        itemsMenuEmail = [
            {
                label: <Link to="/deposit">Deposit Assets</Link>,
                key: "1",
            },
            {
                label: <Link to="/manage-assets">Asset Management</Link>,
                key: "2",
            },
            {
                label: <Link to="/two-fa">{isHave2FA ? "Change 2FA" : "Setup 2FA"}</Link>,
                key: "3",
            },
            {
                label: (
                    <div
                        className="open-account"
                        onClick={() => {
                            handleSignOut()
                        }}
                    >
                        logout <span>{`(${renderEmail(socialAccount?.email, 10)})`}</span>
                    </div>
                ),
                key: "4",
            },
        ]
    } else {
        if (isConnected) {
            itemsMenuEmail = [
                {
                    label: <Link to="/manage-assets">Asset Management</Link>,
                    key: "2",
                },
                {
                    label: <Link to="/deposit">Deposit Assets</Link>,
                    key: "1",
                },
                {
                    label: <Link to="/withdraw">Withdraw Assets</Link>,
                    key: "6",
                },

                {
                    label: <Link to="/two-fa">{isHave2FA ? "Change 2FA" : "Setup 2FA"}</Link>,
                    key: "3",
                },
                {
                    label: (
                        <div
                            className="open-account"
                            onClick={() => {
                                handleSignOut()
                            }}
                        >
                            logout <span>{`(${renderEmail(socialAccount?.email, 10)})`}</span>
                        </div>
                    ),
                    key: "4",
                },

                {
                    label: (
                        <div
                            className="disconnect"
                            onClick={() => {
                                onDisconnect()
                                handleDisConnected()
                            }}
                        >
                            Disconnect Wallet
                        </div>
                    ),
                    key: "5",
                },
            ]
        } else {
            itemsMenuEmail = [
                {
                    label: (
                        <div className="open-account" onClick={showConnectModal}>
                            connect wallet
                        </div>
                    ),
                    key: "5",
                },
                {
                    label: <Link to="/manage-assets">Asset Management</Link>,
                    key: "2",
                },
                {
                    label: (
                        <Link
                            to="/deposit"
                            onClick={(e) => {
                                handlePreventPassThrough(e, "Deposit")
                            }}
                        >
                            Deposit Assets
                        </Link>
                    ),
                    key: "1",
                },
                {
                    label: (
                        <Link
                            to="/withdraw"
                            onClick={(e) => {
                                handlePreventPassThrough(e, "Withdraw")
                            }}
                        >
                            Withdraw Assets
                        </Link>
                    ),
                    key: "6",
                },

                {
                    label: <Link to="/two-fa">{isHave2FA ? "Change 2FA" : "Setup 2FA"}</Link>,
                    key: "3",
                },
                {
                    label: (
                        <div
                            className="open-account"
                            onClick={() => {
                                handleSignOut()
                            }}
                        >
                            logout <span>{`(${renderEmail(socialAccount?.email, 10)})`}</span>
                        </div>
                    ),
                    key: "4",
                },
            ]
        }
    }

    let itemsMenuMobile = []
    if (connectToCyber.isConnected) {
        if (isLoginSocial) {
            itemsMenuMobile = [
                {
                    label: (
                        <Link to="/deposit" onClick={handleCloseMobileMenu}>
                            Deposit Assets
                        </Link>
                    ),
                    key: "1",
                },
                {
                    label: (
                        <Link to="/manage-assets" onClick={handleCloseMobileMenu}>
                            Asset Management
                        </Link>
                    ),
                    key: "2",
                },
                {
                    label: (
                        <Link to="/two-fa" onClick={handleCloseMobileMenu}>
                            {isHave2FA ? "Change 2FA" : "Setup 2FA"}
                        </Link>
                    ),
                    key: "3",
                },
                {
                    label: (
                        <div
                            className="open-account"
                            onClick={() => {
                                handleSignOut()
                            }}
                        >
                            logout <span>{`(${renderEmail(socialAccount?.email, 10)})`}</span>
                        </div>
                    ),
                    key: "4",
                },
            ]
        } else {
            itemsMenuMobile = [
                {
                    label: (
                        <Link
                            to="/deposit"
                            onClick={(e) => {
                                handlePreventPassThrough(e, "Deposit")
                                handleCloseMobileMenu()
                            }}
                        >
                            Deposit Assets
                        </Link>
                    ),
                    key: "1",
                },
                {
                    label: (
                        <Link
                            to="/manage-assets"
                            onClick={(e) => {
                                handlePreventPassThrough(e, "Asset")
                                handleCloseMobileMenu()
                            }}
                        >
                            Asset Management
                        </Link>
                    ),
                    key: "2",
                },
                // {
                //     label: (
                //         <Link
                //             to="/two-fa"
                //             onClick={(e) => {
                //                 handlePreventPassThrough(e, "2FA")
                //                 handleCloseMobileMenu()

                //             }}
                //         >
                //             2-FA
                //         </Link>
                //     ),
                //     key: "3",
                // },
                {
                    label: (
                        <div
                            className="open-account"
                            onClick={() => {
                                setIsOpenModalSocial(true)
                            }}
                        >
                            social login
                        </div>
                    ),
                    key: "4",
                },
            ]
        }
    } else {
        if (isLoginSocial) {
            itemsMenuMobile = [
                {
                    label: (
                        <Link to="/manage-assets" onClick={handleCloseMobileMenu}>
                            Asset Management
                        </Link>
                    ),
                    key: "2",
                },
                {
                    label: (
                        <Link
                            to="/deposit"
                            onClick={(e) => {
                                handleCloseMobileMenu()
                                handlePreventPassThrough(e, "Deposit")
                            }}
                        >
                            Deposit Assets
                        </Link>
                    ),
                    key: "1",
                },
                {
                    label: (
                        <Link
                            to="/withdraw"
                            onClick={(e) => {
                                handleCloseMobileMenu()
                                handlePreventPassThrough(e, "Withdraw")
                            }}
                        >
                            Withdraw Assets
                        </Link>
                    ),
                    key: "6",
                },

                {
                    label: (
                        <Link to="/two-fa" onClick={handleCloseMobileMenu}>
                            {isHave2FA ? "Change 2FA" : "Setup 2FA"}
                        </Link>
                    ),
                    key: "3",
                },
                {
                    label: (
                        <div
                            className="open-account"
                            onClick={() => {
                                handleSignOut()
                                handleCloseMobileMenu()
                            }}
                        >
                            logout <span>{`(${renderEmail(socialAccount?.email, 10)})`}</span>
                        </div>
                    ),
                    key: "4",
                },

                {
                    label: (
                        <div
                            className="disconnect"
                            onClick={() => {
                                onDisconnect()
                                handleCloseMobileMenu()
                                handleDisConnected()
                            }}
                        >
                            Disconnect Wallet
                        </div>
                    ),
                    key: "5",
                },
            ]
        } else {
            itemsMenuMobile = [
                {
                    label: (
                        <div
                            className="open-account"
                            onClick={() => {
                                setIsOpenModalSocial(true)
                            }}
                        >
                            social login
                        </div>
                    ),
                    key: "5",
                },
                {
                    label: (
                        <Link
                            to="/manage-assets"
                            onClick={(e) => {
                                handlePreventPassThrough(e, "Asset")
                                handleCloseMobileMenu()
                            }}
                        >
                            Asset Management
                        </Link>
                    ),
                    key: "2",
                },
                {
                    label: (
                        <Link
                            to="/deposit"
                            onClick={(e) => {
                                handlePreventPassThrough(e, "Deposit")
                                handleCloseMobileMenu()
                            }}
                        >
                            Deposit Assets
                        </Link>
                    ),
                    key: "1",
                },
                {
                    label: (
                        <Link
                            to="/withdraw"
                            onClick={(e) => {
                                handlePreventPassThrough(e, "Withdraw")
                                handleCloseMobileMenu()
                            }}
                        >
                            Withdraw Assets
                        </Link>
                    ),
                    key: "6",
                },
                // {
                //     label: (
                //         <Link
                //             to="/two-fa"
                //             onClick={(e) => {
                //                 handlePreventPassThrough(e, "2FA")
                //                 handleCloseMobileMenu()
                //             }}
                //         >
                //             2-FA
                //         </Link>
                //     ),
                //     key: "3",
                // },
                {
                    label: (
                        <div
                            className="disconnect"
                            onClick={() => {
                                onDisconnect()
                                handleCloseMobileMenu()
                                handleDisConnected()
                            }}
                        >
                            Disconnect Wallet
                        </div>
                    ),
                    key: "4",
                },
            ]
        }
    }

    let itemsMenuEmailMobile = []
    if (connectToCyber.isConnected) {
        itemsMenuEmail = [
            {
                label: (
                    <Link to="/deposit" onClick={handleCloseMobileMenu}>
                        Deposit Assets
                    </Link>
                ),
                key: "1",
            },
            {
                label: (
                    <Link to="/manage-assets" onClick={handleCloseMobileMenu}>
                        Asset Management
                    </Link>
                ),
                key: "2",
            },
            {
                label: (
                    <Link to="/two-fa" onClick={handleCloseMobileMenu}>
                        {isHave2FA ? "Change 2FA" : "Setup 2FA"}
                    </Link>
                ),
                key: "3",
            },
            {
                label: (
                    <div
                        className="open-account"
                        onClick={() => {
                            handleSignOut()
                            handleCloseMobileMenu()
                        }}
                    >
                        logout <span>{`(${renderEmail(socialAccount?.email, 10)})`}</span>
                    </div>
                ),
                key: "4",
            },
        ]
    } else {
        if (isConnected) {
            itemsMenuEmailMobile = [
                {
                    label: (
                        <Link to="/manage-assets" onClick={handleCloseMobileMenu}>
                            Asset Management
                        </Link>
                    ),
                    key: "2",
                },
                {
                    label: (
                        <Link to="/deposit" onClick={handleCloseMobileMenu}>
                            Deposit Assets
                        </Link>
                    ),
                    key: "1",
                },
                {
                    label: (
                        <Link to="/withdraw" onClick={handleCloseMobileMenu}>
                            Withdraw Assets
                        </Link>
                    ),
                    key: "6",
                },

                {
                    label: (
                        <Link to="/two-fa" onClick={handleCloseMobileMenu}>
                            {isHave2FA ? "Change 2FA" : "Setup 2FA"}
                        </Link>
                    ),
                    key: "3",
                },
                {
                    label: (
                        <div
                            className="open-account"
                            onClick={() => {
                                handleSignOut()
                                handleCloseMobileMenu()
                            }}
                        >
                            logout <span>{`(${renderEmail(socialAccount?.email, 10)})`}</span>
                        </div>
                    ),
                    key: "4",
                },

                {
                    label: (
                        <div
                            className="disconnect"
                            onClick={() => {
                                onDisconnect()
                                handleDisConnected()
                            }}
                        >
                            Disconnect Wallet
                        </div>
                    ),
                    key: "5",
                },
            ]
        } else {
            itemsMenuEmailMobile = [
                {
                    label: (
                        <div
                            className="open-account"
                            onClick={() => {
                                showConnectModal()
                            }}
                        >
                            connect wallet
                        </div>
                    ),
                    key: "5",
                },
                {
                    label: (
                        <Link to="/manage-assets" onClick={handleCloseMobileMenu}>
                            Asset Management
                        </Link>
                    ),
                    key: "2",
                },
                {
                    label: (
                        <Link
                            to="/deposit"
                            onClick={(e) => {
                                handleCloseMobileMenu()
                                handlePreventPassThrough(e, "Deposit")
                            }}
                        >
                            Deposit Assets
                        </Link>
                    ),
                    key: "1",
                },
                {
                    label: (
                        <Link
                            to="/withdraw"
                            onClick={(e) => {
                                handleCloseMobileMenu()
                                handlePreventPassThrough(e, "Deposit")
                            }}
                        >
                            Withdraw Assets
                        </Link>
                    ),
                    key: "6",
                },

                {
                    label: (
                        <Link to="/two-fa" onClick={handleCloseMobileMenu}>
                            {isHave2FA ? "Change 2FA" : "Setup 2FA"}
                        </Link>
                    ),
                    key: "3",
                },
                {
                    label: (
                        <div
                            className="open-account"
                            onClick={() => {
                                handleSignOut()
                                handleCloseMobileMenu()
                            }}
                        >
                            logout <span>{`(${renderEmail(socialAccount?.email, 10)})`}</span>
                        </div>
                    ),
                    key: "4",
                },
            ]
        }
    }

    return (
        <div>
            {/* {_renderMarquee()} */}
            <header
                className={classNames(`header`, {"is-active": toggleMenu}, {"is-top": isTop}, getHeaderClassName())}
            >
                <Row align="middle" className="custom-header">
                    <Col>
                        <div className="site-logo">
                            <Link to="/">
                                <img src={getLogoByEvent()} alt="logo" />
                            </Link>
                        </div>
                    </Col>
                    <Col flex="auto" className="header__center">
                        <nav className="header__nav">
                            <ul className="header__menu">
                                {SITE_MENU.map((item, index) => {
                                    return (
                                        <li key={index} className="header__menu-item">
                                            <div className="inner">
                                                {item.comingSoon && <div className="comming-soon">Coming soon</div>}
                                                {item.title === "Bounty Spin" && (
                                                    <div className="comming-soon">New</div>
                                                )}
                                                {item.comingSoon && (
                                                    <a className="canvas-menu__nav-link" onClick={onShowMessage}>
                                                        {item.title}
                                                    </a>
                                                )}
                                                {(item.title === "Mint NFT" || item.title === "Explore") && (
                                                    <ChangeMintPage
                                                        trigger="hover"
                                                        title={item.title}
                                                        url={item.url}
                                                        onPreventPassThrough={handlePreventPassThrough}
                                                        onCloseMobileMenu={handleCloseMobileMenu}
                                                    />
                                                )}
                                                {!item.comingSoon && item.external && item.title !== "Mint NFT" && (
                                                    <a
                                                        target="_blank"
                                                        href={item.url}
                                                        className="canvas-menu__nav-link"
                                                        rel="noreferrer"
                                                    >
                                                        {item.title}
                                                    </a>
                                                )}
                                                {!item.comingSoon &&
                                                    !item.external &&
                                                    item.title !== "Mint NFT" &&
                                                    item.title !== "Explore" && (
                                                        <NavLink
                                                            to={item.url}
                                                            className="canvas-menu__nav-link"
                                                            onClick={(e) => {
                                                                handlePreventPassThrough(e, item.title)
                                                            }}
                                                        >
                                                            {item.title}
                                                        </NavLink>
                                                    )}
                                            </div>
                                        </li>
                                    )
                                })}
                            </ul>
                        </nav>
                    </Col>
                    <Col className="header__right">
                        {location.pathname.includes("bounty-spin") && <ChangeMintNetwork />}
                        <Dropdown
                            overlayClassName="header__download-app-dropdown"
                            menu={{items: items}}
                            trigger={["click"]}
                            placement="bottomLeft"
                        >
                            <div className="header__download-app">
                                <img src={DeviceMobile} alt="" />
                            </div>
                        </Dropdown>

                        <div className="header__cta">
                            <div className="header__cta-login">
                                {isConnected ? (
                                    <Dropdown
                                        overlayClassName="header__choose-action"
                                        menu={{items: itemsMenu}}
                                        trigger={["click"]}
                                        placement="bottomLeft"
                                    >
                                        <Button
                                            className="header__wallet-address d-flex align-items-center"
                                            // onClick={showWalletModal}
                                        >
                                            {/* <Image src={iconWallet} preview={false} width={36} /> */}
                                            <Jdenticon size="36" value={user.account} />
                                            {getShortAddress(user.account, 9)}
                                        </Button>
                                    </Dropdown>
                                ) 
                                : walletConnect.isConnectedWalletConnect ? (
                                    <Dropdown
                                        overlayClassName="header__choose-action"
                                        menu={{items: itemsMenu}}
                                        trigger={["click"]}
                                        placement="bottomLeft"
                                    >
                                        <Button
                                            className="header__wallet-address d-flex align-items-center"
                                            // onClick={showWalletModal}
                                        >
                                            {/* <Image src={iconWallet} preview={false} width={36} /> */}
                                            <Jdenticon size="36" value={walletConnect.accountDataWalletConnect} />
                                            {getShortAddress(walletConnect.accountDataWalletConnect, 9)}
                                        </Button>
                                    </Dropdown>
                                ) 
                                : isLoginSocial ? (
                                    <Dropdown
                                        overlayClassName="header__choose-action"
                                        menu={{items: itemsMenuEmail}}
                                        trigger={["click"]}
                                        placement="bottomLeft"
                                        // getPopupContainer={()=>document.getElementById('login-email')}
                                    >
                                        <Button
                                            className="header__wallet-address d-flex align-items-center login-email"
                                            id="login-email"
                                        >
                                            <img src={emailIcon} alt="Email" />
                                            <span className="email">{renderEmail(socialEmail, 10)}</span>
                                        </Button>
                                    </Dropdown>
                                ) : (
                                    <Button type="primary" icon={<IconWallet />} onClick={showConnectModal}>
                                        Connect wallet
                                    </Button>
                                )}
                            </div>

                            <Button
                                type="text"
                                className="header__btn-toggle"
                                onClick={() => {
                                    setToggleMenu(true)
                                    document.body.classList.add("toggle-menu")
                                }}
                            >
                                <IconBars />
                            </Button>
                        </div>
                    </Col>
                </Row>
            </header>

            <div className={classNames("canvas-menu", {"is-open": toggleMenu})}>
                <div className="canvas-menu__wrapper">
                    <div className="canvas-menu__logo">
                        <Link to="/">
                            <Image src={logo} alt="mobile-log" preview={false} />
                        </Link>
                    </div>
                    <div className="canvas-menu__nav">
                        <ul className="canvas-menu__items">
                            {SITE_MENU.map((item, index) => {
                                return (
                                    <Fragment key={index}>
                                        {item.title === "Bounty Spin" ? (
                                            <li key={index} className="canvas-menu__item">
                                                <a
                                                    className="canvas-menu__nav-link comming"
                                                    onClick={() => {
                                                        handleCloseMobileMenu()
                                                        navigate("/special-event/bounty-spin")
                                                    }}
                                                >
                                                    <div className="comming-soon">New</div>
                                                    {item.title}
                                                </a>
                                            </li>
                                        ) : (
                                            <li
                                                key={index}
                                                className={`canvas-menu__item ${
                                                    item.title === "Explore" ? "explore" : ""
                                                }`}
                                            >
                                                {item.comingSoon && (
                                                    <a
                                                        className="canvas-menu__nav-link"
                                                        onClick={() => {
                                                            onShowMessage()
                                                            handleCloseMobileMenu()
                                                        }}
                                                    >
                                                        {item.title}
                                                    </a>
                                                )}
                                                {!item.comingSoon && item.external && (
                                                    <a
                                                        target="_blank"
                                                        href={item.url}
                                                        className="canvas-menu__nav-link"
                                                        rel="noreferrer"
                                                        onClick={() => {
                                                            handleCloseMobileMenu()
                                                            // navigate(item.url)
                                                        }}
                                                    >
                                                        {item.title}
                                                    </a>
                                                )}
                                                {(item.title === "Mint NFT" || item.title === "Explore") && (
                                                    <ChangeMintPage
                                                        isMobile={true}
                                                        trigger="click"
                                                        title={item.title}
                                                        url={item.url}
                                                        onPreventPassThrough={handlePreventPassThrough}
                                                        onCloseMobileMenu={handleCloseMobileMenu}
                                                    />
                                                )}

                                                {!item.comingSoon &&
                                                    !item.external &&
                                                    item.title !== "Mint NFT" &&
                                                    item.title !== "Explore" &&
                                                    item.title !== "Bounty Spin" && (
                                                        <NavLink
                                                            to={item.url}
                                                            className="canvas-menu__nav-link"
                                                            onClick={(e) => {
                                                                handleCloseMobileMenu()
                                                                handlePreventPassThrough(e, item.title)
                                                            }}
                                                        >
                                                            {item.title}
                                                        </NavLink>
                                                    )}
                                            </li>
                                        )}
                                    </Fragment>

                                    // <li key={index} className="canvas-menu__item">
                                    //     {item.comingSoon && (
                                    //         <a className="canvas-menu__nav-link" onClick={onShowMessage}>
                                    //             {item.title}
                                    //         </a>
                                    //     )}
                                    //     {!item.comingSoon && item.external && (
                                    //         <a
                                    //             target="_blank"
                                    //             href={item.url}
                                    //             className="canvas-menu__nav-link"
                                    //             rel="noreferrer"
                                    //         >
                                    //             {item.title}
                                    //         </a>
                                    //     )}
                                    //     {!item.comingSoon && !item.external && (
                                    //         <NavLink to={item.url} className="canvas-menu__nav-link">
                                    //             {item.title}
                                    //         </NavLink>
                                    //     )}
                                    // </li>
                                )
                            })}
                        </ul>
                    </div>
                    <div className="canvas-menu__cta">
                        <div className="header__download-app">
                            <img
                                src={DeviceMobile}
                                alt=""
                                onClick={() => {
                                    // openMobiQrCode()
                                    window.open("https://onelink.to/kqzrmx")
                                }}
                            />
                            {/* <ModalQr isOpen={isOpenMobiQrCode} setIsOpen={setIsOpenMobiQrCode} /> */}
                        </div>
                        <div className="canvas-menu__cta-login">
                            {isConnected ? (
                                <Dropdown
                                    overlayClassName="header__choose-action-mobile"
                                    menu={{items: itemsMenuMobile}}
                                    trigger={["click"]}
                                    placement="topRight"
                                >
                                    <Button className="header__wallet-address -mobile" block>
                                        <Image src={iconWallet} preview={false} width={36} />
                                        {getShortAddress(user.account, 6)}
                                    </Button>
                                </Dropdown>
                            ) : isLoginSocial ? (
                                <Dropdown
                                    overlayClassName="header__choose-action-mobile"
                                    menu={{items: itemsMenuEmailMobile}}
                                    trigger={["click"]}
                                    placement="topRight"
                                >
                                    <Button className="header__wallet-address -mobile login-email" block>
                                        <img src={emailIcon} alt="Email" />
                                        <span className="email">{renderEmail(socialEmail, 6)}</span>
                                    </Button>
                                </Dropdown>
                            ) : (
                                <Button
                                    type="primary"
                                    className="-primary-2"
                                    icon={<IconWallet />}
                                    onClick={showConnectModal}
                                    block
                                >
                                    Connect wallet
                                </Button>
                            )}
                            <SelectMenuPopup isOpen={isOpenSelectMenu} setIsOpen={setIsOpenSelectMenu} />
                        </div>
                    </div>
                </div>

                <div
                    className="canvas-menu__outside"
                    onClick={() => {
                        setToggleMenu(false)
                        document.body.classList.remove("toggle-menu")
                    }}
                />
            </div>

            {/* <MFModal
                title={"Wallet Information"}
                visible={isWalletModalVisible}
                onCancel={hideWalletModal}
                footer={[
                    <div className={"flex w-full"} key={"account-modal-footer"}>
                        <button
                            type="button"
                            onClick={() => onDisconnect(() => setIsWalletModalVisible(false))}
                            className="w-1/2 button button-dark"
                        >
                            Disconnect
                        </button>
                        <button type="button" onClick={hideWalletModal} className="w-1/2 button button-secondary">
                            Done
                        </button>
                    </div>,
                ]}
            >
                <div>
                    <div className="flex flex-col modal-body-row">
                        <div className={"flex modal-body-row-title"}>Wallet address</div>
                        <Paragraph
                            className={"text-flex text-white"}
                            copyable={{text: user.account, format: "text/plain"}}
                        >
                            {getShortAddress(user.account, 12)}
                        </Paragraph>
                        {renderAccountExtra()}
                    </div>
                    <div className="flex flex-col modal-body-row mt-3">
                        <div className={"flex modal-body-row-title"}>Balance</div>
                        <div className={"flex text-white"}>{user.balance} (GLMR)</div>
                    </div>
                    <div className="flex flex-col modal-body-row mt-3">
                        <div className={"flex modal-body-row-title"}>MFG Balance</div>
                        <div className={"flex text-white"}>{user.mfgBalance ? user.mfgBalance : "Unknown"} (MFG)</div>
                    </div>
                    <div className="flex flex-col modal-body-row mt-3">
                        <div className={"flex modal-body-row-title"}>Network</div>
                        <div className={"flex text-white"}>{CHAIN_ID_MAPPING[user.chainId]}</div>
                    </div>
                </div>
            </MFModal> */}
        </div>
    )
}

export default Header

