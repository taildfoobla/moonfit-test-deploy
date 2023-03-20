import React, {useContext, useEffect, useRef, useState} from 'react'
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
import MoonBeasts from '../components/DepositNFT/MoonBeastsV2/index'
import {loginByWallet} from "../utils/api"

import {
    getMoonBeast,
} from '../services/smc-ntf-world-cup-sale'
import CurveBGWrapper from '../wrappers/CurveBG'
import walletIcon from "../assets/images/icons/Wallet.svg";

const NFTSaleRoundWorldCup = (props) => {
    const [loading, setLoading] = useState(false)
    const [isFetching, setIsFetching] = useState(true)
    const [moonBeastLoading, setMoonBeastLoading] = useState(true)
    const [moonBeasts, setMoonBeasts] = useState([])
    const [moonBeastKey, setMoonBeastKey] = useState(Date.now())
    const [user, setUser] = useState({})
    const [isLogin, setIsLogin] = useState(true)
    const [loginMessage, setLoginMessage] = useState('')

    const mbRetrieverRef = useRef(0)

    const {
        isSignature,
        isConnected,
        wallet,
        provider,
        showWalletSelectModal,
        signatureData
    } = useContext(WalletAuthContext)

    useEffect(() => {
        setMoonBeasts([])

        fetchData().then()
        notification.destroy()
    }, [wallet.account])

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

        loading && setLoading(false)
        await _fetchMoonBeasts(loading)

        loading && setLoading(false)
        setIsFetching(false)
    }

    const handleRefresh = async (e) => {
        e.preventDefault()

        await _fetchMoonBeasts(true)
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
