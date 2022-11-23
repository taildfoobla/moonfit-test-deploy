import React, {useEffect, useState} from 'react'
import {Image, Tooltip} from "antd"
import getNFTMetadata from '../../../utils/moonbeast-metadata'
import {getTokenInfoOfOwnerByIndex} from '../../../services/smc-moon-beast'
import NFTLink from '../../NFTLink'
import configs from "../../../configs";
import MoonBeastItemMinting from './MoonBeastItemMinting';
import socialIcon from '../../../assets/images/icons/social.svg'
import enduranceIcon from '../../../assets/images/icons/endurance.svg'
import luckIcon from '../../../assets/images/icons/luck.svg'
import speedIcon from '../../../assets/images/icons/speed.svg'

const {MOONBEAST_SC} = configs

const MoonBeastItem = ({moonBeast = {}}) => {
    const [isLoading, setIsLoading] = useState(true)
    // eslint-disable-next-line no-unused-vars
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
        console.log(moonBeast);
        if (!moonBeast.tokenId) {
            const {tokenId, uri} = await getTokenInfoOfOwnerByIndex(moonBeast.wallet, moonBeast.index)

            moonBeast.tokenId = parseInt(tokenId, 10)
            moonBeast.uri = uri
        }

        return getNFTMetadata(moonBeast.getUri()).then(response => {
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
                <span className={'secondary-color text-center nft-gender'}>{preName}</span>
                <span className={'primary-color text-center nft-number-name mt-1'}>{numberName} {moonBeast.tokenId}</span>
            </div>
        )
    }

    if (isLoading) {
        return <MoonBeastItemMinting/>
    }

    return (
        <div data-token-id={moonBeast.tokenId || `${moonBeast.wallet}_${moonBeast.index}`}
             className="flex flex-col justify-center items-center mt-4 col-span-2 nft-item">
            <div className="flex nft-item-image">
                <Image
                    className="nft-wrap-img"
                    width={'100%'}
                    src={imageUrl || 'https://bafkreidtf37bm46cpkbanxxbnz6ykcqrtf2na4qdrdfvfgzlrasyov6zoe.ipfs.nftstorage.link/'}
                    alt={name}
                />
                <span className={`nft-item-rarity ${String(attributes.Rarity).toLowerCase()}`}>{attributes.Rarity}</span>
            </div>
            <div className="attributes">
                <div className="nft-attribute">
                    <Tooltip placement="top" title="Social">
                        <img src={socialIcon} alt="Social"/>
                        <span className="attribute-value">{attributes.Social || ''}</span>
                    </Tooltip>
                </div>
                <div className="nft-attribute">
                    <Tooltip placement="top" title="Endurance">
                        <img src={enduranceIcon} alt="Endurance"/>
                        <span className="attribute-value">{attributes.Endurance || ''}</span>
                    </Tooltip>
                </div>
                <div className="nft-attribute">
                    <Tooltip placement="top" title="Luck">
                        <img src={luckIcon} alt="Luck"/>
                        <span className="attribute-value">{attributes.Luck || ''}</span>
                    </Tooltip>
                </div>
                <div className="nft-attribute">
                    <Tooltip placement="top" title="Speed">
                        <img src={speedIcon} alt="Speed"/>
                        <span className="attribute-value">{attributes.Speed || ''}</span>
                    </Tooltip>
                </div>
            </div>
            {renderNFTName()}
            <div className="flex normal-case mt-2">
                <NFTLink address={MOONBEAST_SC} tokenId={moonBeast.tokenId}/>
            </div>
        </div>
    )
}

export default MoonBeastItem
