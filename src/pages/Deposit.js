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
import {Col, Row, Radio, Button} from 'antd'
import moonfitLogo from "../assets/images/logo3.png"
import imageStep1 from "../assets/images/iPhone.png"
import imageStep2 from "../assets/images/iPhone1.png"
import imageStep3 from "../assets/images/iPhone2.png"
import imageStep4 from "../assets/images/iPhone3.png"
import imageBeast from "../assets/images/beast.png"
import iconMask from "../assets/images/mask.png"
import { ReactComponent as CheckIcon } from "../assets/images/Check.svg";
import { ReactComponent as UserIcon } from "../assets/images/user-icon.svg";
import { ReactComponent as RunningIcon } from "../assets/images/running-icon.svg";
import { ReactComponent as GiftIcon } from "../assets/images/gift-icon.svg";
import { ReactComponent as SpeedometerIcon } from "../assets/images/speedometer-icon.svg";
import { ReactComponent as BackIcon } from "../assets/images/ArrowCircleLeft.svg";
import {loadAccess} from '../services/loadAccess'

const NFTSaleRoundWorldCup = () => {
    const [loading, setLoading] = useState(false)
    // eslint-disable-next-line no-unused-vars
    const [isFetching, setIsFetching] = useState(true)
    const [isNFTLoading, setIsNFTLoading] = useState(false)
    const [moonBeasts, setMoonBeasts] = useState([])
    const [mintPass, setMintPass] = useState([])
    const [nftData, setNftData] = useState([])
    const [user, setUser] = useState({})
    const [isLogin, setIsLogin] = useState(true)
    const [loginMessage, setLoginMessage] = useState('')
    const [glmrValue, setGlmrValue] = useState(0)
    const [tokens, setTokens] = useState([])
    const [isDeposited, setIsDeposited] = useState(false)
    const [isChooseAcc, setIsChooseAcc] = useState(false)
    const [listAccount, setListAccount] = useState([])
    const [userIdSelected, setUserIdSelected] = useState('')
    const [isDisplayDeposit, setIsDisplayDeposit] = useState(false)
    const [assetSelected, setAssetSelected] = useState('')

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
    }, [wallet.account, user.id])

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
            console.log('response: ', response)
            if (response.success) {
                const users = response.data.users
                // console.log('users: ', users)
                if(users.length === 1){
                    setUser(users[0])
                    // _fetchMoonFitNT().then()
                } else {
                    setIsChooseAcc(true)
                    setUserIdSelected(users[0].id)
                    setListAccount(users)
                    // setUser(response.data.user)
                }
                // setUser(response.data.user)
                // _fetchMoonFitNT().then()
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
        if (!user.id || !wallet.account) {
            return null
        }
        setIsFetching(true)
        loading && setLoading(true)
        // Switch Network on Desktop Wallet Extension
        provider && await switchNetwork(provider)

        loading && setLoading(false)
        // await _fetchMoonFitNT(loading)
        const response = await loadAccess(wallet.account)
        setTokens(response.tokens)
        setNftData(response.nfts)
        console.log('\n\n\n-------------------------------------')
        console.log(response)
        console.log('-------------------------------------\n\n')
        loading && setLoading(false)
        setIsFetching(false)
    }

    const handleRefresh = async (e) => {
        e.preventDefault()

        await _fetchMoonFitNT(true)
    }

    const onChangeAccount = ({ target: { value } }) => {
        // console.log('radio1 checked', value);
        setUserIdSelected(value)
    }

    const handleConfirm = () => {
        // console.log('confirm click')
        const userSelected = listAccount.filter(user => user.id === userIdSelected)
        setUser(userSelected[0])
        setIsChooseAcc(false)
    }

    const handleChangeAccount = () => {
        setIsChooseAcc(true)
    }

    const handleDisplayDeposit = (value) => {
        console.log('display deposit', value);
        setAssetSelected(value)
        setIsDisplayDeposit(true);
    }

    const handleBackDeposit = () => {
        setIsDisplayDeposit(false);
    }

    const handleChangeAsset = (value) => {
        setAssetSelected(value)
        console.log('valueeee', value)
    }

    const dataOption = [].concat(tokens, nftData)
    // console.log('data options: ', dataOption)
    let listOption = []
    listOption = dataOption.map(item => {
        const itemOption = {
            value: item.id,
            text: item.name,
            image: item.image
        }

        return itemOption
    })

    // console.log('list option: ', listOption)

    const _renderUserInfo = () => {
        if (isLogin) {
            return <LoadingOutlined />
        }

        if (loginMessage) {
            return (
                <Fragment>
                    <div className='section-connected-wallet'>
                        <div className='section-connected-massage'>
                            <p>{loginMessage}</p>
                        </div>
                        <div className='section-connected-guide'>
                            <div className='guide-title'>
                                <img src={moonfitLogo} alt="MoonFit app"/>
                                <p>Kindly open MoonFit app <br/> and connect your wallet first.</p>
                            </div>
                            <div className='guide-steps'>
                                <Row gutter={20}>
                                    <Col className='gutter-row' span={12}>
                                        <div className='step step-1'>
                                            <span>Step 1</span>
                                            <div className='step-image'>
                                                <img src={imageStep1} alt="step 1"/>
                                            </div>
                                        </div>
                                    </Col>

                                    <Col className='gutter-row' span={12}>
                                        <div className='step step-2'>
                                            <span>Step 2</span>
                                            <div className='step-image'>
                                                <img src={imageStep3} alt="step 2"/>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>

                                <Row gutter={20}>
                                    <Col className='gutter-row' span={12}>
                                        <div className='step step-3'>
                                            <span>Step 3</span>
                                            <div className='step-image'>
                                                <img src={imageStep2} alt="step 3"/>
                                            </div>
                                        </div>
                                    </Col>

                                    <Col className='gutter-row' span={12}>
                                        <div className='step step-4'>
                                            <span>Step 4</span>
                                            <div className='step-image'>
                                                <img src={imageStep4} alt="step 4"/>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </div>
                </Fragment>
            )
        }

        if(isChooseAcc){
            
            return (
                <div className="section-choose-account">
                    <Radio.Group name="radiogroup" value={userIdSelected} onChange={onChangeAccount}>
                        {
                            listAccount.map(item => (
                                <Radio key={item.id} value={item.id}>
                                    <div className='Radio-text'>
                                        <div className='account-image'>
                                            <div className='account-image-box'>
                                                <img src={item.avatar} alt={item.name}/>
                                            </div>
                                        </div>
                                        
                                        <div className='account-info'>
                                            <span className='account-name'>{item.name}</span>
                                            <span className='account-email'>{item.email}</span>
                                        </div>
                                    </div>
                                </Radio>
                            ))
                        }
                    </Radio.Group>
    
                    <Button type="primary" className="confirm" onClick={handleConfirm}>
                        <span className="confirm-icon" >
                            <CheckIcon width={12} height={12} />
                        </span>
                        <span className='confirm-text'>
                            Confirm
                        </span>
                    </Button>
                </div>
            )
        }

        return (
            <Fragment>
                <div className="section-inner relative flex items-center section-info">
                    <div className="avatar">
                        <div className='avatar-box'>
                            <Avatar size={84} src={user.avatar || 'https://cdn.moonfit.xyz/image/300/avatar/default3.png'} />
                        </div>
                    </div>
                    <div className="info">
                        <p className="email">Email: {user.email || ''}</p>
                        <p className="name">Name: {user.name || ''}</p>
                        <p className="address">Wallet connected: {user.wallet_address ? getShortAddress(user.wallet_address, 6) : ''}</p>
                    </div>
                    <div className="button-change">
                        <div className={'flex items-center normal-case text-base cursor-pointer rounded-[32px] pt-1 pb-2 px-3 bg-[#A16BD8] text-white hover:opacity-70'} onClick={handleChangeAccount}>
                            <RefreshIcon className="mt-1 mr-1" width={18} height={18} /> Change
                        </div>

                    </div>
                </div>
                <div className="section-inner mt-3 section-tokens">
                    <div className='tokens-title'>TOKENS</div>
                    <ul className="token-list">
                        {
                            tokens.map(token => (
                                <li key={token.symbol} className="token-item" onClick={() => handleDisplayDeposit(token.id)}>
                                    <div className="token-info">
                                        <span className='token-image'>
                                            <img src={token.symbolIcon} alt={token.name}/>
                                        </span>
                                        {token.symbol}
                                    </div>
                                    <div className="token-amount">
                                        {token.value}
                                    </div>
                                </li>
                            ))
                        }
                    </ul>
                </div>

                <div className="section-inner mt-3 section-nfts">
                    <div className='nft-title'>
                        <span>Your NFTS</span>
                        <span>Total 3</span>
                    </div>
                    <ul className="nft-list">
                        {
                            nftData.map(nft => (
                                <li key={nft.id} className="nft-item" onClick={() => handleDisplayDeposit(nft.id)}>
                                    <div className="nft-image">
                                        <span className='nft-image-box'>
                                            <img src={nft.imageUrl} alt="account-image"/>
                                        </span>
                                        <span className='nft-tag'>Uncommon</span>
                                        <span className='nft-mask'><img src={nft.chainIcon} alt="account-image"/></span>
                                    </div>
                                    <div className="nft-stats">
                                        <div className='nft-stats-box'>
                                            <div className='stat-item'>
                                                <div className='stat-item-box'>
                                                    <div className='stat-icon user'>
                                                        <UserIcon width={12} height={12} />
                                                    </div>

                                                    <span className='stat-value'>123</span>
                                                </div>
                                            </div>

                                            <div className='stat-item'>
                                                <div className='stat-item-box'>
                                                    <div className='stat-icon running'>
                                                        <RunningIcon width={12} height={12} />
                                                    </div>

                                                    <span className='stat-value'>123</span>
                                                </div>
                                            </div>

                                            <div className='stat-item'>
                                                <div className='stat-item-box'>
                                                    <div className='stat-icon gift'>
                                                        <GiftIcon width={12} height={12} />
                                                    </div>

                                                    <span className='stat-value'>123</span>
                                                </div>  
                                            </div>

                                            <div className='stat-item'>
                                                <div className='stat-item-box'>
                                                    <div className='stat-icon speed'>
                                                        <SpeedometerIcon width={12} height={12} />
                                                    </div>

                                                    <span className='stat-value'>123</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <h3 className='nft-name'>
                                        {nft.names[0]}<span className='code'>{nft.names[1]}</span>
                                    </h3>
                                </li>
                            ))
                        }
                        {/* <li className="nft-item" onClick={handleDisplayDeposit}>
                            <div className="nft-image">
                                <span className='nft-image-box'>
                                    <img src={imageBeast} alt="account-image"/>
                                </span>
                                <span className='nft-tag'>Uncommon</span>
                                <span className='nft-mask'><img src={iconMask} alt="account-image"/></span>
                            </div>
                            <div className="nft-stats">
                                <div className='nft-stats-box'>
                                    <div className='stat-item'>
                                        <div className='stat-item-box'>
                                            <div className='stat-icon user'>
                                                <UserIcon width={12} height={12} />
                                            </div>

                                            <span className='stat-value'>123</span>
                                        </div>
                                    </div>

                                    <div className='stat-item'>
                                        <div className='stat-item-box'>
                                            <div className='stat-icon running'>
                                                <RunningIcon width={12} height={12} />
                                            </div>

                                            <span className='stat-value'>123</span>
                                        </div>
                                    </div>

                                    <div className='stat-item'>
                                        <div className='stat-item-box'>
                                            <div className='stat-icon gift'>
                                                <GiftIcon width={12} height={12} />
                                            </div>

                                            <span className='stat-value'>123</span>
                                        </div>  
                                    </div>

                                    <div className='stat-item'>
                                        <div className='stat-item-box'>
                                            <div className='stat-icon speed'>
                                                <SpeedometerIcon width={12} height={12} />
                                            </div>

                                            <span className='stat-value'>123</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <h3 className='nft-name'>
                                Beast<span className='code'>#G0019009</span>
                            </h3>
                        </li>

                        <li className="nft-item" onClick={handleDisplayDeposit}>
                            <div className="nft-image">
                                <span className='nft-image-box'>
                                    <img src={imageBeast} alt="account-image"/>
                                </span>
                                <span className='nft-tag'>Uncommon</span>
                                <span className='nft-mask'><img src={iconMask} alt="account-image"/></span>
                            </div>
                            <div className="nft-stats">
                                <div className='nft-stats-box'>
                                    <div className='stat-item'>
                                        <div className='stat-item-box'>
                                            <div className='stat-icon user'>
                                                <UserIcon width={12} height={12} />
                                            </div>

                                            <span className='stat-value'>123</span>
                                        </div>
                                    </div>

                                    <div className='stat-item'>
                                        <div className='stat-item-box'>
                                            <div className='stat-icon running'>
                                                <RunningIcon width={12} height={12} />
                                            </div>

                                            <span className='stat-value'>123</span>
                                        </div>
                                    </div>

                                    <div className='stat-item'>
                                        <div className='stat-item-box'>
                                            <div className='stat-icon gift'>
                                                <GiftIcon width={12} height={12} />
                                            </div>

                                            <span className='stat-value'>123</span>
                                        </div>  
                                    </div>

                                    <div className='stat-item'>
                                        <div className='stat-item-box'>
                                            <div className='stat-icon speed'>
                                                <SpeedometerIcon width={12} height={12} />
                                            </div>

                                            <span className='stat-value'>123</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <h3 className='nft-name'>
                                Beast<span className='code'>#G0019009</span>
                            </h3>
                        </li>

                        <li className="nft-item" onClick={handleDisplayDeposit}>
                            <div className="nft-image">
                                <span className='nft-image-box'>
                                    <img src={imageBeast} alt="account-image"/>
                                </span>
                                <span className='nft-tag'>Uncommon</span>
                                <span className='nft-mask'><img src={iconMask} alt="account-image"/></span>
                            </div>
                            <div className="nft-stats">
                                <div className='nft-stats-box'>
                                    <div className='stat-item'>
                                        <div className='stat-item-box'>
                                            <div className='stat-icon user'>
                                                <UserIcon width={12} height={12} />
                                            </div>

                                            <span className='stat-value'>123</span>
                                        </div>
                                    </div>

                                    <div className='stat-item'>
                                        <div className='stat-item-box'>
                                            <div className='stat-icon running'>
                                                <RunningIcon width={12} height={12} />
                                            </div>

                                            <span className='stat-value'>123</span>
                                        </div>
                                    </div>

                                    <div className='stat-item'>
                                        <div className='stat-item-box'>
                                            <div className='stat-icon gift'>
                                                <GiftIcon width={12} height={12} />
                                            </div>

                                            <span className='stat-value'>123</span>
                                        </div>  
                                    </div>

                                    <div className='stat-item'>
                                        <div className='stat-item-box'>
                                            <div className='stat-icon speed'>
                                                <SpeedometerIcon width={12} height={12} />
                                            </div>

                                            <span className='stat-value'>123</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <h3 className='nft-name'>
                                Beast<span className='code'>#G0019009</span>
                            </h3>
                        </li> */}
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
                        <p className="font-semibold text-[24px] text-white">Spending Account</p>
                    </div>
                    <div className="absolute top-1/2 left-1/2" style={{ transform: 'translate(-50%, -50%)' }}>
                        <ExchangeIcon width={100} height={100} />
                    </div>
                </div>
                <div className="section-inner p-5 mt-3">
                    <div className="assets">
                        <p className="uppercase font-semibold text-[16px] text-[#abadc3] mb-3">ASSET</p>
                        <MFAssetSelect listOption={listOption} assetSelected={assetSelected} handleChangeAsset={handleChangeAsset}/>
                    </div>
                    <div className="network mt-3">
                        <p className="uppercase font-semibold text-[16px] text-[#abadc3] mb-3">ASSET</p>
                        {/* <MFAssetSelect /> */}
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

    const _renderChooseAccount = () => {
        return (
            <div className="section-choose-account">
                <Radio.Group name="radiogroup" defaultValue={1} onChange={onChangeAccount}>
                    <Radio value={1}>
                        <div className='Radio-text'>
                            <div className='account-image'>
                                <div className='account-image-box'>
                                    <img src={moonfitLogo} alt="account-image"/>
                                </div>
                            </div>
                            
                            <div className='account-info'>
                                <span className='account-name'>Do Thai Son</span>
                                <span className='account-email'>sondt@foobla.com</span>
                            </div>
                        </div>
                    </Radio>
                    <Radio value={2}>
                        <div className='Radio-text'>
                            <div className='account-image'>
                                <div className='account-image-box'>
                                    <img src={moonfitLogo} alt="account-image"/>
                                </div>
                            </div>
                            
                            <div className='account-info'>
                                <span className='account-name'>Do Thai Son</span>
                                <span className='account-email'>sondt@foobla.com</span>
                            </div>
                        </div>
                    </Radio>
                    <Radio value={3}>
                        <div className='Radio-text'>
                            <div className='account-image'>
                                <div className='account-image-box'>
                                    <img src={moonfitLogo} alt="account-image"/>
                                </div>
                            </div>
                            
                            <div className='account-info'>
                                <span className='account-name'>Do Thai Son</span>
                                <span className='account-email'>sondt@foobla.com</span>
                            </div>
                        </div>
                    </Radio>
                    <Radio value={4}>
                        <div className='Radio-text'>
                            <div className='account-image'>
                                <div className='account-image-box'>
                                    <img src={moonfitLogo} alt="account-image"/>
                                </div>
                            </div>
                            
                            <div className='account-info'>
                                <span className='account-name'>Do Thai Son</span>
                                <span className='account-email'>sondt@foobla.com</span>
                            </div>
                        </div>
                    </Radio>
                </Radio.Group>

                <Button type="primary" className="confirm" onClick={handleConfirm}>
                    <span className="confirm-icon" >
                        <CheckIcon width={12} height={12} />
                    </span>
                    <span className='confirm-text'>
                        Confirm
                    </span>
                </Button>
            </div>
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
                                <div className="card-title flex flex-col lg:flex-row justify-center lg:justify-between items-start">
                                    <div className={'w-full moonfit-card-title'}>
                                        {/* User Info */}
                                        <span>
                                        {
                                            isChooseAcc ? 'Choose Account' : isDisplayDeposit ? 'Deposit' : 'User Info'
                                        }
                                        </span>
                                        
                                        {
                                            isDisplayDeposit && 
                                            <span className='back-deposit' onClick={handleBackDeposit}>
                                                <BackIcon width={18} height={18} /> Back
                                            </span>
                                        }
                                        
                                    </div>
                                </div>
                                <div className="card-body">
                                    <div className={`card-wrapper ${isLogin ? 'is-loading' : ''}`}>
                                        {
                                            isDisplayDeposit ? _renderDepositAsset() : _renderUserInfo()
                                        }
                                        {/* {_renderUserInfo()} */}
                                        {/* {_renderChooseAccount()} */}
                                        {/* {_renderDepositAsset()} */}
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
