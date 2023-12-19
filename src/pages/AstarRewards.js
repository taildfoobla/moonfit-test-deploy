import React from "react";
import BannerBg from "../assets/images/astar-rewards/stake-banner-bg.png";
import BenefitBg from "../assets/images/astar-rewards/stake-benefit-bg.png";
import CheckPurple from "../assets/images/astar-rewards/check-purple.png";
import { Accordion } from "flowbite-react";
import AstarFooterBg from "../assets/images/astar-rewards/astar-footer-bg.png";
import AstarFooterImg from "../assets/images/astar-rewards/astar-footer-img.png";
import AstarBg1 from "../assets/images/astar-rewards/astar-bg-1.png";
import AstarBg2 from "../assets/images/astar-rewards/astar-bg-2.png";

export default function AstarRewards() {
  const openNewTab = (url) => {
    window.open(url);
  };

  return (
    <div className="astar-page-container-wrapper">
      <div className="astar-page-bg-1">
        <img src={AstarBg1} alt="" />
      </div>
      <div className="astar-page-container">
        <div className="astar-page-header">
          <p className="first">Astar Dapp Staking</p>
          <p className="second">MoonFit Dashboard</p>
        </div>
        <div className="astar-page-section-1">
          <div className="astar-page-section-1-left">
            <div className="wallet-info">
              <h3 className="wallet-info-header">My ASTR Staking</h3>
              <div className="wallet-list">
                <div className="wallet-item">
                  <span>EVM Wallet:</span>
                  <span className="wallet-address">0x9KO...2LX0M</span>
                </div>
                <div className="wallet-item">
                  <span>Substrate Wallet:</span>
                  <span className="wallet-address">0x9KO...2LX0M</span>
                </div>
              </div>
            </div>
            <div className="stake-info-wrapper">
              <div className="stake-info">
                <div className="total-stake">
                  <p className="total-stake-header">Total Staked</p>
                  <p className="total-stake-number">
                    50
                    <span className="total-stake-unit">ASTR</span>
                  </p>
                </div>
                <div className="claimable-rewards">
                  <p className="claimable-rewards-header">Claimable Rewards</p>
                  <div className="claimable-rewards-content">
                    <p className="claimable-rewards-number">
                      7,038<span className="claimable-rewards-unit">ASTR</span>
                    </p>
                    <button className="claimable-rewards-button">Claim</button>
                  </div>
                </div>
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
              </div>
            </div>
          </div>
          <div className="astar-page-section-1-right">
            <div className="stake-info">
              <div className="stake-info-banner">
                <div className="stake-banner-item first">
                  <p className="stake-banner-item-header">
                    MoonFit's Total Staked
                  </p>
                  <p className="stake-banner-item-number">
                    73,932.99{" "}
                    <span className="stake-banner-item-unit">ASTR</span>
                  </p>
                  <p className="stake-banner-item-next">
                    Next Reward Distribution:{" "}
                    <span className="stake-banner-item-next-time">
                      31/12/2023
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
                    <p className="stake-banner-item-number">~11.2%</p>
                    <p className="stake-banner-item-next">APY</p>
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
                        <span className="change-color-1">Get 20%</span> monthly
                        sharing of{" "}
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
                    wallet since it is needed for gas to manage the claiming and
                    re-staking transactions.
                  </span>
                </p>
              </div>
              <div className="astar-guide-item step-3">
                <div className="astar-guide-item-header">step 03</div>
                <p className="astar-guide-item-content">
                  <span className="change-color-1">Done!</span>
                  Come back to claim your rewards.
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
                      If you stake with your Substrate wallet, please link it to
                      your EVM wallet through{" "}
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
                      If you stake with any hardware wallet, please reach out to
                      our team on{" "}
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
                  <span className="change-color-3 change-underline" onClick={()=>{
                    openNewTab("https://www.youtube.com/watch?v=R42Z9fzv8oA")
                  }}>
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
        </div>
        <div className="astar-page-footer">
          <div className="astar-page-footer-left">
            <h4 className="">Frequently asked questions</h4>
            <div className="astar-page-footer-img">
              <img src={AstarFooterImg} alt="" />
            </div>
          </div>
          <div className="astar-page-footer-right">
            <Accordion>
              <Accordion.Panel>
                <Accordion.Title>What is Astar Network?</Accordion.Title>
                <Accordion.Content>
                  <p className="qa-content">
                    Astar Network is a decentralized blockchain platform for
                    Web3 innovations. It supports both EVM and WebAssembly
                    environments, allowing for interoperability between them. It
                    runs in conjunction with Ethereum, Polkadot, and Cosmos,
                    enabling the free flow of assets and communications between
                    different ecosystems.
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
                    cross-chain activities. This is not only a milestone for NFT
                    integration between Moonbeam and Astar but also a step
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
                          share of MoonFit Astar Dapp Staking rewards, enjoy an
                          impressive APY of approximately 11.2%.
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
                          Unlock a world of exclusive benefits, including extra
                          tokens, NFTs, in-app reward boosts, badges, and
                          promising future advantages.
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
                    informed by following MoonFit's official social channels to
                    receive timely updates on the official reward distribution
                    announcements. Your commitment to staking with us is valued,
                    and we aim to ensure a transparent and seamless distribution
                    process for your earned rewards.
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
                    seamless experience as you reap the benefits of your staking
                    commitment.
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
  );
}
