import {Button} from "antd"
import React from "react"
import Icon from "@ant-design/icons"
import "./styles.less"
import rewardTitle from "../../../assets/images/summer/task-reward-title.png"
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
        const url = "https://forms.gle/FrqDr6j9HcwWumtV7"
        window.open(url, "_blank")
    }

    return (
        <div className="task-reward">
            <div className="reward-title">
                <img src={rewardTitle} alt="" />
            </div>
            <img className="reward-image" src={reward?.image_url} alt="" />
            <h3
                className={
                    reward?.detail && reward?.detail.includes("tmfg") ? "text-green-glow-thin" : `text-pink-glow-thin`
                }
            >
                {reward?.detail}
            </h3>
            {reward?.type === "token" || reward?.type === "ticket" ? (
                <div className="button-container">
                    <Button className="button button-secondary" onClick={onClick}>
                        Check your in-app wallet now
                    </Button>
                </div>
            ) : (
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
                    <Button className="button button-secondary" onClick={onOpenLink}>
                        Fill your info here
                    </Button>
                </div>
            )}
        </div>
    )
}

export default RewardModal
