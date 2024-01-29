import React from "react"
import background from "../../../assets/images/lucky-wheel/lw-modal-bg.png"
import LWModal from "./LWModal"
import lottery from "../../../assets/images/lucky-wheel/lottery.svg"

const LuckyWheelModal = (props) => {
    const {open, toggle} = props

    return (
        <LWModal open={open} onCancel={toggle} footer={false} centered={true} className="lucky-wheel-modal-container">
            <div className="lucky-wheel-modal text-center">
                <div className="lucky-wheel-image">
                    <img src={background} alt="" />
                </div>
                <button className="button button-secondary button-box-shadow font-normal py-3 px-7" onClick={toggle}>
                    <img className="mr-2" src={lottery} alt="" /> SPIN
                </button>
                <div className="flex justify-center">
                    <p className="text-[13px] normal-case mt-3 leading-5 opacity-70 font-medium">
                        Come back again tomorrow to get more free spins
                    </p>
                </div>
            </div>
        </LWModal>
    )
}

export default LuckyWheelModal
