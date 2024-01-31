import "./styles.less"
import React, {useState} from "react"
import {Dropdown} from "antd"
import MoonbeamIcon from "../../assets/images/lucky-wheel/wheel/glmr-wheel.png"
import AstarIcon from "../../assets/images/lucky-wheel/wheel/astar-wheel.png"
import FreeMintIcon from "../../assets/images/free-mint/free-mint-icon.png"
import CaretDownIcon from "../../assets/images/caret-down.png"
import { useGlobalContext } from "../../core/contexts/global"

export default function ChangeMintNetwork() {
    const {selectedNetwork,changeSelectedNetwork}= useGlobalContext()


    const handleSelectNetwork = (network) => {
        changeSelectedNetwork(network)
    }

    const renderNetwork = (network) => {
        let networkName = ""
        let networkIcon = ""
        switch (network) {
            case "moonbeam":
                networkName = "Moonbeam Network"
                networkIcon = MoonbeamIcon
                break
            case "astar":
                networkName = "Astar"
                networkIcon = AstarIcon
                break
            // case "free":
            //     networkName="Free Mint"
            //     networkIcon=FreeMintIcon
            //     break
            default:
                networkName = "Moonbeam Network"
                networkIcon = MoonbeamIcon
                break
        }
        return (
            <div className="network-name">
                <img src={networkIcon} alt={networkName} />
                <span>{networkName}</span>
                <img src={CaretDownIcon} alt=""/>
            </div>
        )
    }

    const items = [
        {label: <h3 className="network-menu-header">Select a network</h3>, key: "-1"},
        {
            type: "divider",
        },
        {
            label: (
                <div
                    className={`network-menu-item ${selectedNetwork === "moonbeam" ? "active" : ""}`}
                    onClick={() => {
                        handleSelectNetwork("moonbeam")
                    }}
                >
                    <img src={MoonbeamIcon} alt="" />
                    <span>Moonbeam Network</span>
                </div>
            ),
            key: "0",
        },
        {
            label: (
                <div className={`network-menu-item ${selectedNetwork === "astar" ? "active" : ""}`}   onClick={() => {
                    handleSelectNetwork("astar")
                }}>
                    <img src={AstarIcon} alt="" />
                    <span>Astar</span>
                </div>
            ),
            key: "1",
        },
        // {
        //     label: (
        //         <div className={`network-menu-item ${selectedNetwork === "free" ? "active" : ""}`}   onClick={() => {
        //             handleSelectNetwork("free")
        //         }}>
        //             <img src={FreeMintIcon} alt="" />
        //             <span>Free Mint</span>
        //         </div>
        //     ),
        //     key: "2",
        // },
    ]

    return (
        <Dropdown menu={{items}} trigger={["click"]} overlayClassName="network-menu">
            {renderNetwork(selectedNetwork)}
        </Dropdown>
    )
}

