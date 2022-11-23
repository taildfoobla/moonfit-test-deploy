import React, { useContext, useEffect, useRef, useState } from 'react'
import {Image, notification} from "antd"
import {range} from "../../utils/array"
import NFTSkeleton from "../NFTSkeleton"
import getNFTMetadata from '../../utils/moonbeast-metadata'
import NFTLink from '../NFTLink'
import configs from "../../configs";
const {MOONBEAST_SC} = configs

const MoonBeasts = ({moonBeast= 0}) => {
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)
    const [name, setName] = useState('MoonBeast NFT')
    const [imageUrl, setImageUrl] = useState(true)
    const [attributes, setAttributes] = useState({})

    useEffect(() => {
        fetchData().then()
    }, [])


    const fetchData = async () => {
        setIsLoading(true)
        setIsError(false)
        return getNFTMetadata(moonBeast.uri).then(response => {
            setName(response.name)
            setImageUrl(response.image)
            setAttributes(response.attributes)
            setIsLoading(false)
        }).catch(e => {
            setTimeout(fetchData, 3000)
            setIsError(true)
        })
    }

    const renderNFTName = () => {
        const nameArr = String(name || '').split(' ')
        const preName = nameArr[0] || 'MoonFit'
        const numberName = nameArr[1]

        return (
            <div className={'flex flex-col normal-case race-sport-font text-sm mt-4'}>
                <span className={'secondary-color text-center'}>{preName}</span>
                <span className={'primary-color text-center mt-1'}>{numberName}</span>
            </div>
        )
    }

    if (isLoading) {
        return (
            <div data-token-id={moonBeast.tokenId} className={'flex flex-col justify-center items-center mt-4 col-span-2 nft-item'}>
                {moonBeast.tokenId} isLoading
            </div>)
    }

    return (
        <div data-token-id={moonBeast.tokenId}
             className={'flex flex-col justify-center items-center mt-4 col-span-2 nft-item'}>
            <div className={'flex'}>
                <Image
                    className="nft-wrap-img"
                    width={'100%'}
                    src={imageUrl || 'https://bafkreidtf37bm46cpkbanxxbnz6ykcqrtf2na4qdrdfvfgzlrasyov6zoe.ipfs.nftstorage.link/'}
                    alt={name}
                />
            </div>
            {renderNFTName()}
            <div className={'flex normal-case mt-2'}>
                <NFTLink address={MOONBEAST_SC} tokenId={moonBeast.tokenId}/>
            </div>
        </div>
    )
}

export default MoonBeasts
