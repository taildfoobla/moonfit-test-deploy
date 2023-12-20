import React from 'react'
import CloseBtn from "../../assets/images/astar-rewards/close-border.png"

export default function ClaimRewardsModalMobile({isOpen,onClose}) {
  return (
    <div className={`claim-rewards-modal-wrapper ${isOpen ? "active" : ""}`}>
    <div className="claim-rewards-modal-overlay" onClick={onClose}></div>
  <div className='claim-rewards-modal-mobile'>
    <div className='claim-rewards-modal-close' onClick={onClose}>
    <img src={CloseBtn} alt=''/>
    </div>
    <h4 className='claim-rewards-modal-header'>
    Your Rewards
    </h4>
    <div className='claim-rewards-content'>
        <div className='claim-rewards-list'>

        </div>
    </div>
  </div>
  </div>
  )
}
