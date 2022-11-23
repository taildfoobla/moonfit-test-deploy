import React, { useContext, useEffect, useState } from "react"
import { Progress, Tag } from "antd"
import WalletAuthContext from "../../contexts/WalletAuthContext";
import arrowFatRight from "../../assets/images/icons/ArrowFatRight.svg"
import mintPass from "../../assets/images/icons/mintpass.svg"
import moonBeam from "../../assets/images/icons/moonbeam.svg"
import LoadingOutlined from "../../components/shared/LoadingOutlined";

import Paths from "../../routes/Paths"
import { Link } from "react-router-dom";
import { NFT_SALE_ROUNDS_INFO } from '../../constants/blockchain'
import {
    getAvailableSlots as getAvailableSlotsRoundWC,
    getSaleMaxAmount as getSaleMaxAmountRoundWC
} from "../../services/smc-ntf-world-cup-sale";

const RoundWorldCup = () => {
    const { isConnected, showWalletSelectModal } = useContext(WalletAuthContext)
    const [isLoading, setIsLoading] = useState(true)
    const [isSoldOut, setIsSoldOut] = useState(false)
    const [bought, setBound] = useState(0)
    const [maxAmountRound, setMaxAmountRound] = useState(NFT_SALE_ROUNDS_INFO.WC.amount)

    useEffect(() => {
        init().then()
    }, [])

    const init = async () => {
        setIsLoading(true)
        const data = await Promise.all([
            getAvailableSlotsRoundWC(),
            getSaleMaxAmountRoundWC(),
        ])

        setBound(data[1] - data[0])
        setMaxAmountRound(data[1])
        setIsSoldOut(data[0] === 0)

        setTimeout(() => {setIsLoading(false)}, 0)
    }

    const getProgressPercent = (mintedSlots, maxSaleSlots) => {
        if (maxSaleSlots === 0) {
            return 0
        }

        return Math.floor((mintedSlots || 0) / maxSaleSlots * 10000) / 100
    }

    const dateTitle = (dateMsg) => {
        const day = dateMsg.substring(0, 2)
        const ordinalNumber = dateMsg.substring(2, 4)
        const month = dateMsg.substring(5, dateMsg.length)

        return (
            <>
                <div className="flex">
                    <h1>{day}</h1>
                    <h3 className="pt-2">{ordinalNumber}</h3>
                </div>
                <h3>{month}</h3>
            </>
        )
    }

    const joinButton = () => {
        if (isSoldOut) {
            return (
                <Link to={Paths.NFTSaleRoundWorldCup.path} className="flex items-center header-button button button-secondary w-100 mt-20">
                    <span className="nav-text">View detail</span>
                </Link>
            )
        }
        if (isConnected) {
            return (
                <Link to={Paths.NFTSaleRoundWorldCup.path} className="flex items-center header-button button button-secondary w-100 mt-4">
                    <span className="nav-text">Join now</span>
                </Link>
            )
        }

        return (
            <button type="button" className="flex items-center header-button button button-secondary w-100 mt-4"
                    onClick={showWalletSelectModal}>
                Login
            </button>
        )
    }

    const stage = NFT_SALE_ROUNDS_INFO.WC

    const renderFooter = () => {
        if (isLoading) {
            return (
                <div className="flex justify-center mt-5 mb-5">
                    <LoadingOutlined />
                </div>
            )
        }

        return (
            <>
                <div className={'flex flex-col text-[#4ccbc9] mt-5'}>
                    <div className="flex justify-between items-center">
                        <Progress
                            strokeColor={{ from: '#4ccbc9', to: '#e4007b' }}
                            percent={getProgressPercent(bought, maxAmountRound)}
                            status="active"
                            showInfo={false}
                        />
                    </div>
                </div>
                <div className="flex justify-between mint-sold">
                    <span>{bought} / {maxAmountRound} SOLD</span>
                    <span>{getProgressPercent(bought, maxAmountRound)}%</span>
                </div>
            </>
        )
    }

    return (
        <div className={`stage${stage.isSoldOut && !stage.activeSoldOut ? " sold-out" : ""}`} key={stage._id}>
            {
                stage.isSoldOut && <Tag className="badge" color="#541C8D">SOLD OUT</Tag>
            }
            <div className="stage-content" onClick={() => setIsLoading(!isLoading)}>
                {dateTitle(stage.dateMsg)}
                <h4 className="mt-5 mb-3">{stage.title}</h4>
                <div className="flex mb-2">
                    <img className="arrow-right" src={arrowFatRight} alt="" /> QUANTITY: <span className="text-white ml-1"> {stage.amount} NFTs</span>
                </div>
                <div className="flex mb-3">
                    <img className="arrow-right" src={arrowFatRight} alt="" /> PRICE:
                    <img className="ic-moonbeam" src={moonBeam} alt="" /> <span className="text-[#4ccbc9] mr-1">{stage.price}
                                    </span> + <img className="ic-mintpass" src={mintPass} alt="" /><span className="text-[#4ccbc9]">{stage.mintPass}</span>
                </div>
                <span className="description">{stage.description}</span>
                {renderFooter()}
            </div>
            {joinButton(stage)}
        </div>
    )
}

export default RoundWorldCup
