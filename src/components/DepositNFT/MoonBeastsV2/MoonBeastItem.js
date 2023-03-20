import React, {useContext, useEffect, useState} from 'react'
import {Image, Tooltip} from "antd"
import getNFTMetadata from '../../../utils/moonbeast-metadata'
import {getTokenInfoOfOwnerByIndex} from '../../../services/smc-moon-beast'
import MoonBeastItemMinting from './MoonBeastItemMinting';
import socialIcon from '../../../assets/images/icons/social.svg'
import enduranceIcon from '../../../assets/images/icons/endurance.svg'
import luckIcon from '../../../assets/images/icons/luck.svg'
import speedIcon from '../../../assets/images/icons/speed.svg'
import LoadingOutlined from '../../shared/LoadingOutlined'
import {depositNFT, updateTransactionHash} from '../../../utils/api'
import {
    sendTransaction,
} from "../../../utils/blockchain"
import WalletAuthContext from "../../../contexts/WalletAuthContext";
import * as notification from "../../../utils/notification";
import {getTransactionReceipt} from "../../../services/smc-common";

const MoonBeastItem = ({moonBeast = {}, user}) => {
    const [isLoading, setIsLoading] = useState(true)
    const [isDeposit, setIsDeposit] = useState(false)
    const [transaction, setTransaction] = useState({})
    const [name, setName] = useState('MoonBeast NFT')
    const [imageUrl, setImageUrl] = useState(true)
    const [attributes, setAttributes] = useState({})
    const [isConfirmedTx, setIsConfirmedTx] = useState(false)
    const { provider, connector} = useContext(WalletAuthContext)

    useEffect(() => {
        fetchData().then()
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const fetchData = async () => {
        setIsLoading(true)
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
        })
    }


    const confirmTransaction = async (txHash) => {
        const receipt = await getTransactionReceipt(txHash)

        if (receipt) {
            if (!receipt.status) {
                notification.close(txHash)
                notification.sentTransactionSuccess(txHash)

                setTransaction({
                    ...transaction,
                    success: true,
                })
                return
            }
        }

        setTimeout(() => {
            confirmTransaction(txHash)
        }, 3000)
    }


    const renderNFTName = () => {
        const nameArr = String(name || '').split(' ')
        const preName = nameArr[0] || 'MoonFit'
        const numberName = nameArr[1]

        return (
            <div className={'flex flex-col normal-case race-sport-font text-sm mt-4'}>
                <span className={'secondary-color text-center nft-gender'}>{preName}</span>
                <span className={'primary-color text-center nft-number-name mt-1'}>{numberName}</span>
            </div>
        )
    }

    if (isLoading) {
        return <MoonBeastItemMinting/>
    }

    const depositMoonBeast = async () => {
        setIsDeposit(true)
        const response = await depositNFT({
            user_id: user.id,
            wallet_address: moonBeast.wallet_address,
            value: 1,
            token_id: moonBeast.tokenId,
            currency: 'MoonBeast',
            type: 'MoonBeast',
        })

        const {transaction: transactionData} = response
        transactionData.gas = String(transactionData.gas)

        const txHash = await sendTransaction(provider, connector, transactionData).catch(() => Promise.resolve(null))
        if (txHash) {
            updateTransactionHash({transaction_id: response.id, transaction_hash: txHash}).then()
            setTransaction({
                transactionId: response.id,
                transactionData,
                success: false,
            })

            setTimeout(() => {
                confirmTransaction(txHash)
            }, 3000)

            notification.destroy()
            notification.sentTransactionSuccess(txHash)
        } else {
            setIsDeposit(false)
        }
    }

    const renderButtonDeposit = () => {
        if (isDeposit) {
            return (
                <button type="button" className="button button-secondary btn-deposit" disabled={true}>
                    {transaction.success ? 'Deposited': <LoadingOutlined />}
                </button>
            )
        }

        return (
            <button onClick={depositMoonBeast} type="button" className="button button-secondary btn-deposit">
                Deposit
            </button>
        )
    }

    return (
        <div data-token-id={moonBeast.tokenId || `${moonBeast.wallet}_${moonBeast.index}`}
             className="flex flex-col justify-center items-center mt-4 col-span-2 nft-item">
            <div className="flex nft-item-image">
                <Image
                    className="nft-wrap-img"
                    width={'100%'}
                    preview={false}
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
            <div className="normal-case mt-2">
                <div>
                    {renderButtonDeposit()}
                </div>
            </div>
        </div>
    )
}

export default MoonBeastItem
