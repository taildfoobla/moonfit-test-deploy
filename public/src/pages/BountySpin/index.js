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
import {getHisoryList} from "../../core/services/bounty-spin"
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

const loadingIcon = <LoadingOutlined style={{fontSize: 60, color: "#FFF"}} spin />

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
    const [networkChainId, setNetworkChainId] = useState(1287)
    const [isOpenRefLink, setIsOpenRefLink] = useState(false)
    const [missons, setMissions] = useState({invite: false, zealy: false})
    const {auth, isLoginSocial} = useAuth()
    const {selectedNetwork} = useGlobalContext()
    const [tokens, setTokens] = useState([])
    const [zealyTaskId,setZealyTaskId]=useState("")
    const [isRerender, setIsRerender] = useState(false)

    useEffect(() => {
        if (isLoginSocial && auth?.isConnected) {
            const network = chainData.find((chain) => chain.name === selectedNetwork)
            const id=network?.chainId||1284
            setNetworkChainId(id)
            getHistoryData()
            getBalanceData()
            fetchLuckyWheelInfo(id)
        } else {
            navigate("/")
             AntdMessage.error({
                key: "err",
                content: "Please connect wallet and login social to spin",
                className: "message-error",
                duration: 5,
            })
        }
    }, [selectedNetwork, isLoginSocial, auth?.isConnected])

    useEffect(() => {
        if (isRerender) {
            console.log("rerender")
            const network = chainData.find((chain) => chain.name === selectedNetwork)
            const id=network?.chainId||1284

            getHistoryData()
            getBalanceData()
            fetchLuckyWheelInfo(id)
        }
    }, [isRerender])

    const fetchLuckyWheelInfo = async (chainId) => {
        // const wheels = getLocalStorage(LOCALSTORAGE_KEY.WHEEL_REWARDS || [])
        try {
            setLoadingFetch(true)
            // setWheelsInfo(JSON.parse(wheels))
            console.log("before")
            const res = await checkApi(getWheelInfo, [chainId])
            console.log("after")
            const {success, message, data} = res
            if (success) {
                console.log("res", res)
                setLoadingFetch(false)
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
                // if (data?.user?.game_token) {
                //     setGameToken(data.user.game_token)
                //     updateGameToken(data.user.game_token)
                // }
                if (data?.is_new_today) {
                    setOpenModal(true)
                }
                setMissions({
                    invite: data?.invite_task_status === "not_eligible" ? false : true,
                    zealy: data?.zealy_task_status === "not_eligible" ? false : true,
                })
                setFreeSpin(data?.free_spin)
                if (data?.wheels) {
                    let luckyMoney=data?.wheels.filter(item=>item.type==="GLMR"||item.type==="ASTR")
                
                    luckyMoney=luckyMoney.sort((a,b)=>{return a.value-b.value})
                    console.log("luckyMoney",luckyMoney)
                    let newData= data?.wheels.map(item=>{
                        if(item.type==="GLMR"||item.type==="ASTR"){
                           const index= luckyMoney.findIndex((lucky)=>{
                                        return lucky.value===item.value
                            })
                            console.log("index",index)
                            return {...item,color:`color-${index}`}
                        }else{
                            return {...item,color:""}
                        }
                    })
                    console.log("newData",newData)
                    setWheelsInfo(newData || [])
                    setLocalStorage(LOCALSTORAGE_KEY.WHEEL_REWARDS, JSON.stringify(data?.wheels))
                }
                setZealyTaskId(data?.zealy_task[0])
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

    const getHistoryData = async () => {
        const walletAddress = JSON.parse(getLocalStorage(LOCALSTORAGE_KEY.WALLET_SIGNATURE))?.account
        if (walletAddress) {
            const res = await checkApi(getHisoryList, [walletAddress])
            if (res?.data) {
                setHistoryRewards(res.data?.histories)
            }
        }
    }

    const getBalanceData = async () => {
        const res = await checkApi(getAssetsDataAPI)
        const {success, message, data} = res
        if (res?.tokens) {
            const newTokens = res?.tokens.filter(
                (token) =>
                    token.name === "tMFG" || token.name === "MFR" || token.name === "GLMR" || token.name === "ASTR"
            )
            setTokens(newTokens)
        } else {
            return AntdMessage.error({
                key: "err",
                content: message,
                className: "message-error",
                duration: 5,
            })
        }
    }

    const toggleModal = () => {
        setOpenModal(!openModal)
    }

    const handleToggleHistoryModal = () => {
        setIsOpenHistory(!isOpenHistory)
    }

    const handleTogleOpenRefLink = () => {
        setIsOpenRefLink(!isOpenRefLink)
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(`https://app.moonfit.xyz/bounty-spin?referral_code=${user?.referral_code}`)
    }

    const handleOpenNewTab = (url) => {
        window.open(url)
    }

    const handleNavigateTo = (url) => {
        navigate(`/${url}`)
        // navigate("/mint")
    }

    return (
        <div className={`lucky-wheel-wrapped-container bounty-spin-container ${historiesFixed?.length>0?"":"top-0"}`}>
            {historiesFixed?.length>0&&<WinnerListFixed histories={historiesFixed} marginLeft={"0"} index={5} id="sec5" />}
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
            <LuckyWheelModal open={openModal} toggle={toggleModal} />
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
                            />
                            <UserBalanceInfo tokens={tokens} onToggleHistoryModal={handleToggleHistoryModal} />

                            <div className="lucky-wheel-right">
                                <div className="header-picture">
                                    <img src={img1} alt="" />
                                    <img src={img2} alt="" />
                                    <img src={img3} alt="" />
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
                                    </div>
                                </div>
                            </div>
                            <div className="lucky-wheel-left">
                                <UserBalanceInfo tokens={tokens} onToggleHistoryModal={handleToggleHistoryModal} />
                                <WinnerListMobileWrapper
                                    histories1={histories.histories5}
                                    histories2={histories.histories6}
                                />
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
                                                    Share{" "}
                                                    <span className="color-FFB206" onClick={()=>{
                                                        handleOpenNewTab(`https://zealy.io/c/moonfit/questboard/${zealyTaskId}`)
                                                    }}>MoonFit Official Announcement</span>
                                                </span>
                                            </div>
                                            {missons?.zealy ? (
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
                                                    className={`invite ${isOpenRefLink ? "disabled" : ""}`}
                                                    onClick={handleTogleOpenRefLink}
                                                >
                                                    Invite friends
                                                </button>
                                                {missons?.invite ? (
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
                                                    <p>{`https://app.moonfit.xyz/bounty-spin?referral_code=${user?.referral_code}`}</p>
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
                                <button onClick={()=>{
                                    handleOpenNewTab("https://tofunft.com/collection/moonfit-beast-and-beauty/items")
                                }}>buy on tofunft</button>
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

