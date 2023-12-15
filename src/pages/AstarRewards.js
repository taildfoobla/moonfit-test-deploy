import React from "react";
import BannerBg from "../assets/images/astar-rewards/stake-banner-bg.png";
import BenefitBg from "../assets/images/astar-rewards/stake-benefit-bg.png";

export default function AstarRewards() {
  return (
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
              <button className="go-to-stake">Stake</button>
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
                  73,932.99 <span className="stake-banner-item-unit">ASTR</span>
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
                  <p className="stake-banner-item-header">Estimated Rewards </p>
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
                      exclusive perks: $MFG tokens, NFTs, in-app reward boosts,
                      badges,…
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="astar-page-section-2">
        <h3 className="astar-page-section-2-header">
          How to stake for MoonFit at Astar Dapp Staking?
        </h3>
      </div>
    </div>
  );
}
