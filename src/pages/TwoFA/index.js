import React, {useEffect, useState} from "react"
import "./styles.less"
import TwoFaWrapper from "../../components/Wrapper/TwoFaWrapper"
import lockIcon from "../../assets/images/two-fa/padlock-1.png"
import changeIcon from "../../assets/images/two-fa/transfer.png"
import Loading from "../Mint/components/LoadingOutlined"
import ConfirmModal from "./components/ConfirmModal"
import VerificationModal from "./components/VerificationModal"
import {check2faAPI} from "../../core/services/2fa"
import {checkApi} from "../../core/utils/helpers/check-api"
import {message as AntdMessage} from "antd"
import CreateTwoFa from "./components/CreateTwoFA"
import { useAuth } from "../../core/contexts/auth"
import { useNavigate } from "react-router-dom"
import ActiveTwoFA from "../../components/TwoFAModal/ActiveTwoFA"

export default function TwoFaPage() {
    const navigate=useNavigate()

    const [isLoading, setIsLoading] = useState(true)
    const [isHave2FA, setIsHave2FA] = useState(false)
    const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false)
    const [isOpenVerificationModal, setIsOpenVerificationModal] = useState(false)
    const [isOpenActiveTwoFa,setIsOpenActiveTwoFa]=useState(false)
    const [codeToChaneTwoFa,setCodeToChangeTwoFa]=useState("")

    const {isLoginSocial}=useAuth()

    useEffect(() => {
        if(isLoginSocial){
            checkTwoFA()

        }else{
            navigate("/")
        }
    }, [isLoginSocial])


    const checkTwoFA = async () => {
        const res = await checkApi(check2faAPI)
        const {success, message, data} = res
        if (success) {
            const enable = data?.enable
            if (enable) {
                setIsHave2FA(true)
            } else {
                setIsHave2FA(false)
            }
            setIsLoading(false)
        } else {
            return AntdMessage.error({
                key: "err",
                content: message,
                className: "message-error",
                duration: 5,
            })
        }
    }

    const handleToggleConfirmModal = () => {
        setIsOpenConfirmModal(!isOpenConfirmModal)
    }

    const handleToggleVerificationModal = () => {
        setIsOpenVerificationModal(!isOpenVerificationModal)
    }

    const handleChangeCodeToActiveTwoFa=(value)=>{
        setCodeToChangeTwoFa(value)
    }

    const hanldeToggleActiveTwoFa=()=>{
    setIsOpenActiveTwoFa(!isOpenActiveTwoFa)
    }


    if (isLoading) {
        return (
            <div className="loading two-fa">
                <Loading />
            </div>
        )
    }

    return (
        <TwoFaWrapper>
            <ConfirmModal
                isOpen={isOpenConfirmModal}
                onClose={handleToggleConfirmModal}
                onToggleVerificationModal={handleToggleVerificationModal}
            />
            <VerificationModal
                isOpen={isOpenVerificationModal}
                onClose={handleToggleVerificationModal}
                onToggleActiveTwoFa={hanldeToggleActiveTwoFa}
                onChangeCodeToActiveTwoFa={handleChangeCodeToActiveTwoFa}
            />
            <ActiveTwoFA isOpen={isOpenActiveTwoFa} onClose={hanldeToggleActiveTwoFa} setIsHave2FA={setIsHave2FA} codeToChaneTwoFa={codeToChaneTwoFa}/>
            {isHave2FA ? (
                <div className={`two-fa-container ${isOpenActiveTwoFa||isOpenConfirmModal||isOpenVerificationModal?"to-right":""}`}>
                    <div className="border-gradient"></div>
                    <div className="two-fa-content">
                        <h3>2-Factor Authentication</h3>
                        <img src={lockIcon} alt="TwoFA" />
                        <p>Please enable 2-Factor Authentication to connect wallet</p>
                        <button className="first" onClick={handleToggleConfirmModal}>
                            <img src={changeIcon} alt="Change" />
                            <span>Change 2-Factor Authentication</span>
                        </button>
                        <button className="second" onClick={handleToggleConfirmModal}>
                            <img src={changeIcon} alt="Change" />
                            <span>Change 2-FA</span>
                        </button>
                    </div>
                </div>
            ) : (
                <CreateTwoFa setIsHave2FA={setIsHave2FA}  />
            )}
        </TwoFaWrapper>
    )
}

