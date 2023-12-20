import React from "react";
import AstarRewards from "../../assets/images/astar-rewards/astar-reward.png";
import CloseBtn from "../../assets/images/astar-rewards/close-border.png";
import AmountInfo from "../../assets/images/astar-rewards/amount-info.png";
import { Tooltip } from "flowbite-react";

export default function ClaimRewardsModal({ isOpen, onClose }) {
  return (
    <div className={`claim-rewards-modal-wrapper ${isOpen ? "active" : ""}`}>
      <div className="claim-rewards-modal-overlay" onClick={onClose}></div>
      <div className="claim-rewards-modal">
        <div className="claim-rewards-modal-header">Your Rewards</div>
        <div className="claim-rewards-modal-close" onClick={onClose}>
          <img src={CloseBtn} alt="Close" />
        </div>
        <div className="claim-rewards-modal-content">
          <div className="claim-rewards-table">
            <div className="claim-rewards-table-header">
              <div className="claim-rewards-table-header-item">
                <p>Round</p>
              </div>
              <div className="claim-rewards-table-header-item">
                <p>Amount</p>
                <Tooltip
                  className="amount-tooltip"
                  content="The ASTR amount is determined by your staking contribution to MoonFit at Astar Dapp Staking"
                >
                  <img src={AmountInfo} alt="" />
                </Tooltip>
              </div>
              <div className="claim-rewards-table-header-item">
                <p>Rewards Available At</p>
              </div>
              <div className="claim-rewards-table-header-item">
                <p>Claim</p>
              </div>
            </div>
            <div className="claim-rewards-table-list">
              <div className="claim-rewards-table-item">
                <div className="claim-rewards-item-index">1</div>
                <div className="claim-rewards-item-amount">
                  <div className="reward-icon">
                    <img src={AstarRewards} alt="Astar" />
                  </div>
                  <span className="reward-number">399 $ASTR</span>
                </div>
                <div className="claim-rewards-item-time">
                  Dec 27th 2023 at 23:00
                </div>
                <div className="claim-rewards-round">
                  <input id="round-1" type="checkbox" />
                  <label htmlFor="round-1">Select Round 1</label>
                </div>
              </div>
              <div className="claim-rewards-table-item">
                <div className="claim-rewards-item-index">1</div>
                <div className="claim-rewards-item-amount">
                  <div className="reward-icon">
                    <img src={AstarRewards} alt="Astar" />
                  </div>
                  <span className="reward-number">399 $ASTR</span>
                </div>
                <div className="claim-rewards-item-time">
                  Dec 27th 2023 at 23:00
                </div>
                <div className="claim-rewards-round">
                  <input id="round-1" type="checkbox" />
                  <label htmlFor="round-1">Select Round 1</label>
                </div>
              </div>
              <div className="claim-rewards-table-item">
                <div className="claim-rewards-item-index">1</div>
                <div className="claim-rewards-item-amount">
                  <div className="reward-icon">
                    <img src={AstarRewards} alt="Astar" />
                  </div>
                  <span className="reward-number">399 $ASTR</span>
                </div>
                <div className="claim-rewards-item-time">
                  Dec 27th 2023 at 23:00
                </div>
                <div className="claim-rewards-round">
                  <input id="round-1" type="checkbox" />
                  <label htmlFor="round-1">Select Round 1</label>
                </div>
              </div>
              <div className="claim-rewards-table-item">
                <div className="claim-rewards-item-index">1</div>
                <div className="claim-rewards-item-amount">
                  <div className="reward-icon">
                    <img src={AstarRewards} alt="Astar" />
                  </div>
                  <span className="reward-number">399 $ASTR</span>
                </div>
                <div className="claim-rewards-item-time">
                  Dec 27th 2023 at 23:00
                </div>
                <div className="claim-rewards-round">
                  <input id="round-1" type="checkbox" />
                  <label htmlFor="round-1">Select Round 1</label>
                </div>
              </div>
              <div className="claim-rewards-table-item">
                <div className="claim-rewards-item-index">1</div>
                <div className="claim-rewards-item-amount">
                  <div className="reward-icon">
                    <img src={AstarRewards} alt="Astar" />
                  </div>
                  <span className="reward-number">399 $ASTR</span>
                </div>
                <div className="claim-rewards-item-time">
                  Dec 27th 2023 at 23:00
                </div>
                <div className="claim-rewards-round">
                  <input id="round-6" type="checkbox" />
                  <label htmlFor="round-1">Select Round 1</label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="claim-rewards-button-wrapper">
          <button className="claim-rewards-button">
            Claim selected rewards
          </button>
        </div>
      </div>
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
                <label>
                  <input type="checkbox" />
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
