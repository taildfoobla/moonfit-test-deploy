import React from "react"
import "./styles.less"
import {Modal} from "antd"
import moonfitLogo from "../../assets/images/logo.png"
import closeBorder from "../../assets/images/astar-rewards/close-border.png"
import bg from "../../assets/images/wallets/login-social-bg.png"
import img from "../../assets/images/wallets/login-social-img.png"
import appleLogo from "../../assets/images/wallets/apple-black-logo-1.png"
import googleLogo from "../../assets/images/wallets/google-1.png"
import {signInWithApplePopup, signInWithGooglePopup} from "../../core/utils/helpers/firebase"
import {LOCALSTORAGE_KEY, setLocalStorage} from "../../core/utils/helpers/storage"
import {useAuth} from "../../core/contexts/auth"
export default function SignSocial({isOpen, onClose}) {
    const {setIsLoginSocial} = useAuth()

    const handleSignInGoogle = async () => {
        const success = await signInWithGooglePopup()
        if (success) {
            setIsLoginSocial(true)
        } else {
            setIsLoginSocial(false)
        }
        onClose()
    }

    const handleSignInApple = async () => {
        const success = await signInWithApplePopup()
        if (success) {
            setIsLoginSocial(true)
        } else {
            setIsLoginSocial(false)
        }
        onClose()
    }

    return (
        <Modal className="login-social-modal" open={isOpen} onCancel={onClose} centered={true} footer={false}>
            <div className="border-gradient"></div>
            <img className="bg-login-social" src={bg} alt="Moonfit" />
            <button className="close-button" onClick={onClose}>
                <img src={closeBorder} alt="close" />
            </button>
            <img className="moonfit-logo" src={moonfitLogo} alt="Moonfit" />
            <img className="picture-login-social" src={img} alt="Moonfit" />
            <div className="login-social-content">
                <h3>welcome to Moonfit</h3>
                <p>By signing up, you agree to our Terms of Use, Privacy Policy and Cookies Policy.</p>
                <button className="login-google" onClick={handleSignInGoogle}>
                    <img src={googleLogo} alt="Google" />
                    <span>Sign in with Google</span>
                </button>
                <button className="login-apple" onClick={handleSignInApple}>
                    <img src={appleLogo} alt="Apple" />
                    <span>Sign in with Apple</span>
                </button>
            </div>
        </Modal>
    )
}

