import React from "react"
import "./styles.less"
import {Modal} from "antd"
import closeIcon from "../../../../assets/images/astar-rewards/close-border.png"
import closeCircleIcon from "../../../../assets/images/withdraw/close-circle-2.png"
import caretRightIcon from "../../../../assets/images/withdraw/caret-right.png"
import warningIcon from "../../../../assets/images/withdraw/warning.png"
export default function ConfirmModal({isOpen, onClose, onToggleVerificationModal}) {
    return (
        <Modal className="confirm-two-fa-modal" open={isOpen} centered={true} footer={false} onCancel={onClose}>
            <div className="border-gradient"></div>
            <button className="close-button" onClick={onClose}>
                <img src={closeIcon} alt="Close" />
            </button>
            {/* <div className="confirm-two-fa-content"> */}
            <img src={warningIcon} alt="2FA" />
            <h3>Are you sure you want to change 2FA?</h3>
            <p>
                Withdraw will be disable for 24 hours after changing 2-Factor Authentication to ensure the safety of
                your account
            </p>
            <div className="button-container">
                <button className="cancel" onClick={onClose}>
                    <img src={closeCircleIcon} alt="Cancel" />
                    <span>Cancel</span>
                </button>
                <button
                    className="confirm"
                    onClick={() => {
                        onClose()
                        onToggleVerificationModal()
                    }}
                >
                    <img src={caretRightIcon} alt="Cancel" />
                    <span>continue</span>
                </button>
            </div>
            {/* </div> */}
        </Modal>
    )
}

