import React, {useEffect, useState} from "react"
import mfg from "../../../assets/images/lucky-wheel/mfg.png"
import mfr from "../../../assets/images/lucky-wheel/mfr-border.svg"
import mfrWhite from "../../../assets/images/lucky-wheel/mfr-white.svg"
import raffleTicket from "../../../assets/images/lucky-wheel/raffle-ticket.svg"
import astarTicket from "../../../assets/images/lucky-wheel/astar-luckywheel.png"
import apesTicket from "../../../assets/images/lucky-wheel/apes-ticket.png"
import monesTicket from "../../../assets/images/lucky-wheel/mones-ticket.png"
import ajunaTicket from "../../../assets/images/lucky-wheel/ajuna-ticket.svg"
import spinTicket from "../../../assets/images/lucky-wheel/spin-ticket.svg"
import moonboxSlot from "../../../assets/images/lucky-wheel/moonbox-slot.svg"
import GLMR from "../../../assets/images/lucky-wheel/glmr.png"
import gift from "../../../assets/images/lucky-wheel/gift.svg"
import lottery from "../../../assets/images/lucky-wheel/lottery.svg"
import glmrReward from "../../../assets/images/lucky-wheel/reward/GLMR-reward.png"
import moonboxslotReward from "../../../assets/images/lucky-wheel/reward/MoonBox-reward.png"
import mfgReward from "../../../assets/images/lucky-wheel/reward/MFG-reward.png"
import mfrReward from "../../../assets/images/lucky-wheel/reward/MFR-reward.png"
import astrReward from "../../../assets/images/lucky-wheel/reward/ASTR-reward.png"
import glmrWheel from "../../../assets/images/lucky-wheel/wheel/glmr-wheel.png"
import moonboxslotWheel from "../../../assets/images/lucky-wheel/wheel/moonboxslot-wheel.png"
import mfgWheel from "../../../assets/images/lucky-wheel/wheel/mfg-wheel.png"
import mfrWheel from "../../../assets/images/lucky-wheel/wheel/mfr-wheel.png"
import astrWheel from "../../../assets/images/lucky-wheel/wheel/astar-wheel.png"


// import {spinWheel} from "../../services/LuckyWheelServices"
import {
    checkOnchain,
    spintOnChainNoToken,
    spintOnChainHaveToken,
    updateTransactionHaveToken,
    updateTransactionNoToken,
} from "../../../core/services/lucky-wheel"
import {message} from "antd"
// import {refreshAccessToken} from "../../utils/webview"
import LuckyWheelRewardModal from "./LuckyWheelRewardModal"
import WidgetBar from "./WidgetBar"
import CryptoJS from "crypto-js"
import {useAuth} from "../../../core/contexts/auth"
import {
    LOCALSTORAGE_KEY,
    getLocalStorage,
    setLocalStorage,
    removeLocalStorage,
} from "../../../core/utils/helpers/storage"
import {COMMON_CONFIGS} from "../../../core/utils/configs/common"
import {switchToNetworkOnchain} from "../../../core/utils-app/blockchain"
import {depositOnchainWheelNoToken, depositOnchainWheelHaveToken} from "../../../core/utils/helpers/wheel"
import RewardModal from "../../../components/LuckyWheelRewardModal"
import {message as AntdMessage} from "antd"
const {CYBER_ACCOUNT_KEY} = COMMON_CONFIGS

const Wheel = (props) => {
    const {
        freeSpin,
        luckyWheel,
        user,
        refetch,
        loadingFetch,
        setRefetch,
        setFreeSpin,
        gameToken,
        setGameToken,
        getHistoryData,
    } = props
    const [loading, setLoading] = useState(false)
    const [reward, setReward] = useState({})
    const [openReward, setOpenReward] = useState(false)
    const [currentDeg, setCurrentDeg] = useState(0)
    const [showWidget, setShowWidget] = useState(true)
    const [index, setIndex] = useState(null)
    const {
        auth,
        provider,
        connector,
        handleGetAccessToken,
        onDisconnect,
        sendViaCyberWallet,
        connectToCyber,
        setIsOpenModalChooseAccount,
        listUsers,
    } = useAuth()
    const toggleReward = (open) => setOpenReward(open)

    const checkApi = async (callback, array) => {
        const userId = getLocalStorage(LOCALSTORAGE_KEY.SELECTED_USER_ID)
        const account = JSON.parse(getLocalStorage(LOCALSTORAGE_KEY.WALLET_SIGNATURE))?.account
        try {
            const res = await callback(array.map((item) => item))
            const {message} = res

            if (res.success === undefined) {
                return res
            }

            if (res.success) {
                return res
            } else {
                if (message === "User is invalid.") {
                    return AntdMessage.error({
                        key:"err",
                        content: message,
                        className: "message-error",
                        duration: 5,
                    })
                }
                const newTokenRes = await handleGetAccessToken(account, userId)
                if (newTokenRes?.data?.success) {
                    const newTokenData = newTokenRes?.data?.data
                    const accessToken = newTokenData.access_token
                    const refreshToken = newTokenData.refresh_token
                    removeLocalStorage("ACCESS_TOKEN")
                    removeLocalStorage(LOCALSTORAGE_KEY.ACCESS_TOKEN)
                    removeLocalStorage(LOCALSTORAGE_KEY.REFRESH_TOKEN)
                    removeLocalStorage("REFRESH_TOKEN")
                    setLocalStorage(LOCALSTORAGE_KEY.ACCESS_TOKEN, accessToken)
                    setLocalStorage(LOCALSTORAGE_KEY.REFRESH_TOKEN, refreshToken)
                    setLocalStorage("ACCESS_TOKEN", accessToken)
                    setLocalStorage("REFRESH_TOKEN", refreshToken)
                    const newData = await callback(array.map((item) => item))
                    return newData
                } else {
                    onDisconnect()
                    return AntdMessage.error({
                        key:"err",
                        content: "Your login session has expired",
                        className: "message-error",
                        duration: 5,
                    })
                }
            }

            // return res
        } catch (err) {
            console.log("err",err)
        }
    }

    const openMessage = () => {
        message.error({
            key: "unique",
            className: "message-error",
            content: "Insufficient token",
        })
        setTimeout(() => {
            message.error({
                key: "unique",
                content: "Insufficient token",
                duration: 2,
            })
        }, 1000)
    }

    const rotateWheel = (count) => {
        let wheel = document.getElementById("inner-wheel")
        // if (currentDeg !== 0) {
        //     wheel.style.transition = `${7 + count * 0.5}s linear`
        // } else {
        //     wheel.style.transition = `${6 + count * 0.5}s linear`
        // }
        wheel.style.transition = `7s linear`

        let deg = currentDeg + count * 2 * 1080

        wheel.style.transform = "rotate(" + deg + "deg)"
    }
    const onSpin = async () => {
        if (loading) {
            return
        }
        // if (gameToken < 5 && !freeSpin) {
        //     return openMessage()
        // }

        const token = !freeSpin ? gameToken - 5 : gameToken
        // // updateGameToken(token)
        setGameToken(token)
        setShowWidget(false)
        const walletAddress = JSON.parse(getLocalStorage(LOCALSTORAGE_KEY.WALLET_SIGNATURE))?.account
        if (!walletAddress) {
            return AntdMessage.error({
                key:"err",
                content: "Please connect your wallet",
                className: "message-error",
                duration: 5,
            })
        }

        const accessToken = getLocalStorage(LOCALSTORAGE_KEY.ACCESS_TOKEN)
        if (connectToCyber?.isConnected) {
            if (accessToken !== null) {
                try {
                    setLoading(true)
                    // let wheel = document.getElementById("inner-wheel")
                    // wheel.style.transition = "10s"
                    // wheel.style.transform = "rotate(" + 1080 + "deg)"

                    const res = await checkApi(spintOnChainHaveToken, [])

                    const {data, success} = res
                    if (success) {
                        const transactionData = data?.transaction_data
                        const chainId = transactionData.chainId

                        const hash = await sendViaCyberWallet(transactionData)
                        if (hash) {
                            await checkApi(updateTransactionHaveToken, [data.wallet_transaction_id, hash])

                            let count = 1
                            rotateWheel(count)
                            const x = await checkOnchain([data.lucky_wheel_id])

                            let isCompleted = x.data?.reward
                            let y
                            let z
                            if (!isCompleted) {
                                y = setInterval(async () => {
                                    z = await checkOnchain([data.lucky_wheel_id])
                                    isCompleted = z.data?.reward
                                    if (isCompleted) {
                                        clearInterval(y)
                                        setReward(z.data?.reward)
                                        const totalDeg = 360 - z.data.reward.deg + 18 + count * 2 * 1080
                                        setCurrentDeg(totalDeg)
                                        let wheel = document.getElementById("inner-wheel")
                                        wheel.style.transition = `7s ease-out`
                                        wheel.style.transform = "rotate(" + totalDeg + "deg)"
                                        setTimeout(async() => {
                                            setLoading(false)
                                            if (z.data?.reward?.type === "MFR") {
                                                setGameToken(token + z.data?.reward?.value)
                                            }
                                            const x = Math.floor(totalDeg / 360)
                                            const y = totalDeg - x * 360
                                            setCurrentDeg(y)
                                            wheel.style.transition = "0s"
                                            // wheel.style.transform = "rotate(" +y + "deg)"

                                            toggleReward(true)
                                            setFreeSpin(z.data.free_spin)
                                            await getHistoryData()
                                            // setTimeout(() => {
                                            //     wheel.style.transition = "0s"
                                            //     wheel.style.transform = "rotate(" +y + "deg)"
                                            // }, 2000)
                                        }, 7500)
                                    } else {
                                        count++
                                        rotateWheel(count)
                                    }
                                }, 5000)
                            }
                        }

                        
                      
                        // setReward(z.data?.reward)
                        // const totalDeg = 3600 - data.reward.deg + 18
                        // setCurrentDeg(totalDeg)
                        // wheel.style.transform = "rotate(" + totalDeg + "deg)"
                        // setTimeout(() => {
                        //     setLoading(false)
                        //     if (data?.reward?.type === "MFR") {
                        //         setGameToken(token + data?.reward?.value)
                        //     }
                        //     wheel.style.transition = "0s"
                        //     toggleReward(true)
                        //     setFreeSpin(data.free_spin)
                        // }, 12000)
                    } else {
                        setLoading(false)
                    }
                } catch (error) {
                    setLoading(false)
                    // refreshAccessToken()
                }
            } else {
                if (listUsers?.data?.length > 0) {
                    setIsOpenModalChooseAccount(true)
                    return
                }
                try {
                    setLoading(true)
                    // let wheel = document.getElementById("inner-wheel")
                    // wheel.style.transition = "10s"
                    // wheel.style.transform = "rotate(" + 1080 + "deg)"
                    const walletAddress = JSON.parse(getLocalStorage(LOCALSTORAGE_KEY.WALLET_SIGNATURE)).account

                    const value = {
                        wallet_address: walletAddress,
                        time: Date.now(),
                    }
                    const key = CryptoJS.AES.encrypt(JSON.stringify(value), CYBER_ACCOUNT_KEY).toString()

                    const reqData = {
                        key,
                        wallet_address: walletAddress.toLowerCase(),
                    }
                    const res = await spintOnChainNoToken(reqData)

                    const {data, success} = res
                    if (success) {
                        const transactionData = data?.transaction_data
                        const chainId = transactionData.chainId

                        const hash = await sendViaCyberWallet(transactionData)
                        if (hash) {
                            await updateTransactionNoToken({
                                transaction_id: data.wallet_transaction_id,
                                transaction_hash: hash,
                                key,
                            })
                            let count = 1
                            rotateWheel(count)
                            const x = await checkOnchain([data.lucky_wheel_id])
                            let isCompleted = x.data?.reward
                            let y
                            let z
                       
                            y = setInterval(async () => {
                                z = await checkOnchain([data.lucky_wheel_id])
                                isCompleted = z.data?.reward
                                if (isCompleted) {
                                    clearInterval(y)
                                    setReward(z.data?.reward)
                                    const totalDeg = 360 - z.data.reward.deg + 18 + count * 2 * 1080
                                    setCurrentDeg(totalDeg)
                                    let wheel = document.getElementById("inner-wheel")
                                    wheel.style.transition = `7s ease-out`
                                    wheel.style.transform = "rotate(" + totalDeg + "deg)"
                                    setTimeout(async() => {
                                        setLoading(false)
                                        if (z.data?.reward?.type === "MFR") {
                                            setGameToken(token + z.data?.reward?.value)
                                        }
                                        const x = Math.floor(totalDeg / 360)
                                        const y = totalDeg - x * 360
                                        setCurrentDeg(y)
                                        wheel.style.transition = "0s"
                                        // wheel.style.transform = "rotate(" +y + "deg)"

                                        toggleReward(true)
                                        setFreeSpin(z.data.free_spin)
                                        await getHistoryData()
                                        // setTimeout(() => {
                                        //     wheel.style.transition = "0s"
                                        //     wheel.style.transform = "rotate(" +y + "deg)"
                                        // }, 2000)
                                    }, 7500)
                                } else {
                                    count++
                                    rotateWheel(count)
                                }
                            }, 5000)
                        } else {
                            setLoading(false)
                            return
                        }
                       
                     
                        // setReward(z.data?.reward)
                        // const totalDeg = 3600 - data.reward.deg + 18
                        // setCurrentDeg(totalDeg)
                        // wheel.style.transform = "rotate(" + totalDeg + "deg)"
                        // setTimeout(() => {
                        //     setLoading(false)
                        //     if (data?.reward?.type === "MFR") {
                        //         setGameToken(token + data?.reward?.value)
                        //     }
                        //     wheel.style.transition = "0s"
                        //     toggleReward(true)
                        //     setFreeSpin(data.free_spin)
                        // }, 12000)
                    } else {
                        setLoading(false)
                    }
                } catch (error) {
                    setLoading(false)
                    // refreshAccessToken()
                }
            }
        } else {
            if (accessToken !== null) {
                try {
                    setLoading(true)
                    // let wheel = document.getElementById("inner-wheel")
                    // wheel.style.transition = "10s"
                    // wheel.style.transform = "rotate(" + 1080 + "deg)"

                    const res = await checkApi(spintOnChainHaveToken, [])

                    const {data, success} = res
                    if (success) {
                        const transactionData = data?.transaction_data
                        const chainId = transactionData.chainId
                        if (provider) {
                            const switchSuccess = await switchToNetworkOnchain(provider, chainId, transactionData)
                            if (!switchSuccess) {
                                setLoading(false)
                                return
                            }
                            const sendTransactionSuccess = await checkApi(depositOnchainWheelHaveToken, [
                                provider,
                                connector,
                                data,
                                auth?.user?.account,
                            ])
                            if (!sendTransactionSuccess) {
                                setLoading(false)
                                return
                            }

                            let count = 1
                            rotateWheel(count)

                            const x = await checkOnchain([data.lucky_wheel_id])
                            let isCompleted = x.data?.reward
                            let y
                            let z
                            if (!isCompleted) {
                                y = setInterval(async () => {
                                    z = await checkOnchain([data.lucky_wheel_id])
                                    isCompleted = z.data?.reward
                                    if (isCompleted) {
                                        clearInterval(y)
                                        setReward(z.data?.reward)
                                        const totalDeg = 360 - z.data.reward.deg + 18 + count * 2 * 1080
                                        setCurrentDeg(totalDeg)
                                        let wheel = document.getElementById("inner-wheel")
                                        wheel.style.transition = `7s ease-out`
                                        wheel.style.transform = "rotate(" + totalDeg + "deg)"
                                        setTimeout(async() => {
                                            setLoading(false)
                                            if (z.data?.reward?.type === "MFR") {
                                                setGameToken(token + z.data?.reward?.value)
                                            }
                                            const x = Math.floor(totalDeg / 360)
                                            const y = totalDeg - x * 360
                                            setCurrentDeg(y)
                                            wheel.style.transition = "0s"
                                            // wheel.style.transform = "rotate(" +y + "deg)"

                                            toggleReward(true)
                                            setFreeSpin(z.data.free_spin)
                                            await getHistoryData()
                                            // setTimeout(() => {
                                            //     wheel.style.transition = "0s"
                                            //     wheel.style.transform = "rotate(" +y + "deg)"
                                            // }, 2000)
                                        }, 7500)
                                    } else {
                                        count++
                                        rotateWheel(count)
                                    }
                                }, 5000)
                            }
                        }
                     
                        // setReward(z.data?.reward)
                        // const totalDeg = 3600 - data.reward.deg + 18
                        // setCurrentDeg(totalDeg)
                        // wheel.style.transform = "rotate(" + totalDeg + "deg)"
                        // setTimeout(() => {
                        //     setLoading(false)
                        //     if (data?.reward?.type === "MFR") {
                        //         setGameToken(token + data?.reward?.value)
                        //     }
                        //     wheel.style.transition = "0s"
                        //     toggleReward(true)
                        //     setFreeSpin(data.free_spin)
                        // }, 12000)
                    } else {
                        setLoading(false)
                    }
                } catch (error) {
                    setLoading(false)
                    // refreshAccessToken()
                }
            } else {
                if (listUsers?.data?.length > 0) {
                    setIsOpenModalChooseAccount(true)
                    return
                }
                try {
                    setLoading(true)
                    // let wheel = document.getElementById("inner-wheel")
                    // wheel.style.transition = "10s"
                    // wheel.style.transform = "rotate(" + 1080 + "deg)"

                    const value = {
                        wallet_address: auth?.user?.account,
                        time: Date.now(),
                    }
                    const key = CryptoJS.AES.encrypt(JSON.stringify(value), CYBER_ACCOUNT_KEY).toString()

                    const reqData = {
                        key,
                        wallet_address: auth?.user?.account.toLowerCase(),
                    }

                    const res = await spintOnChainNoToken(reqData)

                    const {data, success} = res
                    if (success) {
                        const transactionData = data?.transaction_data
                        const chainId = transactionData.chainId
                        if (provider) {
                            const switchSuccess = await switchToNetworkOnchain(provider, chainId, transactionData)

                            if (!switchSuccess) {
                                setLoading(false)
                                return
                            }
                            const sendTransactionSuccess = await depositOnchainWheelNoToken(
                                provider,
                                connector,
                                data,
                                auth?.user?.account,
                                key
                            )

                            if (!sendTransactionSuccess) {
                                setLoading(false)
                                return
                            }
                            let count = 1
                            rotateWheel(count)
                            const x = await checkOnchain([data.lucky_wheel_id])

                            let isCompleted = x.data?.reward
                            let y
                            let z
                        
                            y = setInterval(async () => {
                                z = await checkOnchain([data.lucky_wheel_id])
                                isCompleted = z.data?.reward
                                if (isCompleted) {
                                    clearInterval(y)
                                    setReward(z.data?.reward)
                                    const totalDeg = 360 - z.data.reward.deg + 18 + count * 2 * 1080
                                    setCurrentDeg(totalDeg)
                                    let wheel = document.getElementById("inner-wheel")
                                    wheel.style.transition = `7s ease-out`
                                    wheel.style.transform = "rotate(" + totalDeg + "deg)"
                                    setTimeout(async() => {
                                        setLoading(false)
                                        if (z.data?.reward?.type === "MFR") {
                                            setGameToken(token + z.data?.reward?.value)
                                        }
                                        const x = Math.floor(totalDeg / 360)
                                        const y = totalDeg - x * 360
                                        setCurrentDeg(y)
                                        wheel.style.transition = "0s"
                                        // wheel.style.transform = "rotate(" +y + "deg)"

                                        toggleReward(true)
                                        setFreeSpin(z.data.free_spin)
                                        await getHistoryData()
                                        // setTimeout(() => {
                                        //     wheel.style.transition = "0s"
                                        //     wheel.style.transform = "rotate(" +y + "deg)"
                                        // }, 2000)
                                    }, 7500)
                                } else {
                                    count++
                                    rotateWheel(count)
                                }
                            }, 5000)
                        }
                
                 
                        // setReward(z.data?.reward)
                        // const totalDeg = 3600 - data.reward.deg + 18
                        // setCurrentDeg(totalDeg)
                        // wheel.style.transform = "rotate(" + totalDeg + "deg)"
                        // setTimeout(() => {
                        //     setLoading(false)
                        //     if (data?.reward?.type === "MFR") {
                        //         setGameToken(token + data?.reward?.value)
                        //     }
                        //     wheel.style.transition = "0s"
                        //     toggleReward(true)
                        //     setFreeSpin(data.free_spin)
                        // }, 12000)
                    } else {
                        setLoading(false)
                    }
                } catch (error) {
                    setLoading(false)
                    // refreshAccessToken()
                }
            }
        }
      

    }

    const _renderImage = (type) => {
        let output
        switch (type) {
            case "MFR":
                output = <img src={mfrWheel} alt="" />
                break
            case "MFG":
                output = <img src={mfgWheel} alt="" />
                break
            case "GLMR":
                output = <img src={glmrWheel} alt="" />
                break
            case "ASTR":
                output = <img src={astrWheel} alt="" />
                break
            case "MoonBoxSlot":
                output = <img src={moonboxslotWheel} alt="" />
                break
            default:
                break
        }
        return output
    }

    const _renderRewardImage = (type) => {
        let output
        switch (type) {
            case "MoonBoxSlot":
                output = <img className="reward" src={moonboxslotReward} alt="" />
                break
            case "MFR":
                output = <img className="reward" src={mfrReward} alt="" />
                break
            case "MFG":
                output = <img className="reward" src={mfgReward} alt="" />
                break
            case "GLMR":
                output = <img className="reward" src={glmrReward} alt="" />
                break
            case "ASTR":
                output = <img className="reward" src={astrReward} alt="" />
                break
            default:
                break
        }
        return output
    }

    useEffect(() => {
        openReward &&
            setTimeout(() => {
                let wheel = document.getElementById("inner-wheel")
                if (wheel) {
                    wheel.style.transform = "rotate(" + (currentDeg - 3600) + "deg)"
                }
            }, 1000)
        setShowWidget(!openReward)
    }, [openReward])

    const onChangeIndex = (e) => {
        setIndex(e.target.value)
    }

    // const env = process.env.REACT_APP_ENV

    return (
        <div className="wheel-container">
            {/* <div className={showWidget ? "show" : "hide"}>
                <WidgetBar gameToken={gameToken} redirectTo={"Lucky_wheel"} />
            </div> */}
            {/* <LuckyWheelRewardModal
                value={reward?.reward?.value}
                type={reward?.reward?.type}
                is_pending={reward?.moon_box?.is_pending}
                need_buy_slot={reward?.moon_box?.need_buy_slot}
                buy_slot_fee={reward?.moon_box?.buy_slot_fee}
                lucky_box_id={reward?.moon_box?.id}
                rarity={reward?.moon_box?.rarity}
                unit={reward?.reward?.unit}
                userToken={reward?.user?.game_token}
                user={user}
                open={openReward}
                refetch={refetch}
                setRefetch={setRefetch}
                toggle={toggleReward}
                className="reward-modal-container"
            /> */}
            <RewardModal
                rewardData={reward}
                isOpen={openReward}
                onOpenReward={toggleReward}
                renderRewardImage={_renderRewardImage}
            />
            <div className="flex flex-col justify-between wheel-flex">
                <div className="wheel-wrapper" id="wheel-wrapper">
                    <div id="direction">
                        <div id="direction-inner"></div>
                    </div>
                    <div id="sub-direction"></div>
                    <div className="wheeldotsround flicker" id="wheeldotsround">
                        <div className="wheeldots"></div>
                        <div className="wheeldots"></div>
                        <div className="wheeldots"></div>
                        <div className="wheeldots"></div>
                        <div className="wheeldots"></div>
                        <div className="wheeldots"></div>
                        <div className="wheeldots"></div>
                        <div className="wheeldots"></div>
                        <div className="wheeldots"></div>
                        <div className="wheeldots"></div>
                        <div className="wheeldots"></div>
                        <div className="wheeldots"></div>
                        <div className="wheeldots"></div>
                        <div className="wheeldots"></div>
                        <div className="wheeldots"></div>
                        <div className={`wheel wheel-${luckyWheel?.length||10}`} id="outer-wheel">
                            <div id="inner-wheel">
                                {luckyWheel &&
                                    luckyWheel.map((wheel, index) => {
                                        return (
                                            <div key={index} className={`sec ${wheel.type}`}>
                                                {_renderImage(wheel.type)}
                                                <span>{wheel.value}</span>
                                            </div>
                                        )
                                    })}
                            </div>

                            <a id="spin" className={`${loading ? "disabled" : ""}`}>
                                <div id="inner-spin"></div>
                            </a>
                        </div>
                    </div>
                </div>
                <div className={`spin-button ${loading ? "disabled" : ""}`} onClick={onSpin}>
                    <img src={lottery} alt="" />
                    <span>Spin now</span>
                </div>
            </div>
        </div>
    )
}

export default Wheel

