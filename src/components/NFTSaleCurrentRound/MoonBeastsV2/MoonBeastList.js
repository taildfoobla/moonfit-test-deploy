import React from 'react'
import {range} from "../../../utils/array"
import MoonBeastItem from './MoonBeastItem';
import MoonBeastItemMinting from './MoonBeastItemMinting';

const MoonBeasts = ({moonBeasts, moonBeastMinting = 0}) => {
    const _renderMinting = () => {
        if (!moonBeastMinting) {
            return null
        }

        return range(1, moonBeastMinting).map(i => <MoonBeastItemMinting isMinting={true} key={i}/>)
    }

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
                moonBeasts.map((mb, idx) => <MoonBeastItem moonBeast={mb} key={`${idx}_${mb.tokenId}`} />)
            }
        </div>
    )
}

export default MoonBeasts
