import React, {useContext, useState} from 'react'
import {Image} from "antd"
import LoadingOutlined from '../shared/LoadingOutlined'
import WalletAuthContext from "../../contexts/WalletAuthContext";
import {depositToMobileApp} from './_depositToMobileApp'

const MoonBeastItem = ({item, user}) => {
    const [isDeposit, setIsDeposit] = useState(false)
    const [transaction, setTransaction] = useState({deposited: false})
    const { provider, connector} = useContext(WalletAuthContext)


    const renderNFTName = () => {
        const nameArr = String(item.name || '').split(' ')
        const preName = nameArr[0] || 'MoonFit'
        const numberName = nameArr[1]

        return (
            <div className={'flex flex-col normal-case race-sport-font text-sm mt-4'}>
                <span className={'secondary-color text-center nft-gender'}>{preName}</span>
                <span className={'primary-color text-center nft-number-name mt-1'}>{numberName}</span>
            </div>
        )
    }

    const depositNFT = async () => {
        setIsDeposit(true)
        const response = await depositToMobileApp(provider, connector,{
            user_id: user.id,
            wallet_address: user.wallet_address,
            value: 1,
            token_id: item.tokenId,
            currency: item.type,
            type: item.type,
        }, setTransaction)

        if (!response || !response.txHash) {
            setIsDeposit(false)
        }

        setTransaction(response || {})
    }

    const renderButtonDeposit = () => {
        if (isDeposit) {
            return (
                <button type="button" className="button button-secondary btn-deposit" disabled={true}>
                    {transaction.deposited ? 'Deposited': <LoadingOutlined />}
                </button>
            )
        }

        return (
            <button onClick={depositNFT} type="button" className="button button-secondary btn-deposit">
                Deposit
            </button>
        )
    }

    return (
        <div data-token-id={`${item.type}_${item.tokenId}`}
             className="flex flex-col justify-center items-center mt-4 col-span-2 nft-item">
            <div className="flex nft-item-image">
                <Image
                    className="nft-wrap-img"
                    width={'100%'}
                    preview={false}
                    src={item.imageUrl || 'https://bafkreidtf37bm46cpkbanxxbnz6ykcqrtf2na4qdrdfvfgzlrasyov6zoe.ipfs.nftstorage.link/'}
                    alt={item.name}
                />
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
