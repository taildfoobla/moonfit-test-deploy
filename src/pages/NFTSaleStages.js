import React, { useContext, useEffect, useState } from "react"
import { Progress, Tag } from "antd"
import CurveBGWrapper from "../wrappers/CurveBG"
import arrowFatRight from "../assets/images/icons/ArrowFatRight.svg"
import mintPass from "../assets/images/icons/mintpass.svg"
import moonBeam from "../assets/images/icons/moonbeam.svg"
import WalletAuthContext from "../contexts/WalletAuthContext";
import Paths from "../routes/Paths"
import { Link } from "react-router-dom";
import { NFT_SALE_ROUNDS_INFO } from '../constants/blockchain'
import {
    getAvailableSlots as getAvailableSlotsRound3,
    getSaleMaxAmount as getSaleMaxAmountRound3
} from "../services/smc-ntf-sale";
import {
    getAvailableSlots as getAvailableSlotsRound4,
    getSaleMaxAmount as getSaleMaxAmountRound4
} from "../services/smc-ntf-public-sale";


const mapPaths = {
    3: Paths.NFTSaleRoundThree.path,
    4: Paths.NFTPublicSale.path,
}

const stagesArr = Object.values(NFT_SALE_ROUNDS_INFO).map(item => {
    return { ...item, path: mapPaths[item.number], sold: 0, _id: `${item.number}_${Date.now()}`, isLoading: true }
})

const NFTSaleStages = () => {
    const { isConnected, showWalletSelectModal } = useContext(WalletAuthContext)
    const [stages, setStages] = useState(stagesArr)

    useEffect(() => {
        init().then()
    }, [])

    const init = async () => {
        const data = await Promise.all([
            getAvailableSlotsRound3(),
            getSaleMaxAmountRound3(),
            getAvailableSlotsRound4(),
            getSaleMaxAmountRound4(),
        ])
        const obj = {
            3: {
                amount: data[1],
                sold: data[1] - data[0],
                isSoldOut: data[0] === 0
            },
            4: {
                amount: data[3],
                sold: data[3] - data[2],
                isSoldOut: data[2] === 0,
            }
        }

        setStages(stages.map(item => {
            return { ...item, ...obj[item.number], isLoading: false }
        }))
    }

    const getProgressPercent = (mintedSlots, maxSaleSlots) => {
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

    const joinButton = (stage) => {
        if (!stage.path) {
            return null
        }
        if (stage.isSoldOut) {
            return (
                <Link to={stage.path} className="flex items-center header-button button button-secondary w-100 mt-20">
                    <span className="nav-text">View detail</span>
                </Link>
            )
        }
        if (isConnected) {
            return (
                <Link to={stage.path} className="flex items-center header-button button button-secondary w-100 mt-4">
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

    return (
        <CurveBGWrapper>
            <h2 className="stage-title ml-4 mb-12">MoonBEAST NFT SALE Stages</h2>
            <div className="flex flex-wrap justify-center grid xs:grid-cols-1 md:grid-cols-1 xl:grid-cols-4 gap-8">
                {
                    stages.map((stage) => (
                        <div className={`stage${stage.isSoldOut ? " sold-out" : ""}`} key={stage._id}>
                            {
                                stage.isSoldOut && <Tag className="badge" color="#541C8D">SOLD OUT</Tag>
                            }
                            <div className="stage-content">
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
                                {
                                    !stage.isSoldOut &&
                                    <>
                                        <div className={'flex flex-col text-[#4ccbc9] mt-5'}>
                                            <div className="flex justify-between items-center">
                                                <Progress
                                                    strokeColor={{ from: '#4ccbc9', to: '#e4007b' }}
                                                    percent={getProgressPercent(stage.sold, stage.amount)}
                                                    status="active"
                                                    showInfo={false}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex justify-between mint-sold">
                                            <span>{stage.sold} / {stage.amount} SOLD</span>
                                            <span>{getProgressPercent(stage.sold, stage.amount)}%</span>
                                        </div>
                                    </>
                                }
                            </div>
                            {joinButton(stage)}
                        </div>
                    ))
                }
            </div>
        </CurveBGWrapper>
    )
}

export default NFTSaleStages
