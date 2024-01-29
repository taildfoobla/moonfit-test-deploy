import React, {useEffect, useState} from "react"
import LuckyWheelModal from "./components/LuckyWheelModal"
import lwText from "../../assets/images/lucky-wheel/lw-text.png"
import Wheel from "./components/Wheel"
import {getLuckyWheelInfo} from "../../core/services/lucky-wheel"
import {getLocalStorage, LOCALSTORAGE_KEY, setLocalStorage} from "../../core/utils/helpers/storage"
// import {refreshAccessToken, updateGameToken} from "../../utils/webview"
import WinnerList from "./components/WinnerList"
import LuckyWheelBg from "../../assets/images/lucky-wheel/lucky-wheel-bg.png"
import LuckyWheelBgMobile from "../../assets/images/lucky-wheel/lucky wheel-bg-mobile.png"
import LuckyWheelHistoryIcon from "../../assets/images/lucky-wheel/lw-history-gift.png"
import LuckyWheelHistoryModal from "../../components/LuckyWheelHistoryModal"
import {getHisoryList} from "../../core/services/lucky-wheel"
import Bg from "../../assets/images/planet.png"
import "./styles.less"
import WinnerListMobile from "./components/WinnerListMobile"
import {LoadingOutlined} from "@ant-design/icons"
import WinnerListWrapper from "./components/WinnerListWrapper"

const loadingIcon =<LoadingOutlined style={{fontSize: 60, color: "#FFF"}} spin />

const LuckyWheel = () => {
    const [openModal, setOpenModal] = useState(false)
    const [histories, setHistories] = useState({
        histories1: [],
        histories2: [],
        histories3: [],
        histories4: [],
        histories5: [],
        histories6: [],
    })
    const [freeSpin, setFreeSpin] = useState(0)
    const [wheelsInfo, setWheelsInfo] = useState([])
    const [user, setUser] = useState({})
    const [refetch, setRefetch] = useState(0)
    const [gameToken, setGameToken] = useState(0)
    const [loadingFetch, setLoadingFetch] = useState(false)
    const [isOpenHistory, setIsOpenHistory] = useState(false)
    const [isSmallWindow, setIsSmallWindow] = useState(false)
    const [isIpad, setIsIpad] = useState(false)
    const [historyRewards, setHistoryRewards] = useState([])
    const [isScrolling,setIsScrolling]=useState(false)
    const windowOuter = window.outerWidth

    useEffect(() => {
        window.addEventListener("resize", () => {
            if (window.outerWidth < 851) {
                setIsIpad(true)

                setIsSmallWindow(true)
            }
            // else if (window.outerWidth < 1400) {
            //     setIsSmallWindow(true)
            //     setIsIpad(false)
            // }
            else {
                setIsSmallWindow(false)
                setIsIpad(false)
            }
        })
        fetchLuckyWheelInfo()
        getHistoryData()
        // setIsLoadingFirstTime(false)
    }, [])

    useEffect(() => {
        if (windowOuter < 851) {
            setIsIpad(true)

            setIsSmallWindow(true)
        }
        // else if (windowOuter < 1400) {
        //     setIsSmallWindow(true)
        //     setIsIpad(false)
        // }
        else {
            setIsSmallWindow(false)
            setIsIpad(false)
        }
    }, [windowOuter])

    const fetchLuckyWheelInfo = async () => {
        const wheels = getLocalStorage(LOCALSTORAGE_KEY.WHEEL_REWARDS || [])
        try {
            setLoadingFetch(true)
            setWheelsInfo(JSON.parse(wheels))
            const {data} = await getLuckyWheelInfo()
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
            if (data?.user?.game_token) {
                setGameToken(data.user.game_token)
                updateGameToken(data.user.game_token)
            }
            if (data?.is_new_today) {
                setOpenModal(true)
            }
            setFreeSpin(data?.free_spin)
            if (data?.wheels) {
                setWheelsInfo(data?.wheels || [])
                setLocalStorage(LOCALSTORAGE_KEY.WHEEL_REWARDS, JSON.stringify(data?.wheels))
            }
        } catch (error) {
            console.log(error)
            setLoadingFetch(false)
            // refreshAccessToken()
        }
    }

    const getHistoryData = async () => {
        const walletAddress = JSON.parse(getLocalStorage(LOCALSTORAGE_KEY.WALLET_SIGNATURE))?.account
        if (walletAddress) {
            const res = await getHisoryList(walletAddress)
            if (res?.data) {
                setHistoryRewards(res.data?.histories)
            }
        }
    }

    const toggleModal = () => {
        setOpenModal(!openModal)
    }

    const handleOpenHistory = () => {
        setIsOpenHistory(true)
    }

    const handleOpenNewTab = (url) => {
        window.open(url)
    }

    return (
        <div className="lucky-wheel-wrapped-container">
            <div className="explore-bg">
                <img src={Bg} alt="" />
            </div>
            {/* <div className="lucky-wheel-header">Moonfit lucky wheel</div> */}
            <LuckyWheelModal open={openModal} toggle={toggleModal} />

            {loadingFetch?loadingIcon:(
                <div className="lucky-wheel-container">
                    <div className="lucky-wheel-history">
                        <img
                            src={LuckyWheelHistoryIcon}
                            alt=""
                            onClick={() => {
                                handleOpenHistory()
                            }}
                        />
                    </div>
                    <LuckyWheelHistoryModal
                        isOpen={isOpenHistory}
                        setIsOpen={setIsOpenHistory}
                        historyData={historyRewards}
                    />
                    <div className="lucky-wheel-bg">
                        {isIpad ? <img src={LuckyWheelBgMobile} alt="" /> : <img src={LuckyWheelBg} alt="" />}
                    </div>
                    <div className="lucky-wheel-right">
                        <div className="lw-text no-event">
                            <img src={lwText} alt="" />
                        </div>
                        {/* {histories && <WinnerList histories={histories} />} */}
                        {isIpad ? (
                            <>
                                {histories.histories5 && (
                                    <WinnerListMobile
                                        index={5}
                                        id="sec5"
                                        histories={histories.histories5}
                                        marginLeft={"0"}
                                    />
                                )}
                                {histories.histories6 && (
                                    <WinnerListMobile
                                        index={6}
                                        id="sec6"
                                        histories={histories.histories6}
                                        marginLeft={"0"}
                                    />
                                )}
                            </>
                        ) : (
                            histories && (
                                <div className="history-winner">
                                    {/* {histories.histories1 && (
                                        <WinnerList
                                            index={1}
                                            id="sec1"
                                            histories={histories.histories1}
                                            marginLeft={"0"}
                                            isScrolling={isScrolling}
                                            setIsScrolling={setIsScrolling}
                                        />
                                    )}
                                    {histories.histories2 && (
                                        <WinnerList
                                            index={2}
                                            id="sec2"
                                            histories={histories.histories2}
                                            marginLeft={"0"}
                                            wrapperMarginLeft={"-20px"}
                                            isScrolling={isScrolling}
                                            setIsScrolling={setIsScrolling}
                                        />
                                    )}
                                    {histories.histories3 && (
                                        <WinnerList
                                            index={3}
                                            id="sec3"
                                            histories={histories.histories3}
                                            marginLeft={"20px"}
                                            isScrolling={isScrolling}
                                            setIsScrolling={setIsScrolling}
                                        />
                                    )}
                                    {histories.histories4 && (
                                        <WinnerList
                                            index={4}
                                            id="sec4"
                                            histories={histories.histories4}
                                            marginLeft={"20px"}
                                            wrapperMarginLeft={"-20px"}
                                            isScrolling={isScrolling}
                                            setIsScrolling={setIsScrolling}
                                        />
                                    )} */}
                                    <WinnerListWrapper histories={histories}/>
                                </div>
                            )
                        )}

                        {!isIpad && (
                            <div className="claim-tutorial">
                                <h3>IN ORDER TO CLAIM LUCKY WHEEL REWARDS:</h3>
                                <div className="claim-tutorial-content">
                                    <div className="claim-tutorial-content-item">
                                        <div className="claim-tutorial-content-item-number">
                                            {" "}
                                            <span>1</span>
                                        </div>
                                        <p className="claim-tutorial-content-item-text">
                                            Download MoonFit app{" "}
                                            <span
                                                onClick={() => {
                                                    handleOpenNewTab("https://onelink.to/kqzrmx")
                                                }}
                                            >
                                                here
                                            </span>
                                        </p>
                                    </div>
                                    <div className="claim-tutorial-content-item">
                                        <div className="claim-tutorial-content-item-number">
                                            {" "}
                                            <span>2</span>
                                        </div>
                                        <p className="claim-tutorial-content-item-text">
                                            Create an account & Connect your wallet with MoonFit app
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <Wheel
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
                    />
                    {isIpad && (
                        <div className="claim-tutorial">
                            <h3>IN ORDER TO CLAIM LUCKY WHEEL REWARDS:</h3>
                            <div className="claim-tutorial-content">
                                <div className="claim-tutorial-content-item">
                                    <div className="claim-tutorial-content-item-number">
                                        {" "}
                                        <span>1</span>
                                    </div>
                                    <p className="claim-tutorial-content-item-text">
                                        Download MoonFit app{" "}
                                        <span
                                            onClick={() => {
                                                console.log("dsadsa")
                                                handleOpenNewTab("https://onelink.to/kqzrmx")
                                            }}
                                        >
                                            here
                                        </span>
                                    </p>
                                </div>
                                <div className="claim-tutorial-content-item">
                                    <div className="claim-tutorial-content-item-number">
                                        {" "}
                                        <span>2</span>
                                    </div>
                                    <p className="claim-tutorial-content-item-text">
                                        Create an account & Connect your wallet with MoonFit app
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

          
        </div>
    )
}

export default LuckyWheel

