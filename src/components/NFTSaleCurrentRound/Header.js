import React from 'react'
import {NFT_SALE_CURRENT_INFO} from "../../constants/blockchain"
import LoadingOutlined from "../../components/shared/LoadingOutlined";

const Header = ({availableSlots, isLoading=true}) => {
    const _renderProgress = () => {
        if (isLoading || Number.isNaN(availableSlots)) {
            return <LoadingOutlined className="ml-3" />
        }

        if (availableSlots > 0 ) {
            const nft = availableSlots > 1 ? 'NFTs' : 'NFT'

            return (
                <span className="ml-3 bg-[#4CCBC9] text-[#020722] normal-case font-bold px-4 pb-1 rounded dark:bg-green-500 dark:text-white">
                    {availableSlots} {nft} left
                </span>
            )
        }

        return (
            <span className="ml-3 bg-[#EF2763] text-white normal-case font-bold px-4 pb-1 rounded dark:bg-green-500 dark:text-white">
                Sold out
            </span>
        )
    }

    return (
        <div className="container" key={'_renderHead'}>
            <div className={'flex flex-col'}>
                <div className={'flex justify-center'}>
                    <h2 className="font-bold text-3xl secondary-color text-center">
                        NFT Sale <span className={'text-white'}>Round #{NFT_SALE_CURRENT_INFO.number}</span>
                    </h2>
                </div>
                <div className={'flex justify-center mt-6'}>
                        <span
                            className="bg-[#A16BD8] text-white normal-case font-bold px-4 pb-1 rounded dark:bg-green-500 dark:text-white">
                            {NFT_SALE_CURRENT_INFO.dateMsg}
                        </span>
                    {_renderProgress()}
                </div>
            </div>
        </div>
    )
}

export default Header
