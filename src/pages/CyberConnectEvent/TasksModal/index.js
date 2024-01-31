import React from "react"
import "./styles.less"
import advanced from "../../../assets/images/summer/advanced.svg"
import photoTask from "../../../assets/images/summer/photo-task.svg"
import zealyTask from "../../../assets/images/summer/zealy-task.svg"
import dailyTask from "../../../assets/images/summer/daily-task.svg"
import checkCircle from "../../../assets/images/summer/check-circle.svg"
import {useEffect} from "react"
import EventService from "../../../core/services/event"
import {Button, message as AntdMessage, Spin} from "antd"
import {useState} from "react"
import {Fragment} from "react"
import {LoadingOutlined} from "@ant-design/icons"
import MFModal from "../../../components/MFModal"
import ClaimModal from "../ClaimModal"
import {useAuth} from "../../../core/contexts/auth"
import {depositOnchain} from "../../Deposit/components/depositOnchain"
import {switchToNetworkOnchain} from "../../../core/utils-app/blockchain"
import {checkTransactionHash, updateTransactionHash} from "../../../core/utils-app/api"
import {
    LOCALSTORAGE_KEY,
    getLocalStorage,
    setLocalStorage,
    removeLocalStorage,
} from "../../../core/utils/helpers/storage"
import LearnMoreImg from "../../../assets/images/cyber-connect/learn-more.png"
import { useNavigate } from "react-router-dom"
import { updateTransactionNoToken } from "../../../core/services/lucky-wheel"
import CryptoJS from "crypto-js"
import { COMMON_CONFIGS } from "../../../core/utils/configs/common"
const {CYBER_ACCOUNT_KEY} = COMMON_CONFIGS

const antIcon = <LoadingOutlined style={{fontSize: 16, color: "#000"}} spin />

const TaskModal = (props) => {
    const navigate=useNavigate()
    const {provider, connector, auth, handleGetAccessToken, connectToCyber, sendViaCyberWallet, onDisconnect} =
        useAuth()
    const {taskData, dateOfMonth, refetch, setReward, setOpenModal, setModalChallenge, toggle, backgroundData} = props
    const [loading, setLoading] = useState(false)
    const [currentClaimIndex, setCurrentClaimIndex] = useState([])
    const [openRewardModal, setOpenRewardModal] = useState(false)
    const [taskIndex, setTaskIndex] = useState("")
    const [typeReward, setTypeReward] = useState("")
    const [backgroundUrl, setBackgroundUrl] = useState(backgroundData[0])
    const [isOpenTaskGuide, setIsOpenTaskGuide] = useState(false)

 

    useEffect(() => {
        let randomNumber = Math.round(Math.random() * 3)
        setBackgroundUrl(backgroundData[randomNumber])
    }, [taskData])

    const checkApi = async (callback, array) => {
        const userId = getLocalStorage(LOCALSTORAGE_KEY.SELECTED_USER_ID)
        const account = JSON.parse(getLocalStorage(LOCALSTORAGE_KEY.WALLET_SIGNATURE))?.account

        try {
            const res = await callback(array.map((item) => item))
            if (res.data === undefined) {
                return res
            }
            const {message, success} = res.data

            if (success) {
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
            console.log("err", err)
        }
    }

    const generateTaskDetail = (type_action, type_reward, detail) => {
        let taskAction = "Daily task"
        let icon = <img src={advanced} alt="" />
        switch (type_action) {
            case "run":
                if (type_reward === "daily") {
                    taskAction = "Daily task"
                    icon = <img src={dailyTask} alt="" />
                } else if (type_reward === "advanced") {
                    taskAction = "Advanced task"
                    icon = <img src={advanced} alt="" />
                }
                break
            case "run_a_session":
                if (type_reward === "advanced") {
                    taskAction = "Advanced task"
                    icon = <img src={advanced} alt="" />
                }
                break
            case "zealy_task":
                if (taskData.date === "2023-06-13") {
                    taskAction = "Advanced task"
                    icon = <img src={photoTask} alt="" />
                } else {
                    taskAction = "Zealy task"
                    icon = <img src={zealyTask} alt="" />
                }
                break
            default:
                break
        }
        return {
            icon,
            taskAction,
        }
    }

    const generateTaskDescription = (type_action, detail) => {
        let description = <span>{detail}</span>
        switch (type_action) {
            case "zealy_task":
                const searchText = "Zealy Task"
                const startIndex = detail.indexOf(searchText)
                const firstSubstring = detail.substring(0, startIndex)
                const secondSubstring = detail.substring(startIndex + searchText.length)
                description = (
                    <span>
                        {firstSubstring}{" "}
                        <a href="https://zealy.io/c/moonfit/questboard" target="_blank" rel="noreferrer">
                            {searchText}
                        </a>{" "}
                        {secondSubstring}
                    </span>
                )
                break
            case "mint_cyber_id":
                const searchTextCyber = "CyberID"
                const startIndexCyber = detail.indexOf(searchTextCyber)
                const firstSubstringCyber = detail.substring(0, startIndexCyber)
                const secondSubstringCyber = detail.substring(startIndexCyber + searchTextCyber.length)
                description=(
                    <span>
                        {firstSubstringCyber}{" "}
                        <a style={{color:"#e4007b"}} href="https://wallet.cyber.co/cyberid?utm_source=twitter&utm_medium=social&utm_campaign=cyberid&utm_term=cyberaccount-cyberid&utm_content=CyberID+-+Your+Web3+Social+Identity" target="_blank" rel="noreferrer">
                            {searchTextCyber}
                        </a>{" "}
                        {secondSubstringCyber}
                    </span>
                )
            default:
                break
        }
        return description
    }

    const onOpenModalClaim = (typeReward, taskIndex) => {
        setOpenRewardModal(true)
        setTypeReward(typeReward)
        setTaskIndex(taskIndex)
        toggle()
    }

    const onClaimTask = async (type_reward, taskIndex, text = null) => {
        const accessToken = getLocalStorage(LOCALSTORAGE_KEY.ACCESS_TOKEN)
        const walletAddress = JSON.parse(getLocalStorage(LOCALSTORAGE_KEY.WALLET_SIGNATURE))?.account
        if (connectToCyber?.isConnected) {
            if (accessToken !== null) {
                setLoading(true)
                const req = {
                    slug: "moonfit-x-cyberconnect-challenge",
                    date: taskData.date,
                    type_reward,
                }
                const res = await checkApi(EventService.claimOnChain, [req])

                const data = res?.data?.data
                const transactionData = data?.transaction_data
                const to = transactionData?.transaction?.to
                const dataTracsaction = transactionData?.transaction?.data
                const hash = await sendViaCyberWallet(transactionData)
                if (hash) {
                    const reqUpdate = {transaction_id: data.wallet_transaction_id, transaction_hash: hash}
                    const a = await checkApi(updateTransactionHash, [reqUpdate])
                    const x = await checkApi(checkTransactionHash, [data])
                    let isCompleted = x.is_completed
                    let y
                    let z
                    y = setInterval(async () => {
                        z = await await checkApi(checkTransactionHash, [data])
                        isCompleted = z.is_completed
                        if (isCompleted) {
                            clearInterval(y)
                            refetch()
                            setReward(z)
                            setOpenModal(true)
                            setModalChallenge((prev) => ({...prev, visible: false}))
                            const newClaimIndex = [...currentClaimIndex]
                            const isExistIndex = currentClaimIndex.includes(taskIndex)
                            if (!isExistIndex) {
                                newClaimIndex.push(taskIndex)
                            }
                            setCurrentClaimIndex(newClaimIndex)
                        }
                    }, 5000)
                } else {
                    setLoading(false)

                    setModalChallenge((prev) => ({...prev, visible: false}))
                    return AntdMessage.error({
                        key:"err",
                        content: "Transaction hash undefined",
                        className: "message-error",
                        duration: 5,
                    })
                }
            }else{
                setLoading(true)
                const req = {
                    slug: "moonfit-x-cyberconnect-challenge",
                    date: taskData.date,
                    type_reward,
                }
                const res = await checkApi(EventService.claimOnChain, [req])

                const data = res?.data?.data
                const transactionData = data?.transaction_data
                const to = transactionData?.transaction?.to
                const dataTracsaction = transactionData?.transaction?.data
                const hash = await sendViaCyberWallet(transactionData)
                if (hash) {
                    const value = {
                        wallet_address: walletAddress,
                        time: Date.now(),
                    }
                    const key = CryptoJS.AES.encrypt(JSON.stringify(value), CYBER_ACCOUNT_KEY).toString()
                    const reqUpdate = {transaction_id: data.wallet_transaction_id, transaction_hash: hash,key}

                    const a = await updateTransactionNoToken(reqUpdate)
                    const x = await checkTransactionHash([data])
                    let isCompleted = x.is_completed
                    let y
                    let z
                    y = setInterval(async () => {
                        z = await checkTransactionHash([data]), 
                        isCompleted = z.is_completed
                        if (isCompleted) {
                            clearInterval(y)
                            refetch()
                            setReward(z)
                            setOpenModal(true)
                            setModalChallenge((prev) => ({...prev, visible: false}))
                            const newClaimIndex = [...currentClaimIndex]
                            const isExistIndex = currentClaimIndex.includes(taskIndex)
                            if (!isExistIndex) {
                                newClaimIndex.push(taskIndex)
                            }
                            setCurrentClaimIndex(newClaimIndex)
                        }
                    }, 5000)
                } else {
                    setLoading(false)

                    setModalChallenge((prev) => ({...prev, visible: false}))
                    return AntdMessage.error({
                        key:"err",
                        content: "Transaction hash undefined",
                        className: "message-error",
                        duration: 5,
                    })
                }
            }
        } else {
            if (accessToken !== null) {
            try {
                setLoading(true)
                const req = {
                    slug: "moonfit-x-cyberconnect-challenge",
                    date: taskData.date,
                    type_reward,
                }
                const res = await checkApi(EventService.claimOnChain, [req])

                const data = res?.data?.data

                const transactionData = data?.transaction_data
                const chainId = transactionData.chainId
                if (provider) {
                    const switchSuccess = await switchToNetworkOnchain(provider, chainId, transactionData)

                    if (!switchSuccess) {
                        setModalChallenge((prev) => ({...prev, visible: false}))
                        setLoading(false)
                        return
                    }
                    const sendTransactionSucces = await checkApi(depositOnchain, [
                        provider,
                        connector,
                        data,
                        auth?.user?.account,
                    ])
                    if (!sendTransactionSucces) {
                        setModalChallenge((prev) => ({...prev, visible: false}))
                        setLoading(false)
                        return
                    }

                    const x = await checkTransactionHash([data])

                    let isCompleted = x.is_completed
                    let y
                    let z
                    y = setInterval(async () => {
                        z = await checkTransactionHash([data])
                        isCompleted = z.is_completed
                        if (isCompleted) {
                            clearInterval(y)
                            refetch()
                            setReward(z)
                            setOpenModal(true)
                            setModalChallenge((prev) => ({...prev, visible: false}))
                            const newClaimIndex = [...currentClaimIndex]
                            const isExistIndex = currentClaimIndex.includes(taskIndex)
                            if (!isExistIndex) {
                                newClaimIndex.push(taskIndex)
                            }
                            setCurrentClaimIndex(newClaimIndex)
                        }
                    }, 5000)

                    // .catch((err) => {
                    //     // if (text === "reCall") {
                    //     console.log("here2")
                    //     // onDisconnect()
                    //     // }
                    //     setModalChallenge((prev) => ({...prev, visible: false}))

                    //     console.log("errDepositing")
                    //     setLoading(false)
                    // })
                }

                // setLoading(false)
                // setOpenModal(true)
                const {success, message} = res.data
                if (!success) {
                    return AntdMessage.error({
                        key:"err",
                        content: message,
                        className: "message-error",
                        duration: 5,
                    })
                } else {
                    // refetch()
                    // setReward(rewardOnchain)
                    // setOpenModal(true)
                    // setModalChallenge((prev) => ({...prev, visible: false}))
                    // const newClaimIndex = [...currentClaimIndex]
                    // const isExistIndex = currentClaimIndex.includes(taskIndex)
                    // if (!isExistIndex) {
                    //     newClaimIndex.push(taskIndex)
                    // }
                    // setCurrentClaimIndex(newClaimIndex)
                }
            } catch (e) {
                setLoading(false)
            }
            }
            else if(walletAddress!==null){
                try {
                    setLoading(true)
                    const req = {
                        slug: "moonfit-x-cyberconnect-challenge",
                        date: taskData.date,
                        type_reward,
                    }
                    const res = await checkApi(EventService.claimOnChain, [req])

                    const data = res?.data?.data

                    const transactionData = data?.transaction_data
                    const chainId = transactionData.chainId
                    if (provider) {
                        const switchSuccess = await switchToNetworkOnchain(provider, chainId, transactionData)

                        if (!switchSuccess) {
                            setModalChallenge((prev) => ({...prev, visible: false}))
                            setLoading(false)
                            return
                        }
                        const sendTransactionSucces = await checkApi(depositOnchain, [
                            provider,
                            connector,
                            data,
                            auth?.user?.account,
                        ])
                        if (!sendTransactionSucces) {
                            setModalChallenge((prev) => ({...prev, visible: false}))
                            setLoading(false)
                            return
                        }

                        const x = await checkTransactionHash([data])
                        let isCompleted = x.is_completed
                        let y
                        let z
                        y = setInterval(async () => {
                            z = await checkTransactionHash([data])
                            isCompleted = z.is_completed
                            if (isCompleted) {
                                clearInterval(y)
                                refetch()
                                setReward(z)
                                setOpenModal(true)
                                setModalChallenge((prev) => ({...prev, visible: false}))
                                const newClaimIndex = [...currentClaimIndex]
                                const isExistIndex = currentClaimIndex.includes(taskIndex)
                                if (!isExistIndex) {
                                    newClaimIndex.push(taskIndex)
                                }
                                setCurrentClaimIndex(newClaimIndex)
                            }
                        }, 5000)

                    }

                    const {success, message} = res.data
                    if (!success) {
                        return AntdMessage.error({
                            key:"err",
                            content: message,
                            className: "message-error",
                            duration: 5,
                        })
                    } else {

                    }
                } catch (e) {
                    setLoading(false)
                }
            }
        }
    }

    const onCloseRewardModal = () => {
        setOpenRewardModal(false)
    }

    const toggleTaskGuide = (boolean) => {
        setIsOpenTaskGuide(boolean)
    }

    const openNewTab = (url) => {
        window.open(url)
    }

    const handleNavigate=(url)=>{
        navigate(url)
    }

    const renderGuides = (action) => {
        // setIsHaveGuide(true)
        switch (action) {
            case "hodl_nft_in_app":
                // setIsHaveGuide(true)
                return (
                    <div className="learn-more-list">
                        <div className="learn-more-item">
                            Step 1: Visit our{" "}<span className="underline" onClick={()=>{
                                handleNavigate("./mint")
                            }}>minting page</span>
                        </div>
                        <div className="learn-more-item">
                            Step 2: Connect wallet & choose the amount of NFTs you want to buy
                        </div>
                        <div className="learn-more-item">
                            Step 3: Open <span>MoonFit app</span> and deposit NFT into app
                        </div>
                    </div>
                )
                break
            case "connect_wallet":
                // setIsHaveGuide(true)
                return (
                    <div className="learn-more-list">
                        <div className="learn-more-item">
                            Step 1: Download our{" "}
                            <span
                                className="underline"
                                onClick={() => {
                                    openNewTab("https://onelink.to/kqzrmx")
                                }}
                            >
                                app
                            </span>{" "}
                            and create your account
                        </div>
                        <div className="learn-more-item">
                            Step 2: Click on the Token section and choose "<span>Wallet</span>"
                        </div>
                        <div className="learn-more-item">
                            Step 3: Select "<span>Connect Wallet</span>"{" "}
                        </div>
                    </div>
                )
                break
            case "run":
                // setIsHaveGuide(true)
                return (
                    <div className="learn-more-list">
                        <div className="learn-more-item">
                            Step 1: Download our{" "}
                            <span
                                className="underline"
                                onClick={() => {
                                    openNewTab("https://onelink.to/kqzrmx")
                                }}
                            >
                                app
                            </span>{" "}
                            and create your account
                        </div>
                        <div className="learn-more-item">
                            Step 2: Click on "<span>Run</span>" icon and start running
                        </div>
                    </div>
                )
                break
            default:
                // setIsHaveGuide(false)
                break
        }
    }

    return (
        <div className="task-challenge">
            {/* <div style={{backgroundImage:"url(../../../assets/images/lunar/bg-1.png)"}}></div> */}
            {/* <MFModal
                visible={openRewardModal}
                width={488}
                centered={true}
                footer={false}
                className={`lunar-gaming-festival-claim ${
                    "token" === "token" ? "modal-reward-token-container" : "modal-reward-item-container"
                }`}
                maskClosable={false}
                onCancel={() => onCloseRewardModal()}
            >
                <ClaimModal
                    reward={{type: "token"}}
                    toggle={() => onCloseRewardModal()}
                    onClaimTask={onClaimTask}
                    type_reward={typeReward}
                    index={taskIndex}
                />
            </MFModal> */}
            <div className="task-bg" style={{backgroundColor:`${taskData.background}`}}>
                {/* <img src={backgroundUrl} alt="" /> */}
            </div>
            {taskData && (
                <Fragment>
                    {/* <span className="task-date">{dateOfMonth}</span> */}
                    <h3>{taskData.name}</h3>
                    <ul className="list-task">
                        {taskData.tasks.length &&
                            taskData.tasks.map((item, index) => {
                                const {
                                    can_claim,
                                    detail = "",
                                    type_action,
                                    type_reward,
                                    is_claimed,
                                    rewards = {},
                                    rewards_detail,
                                } = item
                                const isHaveGuide =
                                    type_action === "hodl_nft_in_app" ||
                                    type_action === "connect_wallet" ||
                                    type_action === "run"
                                return (
                                    <li className="task" key={`task_${index}`}>
                                        <div className="task-content">
                                            <div className="task-detail">
                                                {generateTaskDetail(type_action, type_reward).icon}
                                                <div className="task-description">
                                                    <p>{generateTaskDetail(type_action, type_reward).taskAction}</p>
                                                    {generateTaskDescription(type_action, detail)}
                                                    <br />
                                                    {is_claimed && (
                                                        <small style={{fontSize: "100%"}}>
                                                            You won{" "}
                                                            <small
                                                                className={
                                                                    rewards.type === "MFG"
                                                                        ? "text-primary"
                                                                        : "text-secondary"
                                                                }
                                                            >
                                                                {rewards_detail}
                                                            </small>
                                                        </small>
                                                    )}
                                                    {isHaveGuide && (
                                                        <div
                                                            className={`learn-more-expand ${
                                                                isOpenTaskGuide ? "disabled" : ""
                                                            }`}
                                                            onClick={() => {
                                                                toggleTaskGuide(true)
                                                            }}
                                                        >
                                                            Learn more
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="task-claim">
                                                <Button
                                                    type="primary"
                                                    disabled={
                                                        !can_claim || is_claimed || loading
                                                        // ||
                                                        // currentClaimIndex.includes(index) ||
                                                        // loading
                                                    }
                                                    // onClick={() => onClaimTask(type_action, type_reward, index)}
                                                    onClick={() => {
                                                        onClaimTask(type_reward, index)
                                                    }}
                                                    style={
                                                        is_claimed || currentClaimIndex.includes(index)
                                                            ? {padding: "0 8px"}
                                                            : null
                                                    }
                                                >
                                                    {loading ? (
                                                        <Spin indicator={antIcon} />
                                                    ) : is_claimed || currentClaimIndex.includes(index) ? (
                                                        <div className="claimed">
                                                            <img
                                                                style={{marginRight: "2px"}}
                                                                src={checkCircle}
                                                                alt=""
                                                            />{" "}
                                                            <span>Claimed</span>
                                                        </div>
                                                    ) : (
                                                        "Claim"
                                                    )}
                                                    {/* {is_claimed || currentClaimIndex.includes(index) ? (
                                                    <div className="claimed">
                                                        <img style={{marginRight: "2px"}} src={checkCircle} alt="" />{" "}
                                                        <span>Claimed</span>
                                                    </div>
                                                ) : (
                                                    "Claim"
                                                )} */}
                                                </Button>
                                            </div>
                                        </div>
                                        {isHaveGuide && (
                                            <div className={`learn-more ${isOpenTaskGuide ? "visible" : ""}`}>
                                                <div className="learn-more-header">
                                                    <img src={LearnMoreImg} alt="" /> Learn more:
                                                </div>
                                                {/* <div className="learn-more-list">
                                                <div className="learn-more-item">
                                                    Step 1: Visit our <span> minting page</span>
                                                </div>
                                                <div className="learn-more-item">
                                                    Step 2: Connect wallet & choose the amount of NFTs you want to buy
                                                </div>
                                                <div className="learn-more-item">
                                                    Step 3: Open <span>MoonFit app</span> and deposit NFT into app
                                                </div>
                                            </div> */}
                                                {renderGuides(type_action)}
                                            </div>
                                        )}
                                    </li>
                                )
                            })}
                    </ul>
                </Fragment>
            )}
        </div>
    )
}

export default TaskModal

