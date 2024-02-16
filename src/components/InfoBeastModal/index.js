import React, {useEffect, useState} from "react"
import "./styles.less"
import {Modal, message as AntdMessage} from "antd"
import closeBorder from "../../assets/images/astar-rewards/close-border.png"
import {
    cancelSellingAPI,
    getFeeHealthAPI,
    getFeeSpeedUpUpgradeAPI,
    leaveClanAPI,
    regenHealthAPI,
    speedUpUpgradeAPI,
    unWearAllItemAPI,
} from "../../core/services/withdraw"
import ConfirmModal from "../ConfirmModal"
import {checkApi} from "../../core/utils/helpers/check-api"
import loadingDualBall from "../../assets/images/withdraw/loading-dual-ball.svg"
import warningIcon from "../../assets/images/withdraw/warning.png"

export default function InfoBeastModal({
    isOpen,
    onClose,
    messageBeast,
    mfrBalance,
    selectedAsset,
    checkTwoFA,
    openTwoFAModal,
    setIsRerender,
    lockWithdraw,
}) {
    const [fee, setFee] = useState(0)
    const [beastMessage, setBeastMessage] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
        getFee()

        const value = {
            upgradingTime: selectedAsset?.upgradingTime,
            clanName: selectedAsset?.clanName,
            cooldownTimeWithdraw: selectedAsset?.cooldownTimeWithdraw,
            health: selectedAsset?.health,
            lockWithdrawTime: lockWithdraw?.time,
        }
        let interval
        let newCooldownTime = renderCooldownTime(messageBeast?.type, value)
        if (newCooldownTime === 0) {
            setBeastMessage(renderMessageBeast(messageBeast?.type, value, newCooldownTime))
        } else {
            setBeastMessage(renderMessageBeast(messageBeast?.type, value, newCooldownTime))
            interval = setInterval(() => {
                if (newCooldownTime <= 0) {
                    clearInterval(interval)
                } else {
                    newCooldownTime = newCooldownTime - 1000
                    setBeastMessage(renderMessageBeast(messageBeast?.type, value, newCooldownTime))
                }
            }, 1000)
        }

        return () => {
            clearInterval(interval)
        }
    }, [isOpen, fee])

    function renderTime(milliseconds) {
        const totalSeconds = Math.floor(milliseconds / 1000)
        const hours = Math.floor(totalSeconds / 3600)
        const minutes = Math.floor((totalSeconds % 3600) / 60)
        const seconds = totalSeconds % 60

        const formattedHours = hours < 10 ? `0${hours}` : hours
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes
        const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds

        let formattedTime
        if (milliseconds < 60000) {
            formattedTime = `${formattedSeconds}s`
        } else if (milliseconds < 3600000) {
            formattedTime = `${formattedMinutes}m ${formattedSeconds}s`
        } else {
            formattedTime = `${formattedHours}h ${formattedMinutes}m ${formattedSeconds}s`
        }

        return formattedTime
    }

    const renderCooldownTime = (type, value) => {
        const {upgradingTime, clanName, cooldownTimeWithdraw, health, lockWithdrawTime} = value
        switch (type) {
            case "isCooldownWithdraw":
                return Date.parse(cooldownTimeWithdraw) - Date.now()

            case "isUpgrading":
                return Date.parse(upgradingTime) - Date.now()

            case "lockWithdraw":
                return Date.parse(lockWithdrawTime) - Date.now()

            default:
                return 0
        }
    }

    const renderMessageBeast = (type, value, time) => {
        const {upgradingTime, clanName, cooldownTimeWithdraw, health, lockWithdrawTime} = value
        switch (type) {
            case "isLocked":
                return "Your MintPass is locked"
            case "isSwap":
                return "Your MoonBeast is currently undergoing a swap, please try again in a few minutes"

            case "isCooldownWithdraw":
                return `Your MoonBeast is under cooldown because it is newly deposited. Remaining time:  ${renderTime(
                    time
                )}`
            case "isSelling":
                if(selectedAsset.beastType==="mint-pass"){
                    return "Your MintPass is selling, cancel it?"
                }else{
                    return "Your MoonBeast is selling, cancel it?"
                }
            case "isJoinClan":
                return `Your MoonBeast is joining clan “${clanName}". Do you want to leave your MoonBeast from the clan and continue?`

            case "isUpgrading":
                return (
                    <>
                        To withdraw this MoonBeast, it needs to undergo the evolution process, and the fee to expedite
                        this process is{" "}
                        {isLoading ? (
                            <img src={loadingDualBall} alt="loading" />
                        ) : (
                            <span className="color-E4007B"></span>
                        )}
                        {fee} MFR
                    </>
                )

            case "item":
                return `Your MoonBeast is equipping some MoonItems. Do you want to unequip all MoonItems from your MoonBeast and continue??`
            case "lockWithdraw":
                return `You can't withdraw because you changed 2FA. Remaining time: ${renderTime(time)}`

            case "health":
                return (
                    <>
                        To withdraw a MoonBeast, it needs to have a health index of 100%, and the fee to regain is{" "}
                        {isLoading ? (
                            <img src={loadingDualBall} alt="loading" />
                        ) : (
                            <span className="color-E4007B">{fee} MFR</span>
                        )}
                    </>
                )
            default:
                return `Your MoonBeast is under cooldown because it is newly deposited. Remaining time: ${renderTime(
                    time
                )}`
        }
    }

    const renderTextButtonConfirm = (type) => {
        switch (type) {
            case "isUpgrading":
                return "Speed up & Continue"
            case "isSelling":
                return "Cancel sale & Continue                "
            case "item":
                return "Unequip item & Continue"
            case "isJoinClan":
                return "Leave clan & Continue"
            case "health":
                return "Regain health & Continue"
        }
    }

    const handleOpenConfirmModal = () => {
        setIsOpenConfirmModal(true)
    }

    const handleCloseConfirmModal = () => {
        setIsOpenConfirmModal(false)
    }

    const {message, type} = messageBeast
  

    const getFee = async () => {
        try {
            if (type === "health") {
                const value = {
                    input: {
                        beast_id: selectedAsset?.id,
                        number: 100 - selectedAsset?.health,
                    },
                }

                const res = await checkApi(getFeeHealthAPI, [value])
                const {success, message, data} = res
                if (success === true) {
                    setFee(data?.fee)
                    setIsLoading(false)
                } else {
                    return AntdMessage.error({
                        key: "err",
                        content: message,
                        className: "message-error",
                        duration: 5,
                    })
                }
            } else if (type === "isUpgrading") {
                const value = {
                    input: {
                        beast_id: selectedAsset?.id,
                    },
                }

                const res = await checkApi(getFeeSpeedUpUpgradeAPI, [value])
                const {success, message, data} = res
                if (success === true) {
                    setFee(data?.fee)
                    setIsLoading(false)
                } else {
                    return AntdMessage.error({
                        key: "err",
                        content: message,
                        className: "message-error",
                        duration: 5,
                    })
                }
            }
        } catch (err) {}
    }

    const handleConfirm = async () => {
        try {
            if (type === "health") {
                const value = {
                    input: {
                        beast_id: selectedAsset?.id,
                        number: 100 - selectedAsset?.health,
                    },
                }
                const res = await checkApi(regenHealthAPI, [value])
                const {success, message, data} = res
                if (success === true) {
                    AntdMessage.success({
                        key: "success",
                        content: "Regain beast successfully",
                        className: "message-success",
                        duration: 5,
                    })
                    onClose()
                    setIsRerender(true)
                } else {
                    return AntdMessage.error({
                        key: "err",
                        content: message,
                        className: "message-error",
                        duration: 5,
                    })
                }
            } else if (type === "isUpgrading") {
                const value = {
                    input: {
                        beast_id: selectedAsset?.id,
                    },
                }
                const res = await checkApi(speedUpUpgradeAPI, [value])
                const {success, message, data} = res
                if (success === true) {
                    onClose()
                    setIsRerender(true)
                    AntdMessage.success({
                        key: "success",
                        content: "Speed up upgrading successfully",
                        className: "message-success",
                        duration: 5,
                    })
                } else {
                    return AntdMessage.error({
                        key: "err",
                        content: message,
                        className: "message-error",
                        duration: 5,
                    })
                }
            } else if (type === "item") {
                const value = {
                    beast_id: selectedAsset?.id,
                }
                const res = await checkApi(unWearAllItemAPI, [value])
                const {success, message, data} = res
                if (res?.item_luck && res?.item_endurance && res?.item_speed && res?.item_stamina) {
                    AntdMessage.success({
                        key: "success",
                        content: "Unwear all item success Error",
                        className: "message-success",
                        duration: 5,
                    })
                    onClose()
                    setIsRerender(true)
                } else {
                    return AntdMessage.error({
                        key: "err",
                        content: "Unwear all items error",
                        className: "message-error",
                        duration: 5,
                    })
                }
            } else if (type === "isJoinClan") {
                const value = {
                    beast_id: selectedAsset?.id,
                    clan_id: selectedAsset?.clanId,
                }
                const res = await checkApi(leaveClanAPI, [value])
                const {success, message, data} = res
                if (success === true) {
                    AntdMessage.success({
                        key: "success",
                        content: "Leave clan successfully",
                        className: "message-success",
                        duration: 5,
                    })
                    onClose()
                    setIsRerender(true)
                } else {
                    return AntdMessage.error({
                        key: "err",
                        content: message,
                        className: "message-error",
                        duration: 5,
                    })
                }
            } else if (type === "isSelling") {
                const value = {
                    input: {
                        arg: {
                            object_id: selectedAsset?.id,
                            object_type: selectedAsset?.beastType,
                        },
                    },
                }
                const res = await checkApi(cancelSellingAPI, [value])
                const {success, message, data} = res
                if (success === true) {
                    AntdMessage.success({
                        key: "success",
                        content: "Cancel selling successfully",
                        className: "message-success",
                        duration: 5,
                    })
                    onClose()
                    setIsRerender(true)
                } else {
                    return AntdMessage.error({
                        key: "err",
                        content: message,
                        className: "message-error",
                        duration: 5,
                    })
                }
            }
        } catch (err) {}
    }
    return (
        <Modal className="info-beast-modal" centered={true} open={isOpen} onCancel={onClose} footer={false}>
            {/* <ConfirmModal isOpen={isOpenConfirmModal} onClose={handleCloseConfirmModal} /> */}
            <div className="border-gradient"></div>
            <button className="close-button" onClick={onClose}>
                <img src={closeBorder} alt="Close" />
            </button>
            <img src={warningIcon} alt="Warning"/>
            <h3>{selectedAsset.beastType==="mint-pass"?"Can't withdraw MintPass":"Can't withdraw MoonBeast"}</h3>
            <p className={`content ${selectedAsset.beastType==="mint-pass"?"center":""}`}>{beastMessage !== "" ? beastMessage : message}</p>
            {type === "isUpgrading" ||
            type === "health" ||
            type === "isJoinClan" ||
            type === "item" ||
            type === "isSelling" ? (
                <button className="confirm" onClick={handleConfirm}>
                    {renderTextButtonConfirm(type)}
                </button>
            ) : (
                ""
            )}
        </Modal>
    )
}

