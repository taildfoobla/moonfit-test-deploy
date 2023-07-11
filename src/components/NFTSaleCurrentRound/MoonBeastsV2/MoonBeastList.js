import React from 'react'
import { range } from "../../../utils/array"
import MoonBeastItem from './MoonBeastItem';
import MoonBeastItemMinting from './MoonBeastItemMinting';

const MoonBeasts = ({ moonBeasts, moonBeastMinting = 0, isExpired = false, isLoading = true }) => {
    const _renderMinting = () => {
        if (!moonBeastMinting) {
            return null
        }

        return range(1, moonBeastMinting).map(i => <MoonBeastItemMinting isMinting={true} key={i} />)
    }

    if (moonBeasts.length === 0 && !moonBeastMinting) {
        return (
            <div className={'mt-5 mb-3'}>
                <div className={'text-center text-white normal-case font-semibold text-[18px] leading-normal'}>
                    { isLoading ? '' : <>
                        <p className="mb-0">Please lock your Mint Pass to secure your purchase first,</p>
                        <p>then click "MINT NFT" button to mint your NFT.</p>
                    </> }
                </div>
            </div>
        )
    }

    return (
        <div className={"grid grid-cols-4 lg:grid-cols-6 gap-4"}>
            {_renderMinting()}
            {
                moonBeasts.map((mb, index) => <MoonBeastItem moonBeast={mb} key={`${index}_${mb.wallet}_${mb.tokenId || mb.index}`} />)
            }
        </div>
    )
}

export default MoonBeasts
