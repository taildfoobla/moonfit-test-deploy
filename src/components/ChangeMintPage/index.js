import "./styles.less"
import React, {useState} from "react"
import {Dropdown, message as AntdMessage} from "antd"
import MoonbeamIcon from "../../assets/images/lucky-wheel/wheel/glmr-wheel.png"
import AstarIcon from "../../assets/images/lucky-wheel/wheel/astar-wheel.png"
import FreeMintIcon from "../../assets/images/free-mint/free-mint-icon.png"
import CaretDownIcon from "../../assets/images/caret-down.png"
import {useGlobalContext} from "../../core/contexts/global"
import {NavLink} from "react-router-dom"
import {useNavigate} from "react-router-dom"
import {useLocation} from "react-router-dom"
import {useAuth} from "../../core/contexts/auth"

export default function ChangeMintPage({isMobile = false, trigger, title, url, onCloseMobileMenu}) {
    const navigate = useNavigate()
    const location = useLocation()
    const {selectedNetwork, changeSelectedNetwork} = useGlobalContext()
    const {isLoginSocial} = useAuth()
    const handleSelectNetwork = (network) => {
        if (isLoginSocial) {
            changeSelectedNetwork(network)
            navigate("/mint")
            isMobile && onCloseMobileMenu()
        } else {
            return AntdMessage.error({
                key: "err",
                content: "Please login social first",
                className: "message-error",
                duration: 5,
            })
        }
    }

    const renderItems = (title) => {
        if (title === "Explore") {
            return [
                {
                    label: (
                        <div
                            className={`network-menu-item ${location.pathname.includes("explore") ? "active" : ""}`}
                            onClick={() => {
                                onCloseMobileMenu()
                                navigate("/explore")
                            }}
                        >
                            {/* <img src={MoonbeamIcon} alt="" /> */}
                            <span>All Campaigns</span>
                        </div>
                    ),
                    key: "0",
                },
                {
                    label: (
                        <div
                            className={`network-menu-item`}
                            onClick={() => {
                                return AntdMessage.error({
                                    key: "err",
                                    content: "Comming Soon",
                                    className: "message-error",
                                    duration: 5,
                                })
                            }}
                        >
                            {/* <img src={AstarIcon} alt="" /> */}
                            <span className="comming-soon">Social Feed (Comming Soon)
                            {/* <span className="small-text">Comming Soon</span> */}
                            </span>
                        </div>
                    ),
                    key: "1",
                },
            ]
        } else if (title === "Mint NFT") {
            return [
                {
                    label: (
                        <div
                            className={`network-menu-item ${location.pathname.includes("mint")&&selectedNetwork === "moonbeam" ? "active" : ""}`}
                            onClick={() => {
                                handleSelectNetwork("moonbeam")
                            }}
                        >
                            {/* <img src={MoonbeamIcon} alt="" /> */}
                            <span>Mint with GLMR</span>
                        </div>
                    ),
                    key: "0",
                },
                {
                    label: (
                        <div
                            className={`network-menu-item ${location.pathname.includes("mint")&&selectedNetwork === "astar" ? "active" : ""}`}
                            onClick={() => {
                                handleSelectNetwork("astar")
                            }}
                        >
                            {/* <img src={AstarIcon} alt="" /> */}
                            <span>Mint with ASTR</span>
                        </div>
                    ),
                    key: "1",
                },
                {
                    label: (
                        <div
                            className={`network-menu-item ${location.pathname.includes("mint")&&selectedNetwork === "free" ? "active" : ""}`}
                            onClick={() => {
                                handleSelectNetwork("free")
                            }}
                        >
                            {/* <img src={FreeMintIcon} alt="" /> */}
                            <span>Free Minting Campaign</span>
                        </div>
                    ),
                    key: "2",
                },
            ]
        }
    }

    const renderPathName = (title)=>{
        if(title==="Mint NFT"){
            return "mint"
        }else if (title==="Explore"){
            return "explore"
        }
    }


    const items = renderItems(title)

    return (
        <Dropdown menu={{items}} trigger={[trigger]} overlayClassName={`network-menu ${title==="Explore"?"explore":""}`}>
            <p className={`mint-header ${location.pathname.includes(renderPathName(title)) ? "active" : ""}`}>{title}</p>
        </Dropdown>
    )
}

