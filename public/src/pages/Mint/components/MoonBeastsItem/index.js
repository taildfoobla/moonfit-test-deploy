import React, {useEffect, useState} from 'react'
import "./styles.less"
import {Image, Tooltip} from "antd"

import NFTLink from '../NFTLink'
import configs from "../../../../core/configs-app"
import socialIcon from "../../../../assets/images/mint/social.svg"
import enduranceIcon from '../../../../assets/images/mint/endurance.svg'
import luckIcon from '../../../../assets/images/mint/luck.svg'
import speedIcon from '../../../../assets/images/mint/speed.svg'

const {MOONBEAST_SC} = configs

const MoonBeastItem = ({moonBeast = {}}) => {
    return (
      
        <div 
             className="flex flex-col justify-center items-center mt-4 col-span-2 nft-item">
            <div className="flex nft-item-image">
                <div className='network-icon'>
                    <img src={moonBeast?.chainIcon} alt={moonBeast?.chainId}/>
                </div>
                <Image
                    className="nft-wrap-img"
                    width={'100%'}
                    height={'100%'}
                    src={moonBeast?.image_url || 'https://bafkreidtf37bm46cpkbanxxbnz6ykcqrtf2na4qdrdfvfgzlrasyov6zoe.ipfs.nftstorage.link/'}
                    alt={moonBeast?.name}
                />
                <span className={`nft-item-rarity ${moonBeast?.BeastRarity?.name==="Uncommon"?"uncommon":""}`}>{moonBeast?.BeastRarity?.name}</span>
            </div>
            <div className="attributes">
                <div className="nft-attribute">
                    <Tooltip placement="top" title="Social">
                        <img src={socialIcon} alt="Social"/>
                        <span className="attribute-value">{moonBeast?.stamina + moonBeast?.item_stamina || ''}</span>
                    </Tooltip>
                </div>
                <div className="nft-attribute">
                    <Tooltip placement="top" title="Endurance">
                        <img src={enduranceIcon} alt="Endurance"/>
                        <span className="attribute-value">{moonBeast?.endurance + moonBeast?.item_endurance|| ''}</span>
                    </Tooltip>
                </div>
                <div className="nft-attribute">
                    <Tooltip placement="top" title="Luck">
                        <img src={luckIcon} alt="Luck"/>
                        <span className="attribute-value">{moonBeast?.luck + moonBeast?.item_luck || ''}</span>
                    </Tooltip>
                </div>
                <div className="nft-attribute">
                    <Tooltip placement="top" title="Speed">
                        <img src={speedIcon} alt="Speed"/>
                        <span className="attribute-value">{moonBeast?.speed + moonBeast?.item_speed || ''}</span>
                    </Tooltip>
                </div>
            </div>
            <div className={'name flex flex-col normal-case race-sport-font text-sm mt-4'}>
                <span className={'secondary-color text-center nft-gender'}>{moonBeast?.nft_name.split(" ")[0]}</span>
                <span className={'primary-color text-center nft-number-name mt-1'}>{moonBeast?.nft_name.split(" ")[1]}</span>
            </div>
            <div className="view flex normal-case mt-2">
                <NFTLink address={MOONBEAST_SC} tokenId={moonBeast?.chain_id}/>
            </div>
        </div>
    )
}

export default MoonBeastItem
