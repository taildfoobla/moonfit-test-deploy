import React from 'react'
import {getNFTScanUrl,} from "../utils/blockchain"

const NFTLink = ({address, tokenId}) => {
    const url = getNFTScanUrl(address.toLowerCase(), tokenId)

    return (
        <a href={url} target={'_blank'} rel={'noreferrer'} className={'text-[#A16BD8] text-sm normal-case'}>
            View on NFTScan
        </a>
    )
}

export default NFTLink
