import React, {useContext} from "react"
import { Progress, Tag } from "antd"
import CurveBGWrapper from "../wrappers/CurveBG"
import arrowFatRight from "../assets/images/icons/ArrowFatRight.svg"
import mintPass from "../assets/images/icons/mintpass.svg"
import moonBeam from "../assets/images/icons/moonbeam.svg"
import WalletAuthContext from "../contexts/WalletAuthContext";
import Paths from "../routes/Paths"
import {Link} from "react-router-dom";
import {NFT_SALE_ROUNDS_INFO} from '../constants/blockchain'

const NFTSaleStages = () => {
    const { isConnected, showWalletSelectModal } = useContext(WalletAuthContext)

    const mapPaths = {
        3: Paths.NFTSaleRoundThree.path,
        4: Paths.NFTPublicSale.path,
    }

    const stages = Object.values(NFT_SALE_ROUNDS_INFO).map(item => {
        return {...item, path: mapPaths[item.number], sold: 0}
    })

    const getProgressPercent = (mintedSlots, maxSaleSlots) => {
        return Math.floor((mintedSlots || 0) / maxSaleSlots * 100)
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
        if (isConnected) {
            return (
                <Link to={stage.path}  className="flex items-center header-button button button-secondary w-100">
                    <span className="nav-text">Join now</span>
                </Link>
            )
        }

        return (
            <button type="button" className="flex items-center header-button button button-secondary w-100" onClick={showWalletSelectModal}>
                Login
            </button>
        )
    }

    return (
        <CurveBGWrapper>
            <h2 className="mb-5">MoonBEAST NFT SALE Stages</h2>
            <div className="grid grid-cols-4 gap-4">
                {
                    stages.map((stage) => (
                        <div className={`stage${stage.isSoldOut ? " sold-out" : ""}`} key={stage.number}>
                            {
                                stage.isSoldOut && <Tag className="badge" color="#541C8D">SOLD OUT</Tag>
                            }
                            {dateTitle(stage.dateMsg)}

                            <h4 className="mt-5">{stage.title}</h4>
                            <div className="flex">
                                <img className="arrow-right" src={arrowFatRight}  alt="" /> QUANTITY: {stage.amount} NFTs
                            </div>
                            <div className="flex">
                                <img className="arrow-right" src={arrowFatRight} alt="" /> PRICE:
                                <img className="ic-moonbeam" src={moonBeam} alt="" /> {stage.price}
                                + <img className="ic-mintpass" src={mintPass} alt="" /> {stage.mintPass}
                            </div>
                            <span className="description">{stage.description}</span>
                            {
                                !stage.isSoldOut &&
                                <>
                                    <div className={'flex flex-col text-[#4ccbc9]'}>
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

                                    {joinButton(stage)}
                                </>
                            }
                        </div>
                    ))
                }
            </div>
        </CurveBGWrapper>
    )
}

export default NFTSaleStages
