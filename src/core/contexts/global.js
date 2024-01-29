import React, {createContext, useContext, useReducer} from "react"
import {getLocalStorage, setLocalStorage, LOCALSTORAGE_KEY} from "../utils/helpers/storage"

const GlobalContext = createContext()

const initialState = {
    selectedNetwork:
        getLocalStorage(LOCALSTORAGE_KEY.SELECTED_NETWORK) !== null
            ? getLocalStorage(LOCALSTORAGE_KEY.SELECTED_NETWORK)
            : "moonbeam",
}

const actions = {
    CHANGE_SELECTED_NETWORK: "CHANGE_SELECTED_NETWORK",
}

const reducer = (state, action) => {
    switch (action.type) {
        case actions.CHANGE_SELECTED_NETWORK:
            return {...state, selectedNetwork: action.value}
    }
}

export default function GlobalContextProvider({children}) {
    const [state, dispatch] = useReducer(reducer, initialState)

    return <GlobalContext.Provider value={[state, dispatch]}>{children}</GlobalContext.Provider>
}

export const useGlobalContext = () => {
    const [state, dispatch] = useContext(GlobalContext)
    const context = {
        selectedNetwork: state.selectedNetwork,
        changeSelectedNetwork: (network) => {
            dispatch({type: actions.CHANGE_SELECTED_NETWORK, value: network})
            setLocalStorage(LOCALSTORAGE_KEY.SELECTED_NETWORK, network)
        },
    }
    return context
}

