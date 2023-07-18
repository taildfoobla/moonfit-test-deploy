import React, { Fragment, useContext, useEffect, useState } from 'react'
import { Avatar } from 'antd';
import Bluebird from 'bluebird'
import WalletAuthContext from "../contexts/WalletAuthContext"
import * as notification from "../utils/notification"
import { getShortAddress, switchNetwork } from "../utils/blockchain"
import LoadingWrapper from "../components/shared/LoadingWrapper"
import LoadingOutlined from "../components/shared/LoadingOutlined"
import Paths from "../routes/Paths"
import EnvWrapper from "../components/shared/EnvWrapper"
import NFTStages from "../components/NFTStages"
import NFTItem from '../components/DepositNFT/NFTItem'
import { loginByWallet } from "../utils/api"
import { fetchMintPassByAccount } from '../services/smc-mint-pass'
import { fetchMoonBeastIdsByAccount } from '../services/smc-moon-beast'
import CurveBGWrapper from '../wrappers/CurveBG'
import walletIcon from "../assets/images/icons/Wallet.svg";
import { ReactComponent as RefreshIcon } from "../assets/images/icons/refresh.svg";
import { ReactComponent as ExchangeIcon } from "../assets/images/icons/exchange.svg";
import { depositToMobileApp } from "../components/DepositNFT/_depositToMobileApp";
import { getMoonBeatInfo } from '../utils/api'
import MFAssetSelect from '../components/shared/MFAssetSelect';

const NFTSaleRoundWorldCup = () => {
    const [loading, setLoading] = useState(false)
    // eslint-disable-next-line no-unused-vars
    const [isFetching, setIsFetching] = useState(true)
    const [isNFTLoading, setIsNFTLoading] = useState(false)
    const [moonBeasts, setMoonBeasts] = useState([])
    const [mintPass, setMintPass] = useState([])
    const [user, setUser] = useState({})
    const [isLogin, setIsLogin] = useState(true)
    const [loginMessage, setLoginMessage] = useState('')
    const [glmrValue, setGlmrValue] = useState(0)
    const [isDeposited, setIsDeposited] = useState(false)

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

        fetchData().then()
        notification.destroy()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [wallet.account])

    useEffect(() => {
        if (isSignature && signatureData && Object.keys(signatureData).length) {
            getUserInfo()
        }
        // return () => clearMbInterval()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [wallet.account, isSignature, signatureData])

    const getUserInfo = () => {
        setIsLogin(true)
        setLoginMessage('')

        loginByWallet(signatureData).then(response => {
            setIsLogin(false)
            if (response.success) {
                setUser(response.data.user)
                _fetchMoonFitNT().then()
            } else {
                setLoginMessage(response.message)
            }
        })
    }


    const _fetchMoonFitNT = async () => {
        if (!wallet.account) {
            return
            // eslint-disable-next-line no-unreachable
            setTimeout(_fetchMoonFitNT, 300)
        }

        if (isNFTLoading) {
            return
        }
        console.log(1);
        setIsNFTLoading(true)
        try {
            const _moonBeasts = await fetchMoonBeastIdsByAccount(wallet.account, 150).then(async tokenIds => {
                const response = await getMoonBeatInfo(tokenIds)

                return response.data.moonBeasts.map(item => {
                    return {
                        ...item,
                        tokenId: item.token_id,
                        imageUrl: item.image_url,
                        type: 'MoonBeast',
                    }
                })
            })
            const _mintPass = await fetchMintPassByAccount(wallet.account)
            console.log(_moonBeasts)
            console.log(_mintPass);

            setMoonBeasts(_moonBeasts)
            setMintPass(_mintPass)
        } catch (e) {
            console.log(e);
            console.log('fetch MoonBeasts error', e.message)

            await Bluebird.delay(3000)
            return _fetchMoonFitNT()
        }

        setIsNFTLoading(false)
    }

    const fetchData = async (loading = true) => {
        if (!user.id) {
            return null
        }
        setIsFetching(true)
        loading && setLoading(true)
        // Switch Network on Desktop Wallet Extension
        provider && await switchNetwork(provider)

        loading && setLoading(false)
        await _fetchMoonFitNT(loading)

        loading && setLoading(false)
        setIsFetching(false)
    }

    const handleRefresh = async (e) => {
        e.preventDefault()

        await _fetchMoonFitNT(true)
    }

    const _renderUserInfo = () => {
        if (isLogin) {
            return <LoadingOutlined />
        }

        if (loginMessage) {
            return <p>{loginMessage}</p>
        }

        return (
            <Fragment>
                <div className="section-inner p-2.5 relative flex items-center">
                    <div className="avatar">
                        <Avatar size={84} src={user.avatar || 'https://cdn.moonfit.xyz/image/300/avatar/default3.png'} />
                    </div>
                    <div className="ml-3">
                        <p className="mb-0">Email: {user.email || ''}</p>
                        <p className="mb-0">Name: {user.name || ''}</p>
                        <p className="mb-0">Wallet connected: {user.wallet_address ? getShortAddress(user.wallet_address, 6) : ''}</p>


                    </div>
                    <div className="absolute top-2 right-4">
                        <div className={'flex items-center normal-case text-base cursor-pointer rounded-[32px] pt-1 pb-2 px-3 bg-[#A16BD8] text-white hover:opacity-70'}>
                            <RefreshIcon className="mt-1 mr-1" width={18} height={18} /> Change
                        </div>
                    </div>
                </div>
                <div className="section-inner p-2.5 mt-3">
                    <p>TOKENS</p>
                    <ul className="token-list p-0">
                        <li className="flex items-center justify-between">
                            <div className="token-info">
                                MFG
                            </div>
                            <div className="token-amount">
                                23.34
                            </div>
                        </li>
                    </ul>
                </div>
            </Fragment>
        )
    }

    const _renderDepositAsset = () => {
        return (
            <Fragment>
                <div className="relative flex items-center gap-x-2.5">
                    <div className="section-inner p-5">
                        <p className="uppercase font-semibold text-[16px] text-[#abadc3] mb-0">from</p>
                        <p className="font-semibold text-[24px] text-white">0xb36A...a9a332</p>
                    </div>
                    <div className="section-inner py-5 pl-8">
                        <p className="uppercase font-semibold text-base text-[#abadc3] mb-0">to</p>
                        <p className="font-semibold text-[24px] text-white">0xb36A...a9a332</p>
                    </div>
                    <div className="absolute top-1/2 left-1/2" style={{ transform: 'translate(-50%, -50%)' }}>
                        <ExchangeIcon width={100} height={100} />
                    </div>
                </div>
                <div className="section-inner p-5 mt-3">
                    <div className="assets">
                        <p className="uppercase font-semibold text-[16px] text-[#abadc3] mb-3">ASSETS</p>
                        <MFAssetSelect />
                    </div>
                    <div className="network mt-3">
                        <p className="uppercase font-semibold text-[16px] text-[#abadc3] mb-3">ASSETS</p>
                        <MFAssetSelect />
                    </div>
                </div>
                <div className="flex justify-center gap-x-2.5 items-center mt-3">
                    <div className={'flex justify-center items-center uppercase w-full text-base cursor-pointer rounded-[2px] pt-1 pb-2 px-3 bg-[#1C0532] border-[2px] border-[#ffffff24] text-white hover:opacity-70'}>
                        Back
                    </div>
                    <div className={'flex justify-center items-center uppercase w-full text-base cursor-pointer rounded-[2px] pt-1 pb-2 px-3 bg-[#4CCBC9] text-white hover:opacity-70'}>
                        <RefreshIcon className="mt-1 mr-1" width={18} height={18} /> Deposit
                    </div>
                </div>
            </Fragment>
        )
    }

    const _depositedGLMR = async () => {
        setIsDeposited(true)

        await depositToMobileApp(provider, connector, {
            user_id: user.id,
            wallet_address: user.wallet_address,
            value: glmrValue,
            currency: 'GLMR',
            type: 'GLMR',
        }, () => {
            setGlmrValue('')
            setIsDeposited(false)
        })
    }

    const _renderNFTItems = () => {
        if (isNFTLoading) {
            return <LoadingOutlined />
        }
        const data = moonBeasts.concat(mintPass)

        return data.map(item => <NFTItem item={item} user={user} key={`${item.type}_${item.tokenId}`} />)
    }
    const _renderDepositGLMR = () => {
        if (!user.id) {
            return null
        }

        return (
            <div className="section-content">
                <div className="container">
                    <div className="moonfit-card">
                        <div className="moonfit-card-inner">
                            <div className="card-body">
                                <div className={'mt-4 mb-6'}>
                                    <div className="mp-verify__header">
                                        Deposit GLMR
                                    </div>
                                    <div className="flex justify-between">
                                        <div className="w-full">
                                            <input
                                                onChange={(e) => setGlmrValue(parseFloat(e.target.value)) || ''} value={glmrValue}
                                                min={0}
                                                readOnly={isDeposited}
                                                className="ant-input mp-verify__input"
                                                type="number" />
                                        </div>
                                        <div>
                                            <button type="submit" disabled={isDeposited || !glmrValue || glmrValue < 0}
                                                onClick={_depositedGLMR}
                                                className={`ant-btn mp-verify__btn ${isDeposited ? 'ant-btn-loading' : ''}`}>
                                                {isDeposited && <LoadingOutlined size={16} className="mp-verify__loading" />}
                                                {isDeposited ? 'Depositing' : 'Deposit'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const _renderNFTList = () => {
        if (!user.id) {
            return null
        }

        return (
            <div className="section-content">
                <div className="container">
                    <div className="moonfit-card">
                        <div className="moonfit-card-inner">
                            <div
                                className="card-title flex flex-col lg:flex-row justify-center lg:justify-between items-start mx-auto mt-0 mb-5 lg:mb-5">
                                <div
                                    className={'flex text-white justify-center w-full lg:w-auto justify-center lg:justify-start mt-4 lg:mt-0'}>
                                    Your NFTs
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
                                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                        Refresh
                                    </a>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className={'mt-4 mb-6 lg:mt-8'}>
                                    <div className={"grid grid-cols-4 lg:grid-cols-6 gap-4"}>
                                        {_renderNFTItems()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const _renderContainer = () => {
        if (!isSignature) {
            return (
                <div className={'flex mt-8 justify-center'} style={{ marginTop: "30px" }}>
                    <div className="btn-connect">
                        <button type="button"
                            onClick={showWalletSelectModal}
                            className="button button-secondary">
                            <img className="mr-1" src={walletIcon} alt="" /> {isConnected ? 'Sign In MoonFit App' : 'Connect Wallet'}
                        </button>
                    </div>
                </div>
            )
        }

        return (
            <>
                <div className="section-content">
                    <div className="container">
                        <div className="moonfit-card">
                            <div className="moonfit-card-inner">
                                <div
                                    className="card-title flex flex-col lg:flex-row justify-center lg:justify-between items-start mx-auto mt-0 mb-5 lg:mb-5">
                                    <div
                                        className={'flex text-white justify-center w-full lg:w-auto justify-center lg:justify-start mt-4 lg:mt-0'}>
                                        User Info
                                    </div>
                                </div>
                                <div className="card-body">
                                    <div className={`mt-4 mb-6 lg:mt-8 ${isLogin ? 'is-loading' : ''}`}>
                                        {/* {_renderUserInfo()} */}
                                        {_renderDepositAsset()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* {_renderDepositGLMR()}
                {_renderNFTList()} */}
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
                        {isSignature && <LoadingWrapper loading={loading} />}
                    </NFTStages>
                </div>
            </EnvWrapper>
        </CurveBGWrapper>
    )
}

export default NFTSaleRoundWorldCup
