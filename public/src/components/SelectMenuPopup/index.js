import "./styles.less"
import React from "react"
import Modal from "antd/lib/modal/Modal"
import CloseBtn from "../../assets/images/lucky-wheel/close-border.svg"
import { useAuth } from "../../core/contexts/auth"

export default function SelectMenuPopup({isOpen, setIsOpen}) {
    
    const {onDisconnect,setIsOpenModalChooseAccount} =useAuth()

    const handleCancel=()=>{
        setIsOpen(false)
    }
    
    const handleShowChooseAccount=()=>{
        setIsOpen(false)
        setIsOpenModalChooseAccount(true)
    }

    const handleDisconnect=()=>{
        setIsOpen(false)
        onDisconnect()
    }

    return (
        <Modal className="select-menu-popup" open={isOpen} centered={true} footer={false} onCancel={handleCancel} >
            <div
                className="close-button"
                onClick={() => {
                    handleCancel()
                }}
            >
                {" "}
                <img src={CloseBtn} alt="" />
            </div>
            <div className="select-menu-popup-content">
                <div className="select-menu-popup-content-item" onClick={handleShowChooseAccount}>Account</div>
                <div className="select-menu-popup-content-item" onClick={handleDisconnect}>Disconnect</div>
            </div>
        </Modal>
    )
}

