import React, {useEffect, useState} from "react"
import {useNavigate} from "react-router-dom"
import mfr from "../../../assets/images/lucky-wheel/mfr.png"
import mfg from "../../../assets/images/lucky-wheel/mfg.png"
import cap from "../../../assets/images/lucky-wheel/cap.png"
import cup from "../../../assets/images/lucky-wheel/cup.png"
import bag from "../../../assets/images/lucky-wheel/bag.png"
import keychain from "../../../assets/images/lucky-wheel/keychain.png"
import tShirt from "../../../assets/images/lucky-wheel/t-shirt.png"
import freeSpin from "../../../assets/images/lucky-wheel/free-spin.png"
import raffleTicket from "../../../assets/images/lucky-wheel/raffle-ticket.png"
import astarTicket from "../../../assets/images/lucky-wheel/astar.png"
import apesTicket from "../../../assets/images/lucky-wheel/apes.png"
import monesTicket from "../../../assets/images/lucky-wheel/mones.png"
import ajunaTicket from "../../../assets/images/lucky-wheel/ajuna.png"
import uncommonBox from "../../../assets/images/lucky-wheel/uncommon-moonbox.png"
import moonboxSlot from "../../../assets/images/lucky-wheel/moonbox_slot.png"
import commonBox from "../../../assets/images/lucky-wheel/common-moonbox.png"
import rareBox from "../../../assets/images/lucky-wheel/rare-moonbox.png"
import mythicalBox from "../../../assets/images/lucky-wheel/mythical-moonbox.png"
import glmr from "../../../assets/images/lucky-wheel/glmr.png"
import check from "../../../assets/images/lucky-wheel/check.svg"
import collect from "../../../assets/images/lucky-wheel/collect.svg"
import spin from "../../../assets/images/lucky-wheel/spin.svg"
import closeBorder from "../../../assets/images/lucky-wheel/close-border.svg"
import LWModal from "./LWModal"
import aura from "../../../assets/images/lucky-wheel/aura.png"
import MoonboxOutSlotModal from "./MoonboxOutSlotModal"
import ConfettiExplosion from "react-confetti-explosion"

const LuckyWheelRewardModal = (props) => {
    const navigate = useNavigate()
    const {
        open,
        toggle,
        value,
        type,
        is_pending,
        need_buy_slot,
        buy_slot_fee,
        lucky_box_id,
        rarity,
        unit,
        refetch,
        user,
        userToken,
        setRefetch,
        className,
    } = props
    const [renderText, setRenderText] = useState("")
    const [renderReward, setRenderReward] = useState(null)
    const [renderButton, setRenderButton] = useState(null)
    const [openOutSlot, setOpenOutSlot] = useState(false)
    const [explode, setExplode] = useState(false)

    useEffect(() => {
        setTimeout(() => {
            _renderUI(value, type)
        }, 500)
    }, [value, type])

    useEffect(() => {
        if (open) {
            setExplode(true)
            setTimeout(() => {
                setExplode(false)
            }, 2000)
        }
    }, [open])

    const onCollect = (type = "", route = "") => {
        if (type === "raffle") {
            return navigate(`/${route}`)
        }
        if (type === "MoonBox") {
            if (is_pending && need_buy_slot) {
                setRefetch(refetch + 1)
                return setOpenOutSlot(true)
            }
            closeModal()
        } else {
            closeModal()
        }
    }

    const fetchRarity = () => {
        let reward = {
            title: "Common",
            moonbox: commonBox,
        }
        switch (rarity) {
            case "R2":
                reward = {
                    title: "Uncommon",
                    moonbox: uncommonBox,
                }
                break
            case "R3":
                reward = {
                    title: "Rare",
                    moonbox: rareBox,
                }
                break
            case "R4":
                reward = {
                    title: "Mythical",
                    moonbox: mythicalBox,
                }
                break
            default:
                break
        }
        return reward
    }

    const _renderUI = (value, type) => {
        switch (type) {
            case "MoonBox":
                const {moonbox} = fetchRarity()
                setRenderText(`1 ${unit}!`)
                setRenderReward(<img src={moonbox} alt="" />)
                setRenderButton(
                    <button type="button" className="button button-primary py-3" onClick={() => onCollect("MoonBox")}>
                        <img className="mb-1 mr-2" src={collect} alt="" />
                        Collect
                    </button>
                )
                break
            case "MFR":
                setRenderText(`${value} ${unit}`)
                setRenderReward(<img src={mfr} alt="" />)
                setRenderButton(
                    <button type="button" className="button button-primary py-3" onClick={() => onCollect("")}>
                        <img className="mb-1 mr-2" src={collect} alt="" />
                        Collect
                    </button>
                )
                break
            case "MFG":
                setRenderText(`${value} ${unit}`)
                setRenderReward(<img src={mfg} alt="" />)
                setRenderButton(
                    <button type="button" className="button button-primary py-3" onClick={() => onCollect("")}>
                        <img className="mb-1 mr-2" src={collect} alt="" />
                        Collect
                    </button>
                )
                break
            case "GLMR":
                setRenderText(`${value} ${unit}`)
                setRenderReward(<img src={glmr} alt="" />)
                setRenderButton(
                    <button type="button" className="button button-primary py-3" onClick={() => onCollect("")}>
                        <img className="mb-1 mr-2" src={collect} alt="" />
                        Collect
                    </button>
                )
                break
            case "WeeklyRaffleTicket":
                setRenderText(`${value} ${unit}`)
                setRenderReward(<img src={raffleTicket} alt="" />)
                setRenderButton(
                    <button
                        type="button"
                        className="button button-primary py-3"
                        onClick={() => onCollect("raffle", "weekly-raffle")}
                    >
                        <img className="mb-1 mr-2" src={check} alt="" />
                        View Raffle
                    </button>
                )
                break
            case "MoonFitAstarDegensTicket":
                setRenderText(`${value} ${unit}`)
                setRenderReward(<img src={astarTicket} alt="" />)
                setRenderButton(
                    <button
                        type="button"
                        className="button button-primary py-3"
                        onClick={() => onCollect("raffle", "moonfit-astar-raffle")}
                    >
                        <img className="mb-1 mr-2" src={check} alt="" />
                        View Raffle
                    </button>
                )
                break
            case "MoonFitGLMRApesTicket":
                setRenderText(`${value} ${unit}`)
                setRenderReward(<img src={apesTicket} alt="" />)
                setRenderButton(
                    <button
                        type="button"
                        className="button button-primary py-3"
                        onClick={() => onCollect("raffle", "moonfit-glmr-apes-raffle")}
                    >
                        <img className="mb-1 mr-2" src={check} alt="" />
                        View Raffle
                    </button>
                )
                break
            case "MoonFitMonesTicket":
                setRenderText(`${value} ${unit}`)
                setRenderReward(<img src={monesTicket} alt="" />)
                setRenderButton(
                    <button
                        type="button"
                        className="button button-primary py-3"
                        onClick={() => onCollect("raffle", "moonfit-mones-raffle")}
                    >
                        <img className="mb-1 mr-2" src={check} alt="" />
                        View Raffle
                    </button>
                )
                break
            case "MoonFitAjunaNetworkTicket":
                setRenderText(`${value} ${unit}`)
                setRenderReward(<img src={ajunaTicket} alt="" />)
                setRenderButton(
                    <button
                        type="button"
                        className="button button-primary py-3"
                        onClick={() => onCollect("raffle", "moonfit-ajuna-raffle")}
                    >
                        <img className="mb-1 mr-2" src={check} alt="" />
                        View Raffle
                    </button>
                )
                break
            case "FreeSpin":
                setRenderText(`${value} ${unit}`)
                setRenderReward(<img src={freeSpin} alt="" />)
                setRenderButton(
                    <button type="button" className="button button-primary py-3" onClick={() => onCollect("")}>
                        <img className="mb-1 mr-2" src={spin} alt="" />
                        Spin Now
                    </button>
                )
                break
            case "MerchandiseCap":
            case "MerchandiseTShirt":
            case "MerchandiseKeychain":
            case "MerchandiseCup":
            case "MerchandiseToteBag":
                const typeImage = renderMerchandide(type)
                setRenderText(`${value} ${unit}`)
                setRenderReward(<img src={typeImage} alt="" />)
                setRenderButton(
                    <button type="button" className="button button-primary py-3" onClick={() => onCollect("")}>
                        <img className="mb-1 mr-2" src={collect} alt="" />
                        Collect
                    </button>
                )
                break
            case "MoonBoxSlot":
                setRenderText(`${value} ${unit}`)
                setRenderReward(<img src={moonboxSlot} alt="" />)
                setRenderButton(
                    <button type="button" className="button button-primary py-3" onClick={() => onCollect("")}>
                        <img className="mb-1 mr-2" src={collect} alt="" />
                        Collect
                    </button>
                )
                break
            default:
                break
        }
    }

    const renderMerchandide = (type) => {
        let output = null
        switch (type) {
            case "MerchandiseCap":
                output = cap
                break
            case "MerchandiseTShirt":
                output = tShirt
                break
            case "MerchandiseKeychain":
                output = keychain
                break
            case "MerchandiseCup":
                output = cup
                break
            case "MerchandiseToteBag":
                output = bag
                break
            default:
                break
        }
        return output
    }

    const closeModal = async () => {
        await toggle(false)
        return setRefetch(refetch + 1)
    }

    const toggleOutSlot = () => {
        setOpenOutSlot(false)
        setTimeout(() => {
            toggle(false)
        }, 200)
    }

    const generateDescription = (className) => {
        let team = ""
        if (className.includes("beyond")) {
            team = "Beyond The Chain"
        } else if (className.includes("paris-dot")) {
            team = "ParisDOT.Comm"
        }
        return team && team.length > 0 ? (
            <>
                <p className="text-[13px] normal-case font-semibold font-poppins text-center text-white no-event mb-0">
                    Meet MoonFit team at {team}
                </p>
                <p className="text-[13px] normal-case font-semibold font-poppins text-center text-white no-event">
                    to claim your reward
                </p>{" "}
            </>
        ) : null
    }

    return (
        <LWModal open={open} footer={false} hasCloseIcon={false} className={className}>
            <div className="lw-reward-container text-center">
                <MoonboxOutSlotModal
                    open={openOutSlot}
                    toggle={toggleOutSlot}
                    rarity={rarity}
                    user={user}
                    buy_slot_fee={buy_slot_fee}
                    lucky_box_id={lucky_box_id}
                />
                <div className="lw-btn-back" onClick={() => closeModal()}>
                    <img src={closeBorder} alt="" />
                </div>
                <div className="lw-reward no-event">{renderReward}</div>
                <div className="lw-reward-title">
                    <h3
                        className={`text-[48px] leading-[3rem] font-normal no-event ${
                            className && (className.includes("beyond") || className.includes("paris-dot"))
                                ? ""
                                : "text-gradient"
                        }`}
                    >
                        YOU WON
                    </h3>
                    <p className="text-[18px] text-white font-semibold no-event">{renderText}</p>
                </div>
                <div className="lw-reward-wrapper flex flex-col justify-between mx-auto">
                    <div className="explode">
                        {explode && <ConfettiExplosion force={0.4} duration={3000} particleCount={100} height={1000} />}
                    </div>
                    {/* <div></div> */}
                    <div className="aura no-event">
                        <img src={aura} alt="" />
                    </div>
                    <div className="lw-button">
                        {generateDescription(className)}
                        {renderButton}
                    </div>
                </div>
            </div>
        </LWModal>
    )
}

export default LuckyWheelRewardModal

