// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app"
import {getAnalytics} from "firebase/analytics"
import {getAuth, signInWithPopup, GoogleAuthProvider, signOut, OAuthProvider,signInWithRedirect} from "firebase/auth"
import {message as AntdMessage} from "antd"
import {setLocalStorage, LOCALSTORAGE_KEY, getLocalStorage, removeLocalStorage} from "./storage"
import {createUserAPI, sendUserTimezoneAPI} from "../../services/create-user-in-db"
import {connectWalletToAccountAPI} from "../../services/connect-account"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
    apiKey: "AIzaSyBaxQq4UR37DOnc5kF1UJI0jn5OLMK-fG8",
    // authDomain: "sw-move2earn-app-f8519.firebaseapp.com",
    authDomain: "app.moonfit.xyz",

    databaseURL: "https://sw-move2earn-app-f8519-default-rtdb.firebaseio.com",
    projectId: "sw-move2earn-app-f8519",
    storageBucket: "sw-move2earn-app-f8519.appspot.com",
    messagingSenderId: "619500821290",
    appId: "1:619500821290:web:62bf1adf647deb739d5c53",
    measurementId: "G-6C18S0ENXE",
}

// export const firebaseConfig = {
//   apiKey: "AIzaSyDeLto8NTAfLpNRNhTgokvHu_7Ahg0rEZA",
//   authDomain: "login-firebase-d1f8d.firebaseapp.com",
//   projectId: "login-firebase-d1f8d",
//   storageBucket: "login-firebase-d1f8d.appspot.com",
//   messagingSenderId: "31744565688",
//   appId: "1:31744565688:web:f475ff7c30161a1c986f4d",
//   measurementId: "G-9Q29CZ6HJB"
// };

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)

// Initialize Firebase Auth provider
const googleProvider = new GoogleAuthProvider()
const appleProvider = new OAuthProvider("apple.com")
// whenever a user interacts with the provider, we force them to select an account
googleProvider.setCustomParameters({
    prompt: "select_account ",
})

appleProvider.setCustomParameters({
    prompt: "select_account ",
})
export const auth = getAuth()
export const signInWithGooglePopup = async () => {
    try {
        const res = await signInWithPopup(auth, googleProvider)
        // const res = await signInWithRedirect(auth,googleProvider)
        if (res) {
            const isAlreadyInDb = res?.user?.reloadUserInfo?.customAttributes ? true : false
            const uId = res?.user?.uid

            const walletSignature = JSON.parse(getLocalStorage(LOCALSTORAGE_KEY.WALLET_SIGNATURE)) || null

            const user = res?.user
            const accessToken = res?.user?.accessToken
            const refreshToken = res?.user?.refreshToken

            setLocalStorage(LOCALSTORAGE_KEY.ACCESS_TOKEN, accessToken)
            setLocalStorage(LOCALSTORAGE_KEY.REFRESH_TOKEN, refreshToken)
            setLocalStorage(LOCALSTORAGE_KEY.SOCIAL_ACOUNT, JSON.stringify(user))
            
            const dataTimezone={
                "timezone_offset_minute": new Date().getTimezoneOffset(),
                "timezone": Intl.DateTimeFormat().resolvedOptions().timeZone,
            }
       

            if (!isAlreadyInDb) {
                const value = {
                    input: {
                        uid: uId,
                        data: {is_testnet: false},
                    },
                }
             

                const dataTimezone={
                    "timezone_offset_minute": new Date().getTimezoneOffset(),
                    "timezone": Intl.DateTimeFormat().resolvedOptions().timeZone,
                }

                await createUserAPI(value)
                await sendUserTimezoneAPI(dataTimezone)
            }
            if (walletSignature !== null) {
                await connectWalletToAccountAPI()
            }
            AntdMessage.success({
                key: "success",
                content: `Successfully to login with ${user?.email}`,
                className: "message-success",
                duration: 5,
            })

            return true
        }
    } catch (err) {
        AntdMessage.error({
            key: "err",
            content: err.message,
            className: "message-error",
            duration: 5,
        })
        return false
    }
}

export const signInWithApplePopup = async () => {
    try {
        const res = await signInWithPopup(auth, appleProvider)
        if (res) {
            const isAlreadyInDb = res?.user?.reloadUserInfo?.customAttributes ? true : false
            const uId = res?.user?.uid

            const walletSignature = JSON.parse(getLocalStorage(LOCALSTORAGE_KEY.WALLET_SIGNATURE)) || null

            const user = res?.user
            const accessToken = res?.user?.accessToken
            const refreshToken = res?.user?.refreshToken

            setLocalStorage(LOCALSTORAGE_KEY.ACCESS_TOKEN, accessToken)
            setLocalStorage(LOCALSTORAGE_KEY.REFRESH_TOKEN, refreshToken)
            setLocalStorage(LOCALSTORAGE_KEY.SOCIAL_ACOUNT, JSON.stringify(user))

            if (!isAlreadyInDb) {
                const value = {
                    input: {
                        uid: uId,
                        data: {is_testnet: false},
                    },
                }
              
                const dataTimezone={
                    "timezone_offset_minute": new Date().getTimezoneOffset(),
                    "timezone": Intl.DateTimeFormat().resolvedOptions().timeZone,
                }

                await createUserAPI(value)
                await sendUserTimezoneAPI(dataTimezone)
            }
            if (walletSignature !== null) {
                await connectWalletToAccountAPI()
            }
            AntdMessage.success({
                key: "success",
                content: `Successfully to login with ${user?.email}`,
                className: "message-success",
                duration: 5,
            })

            return true
        }
    } catch (err) {
        AntdMessage.error({
            key: "err",
            content: err.message,
            className: "message-error",
            duration: 5,
        })
        return false
    }
}

export const signOutAllPlatform = async () => {
    signOut(auth)
        .then((result) => {
            // Sign-out successful.
            removeLocalStorage(LOCALSTORAGE_KEY.ACCESS_TOKEN)
            removeLocalStorage(LOCALSTORAGE_KEY.REFRESH_TOKEN)
            removeLocalStorage(LOCALSTORAGE_KEY.SOCIAL_ACOUNT)
        })
        .catch((error) => {
            // An error happened.
            console.log("signOutError")
        })
}

