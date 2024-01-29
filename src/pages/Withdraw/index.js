import React, {Fragment, useEffect, useState,useRef} from "react"
import "./styles.less"
import qrCode from "../../assets/images/withdraw/qrcode.png"
import {Select} from "antd"
import mfg from "../../assets/images/withdraw/mfg.png"
import glmr from "../../assets/images/withdraw/glmr.png"
import caretDown from "../../assets/images/withdraw/caret-down.png"
import withdrawBtn from "../../assets/images/withdraw/withdraw-btn.png"
import WithdrawWrapper from "../../components/Wrapper/WithdrawWrapper"
import {checkApi} from "../../core/utils/helpers/check-api"
import {useAuth} from "../../core/contexts/auth"
import {getAssetsDataAPI} from "../../core/services/assets-management"
import TwoFAModal from "../../components/TwoFAModal"
import {check2faAPI} from "../../core/services/2fa"
import {message as AntdMessage} from "antd"
import InfoBeastModal from "../../components/InfoBeastModal"
import {checkApiComponent} from "../../core/utils/helpers/check-api-component"
import {useNavigate} from "react-router-dom"
import Loading from "../Mint/components/LoadingOutlined"
import Web3 from "web3"
import loadingDualBall from ".././../assets/images/withdraw/loading-dual-ball.svg"
import SubmittedModal from "./components/SubmittedModal"
import { LOCALSTORAGE_KEY, getLocalStorage } from "../../core/utils/helpers/storage"
import { renderEmail } from "../../core/utils/helpers/render-email"
import copyIcon from "../../assets/images/withdraw/copy-code.png"

const web3 = new Web3()

export default function Withdraw() {
    const navigate = useNavigate()
    const [toAddress, setToAddress] = useState("")
    const [assetsData, setAssetsData] = useState({tokens: [], nfts: [], withdrawList: []})
    const [selectedAsset, setSelectedAsset] = useState({
        type: "token",
        name: "",
        imgLink: "",
        withdraw: "",
        digit: 2,
        value: 0,
        chainId: 0,
        chainIcon: "",
        id: "",
        comingSoonWithdraw: false,
    })
    const [amountInput, setAmountInput] = useState("")
    const [selectedNetwork, setSelectedNetwork] = useState({chainIcon: "", chainId: 0, fees: [], networkName: ""})
    const [isOpenTwoFAModal, setIsOpenTwoFAModal] = useState(false)
    const [isHave2FA, setIsHave2FA] = useState(false)
    const [isActiveButton, setIsActiveButton] = useState(false)
    const [messageBeast, setMessageBeast] = useState({isOpen: false, message: "", type: ""})
    const [lockWithdraw, setLockWithdraw] = useState({isLock: false, time: ""})
    const [mfrBalance, setMfrBalance] = useState(0)
    const [isRerender, setIsRerender] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [isOpenSubmittedModal,setIsOpenSubmittedModal]=useState(false)

    const inputRef =useRef()
    const {isLoginSocial, showConnectModal} = useAuth()

    const socialAccount=JSON.parse(getLocalStorage(LOCALSTORAGE_KEY.SOCIAL_ACOUNT))

    useEffect(() => {
        if (isLoginSocial) {
            getAssetsData()
        } else {
            navigate("/")
        }
    }, [isLoginSocial])

    useEffect(() => {
        if (isRerender) {
            getAssetsData()
            setIsRerender(false)
        }
    }, [isRerender])

    useEffect(() => {
        if (toAddress !== "") {
            if (selectedAsset?.type === "token" && amountInput !== "" && amountInput !== 0 && amountInput !== "0") {
                setIsActiveButton(true)
            } else if (selectedAsset?.type !== "token") {
                setIsActiveButton(true)
            } else {
                setIsActiveButton(false)
            }
        } else {
            setIsActiveButton(false)
        }
    }, [toAddress, selectedAsset, amountInput])

    const getAssetsData = async () => {
        const res = await checkApi(getAssetsDataAPI)
        if (res?.success === false) {
            return
        }
        const isLockWithdraw = res?.is_lock_withdraw
        const lockWithdrawTime = res?.lock_withdraw_time

        const nftsList = res?.nfts?.data || []
        const tokensList = res?.tokens || []
        const mfr = tokensList.find((token) => token.name === "MFR")
        setMfrBalance(mfr?.value)
        const newWithdrawList = []
        if (tokensList.length > 0) {
            tokensList.forEach((token) => {
                const data = {
                    type: "token",
                    name: token.name,
                    imgLink: token.image_url,
                    withdraw: token.withdraw,
                    digit: token.digit,
                    value: token.value,
                    comingSoonWithdraw: token.comingSoonWithdraw,
                    chainId: token.chainId,
                    health: 100,
                    isSelling: false,
                    isSwap: false,
                    isCooldownWithdraw: false,
                    isJoinClan: false,
                    isUpgrading: false,
                    itemEndurance: 0,
                    itemLuck: 0,
                    itemSpeed: 0,
                    itemStamina: 0,
                    upgradingTime: "",
                    clanName: "",
                    clanId: "",
                    cooldownTimeWithdraw: "",
                    beastType: "",
                }
                newWithdrawList.push(data)
            })
        }
        if (nftsList.length > 0) {
            nftsList.forEach((nft) => {
                const data = {
                    type: "MoonBeast",
                    name: nft.nft_name,
                    imgLink: nft.image_url,
                    withdraw: nft.withdraw,
                    chainId: nft.chainId,
                    id: nft.id,
                    chainIcon: nft.chainIcon,
                    health: nft.health,
                    isSelling: nft.is_selling,
                    isSwap: nft.is_swap,
                    isCooldownWithdraw: nft.is_cooldown_withdraw,
                    isJoinClan: nft.is_join_clan,
                    isUpgrading: nft.is_upgrading,
                    itemEndurance: nft.item_endurance,
                    itemLuck: nft.item_luck,
                    itemSpeed: nft.item_speed,
                    itemStamina: nft.item_stamina,
                    upgradingTime: nft.upgrading_time || "",
                    clanName: nft.Clan?.name || "",
                    clanId: nft.Clan?.id || "",
                    cooldownTimeWithdraw: nft.cooldown_time_withdraw || "",
                    beastType: nft.type === "MoonBeast" ? "beast" : nft.type === "MintPass" ? "mint-pass" : "",
                }
                newWithdrawList.push(data)
            })
        }
        let newSelected = {}
        if (selectedAsset?.name !== "") {
            newSelected = newWithdrawList.find((item) => item.name === selectedAsset?.name)
        } else {
            newSelected = newWithdrawList.find((item) => item.name === "GLMR")
        }
        setSelectedAsset(newSelected)

        const network = newSelected?.withdraw[0]
        setSelectedNetwork(network)
        const value = {
            nfts: nftsList,
            tokens: tokensList,
            withdrawList: newWithdrawList,
        }
        setAssetsData(value)
        setLockWithdraw({isLock: isLockWithdraw, time: lockWithdrawTime})
        setIsLoading(false)
    }

    //format balance number
    const formatNumber = (number, digit) => {
        let numbertoString = number.toString()
        let newNumber
        if (numbertoString.includes(".")) {
            const arrNumber = numbertoString.split(".")
            const afterDot = arrNumber[1].slice(0, digit)
            const beforeDot = Number(arrNumber[0]).toLocaleString("en-US")
            newNumber = `${beforeDot}.${afterDot}`
        } else {
            newNumber = number.toLocaleString("en-US")
        }

        return newNumber
    }

    const formatNumberTotal = (number, digit) => {
        let numbertoString = number.toString()
        let newNumber
        if (numbertoString.includes(".")) {
            const arrNumber = numbertoString.split(".")
            const afterDot = arrNumber[1].slice(0, digit)
            const beforeDot = Number(arrNumber[0]).toLocaleString("en-US")
            newNumber = `${beforeDot}.${afterDot}`
        } else {
            newNumber = number.toLocaleString("en-US")
        }

        return newNumber
    }

    // format placeholder
    const formatPlaceholder = (digit) => {
        const number = 0
        return number.toFixed(digit)
    }

    //format input
    const formatInput = (number, digit) => {
        let numbertoString = number.toString()
        let newNumber
        if (numbertoString.includes(".")) {
            const arrNumber = numbertoString.split(".")
            let afterDot
            if (arrNumber[1]) {
                afterDot = arrNumber[1].slice(0, digit)
            } else {
                afterDot = ""
            }

            const beforeDot = Number(arrNumber[0]).toLocaleString("en-US")
            newNumber = `${beforeDot}.${afterDot}`
        } else {
            newNumber = Number(number).toLocaleString("en-US")
        }
        return newNumber
    }

    const handleCommingSoon = () => {
        return AntdMessage.error({
            key: "err",
            content: "Comming soon",
            className: "message-error",
            duration: 5,
        })
    }

    function renderTime(milliseconds) {
        const totalSeconds = Math.floor(milliseconds / 1000)
        const hours = Math.floor(totalSeconds / 3600)
        const minutes = Math.floor((totalSeconds % 3600) / 60)
        const seconds = totalSeconds % 60

        const formattedHours = hours < 10 ? `0${hours}` : hours
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes
        const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds

        const formattedTime = `${formattedHours}h ${formattedMinutes}m ${formattedSeconds}s`

        return formattedTime
    }

    const renderMessageBeast = (type, value) => {
        const {upgradingTime, clanName, cooldownTimeWithdraw, health, lockWithdrawTime} = value
        switch (type) {
            case "isSwap":
                return "Your MoonBeast is currently undergoing a swap, please try again in a few minutes"

            case "isCooldownWithdraw":
                return (
                    <>
                        Your MoonBeast is under cooldown because it is newly deposited. Remaining time:{" "}
                        <span className="dot-flashing" />
                    </>
                )
            case "isSelling":
                return "Your MoonBeast is selling, cancel it?"
            case "isJoinClan":
                return `Your MoonBeast is joining clan “${clanName}". Do you want to leave your MoonBeast from the clan and continue?`

            case "isUpgrading":
                return (
                    <>
                        To withdraw this MoonBeast, it needs to undergo the evolution process, and the fee to expedite
                        this process is <img src={loadingDualBall} alt="loading" />
                    </>
                )

            case "item":
                return `Your MoonBeast is equipping some MoonItems. Do you want to unequip all MoonItems from your MoonBeast and continue??`
            case "lockWithdraw":
                return (
                    <>
                        You can't withdraw because you changed 2FA. Remaining time:{" "}
                        <img src={loadingDualBall} alt="loading" />
                    </>
                )

            case "health":
                return (
                    <>
                        To withdraw a MoonBeast, it needs to have a health index of 100%, and the fee to regain is{" "}
                        <img src={loadingDualBall} alt="loading" />
                    </>
                )
            default:
                return (
                    <>
                        Your MoonBeast is under cooldown because it is newly deposited. Remaining time:{" "}
                        <img src={loadingDualBall} alt="loading" />
                    </>
                )
        }
    }

    const handleOpenModalMessageBeast = () => {
        setMessageBeast({...messageBeast, isOpen: true})
    }

    const handleCloseModalMessageBeast = () => {
        setMessageBeast({...messageBeast, isOpen: false})
    }

    const selectOptions =
        assetsData.withdrawList.length > 0
            ? assetsData.withdrawList.map((item) => {
                  if (item.name === "tMFG" || item.name === "MFR"||item.name==="BNB") {
                      return {
                          value: item.name,
                          disabled: true,
                          label: (
                              <p onClick={handleCommingSoon}>
                                  <img src={item.imgLink} />
                                  <span>{item.name}</span>
                              </p>
                          ),
                      }
                  }
                  //   else if (
                  //       item.isSwap ||
                  //       item.isCooldownWithdraw ||
                  //       item.isJoinClan ||
                  //       item.isUpgrading ||
                  //       item.itemEndurance !== 0 ||
                  //       item.itemLuck !== 0 ||
                  //       item.itemSpeed !== 0 ||
                  //       item.itemStamina !== 0
                  //   ) {
                  //       return {
                  //           value: item.name,
                  //           disabled: true,
                  //           label: (
                  //             <>
                  //                   <img src={item.imgLink} alt={item.name} />
                  //                   <span>{item.name}</span>
                  //               </>
                  //           ),
                  //       }
                  //   }
                  else {
                      return {
                          value: item.name,
                          label: (
                              <>
                                  <img src={item.imgLink} />
                                  <span>{item.name}</span>
                              </>
                          ),
                      }
                  }
              })
            : []
    const networkOptions =
        selectedAsset?.withdraw?.length > 0
            ? selectedAsset?.withdraw.map((item) => {
                  return {
                      value: item.chainId,
                      label: (
                          <>
                              <img src={item.chainIcon} alt={item.networkName} />
                              <span>{item.networkName}</span>
                          </>
                      ),
                  }
              })
            : []

    const handleChange = (value) => {
        const selected = assetsData.withdrawList.find((item) => item.name === value)
        setSelectedAsset(selected)
        setSelectedNetwork(selected?.withdraw[0])
        setAmountInput("")
    }

    const handleChangeInputAddress = (value) => {
        setToAddress(value)
    }

    // change input
    const handleChangeAmount = (value, digit) => {
        const num = Number(value.replaceAll(",", ""))

        if (selectedAsset?.value <= Number(selectedNetwork?.fees[0]?.value)) {
            console.log("here1")
            setAmountInput("0")
            return
        }

        if (isNaN(num)) {
         
            setAmountInput("0")
            return
        }
        if (num > selectedAsset?.value - Number(selectedNetwork?.fees[0]?.value)) {
            return setAmountInput(
                formatNumber(selectedAsset?.value - Number(selectedNetwork?.fees[0]?.value), selectedAsset?.digit)
            )
        } else {
            if (value.includes(",")) {
                const newValue = value.replaceAll(",", "")
                const newAmount = formatInput(newValue, digit)
                setAmountInput(newAmount)
            } else {
                const newAmount = formatInput(value, digit)
                setAmountInput(newAmount)
            }
        }
    }

    const handleChangeNetwork = (value) => {
        const network = selectedAsset.withdraw.find((item) => item.chainId === value)
        setSelectedNetwork(network)
    }

    const checkBalance = () => {
        let result = true
        if (selectedAsset.type === "MoonBeast") {
            const arrFees = selectedNetwork?.fees
            arrFees.forEach((item) => {
                const token = assetsData?.tokens.find((token) => token?.name === item.symbol)
                if (token?.value < item?.value) {
                    result = false
                }
            })
        }

        return result
    }

    const checkTwoFA = async () => {
        const res = await checkApi(check2faAPI)
        const {success, message, data} = res
        if (success) {
            const enable = data?.enable
            if (enable) {
                setIsHave2FA(true)
            } else {
                setIsHave2FA(false)
            }
        } else {
            return AntdMessage.error({
                key: "err",
                content: message,
                className: "message-error",
                duration: 5,
            })
        }
    }

    function isValidMetaMaskAddress(address) {
        return web3.utils.isAddress(address)
    }

    const handleOpenTwoFAModal = async () => {
        try {
            if (isActiveButton) {
                const checkAddress = isValidMetaMaskAddress(toAddress)
                // const checkAddress =true
                if (checkAddress) {
                    if (
                        selectedAsset?.isSwap ||
                        selectedAsset?.isCooldownWithdraw ||
                        selectedAsset?.isSelling ||
                        selectedAsset?.isJoinClan ||
                        selectedAsset?.isUpgrading ||
                        selectedAsset?.itemEndurance !== 0 ||
                        selectedAsset?.itemLuck !== 0 ||
                        selectedAsset?.itemSpeed !== 0 ||
                        selectedAsset?.itemStamina !== 0 ||
                        selectedAsset?.health < 100 ||
                        (lockWithdraw?.isLock&&lockWithdraw?.time!==null&&lockWithdraw?.time!=="")
                    ) {
                        const value = {
                            upgradingTime: selectedAsset?.upgradingTime,
                            clanName: selectedAsset?.clanName,
                            cooldownTimeWithdraw: selectedAsset?.cooldownTimeWithdraw,
                            health: selectedAsset?.health,
                            lockWithdrawTime: lockWithdraw?.time,
                        }
                        let infoMessage = ""
                        let type = ""
                        if (selectedAsset?.isSwap) {
                            console.log("swap")
                            type = "isSwap"
                            infoMessage = renderMessageBeast("isSwap", value)
                        } else if (selectedAsset?.isCooldownWithdraw) {
                            console.log("withdraw")
                            type = "isCooldownWithdraw"
                            infoMessage = renderMessageBeast("isCooldownWithdraw", value)
                        } else if (selectedAsset?.isSelling) {
                            console.log("selling")
                            type = "isSelling"
                            infoMessage = renderMessageBeast("isSelling", value)
                        } else if (selectedAsset?.isJoinClan) {
                            console.log("clan")
                            type = "isJoinClan"
                            infoMessage = renderMessageBeast("isJoinClan", value)
                        } else if (selectedAsset?.isUpgrading) {
                            console.log("upgrade")
                            type = "isUpgrading"
                            infoMessage = renderMessageBeast("isUpgrading", value)
                        } else if (
                            selectedAsset?.itemEndurance !== 0 ||
                            selectedAsset?.itemLuck !== 0 ||
                            selectedAsset?.itemSpeed !== 0 ||
                            selectedAsset?.itemStamina !== 0
                        ) {
                            console.log("item")
                            type = "item"
                            infoMessage = renderMessageBeast("item", value)
                        } else if (selectedAsset?.health < 100) {
                            console.log("heath")
                            type = "health"
                            infoMessage = renderMessageBeast("health", value)
                        } else {
                            console.log("lockWithdraw")
                            type = "lockWithdraw"
                            infoMessage = renderMessageBeast("lockWithdraw", value)
                        }
                        setMessageBeast({
                            isOpen: true,
                            message: infoMessage,
                            type,
                        })
                    } else {
                        const check = checkBalance()
                        if (check) {
                            await checkTwoFA()
                            setIsOpenTwoFAModal(true)
                        } else {
                            return AntdMessage.error({
                                key: "err",
                                content: "You don't have enough tokens to withdraw this nft",
                                className: "message-error",
                                duration: 5,
                            })
                        }
                    }
                } else {
                    return AntdMessage.error({
                        key: "err",
                        content: "Wrong address",
                        className: "message-error",
                        duration: 5,
                    })
                }
            }
        } catch (err) {
            const {message, response} = err
            return AntdMessage.error({
                key: "err",
                content: response?.data?.message || "Something wrong",
                className: "message-error",
                duration: 5,
            })
        }
    }

    const handleToggleTwoFAModal = () => {
        setIsOpenTwoFAModal(true)
    }

    const handleCloseTwoFAModal = () => {
        setIsOpenTwoFAModal(false)
    }

    const handleToggleSubmittedModal=()=>{
        setIsOpenSubmittedModal(!isOpenSubmittedModal)
    }

    const handleMax = () => {
        if(selectedAsset?.value&&selectedNetwork?.fees[0]?.value&&(selectedAsset?.value - Number(selectedNetwork?.fees[0]?.value), selectedAsset?.digit)>0){
            const value = formatNumber(selectedAsset?.value - Number(selectedNetwork?.fees[0]?.value), selectedAsset?.digit)
            setAmountInput(value)
        }else{
            setAmountInput("0")
        }
       
    }

    const handlePaste = async() => {
        console.log("paste")
        const data = await navigator.clipboard.readText()
        inputRef.current.focus()
        if(data.length>6){
            setToAddress(data)

        }else{
            setToAddress(data)
        }
    }
    const renderTotal = (value, fee) => {

        if(value&&fee){
            const numberAfterDotAmountArr = value?.split(".")
            const numberAfterDotAmount = numberAfterDotAmountArr[1]?.length || 0
            const numberAfterDotFeeArr = fee?.toString().split(".")
            const numberAfterDotFee = numberAfterDotFeeArr[1]?.length || 0
            const max = numberAfterDotAmount >= numberAfterDotFee ? numberAfterDotAmount : numberAfterDotFee
            const num = Number(value?.replaceAll(",", "")) + Number(fee)
            return num.toFixed(max)
        }else{
            return 0
        }
     
    }

    return (
        <WithdrawWrapper>
            <TwoFAModal
                isOpen={isOpenTwoFAModal}
                onOpen={handleToggleTwoFAModal}
                isHave2FA={isHave2FA}
                setIsHave2FA={setIsHave2FA}
                onClose={handleCloseTwoFAModal}
                selectedAsset={selectedAsset}
                selectedNetwork={selectedNetwork}
                amountInput={amountInput}
                toAddress={toAddress}
                onToggleSubmittedModal={handleToggleSubmittedModal}
            />
            <InfoBeastModal
                isOpen={messageBeast.isOpen}
                onClose={handleCloseModalMessageBeast}
                messageBeast={messageBeast}
                selectedAsset={selectedAsset}
                checkTwoFA={checkTwoFA}
                openTwoFAModal={handleToggleTwoFAModal}
                mfrBalance={mfrBalance}
                setIsRerender={setIsRerender}
                lockWithdraw={lockWithdraw}
            />
            <SubmittedModal isOpen={isOpenSubmittedModal} onClose={handleToggleSubmittedModal}/>
            {isLoginSocial ? (
                <div className="withdraw-container">
                    <div className="withdraw-card-wrapper">
                        <div className="border-gradient"></div>
                        <div className="withdraw-card">
                            <h3>Withdraw</h3>
                            <div className="withdraw-address">
                                <div className="from">
                                    <p>from</p>
                                    <p className="address">{renderEmail(socialAccount?.email,15)}</p>
                                </div>
                                <div className="to">
                                    <p>to</p>
                                    <div className="to-address">
                                        <input
                                        ref={inputRef}
                                            placeholder="Wallet address here"
                                            value={toAddress}
                                            onChange={(e) => {
                                                handleChangeInputAddress(e.target.value)
                                            }}
                                            onBlur={(e)=>{
                                                console.log("dsadsa",e.target)
                                                e.target.scrollLeft=e.target.scrollWidth
                                            }}
                                        />
                                        <span className="paste" onClick={handlePaste}>Paste</span>
                                          {/* <img src={copy} alt="Copy" onClick={handleCoppy} /> */}
                                        {/* <img src={qrCode} alt="" /> */}
                                    </div>
                                </div>
                            </div>
                            <div className="withdraw-info">
                                <div className="border-gradient"></div>
                                <div id="withdraw-info-content" className="withdraw-info-content">
                                    <p>Asset</p>
                                    {isLoading ? (
                                        <div className="loading">
                                            {" "}
                                            <Loading />
                                        </div>
                                    ) : (
                                        <Select
                                            // defaultValue={defaultValue}
                                            showSearch
                                            // searchValue="123"
                                            // defaultOpen
                                            // open={isOpenDropdownSelectAssets}
                                            // onDropdownVisibleChange={handleDropdownVisibleChange}
                                            // onClick={handleItemClick}
                                            // onSelect={handleOnSelect}
                                            value={selectedAsset?.name}
                                            suffixIcon={<img src={caretDown} alt="down" />}
                                            popupClassName="withdraw-info-dropdown"
                                            onChange={handleChange}
                                            options={selectOptions}
                                            getPopupContainer={() => document.getElementById("withdraw-info-content")}
                                        />
                                    )}

                                    {selectedAsset?.type === "token" ? (
                                        <>
                                            <p>amount</p>
                                            <div className="withdraw-info-amount">
                                                <input
                                                    value={amountInput}
                                                    // disabled={true}
                                                    type="text"
                                                    pattern="\d+(\.\d{0,9})?"
                                                    placeholder={formatPlaceholder(selectedAsset?.digit)}
                                                    onChange={(e) => {
                                                        handleChangeAmount(e.target.value, selectedAsset?.digit)
                                                    }}
                                                />
                                                <span onClick={handleMax}>Max</span>
                                            </div>
                                            <p className="withdraw-info-balance">
                                                Balance:{" "}
                                                <span>{formatNumber(selectedAsset?.value, selectedAsset?.digit)}</span>
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <p>network</p>
                                            <Select
                                                // defaultValue={defaultValue}
                                                value={selectedNetwork?.chainId}
                                                suffixIcon={<img src={caretDown} alt="down" />}
                                                popupClassName="withdraw-info-dropdown"
                                                onChange={handleChangeNetwork}
                                                options={networkOptions}
                                            />
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className="withdraw-summary">
                                <h4>SUMMARY</h4>
                                {isLoading ? (
                                    <div className="loading">
                                        <Loading />
                                    </div>
                                ) : (
                                    <ul className="summary-list">
                                        <li className="summary-item">
                                            <span>Withdrawal Amount</span>
                                            {selectedAsset?.type === "token" ? (
                                                <p>
                                                    <img src={selectedAsset?.imgLink} alt={selectedAsset?.name} />
                                                    <span>{amountInput !== "" ? amountInput : 0}</span>
                                                </p>
                                            ) : (
                                                <p>
                                                    <img src={selectedAsset?.imgLink} />
                                                    <span className="nfts">{selectedAsset?.name}</span>
                                                </p>
                                            )}
                                        </li>
                                        <li className="summary-item">
                                            <span>Fee</span>
                                            {selectedAsset?.type === "token" ? (
                                                <p>
                                                    <img
                                                        src={
                                                            selectedAsset?.withdraw?.length > 0
                                                                ? selectedNetwork?.chainIcon
                                                                : glmr
                                                        }
                                                        alt="GLMR"
                                                    />
                                                    <span>
                                                        {selectedAsset?.withdraw?.length > 0 &&
                                                        amountInput !== "0" &&
                                                        amountInput !== ""
                                                            ? selectedNetwork?.fees[0]?.value||0
                                                            : 0}
                                                    </span>
                                                </p>
                                            ) : selectedAsset?.chainId === selectedNetwork?.chainId ? (
                                                <p>
                                                    <img
                                                        src={
                                                            selectedAsset?.withdraw?.length > 0
                                                                ? selectedNetwork?.chainIcon
                                                                : glmr
                                                        }
                                                        alt="GLMR"
                                                    />
                                                    <span>
                                                        {selectedAsset?.withdraw?.length > 0 &&
                                                            selectedNetwork?.fees[0]?.value}
                                                    </span>
                                                </p>
                                            ) : (
                                                <p>
                                                    {selectedAsset?.withdraw.map((item, index) => (
                                                        <Fragment key={index}>
                                                            <img src={item?.chainIcon} alt={item?.networkName} />
                                                            <span>{item?.fees[0]?.value}</span>
                                                            {index === 0 && " + "}
                                                        </Fragment>
                                                    ))}
                                                </p>
                                            )}
                                        </li>
                                        {selectedAsset?.type === "token" && (
                                            <li className="summary-item">
                                                <span>Total</span>
                                                {selectedAsset.chainId === selectedNetwork.chainId ? (
                                                    <p>
                                                        <img src={selectedAsset?.imgLink} alt={selectedAsset?.name} />
                                                        <span>
                                                            {amountInput !== "" && amountInput !== "0"
                                                                ? formatNumberTotal(
                                                                      renderTotal(
                                                                          amountInput,
                                                                          selectedNetwork?.fees[0]?.value
                                                                      ),
                                                                      selectedAsset?.digit
                                                                  )
                                                                : 0}
                                                        </span>
                                                    </p>
                                                ) : (
                                                    <p>
                                                        <img src={selectedAsset?.imgLink} alt={selectedAsset?.name} />
                                                        <span>{amountInput !== "" ? amountInput : 0}</span>
                                                        <span>+</span>
                                                        <img
                                                            src={
                                                                selectedAsset?.withdraw?.length > 0
                                                                    ? selectedAsset?.withdraw[0]?.chainIcon
                                                                    : glmr
                                                            }
                                                            alt={selectedAsset?.withdraw[0]?.networkName}
                                                        />
                                                        <span>
                                                            {selectedAsset?.withdraw?.length &&
                                                            amountInput !== "" &&
                                                            amountInput !== "0"
                                                                ? selectedAsset?.withdraw[0]?.fees[0]?.value
                                                                : 0}
                                                        </span>
                                                    </p>
                                                )}
                                            </li>
                                        )}
                                    </ul>
                                )}
                            </div>
                            <button
                                className={`withdraw-button ${!isActiveButton ? "disabled" : ""}`}
                                onClick={handleOpenTwoFAModal}
                            >
                                <img src={withdrawBtn} alt="Withdraw" />
                                <span>Withdraw</span>
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <button
                    className="not-login-social"
                    onClick={() => {
                        showConnectModal()
                    }}
                >
                    Login social
                </button>
            )}
        </WithdrawWrapper>
    )
}

