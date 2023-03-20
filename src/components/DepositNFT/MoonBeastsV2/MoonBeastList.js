import React from 'react'
import MoonBeastItem from './MoonBeastItem';

const MoonBeasts = ({ moonBeasts, user }) => {
    if (moonBeasts.length === 0) {
        return (
            <div className={'mt-8 mb-3'}>
                <div className={'text-center text-white normal-case font-normal'}>
                    No MoonBeast
                </div>
            </div>
        )
    }

    return (
        <div className={"grid grid-cols-4 lg:grid-cols-6 gap-4"}>
            {
                moonBeasts.map((mb, index) => <MoonBeastItem  user={user} moonBeast={mb} key={`${index}_${mb.wallet}_${mb.tokenId || mb.index}`} />)
            }
        </div>
    )
}

export default MoonBeasts
