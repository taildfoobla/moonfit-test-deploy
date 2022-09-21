import React from 'react'
import {Progress, Typography} from "antd"
import {
    getAddressScanUrl,
    getShortAddress,
} from "../../utils/blockchain"
import CopyIcon from "../shared/CopyIcon"
import {NFT_SALE_CURRENT_INFO} from "../../constants/blockchain"
import {BLC_CONFIGS} from "../../configs/blockchain";

const {MOONBEAST_SC} = BLC_CONFIGS

const {Paragraph} = Typography

const NFTSaleInfo = ({availableSlots, maxSaleSlots}) => {
    const mintedSlots = maxSaleSlots - availableSlots

    const renderAddressLink = (address) => {
        const url = getAddressScanUrl(address)
        return (
            <a href={url} target={'_blank'} rel={'noreferrer'} className={'text-[#A16BD8] text-sm normal-case mt-2'}>
                View on block explorer
            </a>
        )
    }

    return (
        <div className={'card-body-row flex flex-col'}>
            <div className={'flex card-body-row-title'}>NFT contract</div>
            <div className={'flex flex-col'}>
                <Paragraph className={'flex text-white'}
                           copyable={{
                               text: MOONBEAST_SC,
                               format: 'text/plain',
                               icon: [<CopyIcon/>]
                           }}>
                    {getShortAddress(MOONBEAST_SC, 14)}
                </Paragraph>
                <div className={'flex'}>
                    {renderAddressLink(MOONBEAST_SC)}
                </div>
            </div>
            <hr className={'card-body-separator'}/>
            <div className={'flex card-body-row-title mt-3'}>NFT Price</div>
            <div className={'flex flex-col'}>
                <div className="flex justify-between items-center">
                    <div
                        className={'text-[#4ccbc9]'}>{NFT_SALE_CURRENT_INFO.price} GLMR
                    </div>
                </div>
            </div>
            <hr className={'card-body-separator'}/>
            <div className={'flex justify-between items-center mt-2'}>
                <div className={'flex card-body-row-title'}>
                    Total Minted
                </div>
                {
                    availableSlots > 0 ? (
                        <div className={'text-[#4ccbc9]'}>{mintedSlots} / {maxSaleSlots}</div>
                    ) : (
                        <div className="ml-3 bg-[#EF2763] text-white normal-case font-bold px-4 pb-1 rounded dark:bg-green-500 dark:text-white">
                            Sold out
                        </div>
                    )
                }
            </div>
            <div className={'flex flex-col text-[#4ccbc9]'}>
                <div className="flex justify-between items-center">
                    <Progress
                        strokeColor={{
                            from: '#4ccbc9',
                            to: '#e4007b',
                        }}
                        percent={Math.floor(mintedSlots / maxSaleSlots * 100)}
                        status="active"
                        showInfo={false}
                    />
                </div>
            </div>
        </div>
    )
}

export default NFTSaleInfo
