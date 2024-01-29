import React from 'react'
import BigNumber from 'bignumber.js'
import { Tooltip } from "antd";
import QuestionIcon from "../../../assets/images/mint/question.svg";
import Moonbeam from "../../../assets/images/mint/moonbeam2.svg";
import Astar from "../../../assets/images/lucky-wheel/wheel/astar-wheel.png"
import Pack1 from "../../../assets/images/mint/pack-1.svg";
import Pack3 from "../../../assets/images/mint/pack-3.svg";
import Pack5 from "../../../assets/images/mint/pack-5.svg";
import Pack13 from "../../../assets/images/mint/pack-13.svg";
import { useGlobalContext } from '../../../core/contexts/global';

const PackIcon = ({ pack = '' }) => {
    const icons = {
        pack1: Pack1,
        pack3: Pack3,
        pack5: Pack5,
        pack13: Pack13,
    }

    return (
        <img className="pack-icon" src={icons[pack]} alt={pack} />
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
    const {selectedNetwork}=useGlobalContext()

    const numberFormat = (number) => {
        const fmt = {
            prefix: '',
            decimalSeparator: '.',
            groupSeparator: ',',
            groupSize: 3,
            secondaryGroupSize: 0,
            fractionGroupSeparator: ' ',
            fractionGroupSize: 0,
            suffix: ''
          }
        return new BigNumber(number).toFormat(0,fmt)
    }

    const renderNetworkIcon =()=>{
        switch(selectedNetwork){
            case "moonbeam":
                return Moonbeam
            case "astar":
                return Astar
        }
    }

    return (
        <li {...rootDOMAttributes}>
            <div className='pack-border flex justify-between items-center'>
                <div className='left flex items-center'>
                    <PackIcon pack={item.type} />
                    <div className='pack-label ml-3'>
                        <p className='flex text-[14px] leading-5 race-sport-font mb-2'>
                            <span className='mr-2 font-normal'>{item.label}</span>
                            <Tooltip overlayClassName='mint-tooltip' className='pack-tooltip' placement="top" title={item.tooltip}>
                                <img src={QuestionIcon} alt="ask" />
                            </Tooltip>
                        </p>
                        <PackDiscount item={item} />
                    </div>
                </div>
                <div className='right flex items-center'>
                    <img src={renderNetworkIcon()} alt="GLMR" />
                    <span className={`font-bold text-[24px] text-[#4CCBC9] num-with-${item.value.toString().length}`}>
                        {numberFormat(item.value)}
                    </span>
                </div>
                <PackRecommend item={item} />
            </div>

        </li>
    )
}

export default PackItemInfo
