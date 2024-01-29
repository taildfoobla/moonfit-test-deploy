import {Avatar} from "antd"
import React, {useEffect, useState} from "react"

const WinnerList = (props) => {
    const {histories, marginLeft, id, index, wrapperMarginLeft, isScrolling, setIsScrolling} = props
    const [winnerIndex, setWinnerIndex] = useState(0)

    useEffect(() => {
        if(isScrolling){
            setTimeout(() => {
                const el = document.getElementById(`${id}_${winnerIndex}`)
                if (el) {
                    el.scrollIntoView({behavior: "smooth", block: "nearest"})
                    setWinnerIndex(winnerIndex === histories.length - 1 ? 0 : winnerIndex + 1)
                    setIsScrolling(index)
                }
            }, 1000)
        }
      
    }, [histories, winnerIndex, id,isScrolling])

    const _renderWinnerText = (user, type, rewardName, value, color) => {
        let text = null
        switch (type) {
            case "MoonBoxSlot":
                text = (
                    <p className="normal-case text-[11px] font-normal ml-2">
                        <span className="font-semibold">{user}</span> won{" "}
                        <span
                            style={{color: `#${color}`}}
                            className="text-[#A16BD8] font-semibold"
                        >{`${value} ${rewardName}`}</span>
                    </p>
                )
                break
            case "MoonBox":
            case "MerchandiseTShirt":
                text = (
                    <p className="normal-case text-[11px] font-normal ml-2">
                        <span className="font-semibold">{user}</span> won{" "}
                        <span
                            style={{color: `#${color}`}}
                            className="text-[#A16BD8] font-semibold"
                        >{`${value} ${rewardName}`}</span>
                    </p>
                )
                break
            case "MFR":
                text = (
                    <p className="normal-case text-[11px] font-normal ml-2">
                        <span className="font-semibold">{user}</span> won{" "}
                        <span
                            style={{color: `#${color}`}}
                            className="text-[#E4007B] font-semibold"
                        >{`${value} ${rewardName}`}</span>{" "}
                    </p>
                )
                break
            case "MFG":
                text = (
                    <p className="normal-case text-[11px] font-normal ml-2">
                        <span className="font-semibold">{user}</span> won{" "}
                        <span
                            style={{color: `#${color}`}}
                            className="text-[#4CCBC9] font-semibold"
                        >{`${value} ${rewardName}`}</span>
                    </p>
                )
                break
            case "GLMR":
                text = (
                    <p className="normal-case text-[11px] font-normal ml-2">
                        <span className="font-semibold">{user}</span> won{" "}
                        <span style={{color: `#${color}`}} className="font-semibold">{`${value} ${rewardName}`}</span>{" "}
                    </p>
                )
                break
            case "WeeklyRaffleTicket":
            case "MerchandiseCup":
            case "MerchandiseCap":
                text = (
                    <p className="normal-case text-[11px] font-normal ml-2">
                        <span className="font-semibold">{user}</span> won{" "}
                        <span
                            style={{color: `#${color}`}}
                            className="text-[#EFAA5D] font-semibold"
                        >{`${value} ${rewardName}`}</span>{" "}
                    </p>
                )
                break
            case "MoonFitAstarDegensTicket":
            case "MerchandiseToteBag":
            case "ASTR":
                text = (
                    <p className="normal-case text-[11px] font-normal ml-2">
                        <span className="font-semibold">{user}</span> won{" "}
                        <span
                            style={{color: `#${color}`}}
                            className="text-[#48C8F0] font-semibold"
                        >{`${value} ${rewardName}`}</span>{" "}
                    </p>
                )
                break
            case "MoonFitGLMRApesTicket":
            case "MerchandiseKeychain":
                text = (
                    <p className="normal-case text-[11px] font-normal ml-2">
                        <span className="font-semibold">{user}</span> won{" "}
                        <span
                            style={{color: `#${color}`}}
                            className="text-[#A5D990] font-semibold"
                        >{`${value} ${rewardName}`}</span>{" "}
                    </p>
                )
                break
            case "MoonFitMonesTicket":
                text = (
                    <p className="normal-case text-[11px] font-normal ml-2">
                        <span className="font-semibold">{user}</span> won{" "}
                        <span
                            style={{color: `#${color}`}}
                            className="text-[#FAEB68] font-semibold"
                        >{`${value} ${rewardName}`}</span>{" "}
                    </p>
                )
                break
            case "MoonFitAjunaNetworkTicket":
                text = (
                    <p className="normal-case text-[11px] font-normal ml-2">
                        <span className="font-semibold">{user}</span> won{" "}
                        <span
                            style={{color: `#${color}`}}
                            className="text-[#3D89E3] font-semibold"
                        >{`${value} ${rewardName}`}</span>{" "}
                    </p>
                )
                break
            case "FreeSpin":
                text = (
                    <p className="normal-case text-[11px] font-normal ml-2">
                        <span className="font-semibold">{user}</span> won{" "}
                        <span
                            style={{color: `#${color}`}}
                            className="text-[#4CCBC9] font-semibold"
                        >{`${value} ${rewardName}`}</span>{" "}
                    </p>
                )
                break
            default:
                break
        }
        return text
    }

    return (
        <div className={`lw-list-winners ${id}`} style={{marginLeft: `${wrapperMarginLeft}`}}>
            <div className={`lw-winners-wrapper ${id}`}>
                {histories.map((history, index) => {
                    const {user, rewards} = history
                    return (
                        <div
                            key={index}
                            className="winner flex flex-nowrap justify-center"
                            id={`${id}_${index}`}
                            style={{marginLeft: `${marginLeft}`}}
                        >
                            <div className="lw-winner no-event">
                                <div className="winner-avatar mr-1">
                                    <Avatar size={27} src={user.avatar} />
                                    <div className="sub-avatar">
                                        <img src={rewards[0].icon} alt="" />
                                    </div>
                                </div>
                                {_renderWinnerText(
                                    user.name,
                                    rewards[0].type,
                                    rewards[0].unit,
                                    rewards[0].value,
                                    rewards[0].color
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default WinnerList

