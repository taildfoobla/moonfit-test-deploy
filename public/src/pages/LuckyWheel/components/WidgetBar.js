import React from "react"
import mfr from "../../../assets/images/lucky-wheel/mfr.png"
import gift from "../../../assets/images/lucky-wheel/gift.svg"
import caretLeft from "../../../assets/images/lucky-wheel/caret-left.svg"
import ThousandSeparate from "../../../core/utils/helpers/ThousandSeparate"
// import { postActionToMobile } from "../../utils/webview"
// import { ACTION_TYPES } from "../../common/constants"

const WidgetBar = ({ gameToken, redirectTo = "Lucky_wheel" }) => {
    const onPostAction = (action) => {
        // if (action === "back") {
        //     postActionToMobile(ACTION_TYPES.BUTTON_GO_BACK, true)
        // } else {
        //     postActionToMobile(ACTION_TYPES.BUTTON_HISTORY, { redirectTo })
        // }
    }

    return (
        <div className="lw-widget flex items-center justify-between mx-auto">
            <div className="lw-btn-back" onClick={() => onPostAction("back")}>
                <img src={caretLeft} alt="" />
            </div>
            <div className="flex items-center">
                {gameToken && (
                    <div className="lw-mfr flex items-center mr-3 z-10">
                        <img className="mr-2" src={mfr} />
                        <span>{ThousandSeparate(gameToken)}</span>
                    </div>
                )}
                <div className="lw-history" onClick={() => onPostAction("history")}>
                    <img src={gift} alt="" />
                </div>
            </div>
        </div>
    )
}

export default WidgetBar
