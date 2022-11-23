import React from 'react'
import {Progress, Typography} from "antd"
import {getAddressScanUrl, getShortAddress,} from "../../utils/blockchain"
import CopyIcon from "../shared/CopyIcon"
import {NFT_SALE_CURRENT_INFO} from "../../constants/blockchain"
import configs from "../../configs";
import LoadingOutlined from "../../components/shared/LoadingOutlined";

const {MOONBEAST_SC} = configs

const {Paragraph} = Typography

const LineContract = (props) => {
    const renderAddressLink = (address) => {
        const url = getAddressScanUrl(address)
        return (
            <a href={url} target={'_blank'} rel={'noreferrer'} className={'text-[#A16BD8] text-[18px] text-sm normal-case mt-2'}>
                View on block explorer
            </a>
        )
    }

    return (
        <>
            <div className={'flex card-body-row-title'}>MOONBEAST NFT CONTRACT</div>
            <div className={'flex flex-col'}>
                <Paragraph className={'flex text-white'} copyable={{text: MOONBEAST_SC, format: 'text/plain', icon: [<CopyIcon/>]}}>
                    {getShortAddress(MOONBEAST_SC, 14)}
                </Paragraph>
                <div className={'flex'}>
                    {renderAddressLink(MOONBEAST_SC)}
                </div>
            </div>
        </>
    )
}


const LinePrice = ({price}) => {
    return (
        <>
            <div className={'flex card-body-row-title mt-3'}>NFT Price</div>
            <div className={'flex flex-col'}>
                <div className="flex justify-between items-center">
                    <div
                        className={'text-[#4ccbc9]'}>{price} GLMR / NFT
                    </div>
                </div>
            </div>
        </>
    )
}

const NFTSaleInfo = ({availableSlots, maxSaleSlots, isLoading, handleGetMinted = () => {}, roundInfo=NFT_SALE_CURRENT_INFO}) => {
    const mintedSlots = maxSaleSlots - availableSlots

    const renderMinted = () => {
        if (isLoading || Number.isNaN(mintedSlots)) {
            return <LoadingOutlined size={24} />
        }

        if (availableSlots < 1) {
            return (
                <div className="ml-3 bg-[#EF2763] text-white normal-case font-bold px-4 pb-1 rounded dark:bg-green-500 dark:text-white">
                    Sold out
                </div>
            )
        }

        return <div className={'text-[#4ccbc9] text-[16px]'}>{mintedSlots} / {maxSaleSlots}</div>
    }

    const getProgressPercent = () => {
        return Math.floor((mintedSlots || 0) / maxSaleSlots * 100)
    }

    return (
        <div className={'card-body-row flex flex-col'}>
            <LineContract />
            <hr className={'card-body-separator'}/>
            <LinePrice price={roundInfo.price} />
            <hr className={'card-body-separator'}/>
            <div className="cursor-pointer" onClick={handleGetMinted}>
                <div className={'flex justify-between items-center mt-2 count-minted'}>
                    <div className={'flex card-body-row-title'}>
                        Total Minted
                    </div>
                    {renderMinted()}
                </div>

                <div className={'flex flex-col text-[#4ccbc9]'}>
                    <div className="flex justify-between items-center custom-progress">
                        <Progress
                            strokeColor={{from: '#4ccbc9', to: '#e4007b'}}
                            percent={getProgressPercent()}
                            status="active"
                            showInfo={false}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NFTSaleInfo
