import React, { useContext, useEffect, useRef, useState } from 'react'
import BigNumber from 'bignumber.js'
import Bluebird from 'bluebird'
import WalletAuthContext from "../contexts/WalletAuthContext"
import * as notification from "../utils/notification"
import { switchNetwork } from "../utils/blockchain"
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import LoadingWrapper from "../components/shared/LoadingWrapper"
import Paths from "../routes/Paths"
import EnvWrapper from "../components/shared/EnvWrapper"
import { NFT_SALE_ROUNDS_INFO } from "../constants/blockchain"
import WalletAuthRequiredNFTSale from "../components/WalletAuthRequiredNFTSale"
import NFTStages from "../components/NFTStages"
import Header from '../components/NFTSaleCurrentRound/Header'
import ButtonMintNFT from '../components/NFTSaleCurrentRound/ButtonMintNFT'
import NFTSaleInfo from '../components/NFTSaleCurrentRound/NFTSaleInfo'
import MoonBeasts from '../components/NFTSaleCurrentRound/MoonBeastsV2/index'
import MintPass from '../components/NFTSaleCurrentRound/MintPass'

import {getTransactionReceipt} from "../services/smc-common";
import {getAvailableSlots, getSaleMaxAmount, getMintPass, getMoonBeast, buyNFTData, smcContract, NFT_SALE_ADDRESS} from '../services/smc-ntf-sale'
import {buyNFT} from '../services/smc-common'
import CurveBGWrapper from '../wrappers/CurveBG'
// import TwitterShareButton from '../components/shared/TwitterShare'

const NFT_SALE_CURRENT_INFO = NFT_SALE_ROUNDS_INFO.R3

const NFTSaleRoundThree = (props) => {
    const [loading, setLoading] = useState(true)
    const [isFetching, setIsFetching] = useState(true)
    const [saleInfoLoading, setSaleInfoLoading] = useState(true)
    const [mintPassLoading, setMintPassLoading] = useState(true)
    const [moonBeastLoading, setMoonBeastLoading] = useState(true)
    const [mintLoading, setMintLoading] = useState(false)
    const [mintPasses, setMintPasses] = useState([])
    const [moonBeasts, setMoonBeasts] = useState([])
    const [nftSaleQuantity, setNftSaleQuantity] = useState(NFT_SALE_CURRENT_INFO.amount)
    const [nftSaleAvailableQuantity, setNftSaleAvailableQuantity] = useState(NaN)
    const [moonBeastMinting, setMoonBeastMinting] = useState(0)
    const [isConfirmedTx, setIsConfirmedTx] = useState(false)
    const [mintAmount, setMintAmount] = useState(0)
    const [maxMintAmount, setMaxMintAmount] = useState(0)

    const mbRetrieverRef = useRef(0)

    const { isConnected, wallet, provider, connector } = useContext(WalletAuthContext)

    useEffect(() => {
        if (!!wallet.account) {
            setMintPasses([])
            setMoonBeasts([])
            fetchData().then()
        }
        notification.destroy()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [wallet.account])

    useEffect(() => {
        const interval = setInterval(() => {
            if (nftSaleAvailableQuantity !== 0) {
                _getAvailableSlots().then()
            }
        }, 30000);

        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [saleInfoLoading]);

    useEffect(() => {
        if (isConfirmedTx) {
            // console.log('Effect isConfirmedTx', isConfirmedTx)
            clearMbInterval()
            setMoonBeastMinting(0)
        }
        // return () => clearMbInterval()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isConfirmedTx])

    const clearMbInterval = () => {
        mbRetrieverRef.current && clearInterval(mbRetrieverRef.current)
        mbRetrieverRef.current = 0
    }

    const _getSaleMaxAmount = async () => {
        try {
            const value = await getSaleMaxAmount()

            if (!Number.isNaN(value)) {
                return setNftSaleQuantity(value)
            }
        }catch (e) {
            //
        }

        await Bluebird.delay(3000)
        return _getSaleMaxAmount()
    }

    setTimeout(_getSaleMaxAmount, 0)

    const confirmTransaction = async (txHash) => {
        const receipt = await getTransactionReceipt(txHash)

        if (receipt) {
            setTimeout(async () => {
                if (!isFetching) {
                    await fetchData(false)
                }

                setIsConfirmedTx(true)
            }, 500)

            if (!receipt.status) {
                notification.destroy()
                notification.sentTransactionFailed(txHash)
            }
        }
        return true
    }

    const _getAvailableSlots = async (isSetLoading = false) => {
        isSetLoading && setSaleInfoLoading(true)

        try {
            const value = await getAvailableSlots()

            if (!Number.isNaN(value)) {
                setNftSaleAvailableQuantity(value)
            } else {
                await Bluebird.delay(3000)
                return _getAvailableSlots(isSetLoading)
            }
        } catch (e) {
            //
        }

        isSetLoading && setSaleInfoLoading(false)
    }

    const handleGetMinted = async () => {
        await _getAvailableSlots(true)
    }

    const _fetchMintPass = async (isSetLoading = true) => {
        isSetLoading && setMintPassLoading(true)
        let _mintPasses

        try {
            _mintPasses = await getMintPass(wallet.account)
        } catch (e) {
            console.log('fetch MintPass error', e.message)

            await Bluebird.delay(3000)
            return _fetchMintPass(isSetLoading)
        }

        setMintPasses(_mintPasses)
        const _maxMintAmount = _mintPasses.map(item => item.availableSlots).reduce((a, b) => a + b, 0)
        setMaxMintAmount(_maxMintAmount)
        _updateMintAmount(_maxMintAmount, false, _maxMintAmount)

        setMintPassLoading(false)
    }

    const _fetchMoonBeasts = async (isSetLoading = true) => {
        isSetLoading && setMoonBeastLoading(true)
        try {
            const moonBeasts = await getMoonBeast(wallet.account)

            setMoonBeasts(moonBeasts)
        } catch (e) {
            console.log('fetch MoonBeasts error', e.message)

            await Bluebird.delay(3000)
            return _fetchMoonBeasts(isSetLoading)
        }

        setMoonBeastLoading(false)
    }

    const fetchData = async (loading = true) => {
        setIsFetching(true)
        loading && setLoading(true)
        // Switch Network on Desktop Wallet Extension
        provider && await switchNetwork(provider)

        await _getAvailableSlots(true)
        loading && setLoading(false)
        await _fetchMintPass(loading)
        loading && setLoading(false)
        await _fetchMoonBeasts(loading)

        loading && setLoading(false)
        setIsFetching(false)
    }

    const handleRefresh = async (e) => {
        e.preventDefault()

        await _getAvailableSlots(true)
        await _fetchMintPass(true)
        await _fetchMoonBeasts(true)
    }

    const _updateMintPass = (_mintPasses) => {
        const _maxMintAmount = _mintPasses
            .filter(item => item.isSelected)
            .map(item => item.availableSlots)
            .reduce((a, b) => a + b, 0)

        setMintPasses(_mintPasses)
        _updateMintAmount(_maxMintAmount)
    }

    const onClickMintPass = (tokenId) => {
        const _mintPasses = mintPasses.map(item => {
            let { isSelected } = item
            if (!item.isOutOfSlot && item.tokenId === tokenId) {
                isSelected = !isSelected
            }

            return {
                ...item,
                isSelected
            }
        })

        _updateMintPass(_mintPasses)
    }

    const _calculateSelectedMintPasses = (amount) => {
        let _tmpAmount = 0
        const _mintPasses = mintPasses.map(item => {
            const isSelected = !item.isOutOfSlot && _tmpAmount < amount
            _tmpAmount += item.availableSlots

            return {
                ...item,
                isSelected,
            }
        })

        setMintPasses(_mintPasses)
    }

    const _updateMintAmount = (value, checkSelected = false, maxValue) => {
        let amount = value
        if (value !== '') {
            amount = parseInt(value, 10)
            amount = amount > 0 ? amount : 0
            if (maxValue) {
                amount = amount < maxValue ? amount : maxValue
            } else {
                amount = amount < maxMintAmount ? amount : maxMintAmount
            }

            if (!amount) {
                console.log({amount, maxMintAmount, maxValue})
                console.log({mintPasses})
            }
        }

        if (checkSelected) {
            _calculateSelectedMintPasses(parseInt(value, 10) || 0)
        }

        setMintAmount(amount || 0)
    }

    const _handleChangeAmountInput = (value) => {
        _updateMintAmount(value, true)
    }

    const handleMintNFT = async () => {
        const mintPassTokenIds = mintPasses.filter(item => item.isSelected).map(item => item.tokenId)

        if (mintPassTokenIds.length === 0 || mintAmount <= 0) {
            alert('No mint pass selected')
            return
        }

        setMintLoading(true)
        try {
            let value = await smcContract.methods._price().call()
            value = value * mintAmount

            const tx = {
                to: NFT_SALE_ADDRESS,
                from: wallet.account,
                // gasPrice: `${gasPrice}`,
                maxPriorityFeePerGas: null,
                maxFeePerGas: null,
                value: value.toString(),
                data: buyNFTData(mintPassTokenIds, mintAmount)
            }
            const txHash = await buyNFT(provider, connector, smcContract, tx)
            console.log("The hash of MFB minting transaction is: ", txHash)
            setMoonBeastMinting(mintAmount)
            setIsConfirmedTx(false)
            clearMbInterval()
            notification.destroy()

            mbRetrieverRef.current = setInterval(() => confirmTransaction(txHash), 3000)
            notification.sentTransactionSuccess(txHash)
            setMintLoading(false)
        } catch (e) {
            setMintLoading(false)
            console.log(e.message);
            notification.error(e.message)
            console.log("!error", e)
        }
    }

    const getTotalFee = () => {
        return new BigNumber(NFT_SALE_CURRENT_INFO.price).multipliedBy(parseInt(mintAmount, 10), 10).toString()
    }

    const totalMintPassSelected = () => mintPasses.filter(item => item.isSelected).length

    const onSelectAll = () => {
        const isSelected = totalMintPassSelected() === 0

        const _mintPasses = mintPasses.map(item => {
            return {
                ...item,
                isSelected: isSelected && !item.isOutOfSlot,
            }
        })

        _updateMintPass(_mintPasses)
    }

    const _renderFoot = () => {
        if (maxMintAmount === 0) {
            return
        }

        const isMintBtnDisabled = totalMintPassSelected() === 0 || mintLoading || moonBeastMinting || !mintAmount

        return (
            <div className="flex flex-row items-center mt-6 form-mint justify-between">
                <div className="form-mint__fee normal-case items-center">
                    <span className="mb-1 form-mint__fee-label">Fee: </span>
                    <span className={'race-sport-font primary-color form-mint__fee-value'}>
                        {getTotalFee()} GLMR
                    </span>
                </div>
                <div className="form-mint__warp-input">
                    <span className="form-mint__input-icon icon-minus" onClick={() => _updateMintAmount(mintAmount - 1, true)}>
                        <MinusOutlined size={24} />
                    </span>
                    <span className="form-mint__input-value">
                        <input
                            onChange={(e) => _handleChangeAmountInput(e.target.value)}
                            value={mintAmount}
                            pattern="[0-9]*"
                            type="tel"/>
                    </span>
                    <span className="form-mint__input-icon icon-plus" onClick={() => _updateMintAmount(mintAmount + 1, true)}>
                        <PlusOutlined size={24} />
                    </span>
                </div>
                <div className="form-mint__wrap-btn">
                    <ButtonMintNFT isDisabled={isMintBtnDisabled} isLoading={mintLoading} handleMintNFT={handleMintNFT}>
                        {mintAmount > 0 ? `Mint ${mintAmount} NFT${mintAmount > 1 ? "s" : ""}` : "Mint NFT"}
                    </ButtonMintNFT>
                </div>
            </div>
        )
    }

    const _renderContainer = () => {
        return (
            <div className="section-content" key={'_renderContainer'}>
                <div className="container">
                    <div className="moonfit-card">
                        <div className="moonfit-card-inner">
                            <div
                                className="card-title flex flex-col lg:flex-row justify-center lg:justify-between items-start mx-auto mt-0 mb-6 lg:mb-10">
                                <div
                                    className={'flex text-white justify-center w-full lg:w-auto justify-center lg:justify-start mt-4 lg:mt-0'}>
                                    Mint with Mint Pass
                                </div>
                                <div
                                    className={'flex w-full lg:w-auto justify-center lg:justify-start mt-4 lg:mt-0'}>
                                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                    <a href="#" className={'normal-case text-xs inline primary-color'}
                                       onClick={(e) => handleRefresh(e)}>
                                        <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor"
                                             viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                        Refresh
                                    </a>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className={'mt-4 mb-6 lg:mt-8'}>
                                    <NFTSaleInfo
                                        availableSlots={nftSaleAvailableQuantity}
                                        maxSaleSlots={nftSaleQuantity}
                                        isLoading={saleInfoLoading}
                                        handleGetMinted={handleGetMinted}
                                        roundInfo={NFT_SALE_CURRENT_INFO}
                                    />

                                    <MintPass isLoading={mintPassLoading}
                                              mintPasses={mintPasses}
                                              isMinting={!!moonBeastMinting}
                                              onSelect={onClickMintPass}
                                              onSelectAll={onSelectAll}>
                                        <hr className={'card-body-separator'}/>
                                        {_renderFoot()}
                                    </MintPass>

                                    <MoonBeasts isLoading={moonBeastLoading}
                                                moonBeasts={moonBeasts}
                                                moonBeastMinting={moonBeastMinting}/>
                                </div>
                            </div>
                            {/* <TwitterShareButton /> */}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <CurveBGWrapper className="page-nft-sale" scrollBg={!isConnected}>
            <EnvWrapper routeItem={Paths.NFTSale}>
                <WalletAuthRequiredNFTSale className={'section page-nft-sale'}>
                    <NFTStages>
                        {
                            !loading && (
                                [
                                    <Header availableSlots={nftSaleAvailableQuantity} isLoading={saleInfoLoading} roundInfo={NFT_SALE_CURRENT_INFO} key="Header"/>,
                                    _renderContainer()
                                ]
                            )
                        }
                        <LoadingWrapper loading={loading} />
                    </NFTStages>
                </WalletAuthRequiredNFTSale>
            </EnvWrapper>
        </CurveBGWrapper>
    )
}

export default NFTSaleRoundThree
