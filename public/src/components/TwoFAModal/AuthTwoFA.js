import {Modal, message as AntdMessage} from "antd"
import React, {useEffect, useRef, useState} from "react"
import checkCircle from "../../assets/images/withdraw/check-circle.png"
import { withdrawAPI } from "../../core/services/withdraw"
import closeCircle from "../../assets/images/withdraw/close-circle-2.png"
import { checkApi } from "../../core/utils/helpers/check-api"
import closeIcon from "../../assets/images/astar-rewards/close-border.png"

export default function AuthTwoFA({isOpen, onClose, selectedAsset, selectedNetwork, amountInput, toAddress,onToggleSubmittedModal}) {
    const [code, setCode] = useState("")
    const inputRef = useRef()

    useEffect(()=>{
        setCode("")
    },[isOpen])

    const handleChangeCode = (e) => {
        setCode(e.target.value)
    }

    const handlePaste = async() => {
        console.log("paste")
        const data = await navigator.clipboard.readText()
        inputRef.current.focus()
        if(data.length>6){
            setCode(data.slice(0,6))

        }else{
            setCode(data)

        }
    }

    const renderNumber=(value)=>{
        const num = Number(value.replaceAll(",",""))
        return num
    }

    const handleWithdraw = async () => {
        let body
        if (selectedAsset?.type === "token") {
            body = {
                amount: renderNumber(amountInput),
                type: selectedAsset?.name,
                digit_code: code,
                address: toAddress,
                to_chain: selectedNetwork?.chainId,
            }
        } else {
            body = {
                amount: 0.0,
                type: "MoonBeast",
                id: selectedAsset?.id,
                digit_code: code,
                address: toAddress,
                from_chain: selectedAsset?.chainId,
                to_chain: selectedNetwork?.chainId,
            }
        }
        try {
            const res = await checkApi(withdrawAPI,[body])

            
            const {success, message, data} = res
            if (success === true) {
                onClose()
                onToggleSubmittedModal()
                // return AntdMessage.success({
                //     key: "success",
                //     content: "You are successfully withdraw",
                //     className: "message-success",
                //     duration: 5,
                // })
            } else {
                return AntdMessage.error({
                    key: "err",
                    content: message,
                    className: "message-error",
                    duration: 5,
                })
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

    const handleDelete = async()=>{
        setCode("")
    }

    return (
        <Modal centered={true} open={isOpen} onCancel={onClose} footer={false} className="two-fa-modal">
            <div className="border-gradient"></div>
            <button className="close-btn" onClick={onClose}>
                <img src={closeIcon} alt="Close"/>
            </button>
            <div className="two-fa-modal-content">
                <h3>Authentication</h3>
                <h5>Asset Withdrawal</h5>
                <div className="info">
                    <div className="border-gradient"></div>
                    <div className="info-content">
                        <div className="address">
                            <span>To address</span>
                            <span className="to">{toAddress}</span>
                        </div>
                        <div className="amount">
                            <span>amount</span>
                            <p>
                                {" "}
                                <img src={selectedAsset?.imgLink} alt="" />
                                <span>{amountInput}</span> <span>{selectedAsset?.name}</span>
                            </p>
                        </div>
                        <div className="fee">
                            <span>Fee</span>
                            <p>
                                <img src={selectedNetwork?.chainIcon} alt="" />
                                <span>{selectedNetwork?.fees[0]?.value}</span>
                            </p>
                        </div>
                    </div>
                </div>
                <h4>Enter the 6-digit code FROM authenticator</h4>
                <div className="auth-code">
                    <input
                        ref={inputRef}
                        type="text"
                        maxLength={6}
                        value={code}
                        onChange={(e) => {
                            handleChangeCode(e)
                        }}
                    />
                    <span className="paste">
                       <img src={closeCircle} alt="Delete" onClick={handleDelete}/>
                      <span onClick={handlePaste}>  Paste</span></span>
                </div>
                <button className="button-confirm" onClick={handleWithdraw}>
                    <img src={checkCircle} />
                    <span>Confirm</span>
                </button>
            </div>
        </Modal>
    )
}

