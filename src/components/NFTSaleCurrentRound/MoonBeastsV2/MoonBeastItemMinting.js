import React from 'react'
import { Tooltip } from "antd";
import socialIcon from "../../../assets/images/icons/social.svg";
import enduranceIcon from "../../../assets/images/icons/endurance.svg";
import luckIcon from "../../../assets/images/icons/luck.svg";
import speedIcon from "../../../assets/images/icons/speed.svg";
import RandomNumber from "./RandomNumber";

const MoonBeastItemMinting = ({ isMinting = false }) => {
    return (
        <div className="flex flex-col justify-center items-center mt-4 col-span-2 nft-item animate-pulse">
            <div
                className="flex justify-center items-center w-full aspect-square bg-gray-300 dark:bg-gray-700 nft-item-image"
                style={{ borderRadius: 5 }}>
                <svg className="w-12 h-12 text-gray-200 dark:text-gray-600" xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true" fill="currentColor" viewBox="0 0 640 512">
                    <path
                        d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" />
                </svg>
            </div>
            <div className="attributes">
                <div className="nft-attribute">
                    <Tooltip placement="top" title="Social">
                        <img src={socialIcon} alt="Social" />
                        {isMinting ? <RandomNumber className="attribute-value" /> : <span className="attribute-value">?</span>}
                    </Tooltip>
                </div>
                <div className="nft-attribute">
                    <Tooltip placement="top" title="Endurance">
                        <img src={enduranceIcon} alt="Endurance" />
                        {isMinting ? <RandomNumber className="attribute-value" /> : <span className="attribute-value">?</span>}
                    </Tooltip>
                </div>
                <div className="nft-attribute">
                    <Tooltip placement="top" title="Luck">
                        <img src={luckIcon} alt="Luck" />
                        {isMinting ? <RandomNumber className="attribute-value" /> : <span className="attribute-value">?</span>}
                    </Tooltip>
                </div>
                <div className="nft-attribute">
                    <Tooltip placement="top" title="Speed">
                        <img src={speedIcon} alt="Speed" />
                        {isMinting ? <RandomNumber className="attribute-value" /> : <span className="attribute-value">?</span>}
                    </Tooltip>
                </div>
            </div>
            <div className="flex flex-col normal-case race-sport-font text-sm mt-4">
                <span className="secondary-color text-center nft-gender bg-gray-200 rounded dark:bg-gray-700 w-20">
                    &nbsp;
                </span>
                <span className="primary-color text-center nft-number-name mt-1 text-center bg-gray-200 rounded dark:bg-gray-700 w-16">
                    &nbsp;
                </span>
            </div>
            <div className="flex normal-case mt-2">
                <span className="text-[#A16BD8] text-sm normal-case">................................</span>
            </div>
        </div>
    )
}

export default MoonBeastItemMinting
