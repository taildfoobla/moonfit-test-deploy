import React, { useContext, useEffect, useState } from "react"
import { Progress, Tag } from "antd"
import WalletAuthContext from "../../contexts/WalletAuthContext";
import arrowFatRight from "../../assets/images/icons/ArrowFatRight.svg"
import moonBeam from "../../assets/images/icons/moonbeam.svg"
import LoadingOutlined from "../shared/LoadingOutlined";

import Paths from "../../routes/Paths"
import { Link } from "react-router-dom";
import { NFT_SALE_ROUNDS_INFO } from '../../constants/blockchain'
import {
    getAvailableSlots,
    getSaleMaxAmount,
    subscribeUpdateSaleAmount,
} from "../../services/smc-ntf-world-cup-sale";
import EventBus from "../../utils/event-bus";

const currentRoundSale = NFT_SALE_ROUNDS_INFO.R3

const Round3 = () => {
    const { isConnected, showWalletSelectModal } = useContext(WalletAuthContext)
    const [isLoading, setIsLoading] = useState(true)
    const [isSoldOut, setIsSoldOut] = useState(false)
    const [bought, setBound] = useState(0)
    const [maxAmountRound, setMaxAmountRound] = useState(currentRoundSale.amount)

    useEffect(() => {
        init().then()
    }, [])

    const init = async () => {
        setIsLoading(true)
        EventBus.$on(currentRoundSale.eventUpdateSaleAmountName, (data) => {
            if (data.soldAmount && data.maxSaleAmount) {
                setBound(data.soldAmount)
                setMaxAmountRound(data.maxSaleAmount)
                setIsSoldOut(data.availableSlot === 0)
            }
        })

        subscribeUpdateSaleAmount()

        const data = await Promise.all([
            getAvailableSlots(),
            getSaleMaxAmount(),
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

    // eslint-disable-next-line no-unused-vars
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
                <Link to={Paths.NFTSaleRoundThree.path} className="flex items-center header-button button button-secondary w-100 mt-20">
                    <span className="nav-text">View detail</span>
                </Link>
            )
        }
        if (isConnected) {
            return (
                <Link to={Paths.NFTSaleRoundThree.path} className="flex items-center header-button button button-secondary w-100 mt-20">
                    <span className="nav-text">Join now</span>
                </Link>
            )
        }

        return (
            <button type="button" className="flex items-center header-button button button-secondary w-100 mt-20"
                    onClick={showWalletSelectModal}>
                Login
            </button>
        )
    }

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
        <div className={`stage${isSoldOut && !currentRoundSale.activeSoldOut ? " sold-out" : ""}`}>
            {
                isSoldOut && <Tag className="badge" color="#541C8D">SOLD OUT</Tag>
            }
            <div className="stage-content">
                <div className="flex items-center mb-5">
                    <div className="pt-3">
                        <h2 className="mb-2">Mint Now</h2>
                        <h3 className="mb-2">in MoonFit App</h3>
                    </div>
                </div>
                <h4 className="mt-5 mb-3">{currentRoundSale.title}</h4>
                <div className="flex mb-2">
                    <img className="arrow-right" src={arrowFatRight} alt="" /> QUANTITY: <span className="text-white ml-1"> {maxAmountRound} NFTs</span>
                </div>
                <div className="flex mb-3">
                    <img className="arrow-right" src={arrowFatRight} alt="" /> PRICE:
                    <img className="ic-moonbeam" src={moonBeam} alt="" /> <span className="text-[#4ccbc9] mr-1">FROM {currentRoundSale.price}
                                    </span>
                </div>
                <span className="description">{currentRoundSale.description}</span>
                {renderFooter()}
            </div>
            {joinButton()}
        </div>
    )
}

export default Round3
