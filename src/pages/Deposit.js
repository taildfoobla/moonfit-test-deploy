import React, {useContext, useEffect, useRef, useState} from 'react'
import BigNumber from 'bignumber.js'
import {Avatar, Divider, Tooltip} from 'antd';
import Bluebird from 'bluebird'
import moment from 'moment'
import WalletAuthContext from "../contexts/WalletAuthContext"
import * as notification from "../utils/notification"
import {switchNetwork} from "../utils/blockchain"
import {MinusOutlined, PlusOutlined} from '@ant-design/icons';
import LoadingWrapper from "../components/shared/LoadingWrapper"
import LoadingOutlined from "../components/shared/LoadingOutlined"
import Paths from "../routes/Paths"
import EnvWrapper from "../components/shared/EnvWrapper"
import {NFT_SALE_ROUNDS_INFO} from "../constants/blockchain"
import NFTStages from "../components/NFTStages"
import MoonBeasts from '../components/DepositNFT/MoonBeastsV2/index'
import EventBus from '../utils/event-bus'
import {loginByWallet} from "../utils/api"

import {getTransactionReceipt} from "../services/smc-common";
import {
    getAvailableSlots,
    getSaleMaxAmount,
    getMoonBeast,
    buyNFTData,
    subscribeUpdateSaleAmount,
    getPrice,
    NFT_SALE_ADDRESS,
    getContract
} from '../services/smc-ntf-world-cup-sale'
import {buyNFT} from '../services/smc-common'
import CurveBGWrapper from '../wrappers/CurveBG'
import TeamSelectModal from '../components/NFTSaleCurrentRound/TeamSelectModal';
import walletIcon from "../assets/images/icons/Wallet.svg";
// import TwitterShareButton from '../components/shared/TwitterShare'
const NFT_SALE_CURRENT_INFO = NFT_SALE_ROUNDS_INFO.WC

const NFTSaleRoundWorldCup = (props) => {
    const [loading, setLoading] = useState(false)
    const [isFetching, setIsFetching] = useState(true)
    const [saleInfoLoading, setSaleInfoLoading] = useState(true)
    const [moonBeastLoading, setMoonBeastLoading] = useState(true)
    const [mintLoading, setMintLoading] = useState(false)
    const [moonBeasts, setMoonBeasts] = useState([])
    const [moonBeastKey, setMoonBeastKey] = useState(Date.now())
    const [nftSaleQuantity, setNftSaleQuantity] = useState(NFT_SALE_CURRENT_INFO.amount)
    const [nftSaleAvailableQuantity, setNftSaleAvailableQuantity] = useState(NaN)
    const [user, setUser] = useState({})
    const [isLogin, setIsLogin] = useState(true)
    const [loginMessage, setLoginMessage] = useState('')
    const [isConfirmedTx, setIsConfirmedTx] = useState(false)
    const [mintAmount, setMintAmount] = useState(1)
    const [team, setTeam] = useState('')
    const maxMintAmount = 100

    const mbRetrieverRef = useRef(0)

    const {
        isSignature,
        isConnected,
        wallet,
        provider,
        connector,
        showWalletSelectModal,
        signatureData
    } = useContext(WalletAuthContext)

    useEffect(() => {
        setMoonBeasts([])
        EventBus.$on(NFT_SALE_CURRENT_INFO.eventUpdateSaleAmountName, (data) => {
            if (data.soldAmount && data.maxSaleAmount) {
                setNftSaleAvailableQuantity(data.availableSlot)
            }
        })

        subscribeUpdateSaleAmount()

        fetchData().then()
        notification.destroy()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [wallet.account])

    useEffect(() => {
        if (isConfirmedTx) {
            // console.log('Effect isConfirmedTx', isConfirmedTx)
            clearMbInterval()
        }
        // return () => clearMbInterval()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isConfirmedTx])

    useEffect(() => {
        if (isSignature && signatureData && Object.keys(signatureData).length) {
            getUserInfo()
        }
        // return () => clearMbInterval()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSignature, signatureData])

    const getUserInfo = () => {
        setIsLogin(true)
        setLoginMessage('')

        loginByWallet(signatureData).then(response => {
            setIsLogin(false)
            if (response.success) {
                setUser(response.data.user)
                localStorage.setItem('walletToken', response.data.access_token)
            } else {
                setLoginMessage(response.message)
            }
        })
    }

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
        if (!wallet.account) {
            return
        }
        isSetLoading && setMoonBeastLoading(true)
        try {
            const moonBeasts = await getMoonBeast(wallet.account, {mintByContract: false, isOwnerMinted: false})

            setMoonBeasts(moonBeasts)
            setMoonBeastKey(Date.now())
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
            let value = await getPrice()
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
            const txHash = await buyNFT(provider, connector, getContract(), tx)
            EventBus.$dispatch('buyNFT', {})
            console.log("The hash of MFB minting transaction is: ", txHash)
            setIsConfirmedTx(false)
            clearMbInterval()
            notification.destroy()

            mbRetrieverRef.current = setInterval(() => confirmTransaction(txHash), 3000)
            notification.sentTransactionSuccess(txHash)
            setMintLoading(false)
        } catch (e) {
            setMintLoading(false)
            console.log(e.message);
            notification.error(e.message, e)
            console.log("!error", e)
        }
    }

    const _renderUserInfo = () => {
        if (isLogin) {
            return <LoadingOutlined/>
        }

        if (loginMessage) {
            return <p>{loginMessage}</p>
        }

        return (
            <>
                <div className="avatar">
                    <Avatar size={120} src={user.avatar || 'https://cdn.moonfit.xyz/image/300/avatar/default3.png'}/>
                </div>
                <div>
                    <p>Email: {user.email || ''}</p>
                    <p>Name: {user.name || ''}</p>
                </div>
            </>
        )
    }

    const _renderContainer = () => {
        if (!isSignature) {
            return (
                <div className={'flex mt-8 justify-center'} style={{marginTop: "30px"}}>
                    <div className="btn-connect">
                        <button type="button"
                                onClick={showWalletSelectModal}
                                className="button button-secondary">
                            <img className="mr-1" src={walletIcon} alt=""/> {isConnected ? 'Signature Wallet' : 'Connect Wallet'}
                        </button>
                    </div>
                </div>
            )
        }

        return (
            <>
                <div className="section-content mt-7">
                    <div className="container">
                        <div className="moonfit-card">
                            <div className="moonfit-card-inner worldcup-card-inner">
                                <div
                                    className="card-title flex flex-col lg:flex-row justify-center lg:justify-between items-start mx-auto mt-0 mb-5 lg:mb-5">
                                    <div
                                        className={'flex text-white justify-center w-full lg:w-auto justify-center lg:justify-start mt-4 lg:mt-0'}>
                                        User Info
                                    </div>
                                </div>
                                <div className="card-body">
                                    <div className={`mt-4 mb-6 lg:mt-8 user-info ${isLogin ? 'is-loading' : ''}`}>
                                        {_renderUserInfo()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="section-content mt-7">
                    <div className="container">
                        <div className="moonfit-card">
                            <div className="moonfit-card-inner worldcup-card-inner">
                                <div
                                    className="card-title flex flex-col lg:flex-row justify-center lg:justify-between items-start mx-auto mt-0 mb-5 lg:mb-5">
                                    <div
                                        className={'flex text-white justify-center w-full lg:w-auto justify-center lg:justify-start mt-4 lg:mt-0'}>
                                        Your MoonBeasts
                                    </div>
                                    <div
                                        className={'flex w-full lg:w-auto justify-center lg:justify-start mt-4 lg:mt-0'}>
                                        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                        <a href="#"
                                           className={'uppercase text-xs inline primary-color darker-grotesque-font text-[18px] font-extrabold'}
                                           onClick={(e) => handleRefresh(e)}>
                                            <svg className="w-4 h-4 inline mb-1 mr-1" fill="none" stroke="currentColor"
                                                 viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                                            </svg>
                                            Refresh
                                        </a>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <div className={'mt-4 mb-6 lg:mt-8'}>
                                        {
                                            isSignature && <MoonBeasts isLoading={moonBeastLoading}
                                                                       moonBeasts={moonBeasts}
                                                                       user={user}
                                                                       handleRefresh={_fetchMoonBeasts}
                                                                       key={moonBeastKey}
                                            />
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }

    return (
        <CurveBGWrapper className="page-nft-sale deposit-page" scrollBg={!isSignature}>
            <EnvWrapper routeItem={Paths.Deposit}>
                <div className={'section page-nft-sale'}>
                    <NFTStages>
                        {
                            !loading && _renderContainer()
                        }
                        {isSignature && <LoadingWrapper loading={loading}/>}
                    </NFTStages>
                </div>
            </EnvWrapper>
        </CurveBGWrapper>
    )
}

export default NFTSaleRoundWorldCup
