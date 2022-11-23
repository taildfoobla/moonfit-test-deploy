import React from 'react'
import { NFT_SALE_CURRENT_INFO } from "../../constants/blockchain"
import LoadingOutlined from "../../components/shared/LoadingOutlined";

const Header = ({ availableSlots, isLoading = true, roundInfo = NFT_SALE_CURRENT_INFO }) => {
    const _renderProgress = () => {
        if (isLoading || Number.isNaN(availableSlots)) {
            return <LoadingOutlined className="ml-3" />
        }

        if (availableSlots > 0) {
            const nft = availableSlots > 1 ? 'NFTs' : 'NFT'

            return (
                <span className="ml-3 bg-[#4CCBC9] text-[#020722] text-[16px] uppercase font-extrabold px-4 rounded dark:bg-green-500 dark:text-white">
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
            <div className={'flex flex-col worldcup-round-header'}>
                <div className={'flex justify-center'}>
                    <h2 className="font-bold text-3xl secondary-color text-center">
                        {
                            roundInfo.specialRound ? <div className="header-title">
                                <span className={'text-white'}>{roundInfo?.headerTitle}</span>
                                <p className='text-triple-gradient mt-3'>special round</p>
                            </div> : <>NFT Sale <span className={'text-white'}>Round #{roundInfo.number}</span></>
                        }
                    </h2>
                </div>
                <div className={'flex justify-center mt-6'}>
                    <span
                        className="bg-[#A16BD8] text-[16px] text-white uppercase font-bold px-4 rounded dark:text-white">
                        {roundInfo.specialRound ? roundInfo.dateRange : roundInfo.dateMsg}
                    </span>
                    {_renderProgress()}
                </div>
                {roundInfo.specialRound && _headerInfoItems()}
            </div>
        </div>
    )
}

const _headerInfoItems = () => {
    return (
        <div className='grid md:grid-cols-1 lg:grid-cols-3 gap-4 items-info mt-12'>
            <div className='info flex flex-nowrap border-gradient-red'>
                <span className='index text-triple-gradient-2 text-triple-shadow mr-5'>1</span>
                <span className='normal-case lg:text-[20px] leading-7 font-semibold md:pt-1 lg:pt-3'>
                    The NFTs will wear National Football team uniforms, and you can pick what uniform you want your NFT to wear.
                </span>
            </div>
            <div className='info flex flex-nowrap border-gradient-red'>
                <span className='index text-triple-gradient-2 text-triple-shadow mr-5'>2</span>
                <span className='normal-case lg:text-[20px] leading-7 font-semibold md:pt-1 lg:pt-3'>
                    WC edition NFTs have better stats and attributes compared to other rounds by 20%.
                </span>
            </div>
            <div className='info flex flex-nowrap border-gradient-red'>
                <span className='index text-triple-gradient-2 text-triple-shadow mr-5'>3</span>
                <span className='normal-case lg:text-[20px] leading-7 font-semibold md:pt-1 lg:pt-3'>
                    Up to <span className='text-[#4CCBC9]'>100,000 $GLMR</span> (25%) of the total revenue will be distributed after World Cup 2022 ends. Your prize pool share is determined by the number of WC Champion Moonbeast NFTs you own.
                </span>
            </div>
        </div>
    )
}

export default Header
