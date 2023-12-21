import React from "react";
import CloseBtn from "../../assets/images/astar-rewards/close-border.png";
import { Tooltip } from "flowbite-react";
import AmountInfo from "../../assets/images/astar-rewards/amount-info.png";
import AstarRewards from "../../assets/images/astar-rewards/astar-reward.png";

export default function ClaimRewardsModalMobile({ isOpen, onClose }) {
  return (
    <div className={`claim-rewards-modal-wrapper ${isOpen ? "active" : ""}`}>
      <div className="claim-rewards-modal-overlay" onClick={onClose}></div>
      <div className="claim-rewards-modal-mobile">
        <div className="claim-rewards-modal-close" onClick={onClose}>
          <img src={CloseBtn} alt="" />
        </div>
        <h4 className="claim-rewards-modal-header">Your Rewards</h4>
        <div className="claim-rewards-modal-content">
          <div className="claim-rewards-modal-list">
            <div className="claim-rewards-modal-item">
              <div className="item round">
                <span>Round</span>
                <span>1</span>
              </div>
              <div className="item amount">
                <span>
                  Amount{" "}
                  <Tooltip
                    className="amount-tooltip"
                    content="The ASTR amount is determined by your staking contribution to MoonFit at Astar Dapp Staking"
                  >
                    <img src={AmountInfo} alt="" />
                  </Tooltip>
                </span>
                <span>
                  <img src={AstarRewards} alt="" />
                  399 $ASTR
                </span>
              </div>
              <div className="item rewards">
                <span>Rewards Available At</span>
                <span>Dec 27th 2023 - 23:00</span>
              </div>
              <div className="item claim">
                <span>Claim</span>
                <label htmlFor="round-6">
                  <input id="round-6" type="checkbox" />
                  Select Round 6
                </label>
              </div>
            </div>
            <div className="claim-rewards-modal-item">
              <div className="item round">
                <span>Round</span>
                <span>1</span>
              </div>
              <div className="item amount">
                <span>
                  Amount{" "}
                  <Tooltip
                    className="amount-tooltip"
                    content="The ASTR amount is determined by your staking contribution to MoonFit at Astar Dapp Staking"
                  >
                    <img src={AmountInfo} alt="" />
                  </Tooltip>
                </span>
                <span>
                  <img src={AstarRewards} alt="" />
                  399 $ASTR
                </span>
              </div>
              <div className="item rewards">
                <span>Rewards Available At</span>
                <span>Dec 27th 2023 - 23:00</span>
              </div>
              <div className="item claim">
                <span>Claim</span>
                <label htmlFor="round-6">
                  <input id="round-6" type="checkbox" />
                  Select Round 6
                </label>
              </div>
            </div>
            <div className="claim-rewards-modal-item">
              <div className="item round">
                <span>Round</span>
                <span>1</span>
              </div>
              <div className="item amount">
                <span>
                  Amount{" "}
                  <Tooltip
                    className="amount-tooltip"
                    content="The ASTR amount is determined by your staking contribution to MoonFit at Astar Dapp Staking"
                  >
                    <img src={AmountInfo} alt="" />
                  </Tooltip>
                </span>
                <span>
                  <img src={AstarRewards} alt="" />
                  399 $ASTR
                </span>
              </div>
              <div className="item rewards">
                <span>Rewards Available At</span>
                <span>Dec 27th 2023 - 23:00</span>
              </div>
              <div className="item claim">
                <span>Claim</span>
                <label htmlFor="round-6">
                  <input id="round-6" type="checkbox" />
                  Select Round 6
                </label>
              </div>
            </div>
            <div className="claim-rewards-modal-item">
              <div className="item round">
                <span>Round</span>
                <span>1</span>
              </div>
              <div className="item amount">
                <span>
                  Amount{" "}
                  <Tooltip
                    className="amount-tooltip"
                    content="The ASTR amount is determined by your staking contribution to MoonFit at Astar Dapp Staking"
                  >
                    <img src={AmountInfo} alt="" />
                  </Tooltip>
                </span>
                <span>
                  <img src={AstarRewards} alt="" />
                  399 $ASTR
                </span>
              </div>
              <div className="item rewards">
                <span>Rewards Available At</span>
                <span>Dec 27th 2023 - 23:00</span>
              </div>
              <div className="item claim">
                <span>Claim</span>
                <label htmlFor="round-6">
                  <input id="round-6" type="checkbox" />
                  Select Round 6
                </label>
              </div>
            </div>
            <div className="claim-rewards-modal-item">
              <div className="item round">
                <span>Round</span>
                <span>1</span>
              </div>
              <div className="item amount">
                <span>
                  Amount{" "}
                  <Tooltip
                    className="amount-tooltip"
                    content="The ASTR amount is determined by your staking contribution to MoonFit at Astar Dapp Staking"
                  >
                    <img src={AmountInfo} alt="" />
                  </Tooltip>
                </span>
                <span>
                  <img src={AstarRewards} alt="" />
                  399 $ASTR
                </span>
              </div>
              <div className="item rewards">
                <span>Rewards Available At</span>
                <span>Dec 27th 2023 - 23:00</span>
              </div>
              <div className="item claim">
                <span>Claim</span>
                <label htmlFor="round-6">
                  <input id="round-6" type="checkbox" />
                  Select Round 6
                </label>
              </div>
            </div>
            <div className="claim-rewards-modal-item">
              <div className="item round">
                <span>Round</span>
                <span>1</span>
              </div>
              <div className="item amount">
                <span>
                  Amount{" "}
                  <Tooltip
                    className="amount-tooltip"
                    content="The ASTR amount is determined by your staking contribution to MoonFit at Astar Dapp Staking"
                  >
                    <img src={AmountInfo} alt="" />
                  </Tooltip>
                </span>
                <span>
                  <img src={AstarRewards} alt="" />
                  399 $ASTR
                </span>
              </div>
              <div className="item rewards">
                <span>Rewards Available At</span>
                <span>Dec 27th 2023 - 23:00</span>
              </div>
              <div className="item claim">
                <span>Claim</span>
                <label htmlFor="round-6">
                  <input id="round-6" type="checkbox" />
                  Select Round 6
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
