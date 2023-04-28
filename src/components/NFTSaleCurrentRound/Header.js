import React from 'react'
import { NFT_SALE_CURRENT_INFO } from "../../constants/blockchain"
import LoadingOutlined from "../../components/shared/LoadingOutlined";

const Header = ({ availableSlots, isLoading = true, roundInfo = NFT_SALE_CURRENT_INFO, isExpired = false }) => {
    const _renderProgress = () => {
        if (isLoading || Number.isNaN(availableSlots)) {
            return <LoadingOutlined className="ml-3" />
        }

        if (isExpired) {
            return <span className="ml-3 bg-[#EF2763] text-[16px] text-white uppercase font-bold px-4 rounded dark:bg-green-500 dark:text-white">
                SALE ENDED
            </span>
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
            <span className="ml-3 bg-[#EF2763] text-[16px] text-white uppercase font-bold px-4 rounded dark:bg-green-500 dark:text-white">
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
                <div className={'flex justify-center mt-6'} style={{ minHeight: '32px' }}>
                    <span
                        className="bg-[#A16BD8] text-[16px] text-white uppercase font-bold px-4 rounded dark:text-white">
                        {roundInfo.specialRound ? roundInfo.dateRange : roundInfo.dateMsg}
                    </span>
                    {/* {_renderProgress()} */}
                </div>
                {/* {roundInfo.specialRound && _headerInfoItems()} */}
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
                    The NFTs will wear National Football teams' uniforms of your choice. Only Moonbeast NFTs for minting in this round.
                </span>
            </div>
            <div className='info flex flex-nowrap border-gradient-red'>
                <span className='index text-triple-gradient-2 text-triple-shadow mr-5'>2</span>
                <span className='normal-case lg:text-[20px] leading-7 font-semibold md:pt-1 lg:pt-3'>
                    Special: <span className='text-[#4CCBC9]'>25%</span> chance to mint <span className='text-[#4CCBC9]'>Uncommon NFTs</span>; <span className='text-[#E4007B]'>20%</span> better NFT stats and attributes compared to other rounds.
                </span>
            </div>
            <div className='info flex flex-nowrap border-gradient-red'>
                <span className='index text-triple-gradient-2 text-triple-shadow mr-5'>3</span>
                <span className='normal-case lg:text-[20px] leading-7 font-semibold md:pt-1 lg:pt-3'>
                    Holders of 2022 World Cup Champion Moonbeast NFTs will share up to <span className='text-[#4CCBC9]'>100,000 $GLMR</span> (25% of total revenue) based on the amount of WC Champion NFTs owned.
                </span>


            </div>
        </div>
    )
}

export default Header
