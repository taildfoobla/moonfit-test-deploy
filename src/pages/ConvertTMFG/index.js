import React, {useEffect, useRef, useState} from "react"
import "./styles.less"
import ConvertTMFGWrapper from "../../components/Wrapper/ConvertTMFGWrapper"
import tmfgIcon from "../../assets/images/convert-tmfg/tMFG.png"
import omfgIcon from "../../assets/images/convert-tmfg/oMFG.png"
import tooltipIcon from "../../assets/images/convert-tmfg/info.png"
import convertIcon from "../../assets/images/convert-tmfg/arrow-down.png"
import omfgIcon2 from "../../assets/images/convert-tmfg/oMFG-2.png"
import convertButtonIcon from "../../assets/images/convert-tmfg/convert-button-icon.png"
import {Tooltip} from "antd"
import {checkApi} from "../../core/utils/helpers/check-api"
import {getAssetsDataAPI} from "../../core/services/assets-management"
import {message as AntdMessage} from "antd"
import {LoadingOutlined} from "@ant-design/icons"
import {useNavigate,useSearchParams} from "react-router-dom"
import {useAuth} from "../../core/contexts/auth"
import {getLocalStorage, setLocalStorage, LOCALSTORAGE_KEY} from "../../core/utils/helpers/storage"
import {jwtDecode} from "jwt-decode"

export default function ConvertTMFG() {
    const navigate = useNavigate()
    const [amount, setAmount] = useState("")
    const [tokens, setTokens] = useState([])
    const [rate, setRate] = useState(100)
    const inputRef = useRef()

    const [searchParams, setSearchParams] = useSearchParams()

    const {auth,isLoginSocial, setIsLoginSocial} = useAuth()

    useEffect(() => {
        if (isLoginSocial) {
            getBalanceData()
        } else {
            autoLoginSocial()
        }
    }, [isLoginSocial])

    function autoLoginSocial() {
     
            const accessToken = searchParams.get("access_token")
            if (accessToken) {
                const parts = accessToken.split(".")

                // Check if there are exactly three parts
                if (parts.length !== 3) {
                    navigate("/")
                    return
                }
                const decoded = jwtDecode(accessToken)

                if (decoded?.aud === "sw-move2earn-app-f8519") {
                    const social = {
                        uid: decoded?.user_id,
                        email: decoded?.email,
                        emailVerified: decoded?.email_verified,
                        displayName: decoded?.name,
                        isAnonymous: false,
                        photoURL: decoded?.picture,
                    }
                    setLocalStorage(LOCALSTORAGE_KEY.ACCESS_TOKEN, accessToken)
                    setLocalStorage(LOCALSTORAGE_KEY.SOCIAL_ACOUNT, JSON.stringify(social))
                    setIsLoginSocial(true)
                    getBalanceData()
                } else {
                    navigate("/")
                }
            } else {
                navigate("/")
            }
    }

    const getBalanceData = async () => {
        const res = await checkApi(getAssetsDataAPI, [])
        if (res?.tokens) {
            setTokens(res.tokens)
        } else {
            AntdMessage.error({
                key: "err",
                content: res?.message,
                className: "message-error",
                duration: 3,
            })
        }
    }
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

    const renderOMFG = () => {
        if (amount !== "") {
            const convertToNumber = Number(amount.split(",").join("").split(".").join("")) * rate
            const omfg = tokens.find((token) => token.name === "oMFG")
            if (omfg) {
                return formatNumber(convertToNumber, omfg.digit)
            } else {
                return 0
            }
        } else {
            return 0
        }
    }

    const handleSetInputWidth = (length) => {
        const input = inputRef.current
        if (length > 0) {
            if (length < 13) {
                input.style.width = length - 1 + 1.5 + "ch"
            } else {
                input.style.width = "13ch"
            }
        } else {
            input.style.width = "1.5ch"
        }
    }

    const handleChange = (e) => {
        const input = e.target
        const value = e.target.value
        const tmfg = tokens.find((token) => token?.name === "tMFG")
        const tmfgDigit = tmfg?.digit || 0
        const tmfgValue = tmfg?.value || 0
        const num = Number(value.replaceAll(",", ""))
        let length = 0
        if (isNaN(num)) {
            setAmountInput("0")
            handleSetInputWidth(length)
            return
        }

        if (num > tmfgValue) {
            length = tmfgValue.toString().length
            setAmount(formatNumber(tmfgValue, tmfgDigit))
        } else {
            if (value.includes(",")) {
                const newValue = value.replaceAll(",", "")
                const newAmount = formatInput(newValue, tmfgDigit)
                length = newAmount.length
                setAmount(newAmount)
            } else {
                const newAmount = formatInput(value, tmfgDigit)
                length = newAmount.length
                setAmount(newAmount)
            }
        }
        handleSetInputWidth(length)
    }

    const handleMax = () => {
        const tmfg = tokens.find((token) => token?.name === "tMFG")
        let length = 0
        if (tmfg) {
            length = tmfg.value.toString().length
            setAmount(formatNumber(tmfg.value, tmfg.digit))
        } else {
            setAmount("0")
        }
        handleSetInputWidth(length)
    }

    const handleGoToDeposit = () => {
        if(auth.isConnected){
            setLocalStorage(LOCALSTORAGE_KEY.SELECTED_ASSET,"oMFG")
            navigate("/deposit")
        }else{
            AntdMessage.error({
                key: "err",
                content: "Please connect wallet to deposit",
                className: "message-error",
                duration: 3,
            })
        }
    }

    return (
        <ConvertTMFGWrapper>
            <div className="convert-tmfg-container">
                <div className="convert-container">
                    <div className="border-gradient"></div>
                    <div className="convert-content">
                        <h3>Convert tMFG to oMFG</h3>
                        <div className="convert-data">
                            <div className="convert-data-header">
                                <div className="left">
                                    <img src={tmfgIcon} alt="" />
                                    <span>tMFG</span>
                                    <Tooltip
                                        title="The tMFG amount is locked and snapshotted at the end of Incentivized Testnet Phase 1"
                                        overlayStyle={{paddingBottom: "2px"}}
                                        overlayInnerStyle={{borderRadius: "7px"}}
                                    >
                                        <img src={tooltipIcon} alt="" />
                                    </Tooltip>
                                </div>
                                <div className="right">
                                    <span>Your Balance: </span>
                                    <span>
                                        {tokens.length > 0 ? (
                                            tokens.find((token) => token.name === "tMFG").value
                                        ) : (
                                            <LoadingOutlined style={{color: "#FFF"}} />
                                        )}
                                    </span>
                                </div>
                            </div>
                            <div className="convert-data-content">
                                <div className="left">
                                    <input placeholder="0" value={amount} onChange={handleChange} ref={inputRef} />
                                    <span>tMFG</span>
                                </div>
                                <div className="right" onClick={handleMax}>
                                    <img src={tmfgIcon} alt="" />
                                    <span>Max</span>
                                </div>
                            </div>
                            <div className="convert-icon">
                                <div className="border-gradient"></div>
                                <div className="convert-icon-content">
                                    <img src={convertIcon} alt="" />
                                </div>
                            </div>
                        </div>

                        <div className="convert-data">
                            <div className="convert-data-header">
                                <div className="left">
                                    <img src={omfgIcon} alt="" />
                                    <span>oMFG</span>
                                    <Tooltip
                                        title="oMFG now replaces tMFG, with enhanced utilities."
                                        overlayStyle={{paddingBottom: "2px"}}
                                        overlayInnerStyle={{borderRadius: "7px"}}
                                    >
                                        <img src={tooltipIcon} alt="" />
                                    </Tooltip>
                                </div>
                                <div className="right">
                                    <span>Your Balance: </span>
                                    <span>
                                        {tokens.length > 0 ? (
                                            tokens.find((token) => token.name === "oMFG").value
                                        ) : (
                                            <LoadingOutlined style={{color: "#FFF"}} />
                                        )}
                                    </span>
                                </div>
                            </div>
                            <div className="convert-data-content">
                                <div className="left">
                                    <span>{renderOMFG()}</span>
                                    <span>oMFG</span>
                                </div>
                            </div>
                        </div>
                        <p>
                            Conversion Rate: <span className="change-color-FFF">1 tMFG = {rate} oMFG</span>
                        </p>
                        <p>
                            * Kindly deposit your <span className="change-color-4CCBC9">$oMFG</span> to{" "}
                            <span className="change-color-E4007B">MoonFit</span> account for continuous usage
                        </p>
                        <div className="convert-button-container">
                            <button className="convert-button">
                                <img src={convertButtonIcon} alt="" />
                                <span>Claim Now</span>
                            </button>
                        </div>
                    </div>
                </div>
                <button className="to-deposit" onClick={handleGoToDeposit}>
                    <img src={omfgIcon2} alt="" />
                    <span>Deposit oMFG</span>
                </button>
            </div>
        </ConvertTMFGWrapper>
    )
}

