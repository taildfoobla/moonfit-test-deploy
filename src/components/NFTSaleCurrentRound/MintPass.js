import React from 'react'
import configs from '../../configs'
import {NFT_SALE_CURRENT_INFO} from "../../constants/blockchain"
import classNames from "classnames"
import NFTLink from '../NFTLink'
import LoadingOutlined from "../../components/shared/LoadingOutlined";
import mintPassUrl from '../../assets/images/mint-pass.jpeg'

const {MINT_PASS_SC} = configs
const {nftPerPass} = NFT_SALE_CURRENT_INFO

const MintPass = ({isLoading, mintPasses, onSelect, onSelectAll, children}) => {
    const noMintPass = (
        <div className={'my-3'}>
            <div className={'text-center text-white normal-case'}>You don't own any mint pass yet.</div>
            <div className={'text-center text-white normal-case'}>No Mint-Pass = No Beast or Beauty NFT mint.
            </div>
        </div>
    )

    const renderBadge = (mintPass) => {
        if (!mintPass.bought) {
            return null
        }

        return (<span className={'normal-case used-text'}>Used {`${mintPass.bought}/${nftPerPass}`}</span>)
    }

    const _renderMinPass = mintPasses.map((item, idx) => {
        const nameArr = item.name.split(' ')
        const preName = nameArr[0]
        const _className = classNames('flex flex-col justify-center items-center mt-4 col-span-2 mp-item', {
            'mp-used': item.isUsed,
            'is-out-of-slot': item.isOutOfSlot,
        })

        return (
            <div className={_className}
                 key={idx}
                 onClick={() => onSelect(item.tokenId)}>
                {renderBadge(item)}
                <div className={classNames('flex justify-center square-img-container nft-wrap-img', {
                    'mp-selected': item.isSelected,
                    'mp-out-of-slot': item.isOutOfSlot
                })}>
                    <img src={item.imageUrl || mintPassUrl} alt={item.name}/>
                </div>
                <div className={'flex flex-col normal-case race-sport-font text-sm mt-4'}>
                    <span className={'secondary-color text-center'}>{preName}</span>
                    <span className={'primary-color text-center mt-1'}>Mint Pass</span>
                    <span className={'primary-color text-center mt-1'}>#{item.tokenId}</span>
                </div>
                <div className={'flex normal-case my-2 z-10'}>
                    <NFTLink address={MINT_PASS_SC} tokenId={item.tokenId}/>
                </div>
            </div>
        )
    })

    const totalMintPassSelected = () => mintPasses.filter(item => item.isSelected).length

    const _render = () => (
        <div className={'card-body-row flex flex-col mt-3'}>
            <div className="flex justify-between">
                <div className={'flex card-body-row-title'}>
                    Select A Pass to Mint
                </div>
                <div className={'flex card-body-row-title cursor-pointer'} onClick={onSelectAll}>
                    Selected {totalMintPassSelected()}
                </div>
            </div>
            {
                mintPasses.length ? (
                    <>
                        <div className={"grid grid-cols-4 lg:grid-cols-6 gap-2 lg:gap-4"}>
                            {_renderMinPass}
                        </div>
                        {children}
                    </>
                ) : noMintPass
            }
        </div>
    )

    if (isLoading) {
        return <LoadingOutlined>
            {_render()}
        </LoadingOutlined>
    }

    return _render()
}

export default MintPass
