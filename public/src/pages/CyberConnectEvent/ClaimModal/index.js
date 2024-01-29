import {Button} from "antd"
import React from "react"
import Icon from "@ant-design/icons"
import "./styles.less"
import rewardTitle from "../../../assets/images/summer/task-reward-title.png"
import rewardBg from "../../../assets/images/lunar/claim-bg.png"
import rewardImg from "../../../assets/images/lunar/claim-reward.png"
import Paragraph from "antd/lib/typography/Paragraph"
import {getShortAddress} from "../../../core/utils/helpers/blockchain"

const CopySvg = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M13.125 13.125H16.875V3.125H6.875V6.875"
            stroke="#020722"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M13.125 6.875H3.125V16.875H13.125V6.875Z"
            stroke="#020722"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
)

const CopyIcon = (props) => <Icon component={CopySvg} {...props} />

const claimDouble = ()=>{
    window.open("https://app.fidi.tech/giveaway/moonfit112023")
}

const ClaimModal = (props) => {
    const {reward, toggle, onClaimTask, type_reward, index} = props
    const onOpenLink = () => {
        const url = "https://forms.gle/FrqDr6j9HcwWumtV7"
        window.open(url, "_blank")
    }

    return (
        <div className="claim-reward">
            {/* <div className="claim-bg">
                <img src={rewardBg}/>
            </div> */}
            <div className="claim-title">
                {/* <img src={rewardTitle} alt="" /> */}
                <p>Claim your POAP "LGF MoonFit NFT" to receive x2 daily reward boost now!</p>
            </div>
            {/* <img className="reward-image" src={reward?.image_url} alt="" /> */}
            <img className="claim-image" src={rewardImg} />
            {/* <p
                className={`claim-text ${
                    reward?.detail && reward?.detail.includes("tmfg") ? "text-green-glow-thin" : `text-pink-glow-thin`
                }`}
            >
                {reward?.detail}10 MFR
            </p> */}

            <div className="button-container">
                <Button
                    className="button button-secondary"
                    onClick={() => {
                        onClaimTask(type_reward, index)
                        toggle()
                    }}
                >
                    Claim Now
                </Button>
                <Button onClick={()=>{
                    claimDouble()
                }} className="button button-secondary green">Claim POAP NFT to get x2 rewards</Button>
            </div>
        </div>
    )
}

export default ClaimModal

