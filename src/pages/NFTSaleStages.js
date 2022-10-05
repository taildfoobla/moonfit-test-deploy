import React from "react"
import { Progress, Tag } from "antd"
import CurveBGWrapper from "../wrappers/CurveBG"
import arrowFatRight from "../assets/images/icons/ArrowFatRight.svg"
import mintPass from "../assets/images/icons/mintpass.svg"
import moonBeam from "../assets/images/icons/moonbeam.svg"

const NFTSaleStages = () => {

    const getProgressPercent = (mintedSlots, maxSaleSlots) => {
        return Math.floor((mintedSlots || 0) / maxSaleSlots * 100)
    }



    return (
        <CurveBGWrapper>
            <h2 className="mb-5">MoonBEAST NFT SALE Stages</h2>
            <div className="grid grid-cols-4 gap-4">
                {
                    stages.map((stage) => (
                        <div className={`stage${stage.isSoldOut ? " sold-out" : ""}`}>
                            {
                                stage.isSoldOut && <Tag className="badge" color="#541C8D">SOLD OUT</Tag>
                            }
                            <div className="flex">
                                <h1>{stage.startDate.substring(0, 2)}</h1>
                                <h3 className="pt-2">{stage.startDate.substring(2, 4)}</h3>
                            </div>
                            <h3>{stage.startDate.substring(5, stage.startDate.length)}</h3>
                            <h4 className="mt-5">{stage.title}</h4>
                            <div className="flex">
                                <img className="arrow-right" src={arrowFatRight} /> QUANTITY: {stage.quantity} NFT
                            </div>
                            <div className="flex">
                                <img className="arrow-right" src={arrowFatRight} /> PRICE: <img className="ic-moonbeam" src={moonBeam} /> {stage.price.moonbeam} + <img className="ic-mintpass" src={mintPass} /> {stage.price.mintpass}
                            </div>
                            <span className="description">{stage.description}</span>
                            {
                                !stage.isSoldOut && <>
                                    <div className={'flex flex-col text-[#4ccbc9]'}>
                                        <div className="flex justify-between items-center">
                                            <Progress
                                                strokeColor={{ from: '#4ccbc9', to: '#e4007b' }}
                                                percent={getProgressPercent(stage.sold, stage.quantity)}
                                                status="active"
                                                showInfo={false}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-between mint-sold">
                                        <span>{stage.sold} / {stage.quantity} SOLD</span>
                                        <span>{getProgressPercent(stage.sold, stage.quantity)}%</span>
                                    </div>
                                    <button
                                        type="button"
                                        className={`flex items-center header-button button button-secondary w-100`}>
                                        Login
                                    </button></>
                            }
                        </div>
                    ))
                }
            </div>
        </CurveBGWrapper>
    )
}

const stages = [
    {
        number: 1,
        startDate: "22nd August",
        title: "Whitelist sale",
        quantity: 500,
        price: {
            moonbeam: 79,
            mintpass: 1,
        },
        description: "",
        sold: 0,
        isSoldOut: true,
    },
    {
        number: 2,
        startDate: "24nd September",
        title: "Whitelist sale #2",
        quantity: 1500,
        price: {
            moonbeam: 199,
            mintpass: 1,
        },
        description: "BUY Max 2 MOoNBEASTS PER MINTPASs",
        sold: 0,
        isSoldOut: true,
    },
    {
        number: 3,
        startDate: "12th October",
        title: "Whitelist sale",
        quantity: 2000,
        price: {
            moonbeam: 159,
            mintpass: 1,
        },
        description: "BUY MAX 2 MOoNBEASTS PER MINTPASs",
        sold: 420,
        isSoldOut: false,
    },
    {
        number: 4,
        startDate: "12thn October",
        title: "Whitelist sale",
        quantity: 5000,
        price: {
            moonbeam: 219,
            mintpass: 0,
        },
        description: "NO MINTPASs REQUIRED",
        sold: 4290,
        isSoldOut: false,
    }
]

export default NFTSaleStages