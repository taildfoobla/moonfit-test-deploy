import React from 'react'
import {Image} from 'antd'
import {getNFTScanUrl} from '../../utils/blockchain'
import {BLC_CONFIGS} from '../../configs/blockchain'
import classNames from 'classnames'

const {MINT_PASS_SC} = BLC_CONFIGS

const MintPassNFT = ({tokenId, name, imageUrl}) => {
    const renderNFTLink = (address, tokenId) => {
        const url = getNFTScanUrl(address.toLowerCase(), tokenId)
        return (
            <a href={url} target={'_blank'} rel={'noreferrer'} className={'text-[#A16BD8] text-sm normal-case'}>
                View on NFTScan
            </a>
        )
    }

    return (
        <div className={classNames('flex flex-col justify-center items-center mt-4 col-span-2 mp-item')}>
            <div className={'flex'}>
                <Image width={'100%'}
                       className={'mp-image'}
                       src={imageUrl}
                       alt={name}
                />
            </div>
            <div className={'flex flex-col normal-case race-sport-font text-sm mt-4'}>
                <span className={'secondary-color text-center'}>MoonFit</span>
                <span className={'primary-color text-center mt-1'}>Mint Pass</span>
                <span className={'primary-color text-center mt-1'}>#{tokenId}</span>
            </div>
            <div className={'flex normal-case my-2 z-10'}>
                {renderNFTLink(MINT_PASS_SC, tokenId)}
            </div>
        </div>
    )
}

export default MintPassNFT
