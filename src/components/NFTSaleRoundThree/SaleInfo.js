import React, {useContext, useEffect, useState} from 'react'
import LoadingOutlined from "../shared/LoadingOutlined";
import WalletAuthContext from '../../contexts/WalletAuthContext'
import PackItemInfo from './PackItemInfo'
import LockMintPass from '../../assets/images/icons/lock-mintpass.svg'
import {WITH_MINT_PASS_PACK, WITHOUT_MINT_PASS_PACK} from '../../constants/packs'
import {
    lockMintPass,
    mintNFTWithMintPassData,
    mintNFTWithoutMintPassData,
    NFT_SALE_ADDRESS,
    smcContract,
    unlockMintPass
} from "../../services/smc-ntf-sale-round-34";
import {buyNFT, getTransactionReceipt} from "../../services/smc-common";
import {checkApprove, MINT_PASS_ADDRESS, setApprovalForAllData} from "../../services/smc-mint-pass";
import * as notification from "../../utils/notification";
import Bluebird from "bluebird";
import BigNumber from "bignumber.js";

const BUTTON_TEXT = {
    MINTING: 'Minting',
    LOCKING: 'Locking',
    UNLOCKING: 'Unlocking',
    APPROVING: 'Approving',
    REJECTING: 'Rejecting',
}

const SaleInfo = (props) => {
    const {isConnected, wallet, provider, connector, showWalletSelectModal} = useContext(WalletAuthContext)
    const [tab, setTab] = useState(1)
    const [loading, setLoading] = useState(false)
    const [mintPassApprove, setMintPassApprove] = useState(false)
    const [listPack, setListPack] = useState([])
    const [selectedPack, setSelectedPack] = useState({})
    const [oldSelectedPack, setOldSelectedPack] = useState({})
    const [buttonText, setButtonText] = useState(BUTTON_TEXT.MINTING)

    useEffect(() => {
        setListPack(tab === 1 ? WITH_MINT_PASS_PACK : WITHOUT_MINT_PASS_PACK)
    }, [tab])

    useEffect(() => {
        if (isConnected && wallet.account) {
            _checkApprove()
        }
    }, [wallet, isConnected])


    function _checkApprove() {
        checkApprove(wallet.account, NFT_SALE_ADDRESS).then(approve => {
            setMintPassApprove(approve)
        })
    }

    const confirmTransaction = async (txHash, callback) => {
        const receipt = await getTransactionReceipt(txHash)

        if (receipt) {
            if (typeof callback === 'function') {
                callback()
            }

            notification.close(txHash)

            if (!receipt.status) {
                notification.sentTransactionFailed(txHash)
            } else {
                notification.sentTransactionSuccess(txHash)
            }

            return
        }

        await Bluebird.delay(3000)

        return confirmTransaction(txHash, callback)
    }

    const onChangePack = (pack) => {
        setSelectedPack({...pack, tab})
        setOldSelectedPack({
            ...oldSelectedPack,
            [tab]: {...pack, tab},
        })
    }

    const onChangeTab = (value) => {
        setTab(value)
        setSelectedPack({...(oldSelectedPack[value] || {}), tab: value})
    }

    const handleLockMintPass = async () => {
        setLoading(true)
        setButtonText(BUTTON_TEXT.MINTING)
        let tx = {
            to: NFT_SALE_ADDRESS,
            from: wallet.account,
            // gasPrice: `${gasPrice}`,
            maxPriorityFeePerGas: null,
            maxFeePerGas: null,
        }

        if (tab === 2) {
            try {
                tx = {
                    ...tx,
                    value: selectedPack.price.toString(),
                    data: mintNFTWithoutMintPassData(selectedPack.pack)
                }

                setLoading(false)
            } catch (e) {
                notification.error(e.message, e)
                setLoading(false)
                return
            }
        } else {
            if (selectedPack.pack > props.availableMintPass) {
                setButtonText(BUTTON_TEXT.LOCKING)
                const lockNumber = selectedPack.pack - props.availableMintPass
                const tokenIds = props.mintPasses.slice(0, lockNumber).map(item => item.tokenId)
                console.log(`Lock ${lockNumber} MintPass`, tokenIds)
                tx = {
                    ...tx,
                    value: selectedPack.price.toString(),
                    data: lockMintPass(tokenIds)
                }
            } else {
                tx = {
                    ...tx,
                    value: selectedPack.price.toString(),
                    data: mintNFTWithMintPassData(selectedPack.pack)
                }
            }
        }

        if (tx && tx.data) {
            try {
                const txHash = await buyNFT(provider, connector, smcContract, tx)
                props.setMoonBeastMinting(selectedPack.pack)

                if (txHash) {
                    notification.destroy()
                    notification.sentTransactionSuccess(txHash)
                    return confirmTransaction(txHash, () => {
                        props.setMoonBeastMinting(0)
                        props.onRefresh()
                        setLoading(false)
                    }).then()
                }

                setLoading(false)
            } catch (e) {
                notification.error(e.message, e)
                setLoading(false)
            }
        }
    }

    const _unlockMintPass = async () => {
        setButtonText(BUTTON_TEXT.UNLOCKING)
        setLoading(true)
        const tx = {
            to: NFT_SALE_ADDRESS,
            from: wallet.account,
            // gasPrice: `${gasPrice}`,
            maxPriorityFeePerGas: null,
            maxFeePerGas: null,
            data: unlockMintPass()
        }

        try {
            const txHash = await buyNFT(provider, connector, smcContract, tx)

            if (txHash) {
                notification.sentTransactionSuccess(txHash)
                return confirmTransaction(txHash, () => {
                    props.onRefresh()
                    setLoading(false)
                }).then()
            }

            setLoading(false)
        } catch (e) {
            notification.error(e.message, e)
            setLoading(false)
        }
    }

    const _approvalForAllMintPass = async status => {
        setLoading(true)
        setButtonText(status ? BUTTON_TEXT.APPROVING : BUTTON_TEXT.REJECTING)

        const tx = {
            to: MINT_PASS_ADDRESS,
            from: wallet.account,
            maxPriorityFeePerGas: null,
            maxFeePerGas: null,
            data: setApprovalForAllData(NFT_SALE_ADDRESS, !!status)
        }

        try {
            const txHash = await buyNFT(provider, connector, smcContract, tx)

            if (txHash) {
                notification.sentTransactionSuccess(txHash)
                return confirmTransaction(txHash, () => {
                    _checkApprove()
                    setLoading(false)
                }).then()
            }

            setLoading(false)
        } catch (e) {
            notification.error(e.message, e)
            setLoading(false)
        }
    }

    window.unlockMintPass = _unlockMintPass
    window.approvalForAllMintPass = _approvalForAllMintPass

    const countMintPass = () => {
        return props.availableMintPass + props.mintPasses.length
    }

    const _renderButton = () => {
        if (loading) {
            return (
                <button className="button button-secondary" type="button">
                    <LoadingOutlined className='text-white'/>
                    <span className='ml-2'>{buttonText}</span>
                </button>
            )
        }

        if (!selectedPack.amount || selectedPack.tab !== tab) {
            return (
                <button className="button button-secondary disabled" type="button" disabled>
                    <img className="mr-2" src={LockMintPass} alt=""/>
                    <span>Select a pack</span>
                </button>
            )
        }

        if (tab === 1) {
            if (!mintPassApprove) {
                return (
                    <button className="button button-secondary" type="button" onClick={() => _approvalForAllMintPass(true)}>
                        <img className="mr-2" src={LockMintPass} alt=""/>
                        <span>Approve to Looking MintPass</span>
                    </button>
                )
            }

            if (countMintPass() < selectedPack.amount) {
                return (
                    <button className="button button-secondary disabled" type="button" disabled>
                        <img className="mr-2" src={LockMintPass} alt=""/>
                        <span>Insufficient MintPass</span>
                    </button>
                )
            }

            if (selectedPack.amount > props.availableMintPass) {
                return (
                    <button className="button button-secondary" type="button" onClick={handleLockMintPass}>
                        <img className="mr-2" src={LockMintPass} alt=""/>
                        <span>Lock {selectedPack.amount - props.availableMintPass} MintPass</span>
                    </button>
                )
            }
        }

        return (
            <button className="button button-secondary" type="button" onClick={handleLockMintPass}>
                <img className="mr-2" src={LockMintPass} alt=""/>
                <span>Mint Pack {selectedPack.amount}</span>
            </button>
        )
    }

    const renderHead = () => {
        const availableMintPass = props.isLoading || Number.isNaN(props.availableMintPass) ? <span className="dot-flashing" /> : props.availableMintPass

        return (
            <div className='text-center normal-case font-semibold mb-5'>
                <p className='text-white text-[20px] mb-0'>
                    You have {availableMintPass} Mint Pass available
                </p>
                <p className='text-[#A8ADC3] text-[18px] w-3/4 m-auto'>
                    Each mint pass is one-time use only for buying 1
                    MoonBeast at a discounted price.
                </p>
            </div>
        )
    }

    const numberFormat = (number) => {
        return new BigNumber(number).toFormat(0)
    }

    return (
        <div className={'card-body-row flex flex-col purchase-moonbest'}>
            {renderHead()}

            <div className='flex justify-center normal-case tabs'>
                <div className={`tab ${tab === 1 ? 'active' : ''}`} onClick={() => onChangeTab(1)}>With Mint Pass</div>
                <div className={`tab ${tab === 2 ? 'active' : ''}`} onClick={() => onChangeTab(2)}>Without Mint Pass
                </div>
            </div>

            <ul className='packs p-0'>
                {
                    listPack.map((item, index) => {
                        let className = `pack flex justify-between items-center ${selectedPack.value === item.value ? 'active' : ''}`
                        if (item.amount > countMintPass()) {
                            className = `${className} disabled`
                        }

                        return (
                            <PackItemInfo key={index} className={className} item={item} onClick={() => onChangePack(item)} />
                        )
                    })
                }
            </ul>
            <hr className={'card-body-separator'}/>
            <div className='flex justify-between items-center'>
                <div className='left'>
                    <span className='text-[16px] text-[#A8ADC3]'>FEE:</span>
                    <p className='text-[20px] text-[#4CCBC9] race-sport-font'>
                        {selectedPack.tab === tab && selectedPack.value ? `${numberFormat(selectedPack.value)} $GLMR` : '\u00A0'}
                    </p>
                </div>

                <div className='right'
                     data-count-mint-pass={countMintPass()}
                     data-available-mint-pass={props.availableMintPass}
                     data-unlock-mint-pass={props.mintPasses.length}
                     data-mint-pass={props.mintPasses.map(item => item.tokenId).join(',')}>
                    {_renderButton()}
                </div>
            </div>
            {
                !isConnected &&
                <div className={'flex mt-8 justify-center form-mint-footer'} style={{marginTop: "30px"}}>
                    <div className="btn-connect">
                        <button type="button"
                                onClick={showWalletSelectModal}
                                className="button button-secondary">
                            <img className="mr-1" src={wallet} alt=""/> Connect Wallet
                        </button>
                    </div>
                </div>
            }
        </div>
    )
}

export default SaleInfo
