import {LOCALSTORAGE_KEY, setLocalStorage} from "./LocalStorage"
import {ACTION_TYPES} from "../common/constants"

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


