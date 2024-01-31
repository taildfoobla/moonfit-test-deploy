import {Button} from "antd"
import React, { useEffect, useRef, useState } from "react"
import Icon from "@ant-design/icons"
import "./styles.less"
import rewardTitle from "../../../assets/images/summer/task-reward-title.png"
import rewardBg from "../../../assets/images/lunar/reward-bg.png"
import rewardImg from "../../../assets/images/lunar/reward-img.png"
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
    const [isCopy,setIsCopy] = useState(false)
    const onClick = () => props.toggle()

    const onOpenLink = () => {
        const url = "https://forms.gle/FrqDr6j9HcwWumtV7"
        window.open(url, "_blank")
    }

    useEffect(()=>{
        const timer = setTimeout(() => {
           
            setIsCopy(false)
          }, 2000); 
      
          return () => {
            clearTimeout(timer);
          };
    },[isCopy])

    const copyAddress=(text)=>{
   
        setIsCopy(true)
        navigator.clipboard.writeText(text)
          .then(() => {
            console.log('Text copied to clipboard:', text);
          })
          .catch((error) => {
            console.error('Failed to copy text:', error);
          });
    }

    return (
        <div className="task-reward">
            {/* <div className="task-bg">
                <img src={rewardBg} />
            </div> */}
            <div className="reward-title">
                {/* <img src={rewardTitle} alt="" /> */}
                <p>{reward?.rate > 1 ? "You win X2" : "You win"}</p>
            </div>
            <img className="reward-image" src={reward?.image_url} alt="" />
            {/* <img className="reward-image" src={rewardImg} /> */}
            <div
                className={`reward-text ${
                    reward?.detail && reward?.detail.includes("tmfg") ? "text-green-glow-thin" : `text-pink-glow-thin`
                }`}
            >
                {reward?.detail}
            </div>
            {reward?.type === "token" || reward?.type === "ticket" ? (
                <div className="button-container">
                    <Button className="button button-secondary" onClick={onClick}>
                        Check your in-app wallet now
                    </Button>
                </div>
            ) : (
            
                <div className="button-container">
               <div className="copy" 
               onClick={()=>{
                copyAddress(getShortAddress(user.account, 12))
               }}
               >
                {/* <Paragraph
                        className={"text-main text-center"}
                       title="dsadsadsa"
                        copyable={{
                            text: user.account,
                            format: "text/plain",
                            icon: [<CopyIcon key="copy-icon" />, <CopyIcon key="copied-icon" />],
                            
                        }}
                    >
                        {getShortAddress(user.account, 12)}
                    </Paragraph> */}
                    <div className="text-hover">{isCopy?"Copied":"Copy"}</div>
                    <CopyIcon/>
                    <span className="copy-text">COPY ADDRESS</span>
                    </div> 
                    <Button className="button button-secondary" onClick={onOpenLink}>
                        Fill your info here
                    </Button>
                </div>
             )}
        </div>
    )
}

export default RewardModal

