import React from "react";
import { Modal } from "antd";
import RewardsImg from "../../assets/images/astar-rewards/share-rewards-img.png";
import CloseBorder from "../../assets/images/astar-rewards/close-border.png";
import CloseNoBorder from "../../assets/images/astar-rewards/close-no-border.png"

export default function ShareRewardsModal({ isOpen, onClose }) {
  return (
    <Modal
      className="share-rewards-modal"
      open={isOpen}
      onCancel={onClose}
      centered={true}
      footer={false}
    >
      <div className="close-btn">
        <img src={CloseBorder} alt="" />
        <img src={CloseNoBorder} alt=""/>
      </div>
      <h3 className="share-rewards-modal-header">Congratulations!</h3>
      <p>You have successfully shared the reward pool of</p>
      <img src={RewardsImg} alt="" />
      <p>Stake more to enhance your benefits with MoonFit:</p>
      <ul className="benefit-list">
        <li className="benefit-item">
          <div className="index">
            <span>1</span>
            <div className="border-index"></div>
          </div>
          <span className="text">Boosted APY 11.2%</span>
        </li>
        <li className="benefit-item">
          <div className="index">
            <span>2</span>
            <div className="border-index"></div>
          </div>
          <span className="text">Free MoonFit NFTs</span>
        </li>
        <li className="benefit-item">
          <div className="index">
            <span>3</span>
            <div className="border-index"></div>
          </div>
          <span className="text">Exclusive Perks</span>
        </li>
      </ul>
      <div className="button-wrapper">
        <button className="share">Share & Earn More ASTR</button>
        <button className="stake">Stake More</button>
      </div>
    </Modal>
  );
}
