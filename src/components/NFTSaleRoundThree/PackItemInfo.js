import React from 'react'
import BigNumber from 'bignumber.js'
import { Tooltip } from "antd";
import QuestionIcon from "../../assets/images/icons/question.svg";
import Moonbeam from "../../assets/images/icons/moonbeam.svg";
import Pack1 from "../../assets/images/icons/pack-1.svg";
import Pack3 from "../../assets/images/icons/pack-3.svg";
import Pack5 from "../../assets/images/icons/pack-5.svg";
import Pack13 from "../../assets/images/icons/pack-13.svg";

const PackIcon = ({ pack = '' }) => {
    const icons = {
        pack1: Pack1,
        pack3: Pack3,
        pack5: Pack5,
        pack13: Pack13,
    }

    return (
        <img src={icons[pack]} alt={pack} />
    )
}

const PackDiscount = ({ item = {} }) => {
    if (!item.discount) {
        return null
    }

    return (
        <p className='text-[15px] sub-label'>
            <span>{Math.round(item.value / item.amount)} x {item.amount}</span> <span
                className='text-[#EF2763]'>(-{item.discount}%)</span>
        </p>
    )
}

const PackRecommend = ({ item = {} }) => {
    if (!item.isRecommend) {
        return null
    }

    return (
        <div className='badge-recommend'>
            <span className='text-[13px] font-semibold normal-case'>Recommended</span>
        </div>
    )
}

const PackItemInfo = ({ item = {}, ...rootDOMAttributes }) => {
    const numberFormat = (number) => {
        return new BigNumber(number).toFormat(0)
    }

    return (
        <li {...rootDOMAttributes}>
            <div className='pack-border flex justify-between items-center'>
                <div className='left flex items-center'>
                    <PackIcon pack={item.type} />
                    <div className='pack-label ml-3'>
                        <p className='flex text-[14px] race-sport-font mb-0'>
                            <span className='mr-2'>{item.label}</span>
                            <Tooltip className='pack-tooltip' placement="top" title={item.tooltip}>
                                <img src={QuestionIcon} alt="ask" />
                            </Tooltip>
                        </p>
                        <PackDiscount item={item} />
                    </div>
                </div>
                <div className='right flex items-center'>
                    <img className='mr-3' src={Moonbeam} alt="GLMR" />
                    <span className={`font-bold text-[20px] text-[#4CCBC9] num-with-${item.value.toString().length}`}>
                        {numberFormat(item.value)}
                    </span>
                </div>
                <PackRecommend item={item} />
            </div>

        </li>
    )
}

export default PackItemInfo
