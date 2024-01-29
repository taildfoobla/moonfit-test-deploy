import React from "react"
import "./styles.less"
import {Modal} from "antd"
import closeIcon from "../../../../assets/images/astar-rewards/close-border.png"
import checkIcon from "../../../../assets/images/withdraw/check-circle.png"
import successIcon from "../../../../assets/images/withdraw/success-withdraw.png"
export default function SubmittedModal({isOpen, onClose}) {
    return (
        <Modal className="submitted-withdraw-modal" open={isOpen} centered={true} footer={false} onCancel={onClose}>
            <div className="border-gradient"></div>
            {/* <button className="close-button" onClick={onClose}>
                <img src={closeIcon} alt="Close" />
            </button> */}
            {/* <div className="confirm-two-fa-content"> */}
                <img src={successIcon} alt="2FA" />
                <h3>Transaction Submitted</h3>
                <p>
                Note: It may take up to 5 minutes for the change to reflect on your wallet balance.
                </p>
                <div className="button-container">
                    <button className="confirm"  onClick={onClose}>
                    <img src={checkIcon} alt="Cancel" />
                        <span>Done</span>
                    </button>
                </div>
            {/* </div> */}
        </Modal>
    )
}

