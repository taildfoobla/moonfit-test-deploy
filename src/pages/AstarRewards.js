import React, { useContext, useEffect, useState } from "react";
import BannerBg from "../assets/images/astar-rewards/stake-banner-bg.png";
import BenefitBg from "../assets/images/astar-rewards/stake-benefit-bg.png";
import CheckPurple from "../assets/images/astar-rewards/check-purple.png";
import { Accordion } from "flowbite-react";
import AstarFooterBg from "../assets/images/astar-rewards/astar-footer-bg.png";
import AstarFooterImg from "../assets/images/astar-rewards/astar-footer-img.png";
import AstarBg1 from "../assets/images/astar-rewards/astar-bg-1.png";
import AstarBg2 from "../assets/images/astar-rewards/astar-bg-2.png";
import ClaimRewardsModal from "../components/AstarRewards/ClaimRewardsModal";
import AstarBgMobile1 from "../assets/images/astar-rewards/astar-bg-mobile-1.png";
import BannerBgMobile from "../assets/images/astar-rewards/stake-info-bg-mobile.png";
import AstarFooterImgMobile from "../assets/images/astar-rewards/astar-footer-img-mobile.png";
import AstarFooterBgMobile from "../assets/images/astar-rewards/astar-footer-bg-mobile.png";
import { getShortAddress } from "../utils/blockchain";
// import AnimatedNumbers from "react-animated-numbers";
import NotConnectBg from "../assets/images/astar-rewards/not-connect-bg.png";
import WalletAuthContext from "../contexts/WalletAuthContext";
import {
  getMoonFitTotalStakeAPI,
  getStakeInfoAPI,
} from "../services/astar-rewards";
import InfoIcon from "../assets/images/astar-rewards/Info-color-white.png";
import { Tooltip } from "antd";
import LoadingOutlined from "../components/shared/LoadingOutlined";
import { LOCALSTORAGE_KEY, getLocalStorage } from "../utils/storage";

export default function AstarRewards() {
  const [isFetchingNoWallet, setIsFetchingNoWallet] = useState(true);
  const [isFetchingHaveWallet, setIsFetchingHaveWallet] = useState(true);
  const [isOpenClaimRewardsModal, setIsOpenClaimRewardsModal] = useState(false);
  const [substrateWallet, setSubstrateWallet] = useState([]);
  const [moonfitTotalStake, setMoonfitTotalStake] = useState(0);
  const [totalStake, setTotalStake] = useState(0);
  const [claimable, setClaimable] = useState(0);
  const [nextTime, setNextTime] = useState("31/12/2023");
  const [rewardList, setRewardList] = useState([]);

  const {
    isConnected,
    showWalletSelectModal,
    signatureData,
    provider,
    connector,
  } = useContext(WalletAuthContext);

  //useEffect for first time
  useEffect(() => {
    // let number = parseFloat(moonfitTotalStake.replace(/,/g, ""));
    // let newNumber = Number(moonfitTotalStake);
    // const interval = setInterval(() => {
    //   if (newNumber <= 100) {
    //     clearInterval(interval);
    //   } else {
    //     console.log("This will run every second!");
    //     newNumber = newNumber - 100;
    //     setMoonfitTotalStake(newNumber);
    //   }
    // }, 10000);
    // return () => clearInterval(interval);
  }, []);
  const fakeData = {
    message: "MoonFit:0xaC26C8296D823561EB2C9fb8167D8936761694B0:1703144154494",
    signature:
      "0x10109db033037a541b0f257dc25361daa58edbaefdaa741d5280554d2bbd504f1363e20fa473bb3f5f0f1582d07e4f06760ef87096dfd84cfb7d43bb502f3b801b",
    wallet_address: "0x1fc37012c190526b92a991398829abc8134a6694",
  };
  // useEffect for getting Stake data
  useEffect(() => {
    const signatureDataLocal = JSON.parse(
      getLocalStorage(LOCALSTORAGE_KEY.WALLET_SIGNATURE)
    );

    if (signatureDataLocal !== null) {
      const testWallet = getLocalStorage("TEST_WALLET");
      getStakeInfo({
        ...signatureDataLocal.signature,
        wallet_address: testWallet,
      });
      console.log("here1");

      // getStakeInfo(fakeData);
    } else {
      console.log("here2");

      getMoonFitTotalStake();
    }
  }, []);

  // useEffect to call data after login

  useEffect(() => {
    if (signatureData && moonfitTotalStake !== 0) {
      getStakeInfo(signatureData);
    }
  }, [signatureData]);

  // useEffect for open rewards modal
  useEffect(() => {
    if (isOpenClaimRewardsModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpenClaimRewardsModal]);

  // function to format number
  function formatNumber(number) {
    const formattedNumber = (+number).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    if (number == Number(formattedNumber)) {
      return number;
    } else {
      return formattedNumber;
    }
  }

  //function to get stake data if didn't connect wallet
  const getMoonFitTotalStake = async () => {
    const res = await getMoonFitTotalStakeAPI();
    const { data, success } = res;
    if (success) {
      if (data?.message === "Get Staking Info successfully") {
        const numb = data?.data?.moonfit_info?.total_stake;
        setMoonfitTotalStake(numb);
        setIsFetchingNoWallet(false);
      } else {
        getMoonFitTotalStake();
      }
    } else {
      setMoonfitTotalStake(0);
    }
  };

  // function to get Stake data
  const getStakeInfo = async (signatureData) => {
    const res = await getStakeInfoAPI(signatureData);
    const { data, success } = res;
    if (success) {
      if (data?.message === "Get Staking Info successfully") {
        setMoonfitTotalStake(data?.data?.moonfit_info?.total_stake);
        setTotalStake(data?.data?.user_info?.total_stake);
        let newClaimable = 0;
        data?.data?.user_info?.rounds.forEach((round) => {
          if (round.status === "created") newClaimable += round.total_value;
        });
        setClaimable(newClaimable);
        setRewardList(data?.data?.user_info?.rounds);
        const substrateWalletList =
          data?.data?.user_info?.substrate_address.map((wallet) => wallet);
        setSubstrateWallet(substrateWalletList);
        setIsFetchingHaveWallet(false);
        setIsFetchingNoWallet(false);
      } else {
        getStakeInfo();
      }
    }
  };

  // function to reCall data
  const reCallData = async (signatureData) => {
    const res = await getStakeInfoAPI(signatureData);
    const { data, success } = res;
    if (success) {
      if (data?.message === "Get Staking Info successfully") {
        // setMoonfitTotalStake(
        //   data?.data?.moonfit_info?.total_stake
        // );
        // setTotalStake(data?.data?.user_info?.total_stake);
        // let newClaimable = 0;
        // data?.data?.user_info?.rounds.forEach((round) => {
        //   console.log(round.total_value);
        //   newClaimable += round.total_value;
        // });
        // setClaimable(newClaimable);
        const rounds = data?.data?.user_info?.round;
        let pendingArr = [];
        rounds?.forEach((item) => {
          if (item.status === "pending") {
            pendingArr.push(item.round);
          }
        });
        if (pendingArr.length > 0) {
          reCallData(signatureData);
        }
        setRewardList(data?.data?.user_info?.rounds);
        // const substrateWalletList =
        //   data?.data?.user_info?.substrate_address.map((wallet) => wallet);
        // setSubstrateWallet(substrateWalletList);
        // setIsFetchingHaveWallet(false);
        // setIsFetchingNoWallet(false);
      } else {
        getStakeInfo();
      }
    }
  };

  const changeInfoAfterCheck = (total, claimable) => {
    setTotalStake(total);
    setClaimable(claimable);
  };

  const openNewTab = (url) => {
    window.open(url);
  };

  const handleOpenClaimRewardsModal = () => {
    if (rewardList?.length > 0) {
      setIsOpenClaimRewardsModal(true);
    }
  };

  const handleCloseClaimRewardsModal = () => {
    setIsOpenClaimRewardsModal(false);
  };



  // value to display subtratewallet
  const isDisplayedSubstrateWallet = substrateWallet?.length > 0;

  // value to display text of subtratewallet
  const isOnlyOneWalllet = substrateWallet?.length < 2;

  return (
    <>
      <ClaimRewardsModal
        isOpen={isOpenClaimRewardsModal}
        onClose={handleCloseClaimRewardsModal}
        rewardList={rewardList}
        signatureData={signatureData}
        provider={provider}
        connector={connector}
        reCallData={reCallData}
        setRewardInfo={changeInfoAfterCheck}
        setIsFetchingHaveWallet={setIsFetchingHaveWallet}
      />
      {/* <ClaimRewardsModalMobile
       isOpen={isOpenClaimRewardsModal}
       onClose={handleCloseClaimRewardsModal}
      /> */}
      <div className="astar-page-container-wrapper">
        <div className="astar-page-bg-1">
          <img src={AstarBg1} alt="" />
          <img src={AstarBgMobile1} alt="" />
        </div>
        <div className="astar-page-container">
          <div className="astar-page-header">
            <p className="first" onClick={()=>{
              openNewTab("https://twitter.com/intent/tweet?url=https%3A%2F%2Fmoonfit-token-sale.web.app%2F&text=MoonFit&hashtags=MoonFit")
            }}>Astar Dapp Staking</p>
            <p className="second">MoonFit Dashboard</p>
          </div>
          <div className="astar-page-section-1">
            <div
              className={`astar-page-section-1-left ${
                isConnected ? "" : "not-connect"
              }`}
            >
              <div className="wallet-info">
                <h3 className="wallet-info-header">My ASTR Staking</h3>
                {isConnected && (
                  <div className="wallet-list">
                    <div className="wallet-item">
                      <span>EVM Wallet:</span>
                      <span
                        className="wallet-address"
                        onClick={() => {
                          openNewTab(
                            `https://astar.subscan.io/account/${signatureData?.wallet_address}`
                          );
                        }}
                      >
                        {getShortAddress(signatureData?.wallet_address, 6)}
                      </span>
                    </div>
                    {isDisplayedSubstrateWallet && (
                      <div className="wallet-item">
                        <div className="wallet-item-text">
                          {isOnlyOneWalllet ? (
                            <span>Substrate Wallet:</span>
                          ) : (
                            <>
                              {substrateWallet.map((wallet, index) => (
                                <span key={index}>
                                  Substrate Wallet {index + 1}:
                                </span>
                              ))}
                            </>
                          )}
                        </div>
                        <div className="sub-wallet-list">
                          {substrateWallet.map((wallet, index) => (
                            <span
                              key={index}
                              className="wallet-address"
                              onClick={() => {
                                openNewTab(
                                  `https://astar.subscan.io/account/${wallet}`
                                );
                              }}
                            >
                              {getShortAddress(wallet, 6)}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="stake-info-wrapper">
                <div
                  className={`stake-info ${isConnected ? "" : "not-connect"}`}
                >
                  <div className="total-stake">
                    <p className="total-stake-header">Total Staked</p>
                    {isFetchingHaveWallet && isConnected ? (
                      <LoadingOutlined />
                    ) : (
                      <p className="total-stake-number">
                        {isConnected ? formatNumber(totalStake) : "--"}
                        {isConnected && (
                          <span className="total-stake-unit">ASTR</span>
                        )}
                      </p>
                    )}
                  </div>
                  <div className="claimable-rewards">
                    <p className="claimable-rewards-header">
                      Claimable Rewards
                    </p>
                    <div className="claimable-rewards-content">
                      {isFetchingHaveWallet && isConnected ? (
                        <LoadingOutlined />
                      ) : (
                        <p className="claimable-rewards-number">
                          {isConnected ? formatNumber(claimable) : "--"}
                          {isConnected && (
                            <span className="claimable-rewards-unit">ASTR</span>
                          )}
                        </p>
                      )}

                      {isConnected && (
                        <button
                          className={`claimable-rewards-button ${
                            rewardList?.length < 1 ? "disabled" : ""
                          }`}
                          onClick={handleOpenClaimRewardsModal}
                        >
                          Claim
                        </button>
                      )}
                    </div>
                  </div>
                  {isConnected ? (
                    <button
                      className="go-to-stake"
                      onClick={() => {
                        openNewTab(
                          "https://portal.astar.network/astar/dapp-staking/dapp?dapp=0xe785a37c9d5f3377cbb5b8bf7e9db03ddd440449"
                        );
                      }}
                    >
                      Stake
                    </button>
                  ) : (
                    <button
                      className="go-to-stake"
                      onClick={showWalletSelectModal}
                    >
                      Connect Wallet
                    </button>
                  )}

                  <div className="not-connect-bg">
                    <img src={NotConnectBg} alt="" />
                  </div>
                </div>
              </div>
            </div>
            <div className="astar-page-section-1-right">
              <div className="stake-benefit-img">
                <img src={BannerBgMobile} alt="" />
              </div>
              <div className="stake-info">
                <div className="stake-info-banner">
                  <div className="stake-banner-item first">
                    <p className="stake-banner-item-header">
                      MoonFit's Total Staked
                    </p>
                    {isFetchingNoWallet ? (
                      <div
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          height: "52px",
                          lineHeight: "52px",
                          marginBottom: "24px",
                        }}
                      >
                        <LoadingOutlined />
                      </div>
                    ) : (
                      <p className="stake-banner-item-number">
                        {formatNumber(moonfitTotalStake)}{" "}
                        {/* <AnimatedNumbers
  includeComma={true}
  transitions={(index) => ({
    // type: "spring",
    duration: index + 0.00001,
  })}
  locale="en-US"
  animateToNumber={moonfitTotalStake}
  fontStyle={{
    textAlign: "center",
    fontFamily: "Poppins",
    fontSize: "40px",
    fontWeight: "700",
    background:
      " linear-gradient( 110deg,  #95008e 0%, #3d94fa 22%, #04d8ff 80.31%)",

    color: "transparent",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    lineHeight: "52px",
  }}
/> */}
                        <span className="stake-banner-item-unit">ASTR</span>
                      </p>
                    )}

                    <p className="stake-banner-item-next">
                      Next Reward Distribution:{" "}
                      <span className="stake-banner-item-next-time">
                        {nextTime}
                      </span>
                    </p>
                  </div>
                  <div className="stake-banner-item second">
                    <div className="stake-banner-item-bg">
                      <img src={BannerBg} alt="" />
                    </div>
                    <div className="stake-banner-item-content">
                      <p className="stake-banner-item-header">
                        Estimated Rewards{" "}
                      </p>
                      <div className="stake-banner-item-number">
                        ~11.2%
                        <Tooltip
                          // trigger="click"
                          color="#a16bd8"
                          overlayClassName="banner-tooltip"
                          title="Boosted APY: Astar Network's base APY plus Bonus Staking Rewards from MoonFit"
                        >
                          <img src={InfoIcon} alt="tooltips" />
                        </Tooltip>
                      </div>
                      <p className="stake-banner-item-next">Boosted APY</p>
                    </div>
                  </div>
                </div>
                <div className="stake-benefit">
                  <div className="stake-benefit-bg">
                    <img src={BenefitBg} alt="" />
                  </div>

                  <div className="stake-benefit-content">
                    <p className="stake-benefit-header">
                      Why stake ASTR with MoonFit dApp Staking?
                    </p>
                    <ul className="stake-benefit-list">
                      <li className="stake-benefit-item">
                        <div className="stake-benefit-item-index-wrapper">
                          <p className="stake-benefit-item-index">1</p>
                          <div className="border-index"></div>
                        </div>
                        <p className="stake-benefit-item-content">
                          <span className="change-color-1">
                            Get 1 free MoonFit NFT Minting{" "}
                          </span>
                          by staking <br />
                          <span className="change-color-2">7000 ASTR</span>
                        </p>
                      </li>
                      <li className="stake-benefit-item">
                        <div className="stake-benefit-item-index-wrapper">
                          <p className="stake-benefit-item-index">2</p>
                          <div className="border-index"></div>
                        </div>
                        <p className="stake-benefit-item-content">
                          <span className="change-color-1">Get 20%</span>{" "}
                          monthly sharing of{" "}
                          <span className="change-color-1">
                            MoonFit ASTR Staking Rewards
                          </span>
                        </p>
                      </li>
                      <li className="stake-benefit-item">
                        <div className="stake-benefit-item-index-wrapper">
                          <p className="stake-benefit-item-index">3</p>
                          <div className="border-index"></div>
                        </div>
                        <p className="stake-benefit-item-content">
                          <span className="change-color-1">Receive</span> future
                          exclusive perks: $MFG tokens, NFTs, in-app reward
                          boosts, badges,…
                        </p>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="astar-page-section-2-wrapper">
          <div className="astar-page-section-2-bg">
            <img src={AstarBg2} alt="" />
          </div>
          <div className="astar-page-container">
            <div className="astar-page-section-2">
              <h3 className="astar-page-section-2-header">
                How to stake for MoonFit at Astar Dapp Staking?
              </h3>
              <div className="astar-guide-list">
                <div className="astar-guide-item step-1">
                  <div className="astar-guide-item-header">step 01</div>
                  <p className="astar-guide-item-content">
                    Click on button “Stake” above to visit the{" "}
                    <span
                      className="change-color change-underline"
                      onClick={() => {
                        openNewTab(
                          "https://portal.astar.network/astar/dapp-staking/dapp?dapp=0xe785a37c9d5f3377cbb5b8bf7e9db03ddd440449"
                        );
                      }}
                    >
                      Astar portal
                    </span>{" "}
                    and then connect your wallet{" "}
                    <span className="change-color">
                      (EVM or Substrate wallet)
                    </span>
                  </p>
                </div>
                <div className="astar-guide-item step-2">
                  <div className="astar-guide-item-header">step 02</div>
                  <p className="astar-guide-item-content">
                    Go to the Staking page, place the amount you want to stake,
                    and confirm
                    <span className="change-small-text">
                      *Leave 1–2 SDN/2–5 ASTR as a transferrable balance in your
                      wallet since it is needed for gas to manage the claiming
                      and re-staking transactions.
                    </span>
                  </p>
                </div>
                <div className="astar-guide-item step-3">
                  <div className="astar-guide-item-header">step 03</div>
                  <p className="astar-guide-item-content">
                    <span className="change-color-1">Done!</span> Come back to
                    claim your rewards.
                  </p>
                </div>
              </div>
              <div className="astar-guide-note-wrapper">
                <div className="astar-guide-note">
                  <h4 className="astar-guide-note-header">Note:</h4>
                  <div className="astar-guide-note-list">
                    <div className="astar-guide-note-item">
                      <span className="astar-guide-note-item-icon">
                        <img src={CheckPurple} alt="" />
                      </span>
                      <p className="astar-guide-note-item-content">
                        If you stake with your Substrate wallet, please link it
                        to your EVM wallet through{" "}
                        <span
                          className="change-color change-underline"
                          onClick={() => {
                            openNewTab(
                              "https://astarpass.astar.network/#/register"
                            );
                          }}
                        >
                          AstarPass
                        </span>
                      </p>
                    </div>
                    <div className="astar-guide-note-item">
                      <span className="astar-guide-note-item-icon">
                        <img src={CheckPurple} alt="" />
                      </span>
                      <p className="astar-guide-note-item-content">
                        If you stake with any hardware wallet, please reach out
                        to our team on{" "}
                        <span
                          className="change-color-2 change-underline"
                          onClick={() => {
                            openNewTab("https://discord.com/invite/hStdUVtHXp");
                          }}
                        >
                          Discord
                        </span>{" "}
                        and{" "}
                        <span
                          className="change-color-2 change-underline"
                          onClick={() => {
                            openNewTab("https://t.me/moonfit_official/");
                          }}
                        >
                          Telegram
                        </span>{" "}
                        to get quick support.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="tutorial">
                  <h4 className="tutorial-header">Still confused?</h4>
                  <p className="tutorial-content">
                    Here’s our{" "}
                    <span
                      className="change-color-3 change-underline"
                      onClick={() => {
                        openNewTab(
                          "https://youtu.be/R42Z9fzv8oA?feature=shared"
                        );
                      }}
                    >
                      Tutorial Video
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="astar-page-footer-wrapper">
          <div className="astar-page-footer-bg">
            <img src={AstarFooterBg} alt="" />
            <img src={AstarFooterBgMobile} alt="" />
          </div>
          <div className="astar-page-footer-img">
            <img src={AstarFooterImg} alt="" />
          </div>
          <div className="astar-page-footer">
            <div className="astar-page-footer-left">
              <h4 className="">Frequently asked questions</h4>
              <img src={AstarFooterImgMobile} alt="" />
            </div>
            <div className="astar-page-footer-right">
              <Accordion>
                <Accordion.Panel>
                  <Accordion.Title>What is Astar Network?</Accordion.Title>
                  <Accordion.Content>
                    <p className="qa-content">
                      Astar Network is a decentralized blockchain platform for
                      Web3 innovations. It supports both EVM and WebAssembly
                      environments, allowing for interoperability between them.
                      It runs in conjunction with Ethereum, Polkadot, and
                      Cosmos, enabling the free flow of assets and
                      communications between different ecosystems.
                    </p>
                  </Accordion.Content>
                </Accordion.Panel>
              </Accordion>
              <Accordion>
                <Accordion.Panel>
                  <Accordion.Title>
                    What is MoonFit x Astar Network integration?
                  </Accordion.Title>
                  <Accordion.Content>
                    <p className="qa-content">
                      MoonFit x Astar Network Integration marked our very first
                      cross-chain activities. This is not only a milestone for
                      NFT integration between Moonbeam and Astar but also a step
                      towards enabling NFT Dapps on Polkadot to work seamlessly
                      across parachains.
                    </p>
                  </Accordion.Content>
                </Accordion.Panel>
              </Accordion>
              <Accordion>
                <Accordion.Panel>
                  <Accordion.Title>
                    Why should you stake for MoonFit at Astar Dapp Staking?
                  </Accordion.Title>
                  <Accordion.Content>
                    <div className="info-list">
                      <div className="info-item">
                        <div className="icon">
                          <img src={CheckPurple} alt="" />
                        </div>
                        <div className="info-content">
                          <p className="qa-content">
                            <span className="change-color-white change-font-weight-600">
                              Exclusive NFT Reward:
                            </span>{" "}
                            Stake 7000 ASTR and claim a Free Mint MoonBeast NFT!
                            This exclusive offer is limited to one free mint per
                            user.
                          </p>
                        </div>
                      </div>
                      <div className="info-item">
                        <div className="icon">
                          <img src={CheckPurple} alt="" />
                        </div>
                        <div className="info-content">
                          <p className="qa-content">
                            <span className="change-color-white change-font-weight-600">
                              Attractive APY:
                            </span>{" "}
                            Stake any amount of ASTR to receive a monthly 20%
                            share of MoonFit Astar Dapp Staking rewards, enjoy
                            an impressive APY of approximately 11.2%.
                          </p>
                        </div>
                      </div>
                      <div className="info-item">
                        <div className="icon">
                          <img src={CheckPurple} alt="" />
                        </div>
                        <div className="info-content">
                          <p className="qa-content">
                            <span className="change-color-white change-font-weight-600">
                              Exclusive Perks:
                            </span>{" "}
                            Unlock a world of exclusive benefits, including
                            extra tokens, NFTs, in-app reward boosts, badges,
                            and promising future advantages.
                          </p>
                        </div>
                      </div>
                    </div>
                  </Accordion.Content>
                </Accordion.Panel>
              </Accordion>
              <Accordion>
                <Accordion.Panel>
                  <Accordion.Title className="a">
                    When will rewards be distributed?
                  </Accordion.Title>
                  <Accordion.Content>
                    <p className="qa-content">
                      ASTR rewards earned through staking for MoonFit at Astar
                      Dapp Staking will be distributed on a monthly basis. Stay
                      informed by following MoonFit's official social channels
                      to receive timely updates on the official reward
                      distribution announcements. Your commitment to staking
                      with us is valued, and we aim to ensure a transparent and
                      seamless distribution process for your earned rewards.
                    </p>
                  </Accordion.Content>
                </Accordion.Panel>
              </Accordion>
              <Accordion>
                <Accordion.Panel>
                  <Accordion.Title className="a">
                    How to claim your staking rewards from MoonFit?{" "}
                  </Accordion.Title>
                  <Accordion.Content>
                    <p className="qa-content">
                      To claim your staking rewards from MoonFit at Astar Dapp
                      Staking, simply return to this platform and connect your
                      wallet. Once connected, you'll have access to detailed
                      information, including your staking amount and the ASTR
                      rewards slated for the upcoming distribution round. We've
                      designed the process to be user-friendly, ensuring a
                      seamless experience as you reap the benefits of your
                      staking commitment.
                    </p>
                  </Accordion.Content>
                </Accordion.Panel>
              </Accordion>
              <Accordion>
                <Accordion.Panel>
                  <Accordion.Title className="a">
                    Where can I learn more about Astar Dapp Staking?{" "}
                  </Accordion.Title>
                  <Accordion.Content>
                    <p className="qa-content">
                      For in-depth insights into Astar Dapp Staking, explore the
                      official{" "}
                      <span
                        className="change-color change-underline"
                        onClick={() => {
                          openNewTab(
                            "https://docs.astar.network/docs/build/dapp-staking/"
                          );
                        }}
                      >
                        Astar Documentation
                      </span>
                    </p>
                    <p className="qa-content">
                      For step-by-step guidance on staking with MoonFit, you can
                      check our{" "}
                      <span
                        className="change-color change-underline"
                        onClick={() => {
                          openNewTab(
                            "https://medium.com/@moonfit/free-min-moonfit-nft-moonfit-dapp-staking-officially-launches-on-the-astar-network-fdf5131d9a44"
                          );
                        }}
                      >
                        Medium Article
                      </span>
                    </p>
                  </Accordion.Content>
                </Accordion.Panel>
              </Accordion>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
