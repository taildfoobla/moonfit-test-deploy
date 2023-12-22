import React, { useState, useEffect } from "react";
import AstarRewards from "../../assets/images/astar-rewards/astar-reward.png";
import CloseBtn from "../../assets/images/astar-rewards/close-border.png";
import AmountInfo from "../../assets/images/astar-rewards/amount-info.png";
import { Tooltip } from "flowbite-react";
import { claimStakingAPI } from "../../services/astar-rewards";

export default function ClaimRewardsModal({ isOpen, onClose, rewardList,signatureData }) {
  const [selectedRound, setSelectedRound] = useState([]);

  //useEffect for the first time
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // function to format date
  function formatDate(dateString) {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = months[date.getMonth()];
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();

    // Helper function to add ordinal suffix to day
    function addOrdinalSuffix(day) {
      if (day >= 11 && day <= 13) {
        return day + "th";
      } else {
        const lastDigit = day % 10;
        switch (lastDigit) {
          case 1:
            return day + "st";
          case 2:
            return day + "nd";
          case 3:
            return day + "rd";
          default:
            return day + "th";
        }
      }
    }

    const formattedDate = `${month} ${addOrdinalSuffix(day)} ${year} at ${hours
      .toString()
      .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
    return formattedDate;
  }

  // function to change state when change input checkbox
  const handleSelectedRound = ({ checked, round }) => {
    if (checked) {
      setSelectedRound([...selectedRound, round]);
    } else {
      const newData = selectedRound.filter((item) => item !== round);
      setSelectedRound(newData);
    }
  };

  // function to claim staking
  const handleClaim = async()=>{
    const value ={
      ...signatureData,rounds:selectedRound
    }
    const res =await claimStakingAPI(value)
    const {data,success}=res
    if(success){
      
    }
  }

  console.log(selectedRound)

  // const to set status of claim button
  const isClaimable=selectedRound.length>0;

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
              {rewardList?.length>0?rewardList.map((reward) => (
                <div className="claim-rewards-table-item">
                  <div className="claim-rewards-item-index">{reward.round}</div>
                  <div className="claim-rewards-item-amount">
                    <div className="reward-icon">
                      <img src={AstarRewards} alt="Astar" />
                    </div>
                    <span className="reward-number">
                      {reward.total_value} $ASTR
                    </span>
                  </div>
                  <div className="claim-rewards-item-time">
                    {formatDate(reward.time)}
                  </div>
                  <div className="claim-rewards-round">
                    <input
                      id={`round-${reward.round}`}
                      type="checkbox"
                      onChange={(e) => {
                        const value = {
                          checked: e.target.checked,
                          round: reward.round,
                        };
                        handleSelectedRound(value);
                      }}
                    />
                    <label htmlFor={`round-${reward.round}`}>
                      Select Round {reward.round}
                    </label>
                  </div>
                </div>
              )):<div>You have 0 round to claim</div>}
            </div>
          </div>
        </div>
        <div className="claim-rewards-button-wrapper">
          <button className={`claim-rewards-button ${isClaimable?"":"disabled"}`}>
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
                <div className="pending">Pending</div>
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
                <div className="claimed">Claimed</div>
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
                <label>
                  <input type="checkbox" />
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
                <label>
                  <input type="checkbox" />
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
                <label>
                  <input type="checkbox" />
                  Select Round 6
                </label>
              </div>
            </div>
          </div>
        </div>
        <button className="claim-rewards-button">Claim selected rewards</button>
      </div>
    </div>
  );
}
