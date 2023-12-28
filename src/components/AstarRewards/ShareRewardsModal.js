import React from "react";
import { Modal } from "antd";
import RewardsImg from "../../assets/images/astar-rewards/share-rewards-img.png";
import CloseBorder from "../../assets/images/astar-rewards/close-border.png";
import CloseNoBorder from "../../assets/images/astar-rewards/close-no-border.png";
import Rewards from "../../assets/images/astar-rewards/share-rewards.png";

export default function ShareRewardsModal({ isOpen, onClose }) {
  return (
    <Modal
      className="share-rewards-modal"
      open={isOpen}
      onCancel={onClose}
      centered={true}
      footer={false}
    >
      <div className="close-btn" onClick={onClose}>
        <img src={CloseBorder} alt="" />
        <img src={CloseNoBorder} alt="" />
      </div>
      <h3 className="share-rewards-modal-header">Congratulations!</h3>
      <p>You have successfully shared the reward pool of</p>
      <div className="share-rewards-img">
        <img src={RewardsImg} alt="" />
        <img src={Rewards} alt="" />
      </div>
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
        <button className="share" onClick={()=>{
          window.open("https://twitter.com/intent/tweet?url=https%3A%2F%2Fmoonfit-token-sale.web.app%2F&text=MoonFit&hashtags=MoonFit")
        }}>Share & Earn More ASTR</button>
        <button className="stake" onClick={()=>{
          window.open("https://portal.astar.network/astar/dapp-staking/dapp?dapp=0xe785a37c9d5f3377cbb5b8bf7e9db03ddd440449")
        }}>Stake More</button>
      </div>
    </Modal>
  );
}
