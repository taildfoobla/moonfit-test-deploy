import React, { useContext, useEffect, useRef, useState } from 'react'
import Web3 from "web3"
import BigNumber from 'bignumber.js'
import WalletAuthContext from "../contexts/WalletAuthContext"
import nftSaleABI from '../abis/MFNFTSale.json'
import { notification } from "antd"
import { getMainMessage } from "../utils/tx-error"
import { getShortAddress, getTxScanUrl, sendTransaction, switchNetwork } from "../utils/blockchain"
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import LoadingWrapper from "../components/shared/LoadingWrapper"
import Paths from "../routes/Paths"
import EnvWrapper from "../components/shared/EnvWrapper"
import { NFT_SALE_CURRENT_INFO } from "../constants/blockchain"
import { getStringOfBigNumber } from "../utils/number"
import WalletAuthRequiredNFTSale from "../components/WalletAuthRequiredNFTSale"
import NFTStages from "../components/NFTStages"
import Header from '../components/NFTSaleCurrentRound/Header'
import ButtonMintNFT from '../components/NFTSaleCurrentRound/ButtonMintNFT'
import NFTSaleInfo from '../components/NFTSaleCurrentRound/NFTSaleInfo'
import MoonBeasts from '../components/NFTSaleCurrentRound/MoonBeasts'
import MintPass from '../components/NFTSaleCurrentRound/MintPass'

import { getAvailableSlots, getSaleMaxAmount } from '../services/smc-ntf-sale'
import { fetchMoonBeastsByAccount } from '../services/smc-moon-beast'
import { fetchMintPassByAccount, addAvailableSlotForCurrenSale } from '../services/smc-mint-pass'
import CurveBGWrapper from '../wrappers/CurveBG'

const { NFT_SALE_SC } = NFT_SALE_CURRENT_INFO

const NFTSaleCurrentRound = (props) => {
    const [loading, setLoading] = useState(true)
    const [saleInfoLoading, setSaleInfoLoading] = useState(true)
    const [mintPassLoading, setMintPassLoading] = useState(true)
    const [moonBeastLoading, setMoonBeastLoading] = useState(true)
    const [mintLoading, setMintLoading] = useState(false)
    const [mintPasses, setMintPasses] = useState([])
    const [moonBeasts, setMoonBeasts] = useState([])
    const [saleInfo, setSaleInfo] = useState({})
    const [moonBeastMinting, setMoonBeastMinting] = useState(0)
    const [isConfirmedTx, setIsConfirmedTx] = useState(false)
    const [mintAmount, setMintAmount] = useState(0)
    const [maxMintAmount, setMaxMintAmount] = useState(0)

    const mbRetrieverRef = useRef(0)

    const { wallet, network, provider, connector } = useContext(WalletAuthContext)

    useEffect(() => {
        !!wallet.account && fetchData().then()
        notification.destroy()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [wallet.account])

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

    const confirmTransaction = async (txHash) => {
        const web3js = new Web3(network.rpc_url)
        const receipt = await web3js.eth.getTransactionReceipt(txHash)
        // console.log(receipt?.status)
        if (receipt?.status === true) {
            setTimeout(async () => {
                await fetchData(false)
                setIsConfirmedTx(true)
            }, 500)
            return true
        }
        return true
    }

    const _getAvailableSlots = async () => {
        setSaleInfoLoading(true)
        const [availableSlots, maxSaleSlots] = await Promise.all([
            getAvailableSlots(),
            getSaleMaxAmount(),
        ])

        setSaleInfo({ availableSlots, maxSaleSlots })
        setSaleInfoLoading(false)
    }

    const handleGetMinted = async () => {
        await _getAvailableSlots()
    }

    const _fetchMintPass = async (isSetLoading = true) => {
        isSetLoading && setMintPassLoading(true)
        let _mintPasses = await fetchMintPassByAccount(wallet.account)
        _mintPasses = await addAvailableSlotForCurrenSale(_mintPasses)

        setMintPasses(_mintPasses)
        const _maxMintAmount = _mintPasses.map(item => item.availableSlots).reduce((a, b) => a + b, 0)
        setMaxMintAmount(_maxMintAmount)
        _updateMintAmount(_maxMintAmount, false, _maxMintAmount)

        setMintPassLoading(false)
    }

    const _fetchMoonBeasts = async (isSetLoading = true) => {
        isSetLoading && setMoonBeastLoading(true)
        const moonBeasts = await fetchMoonBeastsByAccount(wallet.account)

        setMoonBeasts(moonBeasts.filter(item => item.isCurrentRound))
        setMoonBeastLoading(false)
    }

    const fetchData = async (loading = true) => {
        loading && setLoading(true)
        // Switch Network on Desktop Wallet Extension
        provider && await switchNetwork(provider)

        await _getAvailableSlots()
        loading && setLoading(false)
        await _fetchMintPass(loading)
        loading && setLoading(false)
        await _fetchMoonBeasts(loading)

        loading && setLoading(false)
    }

    const handleRefresh = async (e) => {
        e.preventDefault()

        await _getAvailableSlots()
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
        }

        if (checkSelected) {
            _calculateSelectedMintPasses(parseInt(value, 10) || 0)
        }

        setMintAmount(amount)
    }
    const _transactionSuccess = (txHash) => {
        notification.success({
            message: `Transaction Sent`,
            description: (
                <div>
                    The hash of MFB minting transaction is: <br />
                    <a target="_blank" rel="noreferrer"
                        className={'text-blue-600'}
                        href={getTxScanUrl(txHash)}>{getShortAddress(txHash, 8)}</a>
                </div>
            ),
            placement: 'bottomRight',
            duration: 60
        })
    }

    const _transactionError = (message) => {
        notification.error({
            message: `Transaction Failed`,
            description: getMainMessage(message),
            placement: 'bottomRight',
            duration: 10
        })
    }

    const handleMintNFT = async () => {
        const mintPassTokenIds = mintPasses.filter(item => item.isSelected).map(item => item.tokenId)

        if (mintPassTokenIds.length === 0 || mintAmount <= 0) {
            alert('No mint pass selected')
            return
        }

        setMintLoading(true)
        try {
            const web3js = new Web3(network.rpc_url)
            const nonce = await web3js.eth.getTransactionCount(wallet.account, 'latest')
            const nftSaleContract = new web3js.eth.Contract(nftSaleABI.abi, NFT_SALE_SC)

            let value = await nftSaleContract.methods._price().call()
            console.log('Price for one NFT', web3js.utils.fromWei(getStringOfBigNumber(value), 'ether'));
            value = value * mintAmount

            const tx = {
                to: NFT_SALE_SC,
                from: wallet.account,
                nonce: `${nonce}`,
                // gasPrice: `${gasPrice}`,
                maxPriorityFeePerGas: null,
                maxFeePerGas: null,
                value: value.toString(),
                data: nftSaleContract.methods.buyNFT(mintPassTokenIds, mintAmount).encodeABI()
            }
            const gasLimit = await web3js.eth.estimateGas(tx)
            tx.gas = gasLimit.toString()

            console.log(tx)
            console.log('GLMR', web3js.utils.fromWei(getStringOfBigNumber(value), 'ether'))
            console.log('GAS', web3js.utils.hexToNumber(gasLimit))

            const txHash = await sendTransaction(provider, connector, tx)
            console.log("The hash of MFB minting transaction is: ", txHash)
            setMoonBeastMinting(mintAmount)
            setIsConfirmedTx(false)
            clearMbInterval()
            notification.destroy()

            mbRetrieverRef.current = setInterval(() => confirmTransaction(txHash), 3000)
            _transactionSuccess(txHash)
            setMintLoading(false)
        } catch (e) {
            setMintLoading(false)
            console.log(e.message);
            _transactionError(e.message)
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
                        {mintAmount}
                    </span>
                    <span className="form-mint__input-icon icon-plus" onClick={() => _updateMintAmount(mintAmount + 1, true)}>
                        <PlusOutlined size={24} />
                    </span>
                </div>
                <ButtonMintNFT isDisabled={isMintBtnDisabled} isLoading={mintLoading} handleMintNFT={handleMintNFT}>
                    {mintAmount > 0 ? `Mint ${mintAmount} NFT${mintAmount > 1 ? "s" : ""}` : "Mint NFT"}
                </ButtonMintNFT>
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
                                        availableSlots={saleInfo.availableSlots}
                                        maxSaleSlots={saleInfo.maxSaleSlots}
                                        isLoading={saleInfoLoading}
                                        handleGetMinted={handleGetMinted}
                                    />

                                    <MintPass isLoading={mintPassLoading} mintPasses={mintPasses} onSelect={onClickMintPass} onSelectAll={onSelectAll}>
                                        <hr className={'card-body-separator'} />
                                        {_renderFoot()}
                                    </MintPass>

                                    <MoonBeasts isLoading={moonBeastLoading} moonBeasts={moonBeasts} moonBeastMinting={moonBeastMinting} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <CurveBGWrapper className="page-nft-sale">
            <EnvWrapper routeItem={Paths.NFTSale}>
                <WalletAuthRequiredNFTSale className={'section page-nft-sale'}>
                    <NFTStages>
                        {
                            !loading && (
                                [
                                    <Header availableSlots={saleInfo.availableSlots} isLoading={saleInfoLoading} key="Header" />,
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

export default NFTSaleCurrentRound
