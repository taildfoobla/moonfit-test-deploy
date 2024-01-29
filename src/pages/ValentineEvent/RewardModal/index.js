import {Button} from "antd"
import React from "react"
import Icon from "@ant-design/icons"
import "./styles.less"
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

const RewardModal = (props) => {
    const {user, reward} = props
    const onClick = () => props.toggle()

    const onOpenLink = () => {
        const url = "https://forms.gle/KRHeRabXLEXwaKLS7"
        window.open(url, "_blank")
    }

    const _getRewardValue = (type, value, imageUrl = "") => {
        let output = <img src={imageUrl} />
        switch (type) {
            case "MFR":
            case "MFG":
            case "GLMR":
                output = <h1 className="text-triple-gradient-3">{value}</h1>
                break
            case "Mug":
            case "T-shirt":
            case "Hoodie":
            case "Sticker":
                output = <img src={imageUrl} alt="" />
                break
            default: break
        }
        return output
    }

    return (
        <div className="task-reward">
            <h2>You win</h2>
            {_getRewardValue(reward?.type, reward?.value, reward?.image_url)}
            {/* <h1 className="text-triple-gradient-3">{10}</h1> */}
            {/* <img src="https://raffle-game-dev.s3.us-east-2.amazonaws.com/background_christmas_event/hoodie.png" /> */}
            <h3 className={reward?.type === "MFG" ? "text-green-glow-thin" : `text-pink-glow-thin`}>
                {["MFR", "MFG", "GLMR"].includes(reward?.type) ? `$${reward?.type}` : `01 ${reward?.type}`}
            </h3>
            {!["MFR", "MFG", "GLMR"].includes(reward?.type) && (
                <div className="button-container">
                    <Paragraph
                        className={"text-main text-center"}
                        copyable={{
                            text: user.account,
                            format: "text/plain",
                            icon: [<CopyIcon key="copy-icon" />, <CopyIcon key="copied-icon" />],
                        }}
                    >
                        {getShortAddress(user.account, 12)}
                    </Paragraph>
                    <Button type="primary" onClick={onOpenLink}>
                        CLAIM YOUR REWARD
                    </Button>
                </div>
            )}
            {["MFR", "MFG", "GLMR"].includes(reward?.type) && (
                <div className="button-container">
                    <Button type="primary" onClick={onClick}>
                        Check your in-app wallet now
                    </Button>
                </div>
            )}
        </div>
    )
}

export default RewardModal
