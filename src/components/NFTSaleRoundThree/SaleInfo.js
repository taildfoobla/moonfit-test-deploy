import React, {useContext, useEffect, useState} from 'react'
import LoadingOutlined from "../shared/LoadingOutlined";
import WalletAuthContext from '../../contexts/WalletAuthContext'
import PackItemInfo from './PackItemInfo'
import LockMintPass from '../../assets/images/icons/lock-mintpass.svg'
import {WITH_MINT_PASS_PACK, WITHOUT_MINT_PASS_PACK} from '../../constants/packs'
import {
    mintNFTWithMintPassData,
    mintNFTWithoutMintPassData,
    NFT_SALE_ADDRESS,
    smcContract,
    lockMintPass,
    unlockMintPass,
    unlockMintPass2,
    getMintPassLooking,
} from "../../services/smc-ntf-sale-round-34";
import {buyNFT, getTransactionReceipt} from "../../services/smc-common";
import {checkApprove, MINT_PASS_ADDRESS, setApprovalForAllData} from "../../services/smc-mint-pass";
import * as notification from "../../utils/notification";
import Bluebird from "bluebird";
import BigNumber from "bignumber.js";
import EventBus from "../../utils/event-bus";

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
    const [buttonText, setButtonText] = useState(BUTTON_TEXT.MINTING)
    const _oldSelectedPack = {
        1: {tab: 1, ...(WITH_MINT_PASS_PACK.find(item => item.isRecommend))},
        2: {tab: 2, ...(WITHOUT_MINT_PASS_PACK.find(item => item.isRecommend))},
    }
    const [selectedPack, setSelectedPack] = useState(_oldSelectedPack[1])
    const [oldSelectedPack, setOldSelectedPack] = useState(_oldSelectedPack)

    useEffect(() => {
        setListPack(tab === 1 ? WITH_MINT_PASS_PACK : WITHOUT_MINT_PASS_PACK)
    }, [tab])

    useEffect(() => {
        if (isConnected && wallet.account) {
            _checkApprove()
        }
    }, [wallet, isConnected]) // eslint-disable-line


    function _checkApprove() {
        checkApprove(wallet.account, NFT_SALE_ADDRESS).then(approve => {
            setMintPassApprove(approve)
        })
    }

    const confirmTransaction = async (txHash, options, callback) => {
        const receipt = await getTransactionReceipt(txHash)

        if (receipt) {
            console.log(receipt);
            if (typeof callback === 'function') {
                callback()
            }

            notification.close(txHash)

            if (!receipt.status) {
                notification.sentTransactionFailed(txHash, {...options, message: 'Transaction Failed'})
            } else {
                notification.sentTransactionSuccess(txHash, options)
            }

            return
        }

        await Bluebird.delay(3000)

        return confirmTransaction(txHash, options, callback)
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

    const _getTransaction = () => {
        let tx = {
            to: NFT_SALE_ADDRESS,
            from: wallet.account,
            // gasPrice: `${gasPrice}`,
            maxPriorityFeePerGas: null,
            maxFeePerGas: null,
        }

        if (tab === 2) {
            return {
                transaction: {
                    ...tx,
                    value: selectedPack.price.toString(),
                    data: mintNFTWithoutMintPassData(selectedPack.pack)
                },
                text: BUTTON_TEXT.MINTING,
                txText: 'mint'
            }
        }

        if (selectedPack.pack > props.availableMintPass) {
            const lockNumber = selectedPack.pack - props.availableMintPass
            const tokenIds = props.mintPasses.slice(0, lockNumber).map(item => item.tokenId)
            console.log(`Lock ${lockNumber} MintPass`, tokenIds)

            return {
                transaction: {
                    ...tx,
                    value: selectedPack.price.toString(),
                    data: lockMintPass(tokenIds)
                },
                text: BUTTON_TEXT.LOCKING,
                txText: `lock ${lockNumber} MintPass`
            }
        }

        return {
            transaction: {
                ...tx,
                value: selectedPack.price.toString(),
                data: mintNFTWithMintPassData(selectedPack.pack)
            },
            text: BUTTON_TEXT.MINTING,
            txText: `mint`
        }
    }

    const handleLockMintPass = async () => {
        setLoading(true)
        setButtonText(BUTTON_TEXT.MINTING)

        try {
            const {transaction, text, txText} = await _getTransaction()
            setButtonText(text)
            if (BUTTON_TEXT.MINTING === text) {
                props.setMoonBeastMinting(selectedPack.pack)
            }

            if (transaction && transaction.data) {
                try {
                    const txHash = await buyNFT(provider, connector, smcContract, transaction)

                    if (txHash) {
                        notification.sentTransactionSuccess(txHash, {
                            message: 'Transaction Sending...',
                            description: `The hash of ${txText} transaction is`
                        })
                        return confirmTransaction(txHash, {
                            message: 'Transaction Sent',
                            description: `The hash of ${txText} transaction is`
                        }, () => {
                            props.setMoonBeastMinting(0)
                            props.onRefresh()
                            EventBus.$dispatch('buyNFT', {})
                            setLoading(false)
                        }).then()
                    }

                    setLoading(false)
                } catch (e) {
                    props.setMoonBeastMinting(0)
                    notification.error(e.message, e)
                    setLoading(false)
                }
            }
        } catch (e) {
            props.setMoonBeastMinting(0)
            notification.error(e.message, e)
            setLoading(false)
        }
    }

    const _unlockMintPass = async (contractAddress = NFT_SALE_ADDRESS, version = 2) => {
        setButtonText(BUTTON_TEXT.UNLOCKING)
        setLoading(true)
        console.log('Unlock', {contractAddress, version})
        const tx = {
            to: contractAddress,
            from: wallet.account,
            // gasPrice: `${gasPrice}`,
            maxPriorityFeePerGas: null,
            maxFeePerGas: null,
            data: version  === 1 ? unlockMintPass() : unlockMintPass2(),
        }

        try {
            const txHash = await buyNFT(provider, connector, smcContract, tx)

            if (txHash) {
                notification.sentTransactionSuccess(txHash, {
                    message: 'Transaction Sending...',
                    description: `The hash of unlock MintPass transaction is`
                })
                return confirmTransaction(txHash, {
                    message: 'Transaction Sent',
                    description: `The hash of unlock MintPass transaction is`
                }, () => {
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
        const text = status ? BUTTON_TEXT.APPROVING : BUTTON_TEXT.REJECTING
        setLoading(true)
        setButtonText(text)

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
                notification.sentTransactionSuccess(txHash, {
                    message: 'Transaction Sending...',
                    description: `The hash of ${text} for all MintPass transaction is`
                })
                return confirmTransaction(txHash, {
                    message: 'Transaction Sent',
                    description: `The hash of ${text} for all MintPass transaction is`
                }, () => {
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

    window.getMintPassLooking = () => getMintPassLooking(wallet.account)
    window.unlockMintPass = _unlockMintPass
    window.approvalForAllMintPass = _approvalForAllMintPass

    const countMintPass = () => {
        return props.availableMintPass + props.mintPasses.length
    }

    const _renderButton = () => {
        if (loading) {
            return (
                <button className="button button-secondary" type="button">
                    <LoadingOutlined className='text-white' size={20}/>
                    <span className='ml-2'>{buttonText}</span>
                </button>
            )
        }

        if (!selectedPack.amount || selectedPack.tab !== tab) {
            return (
                <button className="button button-secondary disabled" type="button" disabled style={{padding: '0 10px'}}>
                    <img className="ml-2" src={LockMintPass} alt=""/>
                    <span>Select a pack</span>
                </button>
            )
        }

        if (tab === 1) {
            if (!mintPassApprove) {
                return (
                    <button className="button button-secondary" type="button"
                            onClick={() => _approvalForAllMintPass(true)}>
                        <img className="mr-2" src={LockMintPass} alt=""/>
                        <span>Approve</span>
                    </button>
                )
            }

            if (countMintPass() < selectedPack.amount) {
                return (
                    <button className="button button-secondary disabled" type="button" disabled>
                        <img className="ml-3" src={LockMintPass} alt=""/>
                        <span>Insufficient MintPass</span>
                    </button>
                )
            }

            if (selectedPack.amount > props.availableMintPass) {
                return (
                    <button className="button button-secondary" type="button" onClick={handleLockMintPass}>
                        <img className="ml-3" src={LockMintPass} alt=""/>
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
        const availableMintPass = props.isLoading || Number.isNaN(props.availableMintPass) ?
            <span className="dot-flashing"/> : (props.availableMintPass + props.mintPasses.length)

        return (
            <div className='text-center normal-case font-semibold mb-5'>
                <p className='text-white text-[18px] leading-normal poppins-font mb-0'>
                    You have {availableMintPass} Mint Pass available
                </p>
                <p className='text-[#A8ADC3] leading-7 text-[20px] w-3/4 m-auto'>
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

            <ul className='packs mb-2 p-0'>
                {
                    listPack.map((item, index) => {
                        let className = `pack ${selectedPack.amount === item.amount ? 'active' : ''}`
                        if (item.amount > countMintPass()) {
                            className = `${className} disabled`
                        }

                        return (
                            <PackItemInfo key={index} className={className} item={item}
                                          onClick={() => onChangePack(item)}/>
                        )
                    })
                }
            </ul>
            <hr className={'card-body-separator'}/>
            <div className='unlock-mintpass flex justify-between items-center'>
                <div className='left'>
                    <span className='text-[16px] text-[#A8ADC3] fee-info'>FEE:</span>
                    <p className='text-[20px] text-[#4CCBC9] race-sport-font fee-amount'>
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
