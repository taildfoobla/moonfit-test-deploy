import React from 'react'
import { Button } from 'antd'

export default function ConfirmModal({isOpen,onClose,onConfirm}) {
  return (
    <div className={`mf-modal-confirm ${!isOpen?"disabled":""}`}>
    <div className="mf-modal-confirm-box">
        <div className="mf-modal-confirm-content">
            <div className="confirm-text">
                You will lost  <span>100 MFR</span>
            </div>

            <div className="confirm-button">
                <Button className="confirm-no" onClick={onClose}>
                    No
                </Button>
                <Button className="confirm-yes" onClick={onConfirm}>
                    Yes
                </Button>
            </div>
        </div>
    </div>
</div>
  )
}
