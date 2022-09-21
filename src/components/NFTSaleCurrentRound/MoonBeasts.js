import React from 'react'
import {Image} from "antd"
import {range} from "../../utils/array"
import NFTSkeleton from "../NFTSkeleton"
import NFTLink from '../NFTLink'
import {BLC_CONFIGS} from "../../configs/blockchain";
const {MOONBEAST_SC} = BLC_CONFIGS

const MoonBeasts = ({moonBeasts, isLoading= false, mintPassSelectNumber = 0}) => {
    const renderMoonBeasts = () => {
        if (moonBeasts.length === 0 && !isLoading) {
            return (
                <div className={'my-3'}>
                    <div className={'text-center text-white normal-case'}>You don't own any beast/beauty yet.</div>
                    <div className={'text-center text-white normal-case'}>
                        If you have a pass, please click "MINT NFT" button to mint one.
                    </div>
                </div>
            )
        }

        return (
            <div className={"grid grid-cols-4 lg:grid-cols-6 gap-4"}>
                {
                    moonBeasts.map((mb, idx) => {
                        const nameArr = String(mb.name || '').split(' ')
                        const preName = nameArr[0]
                        const typeName = nameArr[1]
                        const numberName = nameArr[2]

                        return (
                            <div data-token-id={mb.tokenId}
                                 className={'flex flex-col justify-center items-center mt-4 col-span-2 nft-item'}
                                 key={idx}>
                                <div className={'flex'}>
                                    <Image
                                        width={'100%'}
                                        src={mb.imageUrl}
                                        alt={mb.name}
                                    />
                                </div>
                                <div className={'flex flex-col normal-case race-sport-font text-sm mt-4'}>
                                    <span className={'secondary-color text-center'}>{preName}</span>
                                    <span className={'primary-color text-center mt-1'}>{typeName}</span>
                                    <span className={'primary-color text-center mt-1'}>{numberName}</span>
                                </div>
                                <div className={'flex normal-case mt-2'}>
                                    <NFTLink address={MOONBEAST_SC} tokenId={mb.tokenId}/>
                                </div>
                            </div>
                        )
                    })
                }
                {
                    isLoading && range(0, mintPassSelectNumber).map(i =>
                        <NFTSkeleton className={'flex flex-col items-center mt-4 col-span-2 nft-item'} key={i}/>
                    )
                }
            </div>
        )
    }

    return (
        <div className={'card-body-row flex flex-col mt-3'}>
            <div className="flex justify-between">
                <div className={'flex card-body-row-title'}>
                    Your minted NFTs
                </div>
                <div
                    className={'flex card-body-row-title'}>Total {moonBeasts.length}
                </div>
            </div>
            {renderMoonBeasts()}
        </div>
    )
}

export default MoonBeasts
