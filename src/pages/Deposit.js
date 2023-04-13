import React, {useContext, useEffect, useState} from 'react'
import {Avatar} from 'antd';
import Bluebird from 'bluebird'
import WalletAuthContext from "../contexts/WalletAuthContext"
import * as notification from "../utils/notification"
import {switchNetwork} from "../utils/blockchain"
import LoadingWrapper from "../components/shared/LoadingWrapper"
import LoadingOutlined from "../components/shared/LoadingOutlined"
import Paths from "../routes/Paths"
import EnvWrapper from "../components/shared/EnvWrapper"
import NFTStages from "../components/NFTStages"
import NFTItem from '../components/DepositNFT/NFTItem'
import {loginByWallet} from "../utils/api"

import {fetchMintPassByAccount} from '../services/smc-mint-pass'
import {fetchMoonBeastsByAccount} from '../services/smc-moon-beast'
import CurveBGWrapper from '../wrappers/CurveBG'
import walletIcon from "../assets/images/icons/Wallet.svg";
import {depositToMobileApp} from "../components/DepositNFT/_depositToMobileApp";

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
                localStorage.setItem('walletToken', response.data.access_token)
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
            const _moonBeasts = await fetchMoonBeastsByAccount(wallet.account, 50)
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
            return  null
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

    const _depositedGLMR = async () => {
        setIsDeposited(true)

        await depositToMobileApp(provider, connector,{
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
            return <LoadingOutlined/>
        }
        const data = moonBeasts.concat(mintPass)

        return data.map(item => <NFTItem item={item} user={user} key={`${item.type}_${item.tokenId}`} />)
    }
    const _renderDepositGLMR = () => {
        if (!user.id) {
            return  null
        }

        return (
            <div className="section-content">
                <div className="container">
                    <div className="moonfit-card">
                        <div className="moonfit-card-inner worldcup-card-inner">
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
                                                type="number"/>
                                        </div>
                                        <div>
                                            <button type="submit" disabled={isDeposited || !glmrValue || glmrValue < 0}
                                                    onClick={_depositedGLMR}
                                                    className={`ant-btn mp-verify__btn ${isDeposited ? 'ant-btn-loading' : ''}`}>
                                                {isDeposited && <LoadingOutlined size={16} className="mp-verify__loading"/>}
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
            return  null
        }

        return (
            <div className="section-content">
                <div className="container">
                    <div className="moonfit-card">
                        <div className="moonfit-card-inner worldcup-card-inner">
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
                                                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
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
                <div className={'flex mt-8 justify-center'} style={{marginTop: "30px"}}>
                    <div className="btn-connect">
                        <button type="button"
                                onClick={showWalletSelectModal}
                                className="button button-secondary">
                            <img className="mr-1" src={walletIcon} alt=""/> {isConnected ? 'Sign In MoonFit App' : 'Connect Wallet'}
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
                {_renderDepositGLMR()}
                {_renderNFTList()}
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
