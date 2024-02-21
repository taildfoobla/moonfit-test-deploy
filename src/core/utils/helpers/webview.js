import { ACTION_TYPES } from "../constants/webview-const"
export const postActionToMobile = (action, data, callback) => {
    console.info("postActionToMobile:", {action, data})
    if (window.messageHandler) {
        window.messageHandler.postMessage(
            JSON.stringify({
                action,
                data,
            })
        )
        return
    }

    console.info("No callback messageHandler", {action, data})

    if (typeof callback === "function") {
        callback()
    }
}

export const sendConvertOMFGSuccess=(value)=>{
    postActionToMobile(ACTION_TYPES.CONVERT_OMFG_SUCCESSFULL,value)
}


