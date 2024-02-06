import React, {useEffect, useState} from "react"
import LuckyWheelModal from "./components/LuckyWheelModal"
import lwText from "../../assets/images/lucky-wheel/lw-text.png"
import Wheel from "./components/Wheel"
import {getLuckyWheelInfo} from "../../core/services/lucky-wheel"
import {getLocalStorage, LOCALSTORAGE_KEY, setLocalStorage} from "../../core/utils/helpers/storage"
// import {refreshAccessToken, updateGameToken} from "../../utils/webview"
import WinnerList from "./components/WinnerList"
import LuckyWheelBg from "../../assets/images/bounty-spin/bg.png"
import LuckyWheelBgMobile from "../../assets/images/lucky-wheel/lucky wheel-bg-mobile.png"
import LuckyWheelHistoryIcon from "../../assets/images/lucky-wheel/lw-history-gift.png"
import LuckyWheelHistoryModal from "../../components/LuckyWheelHistoryModal"
import {checkTaskAPI, getHisoryList, getWheelInfoNoTokenAPI} from "../../core/services/bounty-spin"
import Bg from "../../assets/images/bounty-spin/bg.png"
import "./styles.less"
import WinnerListMobile from "./components/WinnerListMobile"
import {LoadingOutlined} from "@ant-design/icons"
import WinnerListWrapper from "./components/WinnerListWrapper"
import img1 from "../../assets/images/bounty-spin/img-1.png"
import img2 from "../../assets/images/bounty-spin/img-2.png"
import img3 from "../../assets/images/bounty-spin/img-3.png"
import doneIcon from "../../assets/images/bounty-spin/done.png"
import notDoneIcon from "../../assets/images/bounty-spin/not-done.png"
import missonIcon from "../../assets/images/bounty-spin/mission-icon.png"
import bannerMfr1 from "../../assets/images/bounty-spin/earn-mfr-1.png"
import bannerMfr2 from "../../assets/images/bounty-spin/earn-mfr-2.png"
import bannerMfr3 from "../../assets/images/bounty-spin/earn-mfr-3.png"
import UserBalanceInfo from "../../components/UserBalanceInfo"
import bgMobile from "../../assets/images/bounty-spin/bg-mobile.png"
import BeastBackground from "../../components/BeastBackground"
import FooterSocial from "../../components/FooterSocial"
import WheelHistoryModal from "../../components/WheelHistoryModal"
import {getWheelInfo} from "../../core/services/bounty-spin"
import {checkApi} from "../../core/utils/helpers/check-api"
import {useAuth} from "../../core/contexts/auth"
import {useGlobalContext} from "../../core/contexts/global"
import {chainData} from "../../core/utils/constants/chain-data"
import {message as AntdMessage} from "antd"
import {getAssetsDataAPI} from "../../core/services/assets-management"
import WinnerListMobileWrapper from "./components/WinnerListMobileWrapper"
import {useNavigate} from "react-router-dom"
import WinnerListFixed from "../../components/WinnerListFixed"
import astrIcon from "../../assets/images/bounty-spin/wheel/astar-wheel.png"
import glmrIcon from "../../assets/images/bounty-spin/wheel/glmr-wheel.png"
import mfrIcon from "../../assets/images/bounty-spin/wheel/mfr-wheel.png"
import omfgIcon from "../../assets/images/bounty-spin/wheel/omfg-wheel.png"
import { sendUserTimezoneAPI } from "../../core/services/create-user-in-db"

const loadingIcon = <LoadingOutlined style={{fontSize: 60, color: "#FFF"}} spin />

const loadingMissonIcon = <LoadingOutlined style={{fontSize: 30, color: "#FFF"}} spin />

const poolData = [
    {index: 1, img: glmrIcon, name: "GLMR", value: 0},
    {index: 2, img: omfgIcon, name: "oMFG", value: ""},
    {index: 3, img: astrIcon, name: "ASTR", value: 0},
    {index: 4, img: mfrIcon, name: "MFR", value: ""},
]

const BountySpin = () => {
    const navigate = useNavigate()
    const [openModal, setOpenModal] = useState(false)
    const [histories, setHistories] = useState({
        histories1: [],
        histories2: [],
        histories3: [],
        histories4: [],
        histories5: [],
        histories6: [],
    })
    const [historiesFixed, setHistoriedFixed] = useState([])
    const [freeSpin, setFreeSpin] = useState(0)
    const [wheelsInfo, setWheelsInfo] = useState([])
    const [user, setUser] = useState({})
    const [refetch, setRefetch] = useState(0)
    const [gameToken, setGameToken] = useState(0)
    const [loadingFetch, setLoadingFetch] = useState(true)
    const [loadingImage, setLoadingImage] = useState(true)
    const [isOpenHistory, setIsOpenHistory] = useState(false)
    const [isSmallWindow, setIsSmallWindow] = useState(false)
    const [isIpad, setIsIpad] = useState(false)
    const [historyRewards, setHistoryRewards] = useState([])
    const [userHasMoreHistory, setUserHasMoreHistory] = useState(false)
    const [networkChainId, setNetworkChainId] = useState(1284)
    const [isOpenRefLink, setIsOpenRefLink] = useState(false)
    const [missons, setMissions] = useState({invite: false, zealy: false})
    const {auth, isLoginSocial} = useAuth()
    const {selectedNetwork} = useGlobalContext()
    const [tokens, setTokens] = useState([])
    const [zealyTaskId, setZealyTaskId] = useState("")
    const [isRerender, setIsRerender] = useState(false)
    const [isLoadingMission, setIsLoadingMisson] = useState(true)

    useEffect(() => {
        if (isLoginSocial && auth?.isConnected) {
            const network = chainData.find((chain) => chain.name === selectedNetwork)
            const id = network?.chainId || 1284
            setNetworkChainId(id)
            getHistoryData()
            getTaskData(id)
            fetchLuckyWheelInfo(id)
        } else {
            // navigate("/")
            // AntdMessage.error({
            //     key: "err",
            //     content: "Please connect wallet and login social to spin",
            //     className: "message-error",
            //     duration: 5,
            // })
            setMissions({invite: false, zealy: false})
            setIsOpenRefLink(false)
            getWheelInfoNoToken()
        }
    }, [selectedNetwork, isLoginSocial, auth?.isConnected])

    useEffect(() => {
        if (isRerender) {
            const network = chainData.find((chain) => chain.name === selectedNetwork)
            const id = network?.chainId || 1284

            getHistoryData()
            fetchLuckyWheelInfo(id)
        }
    }, [isRerender])

    const fetchLuckyWheelInfo = async (chainId) => {
        // const wheels = getLocalStorage(LOCALSTORAGE_KEY.WHEEL_REWARDS || [])
        try {
            // setLoadingFetch(true)
            // setWheelsInfo(JSON.parse(wheels))
            const res = await checkApi(getWheelInfo, [chainId])
            const {success, message, data} = res
            if (success) {
                const dataHistory = data?.histories
                if (dataHistory) {
                    const length = dataHistory?.length
                    const number1 = Math.floor(length / 4)
                    const number2 = Math.floor(length / 2)
                    const dataHistoryDesktop1 = dataHistory.slice(0, number1)
                    const dataHistoryDesktop2 = dataHistory.slice(number1, number1 * 2)
                    const dataHistoryDesktop3 = dataHistory.slice(number1 * 2, number1 * 3)
                    const dataHistoryDesktop4 = dataHistory.slice(number1 * 3, length)

                    const dataHistoryMobile1 = dataHistory.slice(0, number2)
                    const dataHistoryMobile2 = dataHistory.slice(number2, length)

                    setHistoriedFixed(dataHistory)

                    setHistories({
                        histories1: dataHistoryDesktop1,
                        histories2: dataHistoryDesktop2,
                        histories3: dataHistoryDesktop3,
                        histories4: dataHistoryDesktop4,
                        histories5: dataHistoryMobile1,
                        histories6: dataHistoryMobile2,
                    })
                }

                setUser(data?.user || {})

                if (data?.is_new_today) {
                    setOpenModal(true)
                }

                setFreeSpin(data?.free_spin)
                if (data?.wheels) {
                    let luckyMoney = data?.wheels.filter((item) => item.type === "GLMR" || item.type === "ASTR")

                    luckyMoney = luckyMoney.sort((a, b) => {
                        return a.value - b.value
                    })
                    let newData = data?.wheels.map((item) => {
                        if (item.type === "GLMR" || item.type === "ASTR") {
                            const index = luckyMoney.findIndex((lucky) => {
                                return lucky.value === item.value
                            })
                            return {...item, color: `color-${index}`}
                        } else {
                            return {...item, color: ""}
                        }
                    })
                    setWheelsInfo(newData || [])
                    setLocalStorage(LOCALSTORAGE_KEY.WHEEL_REWARDS, JSON.stringify(data?.wheels))
                }
                const newTokensValue = [
                    {
                        type: "ASTR",
                        image_url: astrIcon,
                        value: data?.user?.astar_token,
                    },
                    {
                        type: "GLMR",
                        image_url: glmrIcon,
                        value: data?.user?.base_token,
                    },
                    {
                        type: "MFR",
                        image_url: mfrIcon,
                        value: data?.user?.game_token,
                    },
                    {
                        type: "oMFG",
                        image_url: omfgIcon,
                        value: data?.user?.omfg,
                    },
                ]

                if(data?.user?.timezone===null){
                    const dataTimezone={
                        "timezone_offset_minute": new Date().getTimezoneOffset(),
                        "timezone": Intl.DateTimeFormat().resolvedOptions().timeZone,
                    }
                    await checkApi(sendUserTimezoneAPI,[dataTimezone])

                }

                setTokens(newTokensValue)
                setLoadingFetch(false)
            } else {
                return AntdMessage.error({
                    key: "err",
                    content: message,
                    className: "message-error",
                    duration: 5,
                })
            }
            setIsRerender(false)
        } catch (error) {
            setLoadingFetch(false)
            // refreshAccessToken()
        }
    }

    const getWheelInfoNoToken = async () => {
        try {
            const res = await getWheelInfoNoTokenAPI()
            const {success, message, data} = res
            if (success) {
                const dataHistory = data?.histories
                if (dataHistory) {
                    const length = dataHistory?.length
                    const number1 = Math.floor(length / 4)
                    const number2 = Math.floor(length / 2)
                    const dataHistoryDesktop1 = dataHistory.slice(0, number1)
                    const dataHistoryDesktop2 = dataHistory.slice(number1, number1 * 2)
                    const dataHistoryDesktop3 = dataHistory.slice(number1 * 2, number1 * 3)
                    const dataHistoryDesktop4 = dataHistory.slice(number1 * 3, length)

                    const dataHistoryMobile1 = dataHistory.slice(0, number2)
                    const dataHistoryMobile2 = dataHistory.slice(number2, length)

                    setHistoriedFixed(dataHistory)

                    setHistories({
                        histories1: dataHistoryDesktop1,
                        histories2: dataHistoryDesktop2,
                        histories3: dataHistoryDesktop3,
                        histories4: dataHistoryDesktop4,
                        histories5: dataHistoryMobile1,
                        histories6: dataHistoryMobile2,
                    })
                }

                if (data?.wheels) {
                    let luckyMoney = data?.wheels.filter((item) => item.type === "GLMR" || item.type === "ASTR")

                    luckyMoney = luckyMoney.sort((a, b) => {
                        return a.value - b.value
                    })
                    let newData = data?.wheels.map((item) => {
                        if (item.type === "GLMR" || item.type === "ASTR") {
                            const index = luckyMoney.findIndex((lucky) => {
                                return lucky.value === item.value
                            })
                            return {...item, color: `color-${index}`}
                        } else {
                            return {...item, color: ""}
                        }
                    })
                    setWheelsInfo(newData || [])
                }

                setLoadingFetch(false)
            } else {
                return AntdMessage.error({
                    key: "err",
                    content: message,
                    className: "message-error",
                    duration: 5,
                })
            }
        } catch (err) {
            const errMessage = err?.response?.data?.message
            setLoadingFetch(false)

            return AntdMessage.error({
                key: "err",
                content: errMessage,
                className: "message-error",
                duration: 5,
            })
        }
    }

    const getTaskData = async (chainId) => {
        const res = await checkApi(checkTaskAPI, [chainId])
        const {success, message, data} = res
        if (success) {
            setMissions({
                invite: data?.invite_task_status === "not_eligible" ? false : true,
                zealy: data?.zealy_task_status === "not_eligible" ? false : true,
            })
            setZealyTaskId(data?.zealy_task[0])
            setIsLoadingMisson(false)
        } else {
            return AntdMessage.error({
                key: "err",
                content: message,
                className: "message-error",
                duration: 5,
            })
        }
    }

    const getHistoryData = async (lastId = null, limit = 10) => {
        const walletAddress = JSON.parse(getLocalStorage(LOCALSTORAGE_KEY.WALLET_SIGNATURE))?.account
        if (walletAddress) {
            const res = await checkApi(getHisoryList, [walletAddress, lastId, limit])
            if (res?.data) {
                if (isRerender) {
                    setHistoryRewards(res.data?.histories)
                    setUserHasMoreHistory(res?.data?.has_more)
                } else {
                    const newData = historyRewards.concat(res.data?.histories)
                    setHistoryRewards(newData)
                    setUserHasMoreHistory(res?.data?.has_more)
                }
            }
        }
    }

    // const getBalanceData = async () => {
    //     const res = await checkApi(getAssetsDataAPI)
    //     const {success, message, data} = res
    //     if (res?.tokens) {
    //         const newTokens = res?.tokens.filter(
    //             (token) =>
    //                 token.name === "tMFG" || token.name === "MFR" || token.name === "GLMR" || token.name === "ASTR"
    //         )
    //         setTokens(newTokens)
    //     } else {
    //         return AntdMessage.error({
    //             key: "err",
    //             content: message,
    //             className: "message-error",
    //             duration: 5,
    //         })
    //     }
    // }

    const toggleModal = () => {
        setOpenModal(!openModal)
    }

    const handleToggleHistoryModal = () => {
        setIsOpenHistory(!isOpenHistory)
    }

    const handleTogleOpenRefLink = () => {
        if (auth.isConnected && isLoginSocial) {
            setIsOpenRefLink(!isOpenRefLink)
        }
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(
            `https://app.moonfit.xyz/special-event/bounty-spin?referral_code=${user?.referral_code}`
        )
    }

    const handleOpenNewTab = (url) => {
        window.open(url)
    }

    const handleNavigateTo = (url) => {
        navigate(`/${url}`)
        // navigate("/mint")
    }



    return (
        <div
            className={`lucky-wheel-wrapped-container bounty-spin-container ${
                historiesFixed?.length > 0 ? "" : "top-0"
            }`}
        >
            {historiesFixed?.length > 0 && (
                <WinnerListFixed histories={historiesFixed} marginLeft={"0"} index={5} id="sec5" />
            )}
            <div className={`explore-bg`}>
                <img
                    src={Bg}
                    alt=""
                    onLoad={() => {
                        setLoadingImage(false)
                    }}
                />
                <img
                    src={bgMobile}
                    alt=""
                    onLoad={() => {
                        setLoadingImage(false)
                    }}
                />
            </div>
            <BeastBackground />
            {/* <div className="lucky-wheel-header">Moonfit lucky wheel</div> */}
            {/* <LuckyWheelModal open={openModal} toggle={toggleModal} /> */}
            <div className="container-1170">
                {loadingFetch && loadingImage ? (
                    loadingIcon
                ) : (
                    <>
                        <div className="lucky-wheel-container bounty-spin">
                            {/* <LuckyWheelHistoryModal
                                isOpen={isOpenHistory}
                                setIsOpen={setIsOpenHistory}
                                historyData={historyRewards}
                            /> */}
                            <WheelHistoryModal
                                name="bounty-spin-history"
                                isOpen={isOpenHistory}
                                onClose={handleToggleHistoryModal}
                                historyData={historyRewards}
                                hasMore={userHasMoreHistory}
                                getHisoryList={getHistoryData}
                            />

                            {auth.isConnected && isLoginSocial && (
                                <UserBalanceInfo tokens={tokens} onToggleHistoryModal={handleToggleHistoryModal} />
                            )}

                            <div className="lucky-wheel-right">
                                <div className="header-picture">
                                    <img src={img1} alt="" />
                                    <img src={img2} alt="" />
                                    <img src={img3} alt="" />
                                </div>
                                <div className="pool-status">
                                    <div className="border-gradient-2"></div>
                                    <div className="pool-status-content">
                                        <h3>Pool Status</h3>
                                        <ul className="pool-token-list">
                                            {poolData.map((item) => (
                                                <li className={`pool-token-item ${item.value===0?"blur":""}`} key ={item.index}>
                                                    <div className="info">
                                                        <img src={item.img} alt="" />
                                                        <span>{item.name}</span>
                                                    </div>
                                                    <p className="value">{item.value}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                <div className="claim-tutorial bounty-spin-tutorial">
                                    <h3>How to join ?</h3>
                                    <div className="claim-tutorial-content">
                                        <div className="claim-tutorial-content-item">
                                            <div className="claim-tutorial-content-item-number">
                                                {" "}
                                                <span>1</span>
                                            </div>
                                            <p className="claim-tutorial-content-item-text">
                                                Connect your wallet on website and select the network you want to
                                                receive your prizes.
                                            </p>
                                        </div>
                                        <div className="claim-tutorial-content-item">
                                            <div className="claim-tutorial-content-item-number">
                                                {" "}
                                                <span>2</span>
                                            </div>
                                            <p className="claim-tutorial-content-item-text">
                                                Link to your account (email / Apple ID){" "}
                                            </p>
                                        </div>
                                        <div className="claim-tutorial-content-item">
                                            <div className="claim-tutorial-content-item-number">
                                                {" "}
                                                <span>3</span>
                                            </div>
                                            <div style={{flex: 1}}>
                                                <p className="claim-tutorial-content-item-text">
                                                    Each user has <span>1 FREE SPIN</span> per day{" "}
                                                </p>
                                                <span className="small-text">
                                                    To earn more spin(s), you can perform social tasks, invite friends
                                                    or earn $MFR from in-app activities. 
                                                </span>
                                            </div>
                                        </div>
                                        <p className="hightlight-text">
                                            Earn more spins - complete all our tasks below
                                        </p>
                                        <p className="hightlight-text">
                                            Note: Upon selecting Astar Network/Moonbeam Network, opening Red Envelope
                                            will give you ASTR/GLMR tokens accordingly fam. You need to pay a small gas
                                            fee for each spin.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="lucky-wheel-left">
                                {auth.isConnected && isLoginSocial && (
                                    <>
                                        {" "}
                                        <UserBalanceInfo
                                            tokens={tokens}
                                            onToggleHistoryModal={handleToggleHistoryModal}
                                        />{" "}
                                        <WinnerListMobileWrapper
                                            histories1={histories.histories5}
                                            histories2={histories.histories6}
                                        />
                                    </>
                                )}

                                <Wheel
                                    networkChainId={networkChainId}
                                    luckyWheel={wheelsInfo}
                                    user={user}
                                    freeSpin={freeSpin}
                                    loadingFetch={loadingFetch}
                                    refetch={refetch}
                                    setRefetch={setRefetch}
                                    setFreeSpin={setFreeSpin}
                                    gameToken={gameToken}
                                    setGameToken={setGameToken}
                                    getHistoryData={getHistoryData}
                                    setIsRerender={setIsRerender}
                                    tokens={tokens}
                                />
                                <div className="claim-tutorial bounty-spin-tutorial-mobile">
                                    <h3>How to join ?</h3>
                                    <div className="claim-tutorial-content">
                                        <div className="claim-tutorial-content-item">
                                            <div className="claim-tutorial-content-item-number">
                                                {" "}
                                                <span>1</span>
                                            </div>
                                            <p className="claim-tutorial-content-item-text">
                                                Connect your wallet on website and select the network you want to
                                                receive your prizes.
                                            </p>
                                        </div>
                                        <div className="claim-tutorial-content-item">
                                            <div className="claim-tutorial-content-item-number">
                                                {" "}
                                                <span>2</span>
                                            </div>
                                            <p className="claim-tutorial-content-item-text">
                                                Link to your account (email / Apple ID){" "}
                                            </p>
                                        </div>
                                        <div className="claim-tutorial-content-item">
                                            <div className="claim-tutorial-content-item-number">
                                                {" "}
                                                <span>3</span>
                                            </div>
                                            <div style={{flex: 1}}>
                                                <p className="claim-tutorial-content-item-text">
                                                    Each user has <span>1 FREE SPIN</span> per day{" "}
                                                </p>
                                                <span className="small-text">
                                                    To earn more spin(s), you can perform social tasks, invite friends
                                                    or earn $MFR from in-app activities. 
                                                </span>
                                            </div>
                                        </div>
                                        <p className="hightlight-text">
                                            Earn more spins - complete all our tasks below
                                        </p>
                                        <p className="hightlight-text">
                                            Note: Upon selecting Astar Network/Moonbeam Network, opening Red Envelope
                                            will give you ASTR/GLMR tokens accordingly fam. You need to pay a small gas
                                            fee for each spin.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="earn-more-spin-container">
                            <h3>How To Earn More Spins?</h3>
                            <div className="list-mission">
                                <div className="mission">
                                    <h4>Get +3 SPin</h4>
                                    <div className="mission-content-wrapper">
                                        <div className="mission-content">
                                            <div className="text">
                                                <img src={missonIcon} alt="" />
                                                <span>
                                                    <span
                                                        className="color-FFB206"
                                                        onClick={() => {
                                                            handleOpenNewTab(
                                                                `https://zealy.io/c/moonfit/questboard/${zealyTaskId}`
                                                            )
                                                        }}
                                                    >
                                                        Share MoonFit Official Announcement
                                                    </span>
                                                </span>
                                            </div>
                                            {auth.isConnected && isLoginSocial && isLoadingMission ? (
                                                loadingMissonIcon
                                            ) : missons?.zealy ? (
                                                <img className="check" src={doneIcon} alt="" />
                                            ) : (
                                                <img className="check" src={notDoneIcon} alt="" />
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="mission">
                                    <h4>Get +3 SPin</h4>
                                    <div className="mission-content-wrapper">
                                        <div className="mission-content">
                                            <div className="text">
                                                <img src={missonIcon} alt="" />
                                                <span>Refer 1 friend to get +3 spins (More friends, more spins)</span>
                                            </div>
                                            <div className="result">
                                                <button
                                                    className={`invite ${
                                                        isOpenRefLink || !auth.isConnected || !isLoginSocial
                                                            ? "disabled"
                                                            : ""
                                                    }`}
                                                    onClick={handleTogleOpenRefLink}
                                                >
                                                    Invite friends
                                                </button>
                                                {auth.isConnected && isLoginSocial && isLoadingMission ? (
                                                    loadingMissonIcon
                                                ) : missons?.invite ? (
                                                    <img className="check" src={doneIcon} alt="" />
                                                ) : (
                                                    <img className="check" src={notDoneIcon} alt="" />
                                                )}
                                            </div>
                                        </div>
                                        <div className={`ref-link ${isOpenRefLink ? "active" : ""}`}>
                                            <div className="link">
                                                <div className="text-ref">
                                                    <span>Your referral link</span>
                                                    <p>{`https://app.moonfit.xyz/special-event/bounty-spin?referral_code=${user?.referral_code}`}</p>
                                                </div>
                                                <button onClick={handleCopy}>Copy</button>
                                            </div>
                                            <p>
                                                Send your referral links to your friend: One successful referral must
                                                connect your wallet and complete 1 free spin.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="earn-mfr-container">
                            <h3>How to earn mfr?</h3>
                            <div className="banner-bounty-spin">
                                <img src={bannerMfr1} alt="" />
                                <img src={bannerMfr2} alt="" />
                                <img src={bannerMfr3} alt="" />
                            </div>
                            <p> Own Moonbeast to earn MFR & lots of other rewards!</p>
                            <div className="button-container">
                                <button
                                    onClick={() => {
                                        handleOpenNewTab("https://app.moonfit.xyz/mint")
                                    }}
                                >
                                    Mint on moonfit website
                                </button>
                                <button
                                    onClick={() => {
                                        handleOpenNewTab(
                                            "https://tofunft.com/collection/moonfit-beast-and-beauty/items"
                                        )
                                    }}
                                >
                                    buy on tofunft
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
            <FooterSocial name="bounty-spin-footer" isHaveFooterBg={false} />
        </div>
    )
}

export default BountySpin

