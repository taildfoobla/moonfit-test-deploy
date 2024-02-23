import React, {useState} from "react"
import "./styles.less"
import {Modal} from "antd"
import closeBorder from "../../assets/images/astar-rewards/close-border.png"
import moonfitLogo from "../../assets/images/logo.png"
import metamaskLogo from "../../assets/images/wallets/metamask-2.png"
import subwalletLogo from "../../assets/images/wallets/subwallet-2.png"
import walletconnectLogo from "../../assets/images/wallets/walletconnect-2.png"
import socialLoginIcon from "../../assets/images/wallets/social-login.png"
import {EVM_WALLETS} from "../../core/utils/constants/blockchain"
import {connectWalletToAccountAPI} from "../../core/services/connect-account"
import {isMobileOrTablet} from "../../core/utils/helpers/device"

export default function ConnectWalletModal({
    onWalletSelect,
    setIsConnectModalVisible,
    setIsOpenModalSocial,
    isOpen,
    onClose,
    isLoginSocial,
    setIsOpenWalletConnectModal,
}) {
    const [isUsedMobile, setIsUsedMobile] = useState(isMobileOrTablet())
    const metamask = EVM_WALLETS.find((wallet) => wallet.title === "MetaMask")
    const subwallet = EVM_WALLETS.find((wallet) => wallet.title === "SubWallet (EVM)")

    const handleOpenLoginSocialModal = () => {
        setIsConnectModalVisible(false)
        setIsOpenModalSocial(true)
    }

    const handleConnectWallet = async (wallet) => {
        const isMobile = isMobileOrTablet()
        const isVisible = isMobile ? wallet.isMobileSupport : true

        const isInstalled = window[wallet.extensionName] && window[wallet.extensionName][wallet.isSetGlobalString]
        if (isVisible) {
            await onWalletSelect(wallet)
            // if (isLoginSocial) {
            //     await connectWalletToAccountAPI()
            // }
        } else if (!isInstalled && !isMobile) {
            window.open(wallet.installUrl)
        }
    }

    return (
        <Modal className="connect-wallet-modal" open={isOpen} onCancel={onClose} centered={true} footer={false}>
            <div className="border-gradient"></div>
            <button className="close-button" onClick={onClose}>
                <img src={closeBorder} alt="close" />
            </button>
            <img className="moonfit-logo" src={moonfitLogo} alt="Moonfit" />
            <h3>welcome to Moonfit</h3>
            <p>Please select sign-in method</p>
            <ul className={isLoginSocial ? "login-social" : ""}>
                {!isUsedMobile && (
                    <>
                        <li
                            onClick={() => {
                                handleConnectWallet(metamask)
                            }}
                        >
                            <div className="wallet-picture">
                                <div className="border-gradient"></div>
                                <div className="wallet-img">
                                    <img src={metamaskLogo} alt="MetaMask" />
                                </div>
                            </div>

                            <span>MetaMask</span>
                        </li>
                        <li
                            onClick={() => {
                                handleConnectWallet(subwallet)
                            }}
                        >
                            <div className="wallet-picture">
                                <div className="border-gradient"></div>
                                <div className="wallet-img">
                                    <img src={subwalletLogo} alt="SubWallet" />
                                </div>
                            </div>
                            <span>SubWallet</span>
                        </li>
                    </>
                )}

                <li
                    onClick={() => {
                        onClose()
                        setIsOpenWalletConnectModal(true)
                    }}
                >
                    <div className="wallet-picture">
                        <div className="border-gradient"></div>
                        <div className="wallet-img">
                            <img src={walletconnectLogo} alt="WalletConnect" />
                        </div>
                    </div>
                    <span>WalletConnect</span>
                </li>
            </ul>
            {!isLoginSocial && (
                <div className="social-login-wrapper">
                    <div className="border-gradient"></div>

                    <button className="social-login" onClick={handleOpenLoginSocialModal}>
                        <p>Social login</p>
                        <img src={socialLoginIcon} alt="SocialLogin" />
                    </button>
                </div>
            )}
        </Modal>
    )
}

