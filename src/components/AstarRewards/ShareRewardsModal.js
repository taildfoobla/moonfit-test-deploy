import React from "react";
import { Modal } from "antd";
import { RewardsImg } from "../../constants/astar-img";
import { CloseBtn as CloseBorder } from "../../constants/astar-img";
import { CloseNoBorder } from "../../constants/astar-img";
import { Rewards } from "../../constants/astar-img";

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
          window.open("https://twitter.com/intent/tweet?text=Super%20excited%20to%20get%20a%20shared%20reward%20pool%20of%203%2C579%20%24ASTR%20from%20%40MoonFitOfficial%20through%20%40AstarNetwork%20dApp%20Staking.%20%0A%0A%F0%9F%9A%80%20Boosted%2011.2%25%20APY%0A%F0%9F%8E%81%20Free%20MoonFit%20NFTs%0A%F0%9F%8C%88%20More%20exclusive%20perks%0A%0AStake%20now%3A%20https%3A%2F%2Fapp.moonfit.xyz%2Fastar-reward%0A%0A%23AstarNetwork%20%23MoonFit")
        }}>Share & Earn More ASTR</button>
        <button className="stake" onClick={()=>{
          window.open("https://portal.astar.network/astar/dapp-staking/dapp?dapp=0xe785a37c9d5f3377cbb5b8bf7e9db03ddd440449")
        }}>Stake More</button>
      </div>
    </Modal>
  );
}
