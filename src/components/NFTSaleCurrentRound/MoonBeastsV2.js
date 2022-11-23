import React from 'react'
import {range} from "../../utils/array"
import NFTSkeleton from "../NFTSkeleton"
import LoadingOutlined from "../../components/shared/LoadingOutlined";
import MoonBeastItem from './MoonBeastItemV2';

const MoonBeasts = ({moonBeasts, isLoading, moonBeastMinting= 0}) => {
    const _renderMinting = () => {
        if (!moonBeastMinting) {
            return null
        }

        return range(1, moonBeastMinting).map(i =>
            <NFTSkeleton className={'flex flex-col items-center mt-4 col-span-2 nft-item'} key={i}/>
        )
    }
    const renderMoonBeasts = () => {
        if (moonBeasts.length === 0 && !moonBeastMinting) {
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
                {_renderMinting()}
                {
                    moonBeasts.map((mb, idx) =>  <MoonBeastItem moonBeast={mb} key={idx} />)
                }
            </div>
        )
    }

    const _render = () => (
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

    if (isLoading) {
        return <LoadingOutlined>
            {_render()}
        </LoadingOutlined>
    }

    return _render()
}

export default MoonBeasts
