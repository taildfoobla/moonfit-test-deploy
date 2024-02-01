import React, { useEffect } from "react"
import router from "./router"
import { AuthProvider } from "./core/contexts/auth"
import { TokenBalanceProvider } from "./core/contexts/token-balance"
import AOS from "aos"
import routerWithoutProvider from "./routerWithoutProvider"
import {CyberApp} from "@cyberlab/cyber-app-sdk"
import FirstShow from "./components/FirstShow"
import ChooseAccountModal from "./components/ChooseAccount"
import {useLocation} from "react-router-dom"
import BodyBg from "./assets/images/planet.png"
import {render} from "@testing-library/react"
import GlobalContextProvider from "./core/contexts/global"
// import WalletConnectProvider from "./core/contexts/wallet-connect"

function App() {
    const location = useLocation()
    useEffect(() => {
        AOS.init({
            once: true,
            offset: 0
        })
    }, [])
    useEffect(() => {
        const bodyElement = document.body
        if (location.pathname.includes("explore")||location.pathname.includes("lucky-wheel")) {
            bodyElement.style.backgroundImage = "none"
        } else {
            bodyElement.style.backgroundImage=""
        }
    }, [location.pathname])

    // const renderBodyBg = () => {
    //     return (
    //         <div className="body=bg">
    //             <img src={BodyBg} alt="" />
    //         </div>
    //     )
    // }
    return (
        <AuthProvider>
            {/* <WalletConnectProvider> */}
            <GlobalContextProvider>
            <FirstShow />
            <ChooseAccountModal />
            <ScrollTop>
                <TokenBalanceProvider>{router}</TokenBalanceProvider>
                <div>{routerWithoutProvider}</div>
            </ScrollTop>
            </GlobalContextProvider>
            {/* </WalletConnectProvider> */}
        </AuthProvider>
    )
}

const ScrollTop = ({ children }) => {
    const location = useLocation();
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        const body = document.querySelector("body")
        let timer = null
        if (body && location.pathname.includes('summer-fitsnap-challenge')) {
            timer = setTimeout(() => {
                body.style.backgroundColor = "#f3d9b1"
            }, 1000)
        } else {
            body.style.backgroundColor = "#020722"
        }
        return () => {
            clearTimeout(timer)
        }
    }, [location]);
    return children
}

export default App
