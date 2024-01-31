import React, {useEffect, useRef, useState} from "react"
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
import lottery from "../../../assets/images/bounty-spin/lottery-color-#730000.png"
import glmrReward from "../../../assets/images/lucky-wheel/reward/GLMR-reward.png"
import moonboxslotReward from "../../../assets/images/lucky-wheel/reward/MoonBox-reward.png"
import omfgReward from "../../../assets/images/bounty-spin/reward/omfg.png"
import mfrReward from "../../../assets/images/lucky-wheel/reward/MFR-reward.png"
import astrReward from "../../../assets/images/lucky-wheel/reward/ASTR-reward.png"
import luckyReward from "../../../assets/images/bounty-spin/reward/lucky-money.png"
import glmrWheel from "../../../assets/images/lucky-wheel/wheel/glmr-wheel.png"
import omfgWheel from "../../../assets/images/bounty-spin/wheel/omfg-wheel.png"
import luckyWheel1 from "../../../assets/images/bounty-spin/wheel/lucky-1.png"
import luckyWheel2 from "../../../assets/images/bounty-spin/wheel/lucky-2.png"
import luckyWheel3 from "../../../assets/images/bounty-spin/wheel/lucky-3.png"
import luckyWheel4 from "../../../assets/images/bounty-spin/wheel/lucky-4.png"
import luckyWheel5 from "../../../assets/images/bounty-spin/wheel/lucky-5.png"

import moonboxslotWheel from "../../../assets/images/lucky-wheel/wheel/moonboxslot-wheel.png"
import mfgWheel from "../../../assets/images/lucky-wheel/wheel/mfg-wheel.png"
import mfrWheel from "../../../assets/images/lucky-wheel/wheel/mfr-wheel.png"
import astrWheel from "../../../assets/images/lucky-wheel/wheel/astar-wheel.png"
import bgReward from "../../../assets/images/bounty-spin/bg-reward.png"
import headerReward from "../../../assets/images/bounty-spin/header-reward.png"
import headerLuckyReward from "../../../assets/images/bounty-spin/lucky-reward-header.png"
import bgRewardMobile from "../../../assets/images/bounty-spin/bg-reward-mobile.png"
import wheelBg from "../../../assets/images/bounty-spin/wheel/wheel-bg.png"
// import {spinWheel} from "../../services/LuckyWheelServices"
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
import {
    depositOnchainWheelNoToken,
    depositOnchainWheelHaveToken,
    depositOnchainWheel,
} from "../../../core/utils/helpers/wheel"
import RewardModal from "../../../components/LuckyWheelRewardModal"
import {message as AntdMessage} from "antd"
import WheelRewardModal from "../../../components/WheelRewardModal"
import LuckyRewardModal from "../../../components/LuckyRewardModal"
import {checkApi} from "../../../core/utils/helpers/check-api"
import {spinOnChain, checkOnchain} from "../../../core/services/bounty-spin"
import {useLocation, useParams, useSearchParams} from "react-router-dom"
import ReCAPTCHA from "react-google-recaptcha"

const {CYBER_ACCOUNT_KEY} = COMMON_CONFIGS

const Wheel = (props) => {
    const location = useLocation()
    const recaptcha = useRef()
    const {
        networkChainId,
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
        setIsRerender,
        tokens,
    } = props
    const [loading, setLoading] = useState(false)
    const [reward, setReward] = useState({})
    const [openReward, setOpenReward] = useState(false)
    const [openLuckyReward, setOpenLuckyReward] = useState(false)
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
        isLoginSocial,
        listUsers,
    } = useAuth()

    const [searchParams] = useSearchParams()

    const toggleReward = (open) => setOpenReward(open)

    const toggleLuckyReward = () => {
        setOpenLuckyReward(!openLuckyReward)
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
        // const captchaValue = recaptcha.current.getValue();
        // if (!captchaValue) {
        //     alert("Please verify the reCAPTCHA!");

        //     return
        //   } else {
        //     // make form submission
        //     alert("Form submission successful!");
        //     console.log("capcha",captchaValue)
        //     return
        //   }
        if (!isLoginSocial || !auth.isConnected) {
            return AntdMessage.error({
                key: "err",
                content: "Connect your wallet and link your social accounts to start spinning!",
                className: "message-error",
                duration: 3,
            })
        }
        if (loading) {
            return
        }
        const mfrToken = tokens.find((token) => token.type === "MFR")
        if (freeSpin < 1 && mfrToken?.value < 1) {
            return AntdMessage.error({
                key: "err",
                content: "You don't have enough MFR to spin",
                className: "message-error",
                duration: 3,
            })
        }

        const token = !freeSpin ? gameToken - 5 : gameToken
        setGameToken(token)
        setShowWidget(false)
        const walletAddress = JSON.parse(getLocalStorage(LOCALSTORAGE_KEY.WALLET_SIGNATURE))?.account
        if (!walletAddress) {
            return AntdMessage.error({
                key: "err",
                content: "Please connect your wallet",
                className: "message-error",
                duration: 5,
            })
        }

        try {
            setLoading(true)
            let value
            if (searchParams.get("referral_code") !== null) {
                value = {
                    wallet_address: walletAddress,
                    referral_code: searchParams.get("referral_code"),
                    chain_id: networkChainId,
                }
            } else {
                value = {
                    wallet_address: walletAddress,
                    chain_id: networkChainId,
                }
            }

            const res = await checkApi(spinOnChain, [value])

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
                    const luckyWheelId = await checkApi(depositOnchainWheel, [
                        provider,
                        connector,
                        data,
                        auth?.user?.account,
                    ])
                    if (luckyWheelId === false) {
                        setLoading(false)
                        return
                    }

                    let count = 1
                    rotateWheel(count)

                    const x = await checkApi(checkOnchain, [luckyWheelId])
                    let isCompleted = x.data?.reward
                    let y
                    let z
                    if (!isCompleted) {
                        y = setInterval(async () => {
                            z = await checkApi(checkOnchain, [luckyWheelId])
                            isCompleted = z.data?.reward
                            if(!window.location.href.includes("bounty-spin")){
                                clearInterval(y)
                                
                                let wheel = document.getElementById("inner-wheel")
                                if(wheel){
                                    wheel.style.transition = "0s"
                                }
                                return
                            }
                            if (isCompleted) {
                                clearInterval(y)
                                setReward(z.data?.reward)
                                const totalDeg = 360 - z.data.reward.deg + 18 + count * 2 * 1080
                                setCurrentDeg(totalDeg)
                                let wheel = document.getElementById("inner-wheel")
                                wheel.style.transition = `7s ease-out`
                                wheel.style.transform = "rotate(" + totalDeg + "deg)"
                                setTimeout(async () => {
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
                                    setIsRerender(true)
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
            } else {
                setLoading(false)
                setIsRerender(true)
                return AntdMessage.error({
                    key: "err",
                    content: "Please try again",
                    className: "message-error",
                    duration: 5,
                })
            }
        } catch (error) {
            setLoading(false)
        }
    }

    const _renderImage = (type, color) => {
        let output

        switch (type) {
            case "MFR":
                output = <img src={mfrWheel} alt="" />
                break
            case "MFG":
                output = <img src={mfgWheel} alt="" />
                break
            case "GLMR":
                if (color === "color-0") {
                    output = <img src={luckyWheel1} alt="" />
                } else if (color === "color-1") {
                    output = <img src={luckyWheel2} alt="" />
                } else if (color === "color-2") {
                    output = <img src={luckyWheel3} alt="" />
                } else if (color === "color-3") {
                    output = <img src={luckyWheel4} alt="" />
                } else {
                    output = <img src={luckyWheel5} alt="" />
                }
                break
            case "ASTR":
                if (color === "color-0") {
                    output = <img src={luckyWheel1} alt="" />
                } else if (color === "color-1") {
                    output = <img src={luckyWheel2} alt="" />
                } else if (color === "color-2") {
                    output = <img src={luckyWheel3} alt="" />
                } else if (color === "color-3") {
                    output = <img src={luckyWheel4} alt="" />
                } else {
                    output = <img src={luckyWheel5} alt="" />
                }
                break
            case "oMFG":
                output = <img src={omfgWheel} alt="" />
                break
            default:
                break
        }
        return output
    }

    const _renderRewardImage = (type) => {
        let output
        switch (type) {
            case "MFR":
                output = <img className="reward" src={mfrReward} alt="" />
                break
            case "oMFG":
                output = <img className="reward" src={omfgReward} alt="" />
                break
            case "GLMR":
                output = <img className="reward" src={luckyReward} alt="" />
                break
            case "ASTR":
                output = <img className="reward" src={luckyReward} alt="" />
                break
            default:
                break
        }
        return output
    }

    const _renderLuckyRewardImage = (type) => {
        let output
        switch (type) {
            case "MFR":
                output = <img className="reward" src={mfrReward} alt="" />
                break
            case "oMFG":
                output = <img className="reward" src={omfgReward} alt="" />
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

    const renderTextButton = () => {
        if (freeSpin > 0) {
            return `${freeSpin} free spin`
        } else {
            return `Spin now`
        }
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
        <div className="wheel-container bounty-spin-wheel">
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
            <WheelRewardModal
                rewardData={reward}
                isOpen={openReward}
                onOpenReward={toggleReward}
                onToggleLuckyReward={toggleLuckyReward}
                renderRewardImage={_renderRewardImage}
                imgBg={bgReward}
                imgWon={headerReward}
                imgBgMobile={bgRewardMobile}
            />
            <LuckyRewardModal
                rewardData={reward}
                isOpen={openLuckyReward}
                onOpenReward={toggleLuckyReward}
                renderRewardImage={_renderLuckyRewardImage}
                imgBg={bgReward}
                imgWon={headerLuckyReward}
                imgBgMobile={bgRewardMobile}
            />

            <div className="flex flex-col justify-between wheel-flex">
                <div className="wheel-wrapper" id="wheel-wrapper">
                    <div className="wheel-background">
                        <img src={wheelBg} alt="" />
                    </div>
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
                        <div className={`wheel wheel-${luckyWheel?.length || 10}`} id="outer-wheel">
                            <div id="inner-wheel">
                                {luckyWheel &&
                                    luckyWheel.map((wheel, index) => {
                                        // let randomNumber = Math.round(Math.random() * 2)
                                        return (
                                            <div key={index} className={`sec ${wheel.type} ${wheel.color}`}>
                                                {_renderImage(wheel.type, wheel.color)}
                                                <span>
                                                    {wheel.type === "GLMR" || wheel.type === "ASTR" ? "1" : wheel.value}
                                                </span>
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
                    <span>{renderTextButton()}</span>
                </div>
                {/* <ReCAPTCHA ref={recaptcha} sitekey={"6LdfhmApAAAAAEgoVBB5oueRi_tPD7YdfMh18QiL"} /> */}
            </div>
        </div>
    )
}

export default Wheel

