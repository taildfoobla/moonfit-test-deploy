import React, {useState} from "react"
import mfr from "../../../assets/images/lucky-wheel/mfr-border.svg"
import close from "../../../assets/images/lucky-wheel/close.svg"
import cart from "../../../assets/images/lucky-wheel/cart.svg"
import outOfSlot from "../../../assets/images/lucky-wheel/out-of-slot.svg"
import onTime from "../../../assets/images/lucky-wheel/on-time.svg"
import uncommonBox from "../../../assets/images/lucky-wheel/uncommon-moonbox.png"
import commonBox from "../../../assets/images/lucky-wheel/common-moonbox.png"
import rareBox from "../../../assets/images/lucky-wheel/rare-moonbox.png"
import mythicalBox from "../../../assets/images/lucky-wheel/mythical-moonbox.png"
import LWModal from "./LWModal"
import {useNavigate} from "react-router-dom"
// import {buyMoreSlot} from "../../services/LuckyWheelServices"
import {LoadingOutlined} from "@ant-design/icons"
import {message, Spin} from "antd"
// import { updateGameToken } from "../../utils/webview"

const antIcon = <LoadingOutlined style={{fontSize: 20}} spin />

const MoonboxOutSlotModal = (props) => {
    const {open, toggle, rarity, user, buy_slot_fee, lucky_box_id} = props
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const buySlot = async () => {
        // try {
        //     setLoading(true)
        //     const res = await buyMoreSlot({lucky_box_id})
        //     const {data, success} = res
        //     setLoading(false)
        //     if (success) {
        //         const token = user.game_token - buy_slot_fee
        //         user.game_token = token
        //         updateGameToken(token)
        //         message.error({
        //             content: "Acquired a new MoonBox slot and claimed the MoonBox succesfully.",
        //             className: "message-success",
        //             duration: 2,
        //         })
        //         toggle()
        //     } else {
        //         message.error({
        //             content: res.message,
        //             className: "message-error",
        //         })
        //     }
        // } catch (error) {
        //     message.error({
        //         content: error?.message,
        //         className: "message-error",
        //     })
        //     setLoading(false)
        // }
    }

    const getRarity = (rarity) => {
        let image = commonBox
        switch (rarity) {
            case "R2":
                image = uncommonBox
                break
            case "R3":
                image = rareBox
                break
            case "R4":
                image = mythicalBox
                break
            default: break
        }
        return image
    }

    return (
        <LWModal open={open} footer={false} centered={true} hasCloseIcon={false} className="moonbox-out-slot-container">
            <div className="moonbox-out-slot">
                <div className="reward-moonbox-wrapper">
                    <div className="border-gradient flex flex-nowrap justify-center items-center no-event">
                        <img src={getRarity(rarity)} alt="" />
                        <span className="text-white text-[18px] font-semibold font-poppins normal-case ml-4">
                            {`You won 1 MoonBox!`}
                        </span>
                    </div>
                </div>
                <div className="buy-slot-wrapper mt-5 text-center">
                    <div className="border-gradient">
                        <p className="text-white text-[18px] font-semibold font-poppins normal-case">
                            No more MoonBox slots available
                        </p>
                        <div className="out-of-slot mb-5">
                            <img className="mx-auto" src={outOfSlot} alt="" />
                        </div>
                        <span className="text-[13px] text-[#90829D] font-medium font-poppins normal-case">
                            All of MoonBox slot is full!
                        </span>{" "}
                        <br />
                        <p className="text-[13px] text-[#90829D] font-medium font-poppins normal-case flex justify-center items-center">
                            Pay <img className="mfr m-1" src={mfr} alt="" />{" "}
                            <span className="text-[16px] text-[#4CCBC9] font-semibold mr-1">{buy_slot_fee}</span> to buy
                            1 more slot.
                        </p>
                        <div className="grid grid-cols-2 font-poppins">
                            <button
                                type="button"
                                className="button button-purge"
                                disabled={loading}
                                onClick={() => toggle()}
                            >
                                <img className="mr-2 mb-1" src={onTime} alt="" />
                                Keep for 48h
                            </button>
                            <button
                                type="button"
                                className="button button-primary"
                                onClick={buySlot}
                                disabled={loading}
                            >
                                {loading ? (
                                    <Spin className="mr-2" indicator={antIcon} />
                                ) : (
                                    <img className="mr-2 mb-1" src={cart} alt="" />
                                )}
                                Buy 1 slot
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </LWModal>
    )
}

export default MoonboxOutSlotModal
