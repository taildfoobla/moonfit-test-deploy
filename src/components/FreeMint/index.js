import React, {useState} from "react"
import "./styles.less"
import icon1 from "../../assets/images/free-mint/icon-mission-1.png"
import icon2 from "../../assets/images/free-mint/icon-mission-2.png"
import icon3 from "../../assets/images/free-mint/icon-mission-3.png"
import checkCircleGreen from "../../assets/images/free-mint/check-circle-green.png"
import Bg from "../../assets/images/free-mint/mint-banner-bg.png"
import Sell from "../../assets/images/mint/sell.png"
import { Button, message as AndtMessage } from "antd"
import { getLocalStorage,LOCALSTORAGE_KEY } from "../../core/utils/helpers/storage"
import { mintAPI } from "../../core/services/mint"
import { checkApi } from "../../core/utils/helpers/check-api"

export default function FreeMint(props) {
    const [isOpenConfirmPopup, setIsOpenConfirmPopup] = useState(false)
    const {setIsRerender}=props
    const missionsData = [
        {
            icon: icon1,
            header: "Get 1 Free MoonBeast",
            content: "Stake 7000 $ASTR with MoonFit dApp Staking",
        },
        {
            icon: icon2,
            header: "Staking Rewards",
            content: "Get staking rewards exclusively for dApp Stakers",
        },
        {
            icon: icon3,
            header: "Monthly Sharing of MoonFit dApp Staking",
            content:
                "In addition to receiving staking rewards from Astar, users can also earn additional rewards from MoonFit dApp Staking. ",
            prize: [
                {
                    icon: checkCircleGreen,
                    content: "20% rewards for Stakers",
                },
                {
                    icon: checkCircleGreen,
                    content: "30% rewards for the Reward Exchange prize pool.",
                },
            ],
        },
        {
            icon: icon3,
            header: "Exclusive Perks and Future Benefits",
            content:
                "Receive lots of rewards such as additional tokens, NFTs, in-app reward boosts, badges, and exciting future benefits",
        },
    ]


    const _renderModalConfirm = () => {
        const user = JSON.parse(getLocalStorage(LOCALSTORAGE_KEY.SOCIAL_ACOUNT))
        return (
            <div className="mf-modal-confirm">
                <div className="mf-modal-confirm-box">
                    <div className="mf-modal-confirm-content">
                        <div className="confirm-text">
                        Are you sure you want to mint this NFT (Free)?
                        </div>

                        <div className="confirm-button">
                            <Button className="confirm-no" onClick={handleCloseConfirmPopup}>
                                No
                            </Button>
                            <Button
                                className="confirm-yes"
                                onClick={() => {
                                    handleMint()
                                }}
                            >
                                Yes
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const handleOpenConfirmPopup = () => {
 
            setIsOpenConfirmPopup(true)
        

    }
    const handleCloseConfirmPopup = () => {
        setIsOpenConfirmPopup(false)
    }

    const handleMint = async (round) => {
        let value

        switch (round) {
            case "mint-round-3":
                if (amount?.GLMR < selectedPack.value) {
                    return
                }
                value = {
                    pack: selectedPack?.amount,
                }
                break
            case "mint-round-4":
                if (amount?.GLMR < selectedPack.value) {
                    return
                }
                value = {
                    pack: selectedPack?.amount,
                }
                break
            case "mint-nft-on-astar":
                if (amount?.ASTR < selectedPack.value) {
                    return
                }
                value = {
                    pack: selectedPack?.amount,
                    is_free: false,
                }
                break
            default:
                value = {
                    pack: 1,
                    is_free: true,
                }
        }
        const res = await checkApi(mintAPI,["mint-nft-on-astar", value])
        const {data, message, success} = res
        setIsOpenConfirmPopup(false)
        if (success) {
            setIsRerender(true)
            return AndtMessage.success({
                key: "success",
                content: "Mint was successfully",
                className: "message-success",
                duration: 5,
            })
        } else {
            return AndtMessage.error({
                key: "err",
                content: message,
                className: "message-error",
                duration: 5,
            })
        }
    }

    return (
        <div className="section-content">
          {isOpenConfirmPopup&&_renderModalConfirm()}
            <div className="container">
                <div className="moonfit-card free-mint">
                    <div className="moonfit-card-inner free-mint">
                        <h3 className="card-header">Key benefits of staking ASTR on MoonFit dApp Staking</h3>
                        <p className="card-text">
                            Regardless of your $ASTR stake size, all participants enjoy monthly rewards and future
                            perks.
                        </p>
                        <ul className="list-missions">
                            {missionsData.map((mission,index) => (
                                <li className="mission" key={index}>
                                    <img className="icon" src={mission.icon} alt="" />
                                    <div className="mission-content">
                                        <h4>{mission.header}</h4>
                                        <p>{mission.content}</p>
                                        {mission.prize && (
                                        <>
                                            <h4 className="mission-prize-header">We allocate:</h4>
                                            <ul>
                                                {mission.prize.map((item) => (
                                                    <li>
                                                        <img src={item.icon} alt="" />
                                                        <span>{item.content}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </>
                                    )}
                                    </div>
                                  
                                </li>
                            ))}
                        </ul>
                        <div className="banner">
                            <img className="bg" src={Bg} alt="" />
                            <div className="banner-content">
                                <h3>Discover Staking Guide with MoonFit dApp Staking</h3>
                                <button>
                                    <p>Read Our Guide</p>
                                </button>
                            </div>
                        </div>
                        <button className="free-mint-button" onClick={handleOpenConfirmPopup}>
                            <img src={Sell} alt="" />
                            <span>Free Mint NFT</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

