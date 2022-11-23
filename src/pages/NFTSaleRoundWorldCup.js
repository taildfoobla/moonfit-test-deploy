import React, { useContext, useEffect, useRef, useState } from 'react'
import BigNumber from 'bignumber.js'
import Bluebird from 'bluebird'
import { Input, Modal } from 'antd';
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
import EventBus from '../utils/event-bus'
import ball from "../assets/images/worldcup/ball.svg"
import ballWhite from "../assets/images/worldcup/ball-white.svg"

import { getTransactionReceipt } from "../services/smc-common";
import { getAvailableSlots, getSaleMaxAmount, getMoonBeast, buyNFTData, subscribeUpdateSaleAmount, smcContract, NFT_SALE_ADDRESS } from '../services/smc-ntf-world-cup-sale'
import { buyNFT } from '../services/smc-common'
import WorldcupBGWrapper from '../wrappers/WorldcupBG';
import TeamSelectModal from '../components/NFTSaleCurrentRound/TeamSelectModal';
// import TwitterShareButton from '../components/shared/TwitterShare'
const NFT_SALE_CURRENT_INFO = NFT_SALE_ROUNDS_INFO.WC

const NFTSaleRoundWorldCup = (props) => {
    const [loading, setLoading] = useState(true)
    const [isFetching, setIsFetching] = useState(true)
    const [saleInfoLoading, setSaleInfoLoading] = useState(true)
    const [moonBeastLoading, setMoonBeastLoading] = useState(true)
    const [mintLoading, setMintLoading] = useState(false)
    const [moonBeasts, setMoonBeasts] = useState([])
    const [nftSaleQuantity, setNftSaleQuantity] = useState(NFT_SALE_CURRENT_INFO.amount)
    const [nftSaleAvailableQuantity, setNftSaleAvailableQuantity] = useState(NaN)
    const [moonBeastMinting, setMoonBeastMinting] = useState(0)
    const [isConfirmedTx, setIsConfirmedTx] = useState(false)
    const [mintAmount, setMintAmount] = useState(1)
    const [team, setTeam] = useState('')
    const [openModal, setOpenModal] = useState(false)
    const maxMintAmount = 100

    const mbRetrieverRef = useRef(0)

    const { isConnected, wallet, provider, connector } = useContext(WalletAuthContext)

    useEffect(() => {
        if (!!wallet.account) {
            setMoonBeasts([])
            EventBus.$on('WCUpdateSaleAmount', (data) => {
                console.log(data, { R3UpdateSaleAmount: 'WCUpdateSaleAmount' });
                const value = parseInt(data.maxSaleAmount, 10) - parseInt(data.currentSaleAmount, 10)
                console.log(value);
                if (!value && value >= 0) {
                    setNftSaleAvailableQuantity(value)
                }
            })

            subscribeUpdateSaleAmount()

            fetchData().then()
        }
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

    const _getSaleMaxAmount = async () => {
        try {
            const value = await getSaleMaxAmount()

            if (!Number.isNaN(value)) {
                return setNftSaleQuantity(value)
            }
        } catch (e) {
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
                notification.close(txHash)
                notification.sentTransactionSuccess(txHash)
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

    const _fetchMoonBeasts = async (isSetLoading = true) => {
        isSetLoading && setMoonBeastLoading(true)
        try {
            const moonBeasts = await getMoonBeast(wallet.account)

            setMoonBeasts(moonBeasts)
        } catch (e) {
            console.log(e);
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
        await _fetchMoonBeasts(loading)

        loading && setLoading(false)
        setIsFetching(false)
    }

    const handleRefresh = async (e) => {
        e.preventDefault()

        await _getAvailableSlots(true)
        await _fetchMoonBeasts(true)
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

        setMintAmount(amount || 0)
    }

    const _handleChangeAmountInput = (value) => {
        _updateMintAmount(value, true)
    }

    const handleMintNFT = async () => {
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
                data: buyNFTData(mintAmount, team?.name)
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
            window.e = e
            setMintLoading(false)
            console.log(e.message);
            notification.error(e.message, e)
            console.log("!error", e)
        }
    }

    const getTotalFee = () => {
        return new BigNumber(NFT_SALE_CURRENT_INFO.price).multipliedBy(parseInt(mintAmount, 10), 10).toString()
    }

    const onChangeTeam = (newTeam) => {
        setTeam(newTeam)
    }

    const toggleModal = () => setOpenModal(!openModal)

    const _renderFoot = () => {
        if (maxMintAmount === 0) {
            return
        }

        const isMintBtnDisabled = mintLoading || moonBeastMinting || !mintAmount

        return (
            <div className='section-mint'>
                {
                    NFT_SALE_CURRENT_INFO.specialRound && <>
                        <TeamSelectModal open={openModal} handleCancel={toggleModal} onChangeTeam={onChangeTeam} />
                        {
                            team && <div className='form-mint__team-select'>
                                <div className='flex flex-wrap justify-between items-center'>
                                    <span className='text-[#A8ADC3] font-semibold'>PICK YOUR FAVOURITE TEAM</span>
                                    <a className='text-[#4CCBC9] font-extrabold flex items-center' onClick={toggleModal}>Change TEAM
                                        <img className='ml-2 pt-1' src={ball} />
                                    </a>
                                </div>
                                <div className='team-select-detail text-center'>
                                    <img className='w-full mx-auto' src={team?.url} onClick={toggleModal} />
                                    <span className='race-sport-font text-[20px] font-normal'>{team?.name}</span>
                                </div>
                            </div>
                        }
                        {
                            !team && <div className='form-mint__team-select mb-3'>
                                <div className='flex flex-wrap justify-between items-center'>
                                    <span className='text-[#A8ADC3] font-semibold'>PICK YOUR FAVOURITE TEAM</span>
                                </div>
                                <div className='team-select-detail text-center mt-7'>
                                    <span className='normal-case font-normal'>Pick a National Football team</span>
                                    <p className='normal-case font-normal'>you want yours NFT to wear their uniform.</p>
                                    <button type="button"
                                        onClick={toggleModal}
                                        className="button button-secondary mt-4" style={{ padding: "10px 30px" }}>
                                        <img className='pt-1 mr-2' src={ballWhite} /> Pick a team
                                    </button>
                                </div>
                            </div>
                        }
                    </>
                }

                {
                    team && <div className="flex flex-row items-center mt-4 form-mint justify-between">
                        <div className="form-mint__fee normal-case items-center">
                            <span className="mb-1 form-mint__fee-label">Fee: </span>
                            <span className={'race-sport-font primary-color form-mint__fee-value'}>
                                {getTotalFee()} GLMR
                            </span>
                        </div>
                        {/* <div className="form-mint__fee normal-case items-center">
                        <Input placeholder="Please input team" value={team} onChange={onChangeTeam} />
                    </div> */}
                        <div className="form-mint__warp-input">
                            <span className="form-mint__input-icon icon-minus" onClick={() => _updateMintAmount(mintAmount - 1, true)}>
                                <MinusOutlined size={24} />
                            </span>
                            <span className="form-mint__input-value">
                                <input
                                    onChange={(e) => _handleChangeAmountInput(e.target.value)}
                                    value={mintAmount}
                                    pattern="[0-9]*"
                                    type="tel" />
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
                }
            </div>
        )
    }

    const _renderContainer = () => {
        return (
            <div className="section-content mt-7" key={'_renderContainer'}>
                <div className="container">
                    <div className="moonfit-card">
                        <div className="moonfit-card-inner worldcup-card-inner">
                            <div
                                className="card-title flex flex-col lg:flex-row justify-center lg:justify-between items-start mx-auto mt-0 mb-5 lg:mb-5">
                                <div
                                    className={'flex text-white justify-center w-full lg:w-auto justify-center lg:justify-start mt-4 lg:mt-0'}>
                                    Public mint
                                </div>
                                <div
                                    className={'flex w-full lg:w-auto justify-center lg:justify-start mt-4 lg:mt-0'}>
                                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                    <a href="#" className={'uppercase text-xs inline primary-color darker-grotesque-font text-[18px] font-extrabold'}
                                        onClick={(e) => handleRefresh(e)}>
                                        <svg className="w-4 h-4 inline mb-1 mr-1" fill="none" stroke="currentColor"
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
                                    {
                                        (NFT_SALE_CURRENT_INFO.isSoldOut || nftSaleAvailableQuantity <= 0) ? null : (
                                            <div className={'card-body-row flex flex-col mt-3'}>
                                                {_renderFoot()}
                                            </div>
                                        )
                                    }
                                    <MoonBeasts isLoading={moonBeastLoading}
                                        moonBeasts={moonBeasts}
                                        moonBeastMinting={moonBeastMinting} />
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
        <WorldcupBGWrapper className="page-nft-sale" scrollBg={!isConnected}>
            <EnvWrapper routeItem={Paths.NFTSale}>
                <WalletAuthRequiredNFTSale className={'section page-nft-sale'}>
                    <NFTStages>
                        {
                            !loading && (
                                [
                                    <Header availableSlots={nftSaleAvailableQuantity} isLoading={saleInfoLoading} roundInfo={NFT_SALE_CURRENT_INFO} key="Header" />,
                                    _renderContainer()
                                ]
                            )
                        }
                        <LoadingWrapper loading={loading} />
                    </NFTStages>
                </WalletAuthRequiredNFTSale>
            </EnvWrapper>
        </WorldcupBGWrapper>
    )
}

export default NFTSaleRoundWorldCup
