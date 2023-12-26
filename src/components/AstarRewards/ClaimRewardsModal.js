import React, { useState, useEffect } from "react";
import AstarRewards from "../../assets/images/astar-rewards/astar-reward.png";
import CloseBtn from "../../assets/images/astar-rewards/close-border.png";
import AmountInfo from "../../assets/images/astar-rewards/amount-info.png";
import { Tooltip } from "flowbite-react";
import { claimStakingAPI, getStakeInfoAPI } from "../../services/astar-rewards";
import { sendTransaction } from "../../utils/blockchain";
import { updateTransactionAPI } from "../../services/astar-rewards";
import { switchToNetwork } from "../../utils/blockchain";
import { LOCALSTORAGE_KEY, getLocalStorage } from "../../utils/storage";

export default function ClaimRewardsModal({
  isOpen,
  onClose,
  rewardList,
  signatureData,
  provider,
  connector,
  reCallData,
  setRewardInfo,
  setIsFetchingHaveWallet
}) {
  const fakeData = {
    message: "MoonFit:0xaC26C8296D823561EB2C9fb8167D8936761694B0:1703144154494",
    signature:
      "0x10109db033037a541b0f257dc25361daa58edbaefdaa741d5280554d2bbd504f1363e20fa473bb3f5f0f1582d07e4f06760ef87096dfd84cfb7d43bb502f3b801b",
    wallet_address: "0x1fc37012c190526b92a991398829abc8134a6694",
  };
  const [selectedRound, setSelectedRound] = useState([]);
  const [pendingRound, setPendingRound] = useState([]);
  const [claimedRound, setClaimedRound] = useState([]);
  const [isNeedCheckPending, setIsNeedCheckPending] = useState(false);
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

  //useEffect for roundList
  useEffect(() => {
    if (rewardList) {
      // let pendingArr = [];
      // rewardList.forEach((item) => {
      //   if (item.status === "pending") {
      //     pendingArr.push(item.round);
      //   }
      // });
      // setPendingRound(pendingArr);
      // if(pendingArr?.length>0){
      //   setIsNeedCheckPending(true)
      // }
      let claimedArr = [];
      rewardList.forEach((item) => {
        if (item.status === "completed" || item.status === "pending") {
          claimedArr.push(item.round);
        }
      });
      setClaimedRound(claimedArr);
    }
  }, [rewardList]);

  //useEffect for check pending round
  // useEffect(() => {
  //   const testWallet = getLocalStorage("TEST_WALLET")
  //  if(pendingRound?.length>0&&isNeedCheckPending){
  //   checkPending({...signatureData,wallet_address:testWallet})
  // }
  // }, [pendingRound,isNeedCheckPending]);

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
  function formatNumber(number) {
    if (number === 0) {
      return number;
    } else {
      const formattedNumber = (+number).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      return formattedNumber;
    }
  }

  // function to check pending
  const checkPending = async (signatureData) => {
    setIsFetchingHaveWallet(true)
    const res = await getStakeInfoAPI(signatureData);
    const { data, success } = res;
    if (success) {
      if (data?.message === "Get Staking Info successfully") {
        const canClaimArr = [];

        data?.data?.user_info?.rounds.forEach((round) => {
          if (round.status === "created") {
            canClaimArr.push(round);
          }
        });

        // const claimedArr = [];
        // data?.data?.user_info?.rounds.forEach((round) => {
        //   if (round.status === "completed") {
        //     claimedArr.push(round.round);
        //   } else if (round.status === "created") {
        //     canClaimArr.push(round);
        //   }
        // });
        // const newPendingArr = [];
        // pendingRound.forEach((round) => {
        //   if (!claimedArr.includes(round)) {
        //     newPendingArr.push(round);
        //   }
        // });

        let newClaimableNumber = 0;
        canClaimArr.forEach((round) => {
          newClaimableNumber += round.total_value;
        });

        // setClaimedRound(claimedArr);
        // setPendingRound(newPendingArr);
        setRewardInfo(data?.data?.user_info?.total_stake, newClaimableNumber);
        // if(newPendingArr?.length==0){
        //   setIsNeedCheckPending(false)
        // }
        setIsFetchingHaveWallet(false)
      }

    }
  };

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
  const handleClaim = async () => {
    const testWallet = getLocalStorage("TEST_WALLET");

    if (isClaimable) {
      const newPendingArr = pendingRound;
      selectedRound.forEach((item) => {
        newPendingArr.push(item);
      });
      const cacheSelectedRound = selectedRound;
      // setIsNeedCheckPending(false)
      setPendingRound(newPendingArr);
      setSelectedRound([]);
      const value = {
        ...signatureData,
        rounds: selectedRound,
        wallet_address: testWallet,
      };
      try {
        const res = await claimStakingAPI(value);
        console.log("res", res);
        const { data, success } = res;
        if (success) {
          if (data?.message === "Get Staking Info successfully") {
            console.log("before send");
            const sendData = {
              ...data?.data?.transaction?.transaction,
              from: signatureData.wallet_address,
            };
            await switchToNetwork(provider, data?.data?.transaction?.chainId);
            const txHash = await sendTransaction(provider, connector, sendData);
            console.log("txHash", txHash);

            const valueForUpdate = {
              transaction_id: data?.data?.wallet_transaction_id,
              transaction_hash: txHash,
            };
            const updateData = await updateTransactionAPI(valueForUpdate);
            console.log("update", updateData);
            const newClaimedArr = claimedRound.concat(cacheSelectedRound);
            setClaimedRound(newClaimedArr);
            await checkPending(signatureData);
          }
        }
      } catch (err) {
        // const newArr = [];
        // newPendingArr.forEach((round) => {
        //   if (!cacheSelectedRound.includes(round)) {
        //     newArr.push(round);
        //   }
        // });
        // if(newArr?.length>0){
        //   setIsNeedCheckPending(true)
        // }
        setPendingRound([]);
        setSelectedRound([]);
      }
    }
  };

  // const to set status of claim button
  const isClaimable = selectedRound.length > 0;

  return (
    <div className={`claim-rewards-modal-wrapper ${isOpen ? "active" : ""}`}>
      <div
        className="claim-rewards-modal-overlay"
        onClick={() => {
          setSelectedRound([]);
          onClose();
        }}
      ></div>
      <div className="claim-rewards-modal">
        <div className="claim-rewards-modal-header">Your Rewards</div>
        <div
          className="claim-rewards-modal-close"
          onClick={() => {
            setSelectedRound([]);
            onClose();
          }}
        >
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
              {rewardList?.length > 0 ? (
                rewardList.map((reward, index) => (
                  <div key={index} className="claim-rewards-table-item">
                    <div className="claim-rewards-item-index">
                      {reward.round}
                    </div>
                    <div className="claim-rewards-item-amount">
                      <div className="reward-icon">
                        <img src={AstarRewards} alt="Astar" />
                      </div>
                      <span className="reward-number">
                        {formatNumber(reward.total_value)} $ASTR
                      </span>
                    </div>
                    <div className="claim-rewards-item-time">
                      {formatDate(reward.time)}
                    </div>
                    <div className="claim-rewards-round">
                      {claimedRound.includes(reward.round) ? (
                        <div className="claimed">Claimed</div>
                      ) : pendingRound.includes(reward.round) ? (
                        <div className="pending">Pending</div>
                      ) : (
                        <>
                          <input
                            id={`round-${reward.round}`}
                            type="checkbox"
                            checked={selectedRound.includes(reward.round)}
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
                        </>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div>You have 0 rounds to claim</div>
              )}
            </div>
          </div>
        </div>
        <div className="claim-rewards-button-wrapper">
          <button
            className={`claim-rewards-button ${isClaimable ? "" : "disabled"}`}
            onClick={() => {
              handleClaim();
            }}
          >
            Claim selected rewards
          </button>
        </div>
      </div>
      <div className="claim-rewards-modal-mobile">
        <div
          className="claim-rewards-modal-close"
          onClick={() => {
            setSelectedRound([]);
            onClose();
          }}
        >
          <img src={CloseBtn} alt="" />
        </div>
        <h4 className="claim-rewards-modal-header">Your Rewards</h4>
        <div className="claim-rewards-modal-content">
          <div className="claim-rewards-modal-list">
            {rewardList?.length > 0 ? (
              rewardList.map((reward, index) => (
                <div key={index} className="claim-rewards-modal-item">
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
                      {formatNumber(reward.total_value)} $ASTR
                    </span>
                  </div>
                  <div className="item rewards">
                    <span>Rewards Available At</span>
                    <span>{formatDate(reward.time)}</span>
                  </div>
                  <div className="item claim">
                    <span>Claim</span>
                    {pendingRound.includes(reward.round) ? (
                      <div className="pending">Pending</div>
                    ) : claimedRound.includes(reward.round) ? (
                      <div className="claimed">Claimed</div>
                    ) : (
                      <label htmlFor={`round-${reward.round}-mobile`}>
                        <input
                          onChange={(e) => {
                            const value = {
                              checked: e.target.checked,
                              round: reward.round,
                            };
                            handleSelectedRound(value);
                          }}
                          checked={selectedRound.includes(reward.round)}
                          id={`round-${reward.round}-mobile`}
                          type="checkbox"
                        />
                        Select Round {reward.round}
                      </label>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div>You have 0 rounds to claim</div>
            )}
          </div>
        </div>
        <button
          onClick={() => {
            handleClaim();
          }}
          className={`claim-rewards-button ${isClaimable ? "" : "disabled"}`}
        >
          Claim selected rewards
        </button>
      </div>
    </div>
  );
}
