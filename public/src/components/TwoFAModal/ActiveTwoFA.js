import React, {useEffect, useState} from "react"
import {Modal,message as AntdMessage} from "antd"
import copy from "../../assets/images/withdraw/copy-code.png"
import close from "../../assets/images/withdraw/close-circle.png"
import caretRight from "../../assets/images/withdraw/caret-right.png"
import {auth} from "../../core/utils/helpers/firebase"
import { create2faAPI, generate2faAPI } from "../../core/services/2fa"
import { LoadingOutlined} from '@ant-design/icons';
import { checkApi } from "../../core/utils/helpers/check-api"

export default function ActiveTwoFA({isOpen,onOpen=null, onClose,setIsHave2FA,codeToChaneTwoFa=null}) {
    const [isCoppied, setIsCoppied] = useState(false)
    const [isLoading,setIsLoading]=useState(true)
    const [authCode, setAuthCode] = useState({
        input_0: "",
        input_1: "",
        input_2: "",
        input_3: "",
        input_4: "",
        input_5: ""
    })
    const [generateCode,setGenerateCode]=useState("")

    useEffect(() => {
        let timeOut
        if (isCoppied) {
            timeOut = setTimeout(() => {
                setIsCoppied(false)
            }, 2000)
        }
    }, [isCoppied])

    useEffect(()=>{
        if(isOpen&&codeToChaneTwoFa===null){
            getGenerateCode()
        }else if(!isOpen){
            setAuthCode({
                input_0: "",
                input_1: "",
                input_2: "",
                input_3: "",
                input_4: "",
                input_5: ""
            })
        }else{
            setGenerateCode(codeToChaneTwoFa)
            setIsLoading(false)
        }
    },[isOpen])

    const handleCoppy = () => {
        navigator.clipboard.writeText(generateCode)
        setIsCoppied(true)
    }

    const handleChangeInputCode = (e, index) => {
        const input = e.target
        console.log("value", input.value)
        const value = {...authCode, [`input_${index}`]: input.value}
        setAuthCode(value)
        if (input.value !== "" && index < 5) {
            input.nextElementSibling.focus()
        }

        if(e.key=== "Backspace" && index>0){
            input.previousElementSibling.focus()
        }
    }

    const handlePaste=(e)=>{
        const data= e.clipboardData.getData("text")
        const value =data.split("")
        console.log("data",value)

        if(value.length===6){
            setAuthCode({
                input_0: value[0],
                input_1: value[1],
                input_2: value[2],
                input_3: value[3],
                input_4: value[4],
                input_5: value[5]
            })
        }
    }

    const getGenerateCode = async ()=>{
        try{
            const res = await checkApi(generate2faAPI)
            const {success,message,data}=res
            if(success===true){
                setGenerateCode(data?.secret_key)
                setIsLoading(false)
            }else{
                return AntdMessage.error({
                    key:"err",
                    content: message,
                    className: "message-error",
                    duration: 5,
                })
            
            }
        }catch(err){
            const {message, response} = err
            return AntdMessage.error({
                key: "err",
                content: response?.data?.message || "Something wrong",
                className: "message-error",
                duration: 5,
            })
        }
       
    }

    const handleVerify = async ()=>{
        let code =""
        for (let key in authCode) {
            if (authCode.hasOwnProperty(key)) {
              const value = authCode[key];
              code+=value
            }
          }
        const res = await checkApi(create2faAPI,[code])
       const {success,message,data}=res 
       if(success===true){
        onOpen!==null&&onOpen()
        setIsHave2FA(true)
        onClose()
        return AntdMessage.success({
            key: "success",
            content: "The 2FA setup was successful.",
            className: "message-success",
            duration: 5,
        })
       }else{
        return AntdMessage.error({
            key: "err",
            content: message || "Something wrong",
            className: "message-error",
            duration: 5,
        })
       }

    }

    return (
        <Modal centered={true} open={isOpen} onCancel={onClose} footer={false} className="two-fa-modal">
            <div className="border-gradient"></div>
            <div className="two-fa-modal-content">
                <h3>Enable 2-Factor Authentication</h3>
                <p>To withdraw assets, you must enable 2FA</p>
                <ul className="two-fa-guide-list">
                    <li className="two-fa-guide-item">
                        <div className="first">
                        <div className="index">
                            <div className="border-index"></div>
                            <div className="index-content">1</div>
                        </div>
                        <p className="content">
                            Download and install <span className="change-color-4CCBC9">Authy</span> or{" "}
                            <span className="change-color-4CCBC9">Google Authenticator</span>
                        </p>
                        </div>
                    </li>
                    <li className="two-fa-guide-item">
                        <div className="first">
                        <div className="index">
                            <div className="border-index"></div>
                            <div className="index-content">2</div>
                        </div>
                        <p className="content">Enter the code below onto your authenticator app</p>
                        </div>
                        <div className="code">
                           {isLoading?<LoadingOutlined/>:generateCode}
                            <div className="copy">
                                <img src={copy} alt="Copy" onClick={handleCoppy} />
                                {/* <p className="hover">{isCoppied ? "Coppied" : "Copy"}</p> */}
                            </div>
                        </div>
                    </li>
                    <li className="two-fa-guide-item">
                    <div className="first">
                        <div className="index">
                            <div className="border-index"></div>
                            <div className="index-content">3</div>
                        </div>
                        <p className="content">Enter the 6-digit verification code generated</p>
                        </div>
                        <div className="input-list">
                            <input
                                type="text"
                                maxLength="1"
                                value={authCode.input_0}
                                onChange={(e) => {
                                    handleChangeInputCode(e, 0)
                                }}
                                onKeyUp={(e) => {
                                    handleChangeInputCode(e, 0)
                                }}
                                onPaste={(e)=>{
                                    handlePaste(e)
                                }}
                            />
                            <input
                                type="text"
                                maxLength={1}
                                value={authCode.input_1}
                                onChange={(e) => {
                                    handleChangeInputCode(e, 1)
                                }}
                                onKeyUp={(e) => {
                                    handleChangeInputCode(e, 1)
                                }}
                                onPaste={(e)=>{
                                    handlePaste(e)
                                }}
                            />
                            <input
                                type="text"
                                maxLength={1}
                                value={authCode.input_2}
                                onChange={(e) => {
                                    handleChangeInputCode(e, 2)
                                }}
                                onKeyUp={(e) => {
                                    handleChangeInputCode(e, 2)
                                }}
                                onPaste={(e)=>{
                                    handlePaste(e)
                                }}
                            />
                            <input
                                type="text"
                                maxLength={1}
                                value={authCode.input_3}
                                onChange={(e) => {
                                    handleChangeInputCode(e, 3)
                                }}
                                onKeyUp={(e) => {
                                    handleChangeInputCode(e, 3)
                                }}
                                onPaste={(e)=>{
                                    handlePaste(e)
                                }}
                            />
                            <input
                                type="text"
                                maxLength={1}
                                value={authCode.input_4}
                                onChange={(e) => {
                                    handleChangeInputCode(e, 4)
                                }}
                                onKeyUp={(e) => {
                                    handleChangeInputCode(e, 4)
                                }}
                                onPaste={(e)=>{
                                    handlePaste(e)
                                }}
                            />
                            <input
                                type="text"
                                maxLength={1}
                                value={authCode.input_5}
                                onChange={(e) => {
                                    handleChangeInputCode(e, 5)
                                }}
                                onKeyUp={(e) => {
                                    handleChangeInputCode(e, 5)
                                }}
                                onPaste={(e)=>{
                                    handlePaste(e)
                                }}
                            />
                        </div>
                    </li>
                </ul>
                <div className="button-verify" >
                    <button className="cancel" onClick={onClose}>
                        <img src={close} alt="Cancel" />
                        <p>Cancel</p>
                    </button>
                    <button className="verify" onClick={handleVerify}>
                        <img src={caretRight} alt="Verify" />
                        <p>Verify</p>
                    </button>
                </div>
            </div>
        </Modal>
    )
}

