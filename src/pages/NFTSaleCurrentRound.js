import React, {useContext, useEffect, useRef, useState} from 'react'
import Web3 from "web3"
import WalletAuthContext from "../contexts/WalletAuthContext"
import nftSaleABI from '../abis/MFNFTSale.json'
import mintPassABI from '../abis/MintPassNFT.json'
import moonBeastABI from '../abis/MoonBeastNFT.json'
import {notification} from "antd"
import {getMainMessage} from "../utils/tx-error"
import {getNFTInfo, getShortAddress, getTxScanUrl, sendTransaction, switchNetwork} from "../utils/blockchain"
import {BLC_CONFIGS} from '../configs/blockchain'
import LoadingWrapper from "../components/shared/LoadingWrapper"
import Paths from "../routes/Paths"
import EnvWrapper from "../components/shared/EnvWrapper"
import CurveBGWrapper from "../wrappers/CurveBG"
import {range} from "../utils/array"
import {NFT_SALE_CURRENT_INFO} from "../constants/blockchain"
import {getStringOfBigNumber} from "../utils/number"
import classNames from "classnames"
import WalletAuthRequiredNFTSale from "../components/WalletAuthRequiredNFTSale"
import MintPassVerify from "../components/MintPassVerify"
import NFTStages from "../components/NFTStages"
import Header from '../components/NFTSaleCurrentRound/Header'
import ButtonMintNFT from '../components/NFTSaleCurrentRound/ButtonMintNFT'
import NFTSaleInfo from '../components/NFTSaleCurrentRound/NFTSaleInfo'
import MoonBeasts from '../components/NFTSaleCurrentRound/MoonBeasts'
import MintPass from '../components/NFTSaleCurrentRound/MintPass'

const {MINT_PASS_SC, MOONBEAST_SC} = BLC_CONFIGS
const {NFT_SALE_SC, nftPerPass} = NFT_SALE_CURRENT_INFO

const NFTSaleCurrentRound = (props) => {
    const [loading, setLoading] = useState(true)
    const [mintLoading, setMintLoading] = useState(false)
    const [mintPasses, setMintPasses] = useState([])
    const [moonBeasts, setMoonBeasts] = useState([])
    const [saleInfo, setSaleInfo] = useState({})
    const [moonBeastMinting, setMoonBeastMinting] = useState(0)
    const [isConfirmedTx, setIsConfirmedTx] = useState(false)
    const [mintAmount, setMintAmount] = useState(0)
    const [maxMintAmount, setMaxMintAmount] = useState(0)
    const [chainNetwork, setChainNetwork] = useState('')

    const mbRetrieverRef = useRef(0)

    const {wallet, network, provider, connector} = useContext(WalletAuthContext)

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

    const fetchMoonBeasts = async (txHash) => {
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
        if (!chainNetwork) {
            return
        }

        const web3js = new Web3(network.rpc_url)
        const saleContract = new web3js.eth.Contract(nftSaleABI.abi, NFT_SALE_SC)
        const [saleAvailableSlots, maxSaleSlots] = await Promise.all([
            saleContract.methods.getAvailableSlots().call(),
            saleContract.methods._maxSaleAmount().call(),
        ])

        setSaleInfo({availableSlots: saleAvailableSlots, maxSaleSlots})
    }

    const fetchData = async (loading = true) => {
        loading && setLoading(true)

        // Switch Network on Desktop Wallet Extension
        provider && await switchNetwork(provider)
        setChainNetwork(network.rpc_url)

        const web3js = new Web3(network.rpc_url)
        const mintPassContract = new web3js.eth.Contract(mintPassABI.abi, MINT_PASS_SC)
        const saleContract = new web3js.eth.Contract(nftSaleABI.abi, NFT_SALE_SC)
        const moonBeastContract = new web3js.eth.Contract(moonBeastABI.abi, MOONBEAST_SC)
        await _getAvailableSlots()

        const [mpBalance, mbBalance] = await Promise.all([
            mintPassContract.methods.balanceOf(wallet.account).call(),
            moonBeastContract.methods.balanceOf(wallet.account).call(),
        ])

        const mintPasses = await Promise.all(range(0, mpBalance - 1).map(async i => {
            const tokenId = await mintPassContract.methods.tokenOfOwnerByIndex(wallet.account, i).call()
            const {name, imageUrl} = await getNFTInfo(mintPassContract.methods, tokenId)
            let availableSlots = await saleContract.methods.getMintPassAvailableSlots(tokenId).call()
            availableSlots = parseInt(availableSlots, 10)
            const bought = nftPerPass - availableSlots
            const isOutOfSlot = availableSlots <= 0

            return {
                name,
                imageUrl,
                tokenId,
                isUsed: !!bought,
                availableSlots,
                bought,
                isOutOfSlot,
                isSelected: !isOutOfSlot
            }
        }))
        setMintPasses(mintPasses)
        const _maxMintAmount = mintPasses.map(item => item.availableSlots).reduce((a, b) => a + b, 0)
        setMaxMintAmount(_maxMintAmount)
        _updateMintAmount(_maxMintAmount)

        const moonBeasts = await Promise.all(range(0, mbBalance - 1).map(async i => {
            const tokenId = await moonBeastContract.methods.tokenOfOwnerByIndex(wallet.account, i).call()
            const isCurrentRound = parseInt(tokenId, 10) >= NFT_SALE_CURRENT_INFO.fromTokenID
            if (!isCurrentRound) {
                return {tokenId, isCurrentRound}
            }
            const {name, imageUrl} = await getNFTInfo(moonBeastContract.methods, tokenId)
            return {name, imageUrl, tokenId, isCurrentRound}
        }))

        setMoonBeasts(moonBeasts.filter(item => item.isCurrentRound))

        loading && setLoading(false)
    }

    const onClickMintPass = (tokenId) => {
        const _mintPasses = mintPasses.map(item => {
            let {isSelected} = item
            if (!item.isOutOfSlot && item.tokenId === tokenId) {
                isSelected = !isSelected
            }

            return {
                ...item,
                isSelected
            }
        })


        const _maxMintAmount = _mintPasses
            .filter(item => item.isSelected)
            .map(item => item.availableSlots)
            .reduce((a, b) => a + b, 0)

        setMintPasses(_mintPasses)
        _updateMintAmount(_maxMintAmount)
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
        console.log('-------');
        _mintPasses.forEach(item => console.log({...item, imageUrl: undefined}))
        console.log('-------');

        setMintPasses(_mintPasses)
    }


    const _updateMintAmount = (value, checkSelected = false) => {
        let amount = value
        if (value !== '') {
            amount = parseInt(value, 10)
            amount = amount > 0 ? amount : 0
            amount = amount < maxMintAmount ? amount : maxMintAmount
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
                    The hash of MFB minting transaction is: <br/>
                    <a target="_blank" rel="noreferrer"
                       className={'text-blue-600'}
                       href={getTxScanUrl(txHash)}>{getShortAddress(txHash, 8)}</a>
                </div>
            ),
            placement: 'bottomRight',
            duration: 1800
        })
    }

    const _transactionError = (message) => {
        notification.error({
            message: `Transaction Failed`,
            description: getMainMessage(message),
            placement: 'bottomRight',
            duration: 3
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
            console.log('GLMR',  web3js.utils.fromWei(getStringOfBigNumber(value), 'ether'))
            console.log('GAS',  web3js.utils.hexToNumber(gasLimit))

            const txHash = await sendTransaction(provider, connector, tx)
            console.log("The hash of MFB minting transaction is: ", txHash)
            setMoonBeastMinting(mintAmount)
            setIsConfirmedTx(false)
            clearMbInterval()
            notification.destroy()

            mbRetrieverRef.current = setInterval(() => fetchMoonBeasts(txHash), 3000)
            _transactionSuccess(txHash)
            setMintLoading(false)
        } catch (e) {
            setMintLoading(false)
            console.log(e.message);
            _transactionError(e.message)
            console.log("!error", e)
        }
    }

    const totalMintPassSelected = () => mintPasses.filter(item => item.isSelected).length

    const _renderFoot = () => {
        if (maxMintAmount === 0) {
            return
        }

        const _totalMintPassSelected = totalMintPassSelected()
        const isMintBtnDisabled = totalMintPassSelected() === 0 || mintLoading || moonBeastMinting || !mintAmount

        return (
            <div
                className={classNames('flex flex-row items-center mt-6', {
                    'justify-between': _totalMintPassSelected > 0,
                    'justify-center': _totalMintPassSelected === 0
                })}>
                <div className={'normal-case items-center'}>
                    <span className={'mb-1'}>Total: </span>
                    <span className={'race-sport-font primary-color'}>
                        {NFT_SALE_CURRENT_INFO.price * mintAmount} GLMR
                    </span>
                    <input onChange={(e) => _updateMintAmount(e.target.value, true)} value={mintAmount} type="number" min={0}/>
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
                            <div className="card-title flex flex-col lg:flex-row justify-center lg:justify-between items-start mx-auto mt-0 mb-6 lg:mb-10">
                                <div className={'flex text-white justify-center w-full lg:w-auto justify-center lg:justify-start mt-4 lg:mt-0'}>
                                    Mint with Mint Pass
                                </div>
                                <div
                                    className={'flex w-full lg:w-auto justify-center lg:justify-start mt-4 lg:mt-0'}>
                                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                    <a href="#" className={'normal-case text-xs inline primary-color'}
                                       onClick={() => fetchData()}>
                                        <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                                        </svg>
                                        Refresh
                                    </a>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className={'mt-4 mb-6 lg:mt-8'}>
                                    <NFTSaleInfo availableSlots={saleInfo.availableSlots} maxSaleSlots={saleInfo.maxSaleSlots}/>

                                    <div className={'card-body-row flex flex-col mt-3'}>
                                        <div className="flex justify-between">
                                            <div className={'flex card-body-row-title'}>
                                                Select A Pass to Mint
                                            </div>
                                            <div
                                                className={'flex card-body-row-title'}>Selected {totalMintPassSelected()}
                                            </div>
                                        </div>
                                        <MintPass mintPasses={mintPasses} onSelect={onClickMintPass} />
                                    </div>

                                    <MoonBeasts moonBeasts={moonBeasts} moonBeastMinting={moonBeastMinting}/>
                                    {_renderFoot()}
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
                                    <Header key="Header"/>,
                                    <MintPassVerify key="MintPassVerify"/>,
                                    _renderContainer()
                                ]
                            )
                        }
                        <LoadingWrapper loading={loading}/>
                    </NFTStages>
                </WalletAuthRequiredNFTSale>
            </EnvWrapper>
        </CurveBGWrapper>
    )
}

export default NFTSaleCurrentRound
