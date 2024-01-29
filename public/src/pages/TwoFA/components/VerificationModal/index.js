import React, { useRef, useState } from "react"
import "./styles.less"
import {Modal, message as AntdMessage} from "antd"
import closeIcon from "../../../../assets/images/astar-rewards/close-border.png"
import closeCircleIcon from "../../../../assets/images/withdraw/close-circle-2.png"
import caretRightIcon from "../../../../assets/images/withdraw/caret-right.png"
import checkIcon from "../../../../assets/images/withdraw/check-circle.png"
import { checkApi } from "../../../../core/utils/helpers/check-api"
import { change2faAPI } from "../../../../core/services/2fa"
export default function VerificationModal({isOpen, onClose,onToggleActiveTwoFa,onChangeCodeToActiveTwoFa}) {
   const inputRef=useRef()
   const [code,setCode]=useState("")

   const handleChangeCode=(e)=>{
    setCode(e.target.value)
   }

   const handleDelete=(e)=>{
    setCode("")
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

    const handleSubmit=async()=>{
        const res = await checkApi(change2faAPI,[code])
        console.log("res",res)
        const {success,message,data}=res
        if(success===true){
            onChangeCodeToActiveTwoFa(data?.secret_key)
            onClose()
            onToggleActiveTwoFa()
        }else{
            return AntdMessage.error({
                key:"err",
                content: message,
                className: "message-error",
                duration: 5,
            })
        }
    }

    return (
        <Modal className="verification-two-fa-modal" open={isOpen} centered={true} footer={false} onCancel={onClose}>
            <div className="border-gradient"></div>
            <button className="close-button" onClick={onClose}>
                <img src={closeIcon} alt="Close" />
            </button>
            {/* <div className="confirm-two-fa-content"> */}
                <h3>Verification</h3>
                <p>
                Enter the 6-digit code FROM authenticator
                </p>
                <div className="auth-code">
                    <input
                        ref={inputRef}
                        type="text"
                        maxLength={6}
                        value={code}
                        placeholder="6-Digit code"
                        onChange={(e) => {
                            handleChangeCode(e)
                        }}
                    />
                    <span className="paste">
                       <img src={closeCircleIcon} alt="Delete" onClick={handleDelete}/>
                      <span onClick={handlePaste}>  Paste</span></span>
                </div>
                <div className="button-container">
                 
                    <button className="confirm" onClick={handleSubmit}>
                    <img src={checkIcon} alt="Cancel" />
                        <span>submit</span>
                    </button>
                </div>
            {/* </div> */}
        </Modal>
    )
}

