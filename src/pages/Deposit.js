import React, {Fragment, useContext, useEffect, useState} from 'react'
import {Avatar, Input} from 'antd';
import WalletAuthContext from "../contexts/WalletAuthContext"
import * as notification from "../utils/notification"
import {findNetworkFromSymbol, moonBeamNetwork} from "../constants/blockchain"
import {getShortAddress, getShortEmail, switchToNetwork} from "../utils/blockchain"
import LoadingWrapper from "../components/shared/LoadingWrapper"
import LoadingOutlined from "../components/shared/LoadingOutlined"
import Paths from "../routes/Paths"
import EnvWrapper from "../components/shared/EnvWrapper"
import NFTStages from "../components/NFTStages"
import {loginByWallet} from "../utils/api"
import CurveBGWrapper from '../wrappers/CurveBG'
import walletIcon from "../assets/images/icons/Wallet.svg";
import {ReactComponent as RefreshIcon} from "../assets/images/icons/refresh.svg";
import {ReactComponent as ExchangeIcon} from "../assets/images/icons/exchange.svg";
import {depositToMobileApp} from "../components/DepositNFT/_depositToMobileApp";
import MFAssetSelect from '../components/shared/MFAssetSelect';
import {Col, Row, Radio, Button, Tooltip} from 'antd'
import moonfitLogo from "../assets/images/logo3.png"
import imageStep1 from "../assets/images/iPhone.png"
import imageStep2 from "../assets/images/iPhone1.png"
import imageStep3 from "../assets/images/iPhone2.png"
import imageStep4 from "../assets/images/iPhone3.png"
import close from "../assets/images/deposit-popup-close.png"
import warning from "../assets/images/Warning.png"
import agree from "../assets/images/agree.png"
import {ReactComponent as CheckIcon} from "../assets/images/Check.svg";
import {ReactComponent as UserIcon} from "../assets/images/user-icon.svg";
import {ReactComponent as RunningIcon} from "../assets/images/running-icon.svg";
import {ReactComponent as GiftIcon} from "../assets/images/gift-icon.svg";
import {ReactComponent as SpeedometerIcon} from "../assets/images/speedometer-icon.svg";
import {ReactComponent as DepositIcon} from "../assets/images/deposit-icon.svg";
import iconSuccess from "../assets/images/success-icon.png"
import iconFail from "../assets/images/fail-icon.png"
import {ReactComponent as ArrowSquareOut} from "../assets/images/ArrowSquareOut.svg";
import {ReactComponent as TryAgainIcon} from "../assets/images/transfer.svg";
import {loadAsset, loadTokens} from '../services/loadAsset'
import { removeLocalStorage, setLocalStorage } from "../utils/storage"

const NFTSaleRoundWorldCup = () => {
    const [loading, setLoading] = useState(false)
    // eslint-disable-next-line no-unused-vars
    const [isFetching, setIsFetching] = useState(true)
    const [nftData, setNftData] = useState([])
    const [user, setUser] = useState({})
    const [isLogin, setIsLogin] = useState(true)
    const [loginMessage, setLoginMessage] = useState('')
    const [tokens, setTokens] = useState([])
    const [isChooseAcc, setIsChooseAcc] = useState(false)
    const [listAccount, setListAccount] = useState([])
    const [userIdSelected, setUserIdSelected] = useState('')
    const [isDisplayDeposit, setIsDisplayDeposit] = useState(false)
    const [assetSelected, setAssetSelected] = useState(null)
    const [isSelectToken, setIsSelectToken] = useState(false)
    const [isSelectNFT, setIsSelectNFT] = useState(false)
    const [balance, setBalance] = useState(0)
    const [amount, setAmount] = useState('')
    const [isModalConfirm, setIsModalConfirm] = useState(false)
    const [isModalResult, setIsModalResult] = useState(false)
    const [depositResult, setDepositResult] = useState({})
    const [isFocus, setIsFocus] = useState(false)
    const [depositing, setDepositing] = useState(false)
    const [isOpenPopup,setIsOpenPopup] = useState(true)

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
        setIsChooseAcc(false)
        setIsDisplayDeposit(false)
    }, [wallet.account])

    useEffect(() => {

        fetchData().then()
        notification.destroy()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [wallet.account, user.id, depositing])

    useEffect(() => {
        if (isSignature && signatureData && Object.keys(signatureData).length) {
            getUserInfo()
        }
        // return () => clearMbInterval()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [wallet.account, isSignature, signatureData])

    useEffect(()=>{
        const header=  document.querySelector(".header")
        if(assetSelected?.name==="MANTA_ETH"&&isOpenPopup){
            header.style.zIndex="0"
            document.body.style.overflow = 'hidden'
        }else{
            header.style.zIndex="999"
            document.body.style.overflow = 'auto'
        }
    },
    [isOpenPopup,assetSelected])

    const getUserInfo = () => {
        setIsLogin(true)
        setLoginMessage('')

        loginByWallet(signatureData).then(response => {
            setIsLogin(false)
            // console.log('response: ', response)
            removeLocalStorage('walletToken')
            if (response.success) {
                const users = response.data.users
                // console.log('users: ', users)
                setLocalStorage('walletToken', users[0].access_token)

                if (users.length === 1) {
                    // setIsDisplayDeposit(false)
                    setUser(users[0])
                    setUserIdSelected(users[0].id)
                    setListAccount(users)

                } else {
                    // setIsDisplayDeposit(false)
                    setIsChooseAcc(true)
                    setUserIdSelected(users[0].id)
                    setListAccount(users)
                    // setUser(response.data.user)
                }
                // setUser(response.data.user)
            } else {
                setLoginMessage(response.message)
            }
        })
    }

    const fetchData = async (loading = true) => {
        if (!user.id || !wallet.account) {
            return null
        }
        setIsFetching(true)
        loading && setLoading(true)
        // Switch Network on Desktop Wallet Extension

        loading && setLoading(false)
        const [response, response2] = await Promise.all([
            loadAsset(wallet.account),
            loadTokens(wallet.account)
        ])
        setTokens(response2.tokens)
        setNftData(response.nfts)
        // console.log('\n\n\n-------------------------------------')
        // console.log(response)
        // console.log('-------------------------------------\n\n')
        loading && setLoading(false)
        setIsFetching(false)
    }

    const onChangeAccount = ({target: {value}}) => {
        // console.log('radio1 checked', value);
        setUserIdSelected(value)
    }

    const handleConfirm = () => {
        // console.log('confirm click')
        const userSelected = listAccount.filter(user => user.id === userIdSelected)
        setUser(userSelected[0])
        removeLocalStorage('walletToken')
        setLocalStorage('walletToken', userSelected[0].access_token)
        setIsChooseAcc(false)
    }

    const handleChangeAccount = () => {
        setIsChooseAcc(true)
    }

    const handleDisplayDeposit = (value) => {
        // console.log('display deposit', value);
        const assetClick = listOption.find(item => item.value === value)
        // console.log('asset selected: ', assetClick)
        // let isSelectToken = false;

        const filterToken = tokens.filter(item => item.id === value)
        if (filterToken.length > 0) {
            setIsSelectToken(true)
            setBalance(filterToken[0].value)
        } else {
            setIsSelectToken(false)
        }

        const filterNFT = nftData.filter(item => item.id === value)
        if (filterNFT.length > 0) {
            setIsSelectNFT(true)
        } else {
            setIsSelectNFT(false)
        }

        setAssetSelected(assetClick)
        setIsDisplayDeposit(true);
        setAmount('')
    }

    const handleChangeAsset = (value) => {
        const filterToken = tokens.filter(item => item.id === value.value)
        if (filterToken.length > 0) {
            setIsSelectToken(true)
            setBalance(filterToken[0].value)
        } else {
            setIsSelectToken(false)
        }

        const filterNFT = nftData.filter(item => item.id === value.value)
        if (filterNFT.length > 0) {
            setIsSelectNFT(true)
        } else {
            setIsSelectNFT(false)
        }
        setIsFocus(false)
        setAssetSelected(value)
        setAmount('')
    }

    const handleOnFocusInput = () => {
        setIsFocus(true)
    }

    const handleOnBlurInput = () => {
        setIsFocus(false)
    }

    const handleBackDeposit = () => {
        setIsDisplayDeposit(false);
    }

    const dataOption = [].concat(tokens, nftData)
    // console.log('data options: ', dataOption)
    let listOption = []
    listOption = dataOption.map(item => ({
        ...item,
        value: item.id,
        text: item.symbolDisplay || item.name,
        image: item.imageUrl ? item.imageUrl : item.symbolIcon,
        balance: item.assetType === 'token' ? item.value : 1
    }))

    const getPlaceholder = () => {
        const network = findNetworkFromSymbol(assetSelected.name) || moonBeamNetwork

        return `0.${'0'.repeat(network.digit)}`
    }

    const onChangeAmount = (e) => {
        const value = e.target.value

        // if(!isNaN(+value) && (+value) <= (+balance)){
            if(value.indexOf(".") >= 0){
                const network = findNetworkFromSymbol(assetSelected.name) || moonBeamNetwork

                setAmount(value.slice(0, value.indexOf(".") + network.digit +1))
            }else{
                setAmount(value)
            }
        // }
    };

    const handleClickMaxValue = () => {
        // console.log('set max value')
        setAmount(balance)
    }

    const _handleCloseModalResult = () => {
        setIsModalResult(false)
        // setIsChooseAcc(true)
        setIsDisplayDeposit(false)
    }

    const handleClosePopup =()=>{
        setIsOpenPopup(false)
    }

    const _renderEmailAddress = (email) => {
        if(email.length > 22){
            return (
                <Tooltip title={email}>
                    <span>{getShortEmail(email, 7)}</span>
                </Tooltip>
            )
        }

        return (
            <span>{email}</span>
        )
    }

    const _renderName = (name) => {
        return name.length > 22 ? name.slice(0, 19) + "..." : name
    }

    const _renderUserInfo = () => {
        if (isLogin) {
            return <LoadingOutlined/>
        }

        if (loginMessage) {
            return (
                <Fragment>
                    <div className='section-connected-wallet'>
                        <div className='section-connected-massage'>
                            <p>Can't find user connected to {wallet.account ? getShortAddress(wallet.account, 6) : ''} wallet.</p>
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

        if (isChooseAcc) {
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
                        <span className="confirm-icon">
                            <CheckIcon width={12} height={12}/>
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
                            <Avatar size={84}
                                    src={user.avatar || 'https://cdn.moonfit.xyz/image/300/avatar/default3.png'}/>
                        </div>
                    </div>
                    <div className="info">
                        <p className="email">
                            Email: {_renderEmailAddress(user.email)}
                        </p>
                        <p className="name">Name: {_renderName(user.name)}</p>
                        <p className="address">Wallet
                            connected: {user.wallet_address ? getShortAddress(user.wallet_address, 6) : ''}</p>
                    </div>

                    <div className="button-change">
                        <div
                            className={'flex items-center normal-case text-base cursor-pointer rounded-[32px] pt-1 pb-2 px-3 bg-[#A16BD8] text-white hover:opacity-70'}
                            onClick={handleChangeAccount}>
                            <RefreshIcon className="mt-1 mr-1" width={18} height={18}/> Change
                        </div>
                    </div>

                </div>
                <div className="section-inner mt-3 section-tokens">
                    <div className='tokens-title'>TOKENS</div>
                    {
                        isFetching ? <LoadingOutlined/> :
                            <ul className="token-list">
                                {
                                    tokens.map(token => (
                                        <li key={token.symbol} className={`token-item ${token.name}`}
                                            onClick={() => handleDisplayDeposit(token.id)}>
                                            <div className="token-info">
                                            <span className='token-image'>
                                                <img src={token.symbolIcon} alt={token.name}/>
                                            </span>
                                                {token.symbolDisplay || token.symbol}
                                            </div>
                                            <div className="token-amount">
                                                {token.value}
                                            </div>
                                        </li>
                                    ))
                                }
                            </ul>
                    }
                </div>

                <div className="section-inner mt-3 section-nfts">
                    <div className='nft-title'>
                        <span>Your NFTS</span>
                        <span>{isFetching ? '' : `Total ${nftData.length}`}</span>
                    </div>

                    {
                        isFetching ? <LoadingOutlined/> : nftData.length > 0 ?
                            <div className="nft-list">
                                {
                                    nftData.map(nft => (
                                        <div key={nft.id} className="nft-list-item"
                                             onClick={() => handleDisplayDeposit(nft.id)}>
                                            <div className="nft-image">
                                                <span className='nft-image-box'>
                                                    <img src={nft.imageUrl} alt=""/>
                                                </span>
                                                {
                                                    nft.attributes && nft.attributes.Rarity &&
                                                    <span className='nft-tag'>{nft.attributes.Rarity}</span>
                                                }

                                                <span className='nft-mask'>
                                                    <img src={nft.chainIcon} alt=""/>
                                                </span>
                                            </div>
                                            {
                                                nft.attributes &&
                                                <div className="nft-stats">
                                                    <div className='nft-stats-box'>
                                                        <div className='stat-item'>
                                                            <div className='stat-item-box'>
                                                                <div className='stat-icon user'>
                                                                    <UserIcon width={12} height={12}/>
                                                                </div>

                                                                <span
                                                                    className='stat-value'>{nft.attributes.Social ? nft.attributes.Social : '0'}</span>
                                                            </div>
                                                        </div>

                                                        <div className='stat-item'>
                                                            <div className='stat-item-box'>
                                                                <div className='stat-icon running'>
                                                                    <RunningIcon width={12} height={12}/>
                                                                </div>

                                                                <span
                                                                    className='stat-value'>{nft.attributes && nft.attributes.Endurance ? nft.attributes.Endurance : '0'}</span>
                                                            </div>
                                                        </div>

                                                        <div className='stat-item'>
                                                            <div className='stat-item-box'>
                                                                <div className='stat-icon gift'>
                                                                    <GiftIcon width={12} height={12}/>
                                                                </div>

                                                                <span
                                                                    className='stat-value'>{nft.attributes && nft.attributes.Luck ? nft.attributes.Luck : '0'}</span>
                                                            </div>
                                                        </div>

                                                        <div className='stat-item'>
                                                            <div className='stat-item-box'>
                                                                <div className='stat-icon speed'>
                                                                    <SpeedometerIcon width={12} height={12}/>
                                                                </div>

                                                                <span
                                                                    className='stat-value'>{nft.attributes && nft.attributes.Speed ? nft.attributes.Speed : '0'}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            }
                                            <h3 className='nft-name'>
                                                {nft.names[0]}<span className='code'>{nft.names[1]}</span>
                                            </h3>
                                        </div>
                                    ))
                                }
                            </div> :
                            <div className='nft-nodata'>
                                <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g clip-path="url(#clip0_17045_2259)">
                                    <path d="M54.4097 27.3105H69.5172C70.8867 27.3146 71.9959 28.4238 72 29.7933V34.7588C71.9959 36.1283 70.8867 37.2375 69.5172 37.2416H2.48276C1.11327 37.2375 0.0040901 36.1283 0 34.7588V29.7933C0.0040901 28.4238 1.11327 27.3146 2.48276 27.3105H54.4097Z" fill="#4A266B"/>
                                    <path d="M45.6192 37.2422H68.2744L62.9861 66.8863C62.4521 69.8472 59.8748 72.0011 56.8661 72.0008H15.1309C12.1222 72.0011 9.54492 69.8472 9.01093 66.8863L3.72266 37.2422H45.6192Z" fill="#4A266B"/>
                                    <path d="M7.44841 33.5179C8.134 33.5179 8.68979 32.9621 8.68979 32.2765C8.68979 31.5909 8.134 31.0352 7.44841 31.0352C6.76282 31.0352 6.20703 31.5909 6.20703 32.2765C6.20703 32.9621 6.76282 33.5179 7.44841 33.5179Z" fill="#280848"/>
                                    <path d="M14.8937 33.5179C15.5793 33.5179 16.1351 32.9621 16.1351 32.2765C16.1351 31.5909 15.5793 31.0352 14.8937 31.0352C14.2081 31.0352 13.6523 31.5909 13.6523 32.2765C13.6523 32.9621 14.2081 33.5179 14.8937 33.5179Z" fill="#280848"/>
                                    <path d="M57.1008 33.5179C57.7864 33.5179 58.3421 32.9621 58.3421 32.2765C58.3421 31.5909 57.7864 31.0352 57.1008 31.0352C56.4152 31.0352 55.8594 31.5909 55.8594 32.2765C55.8594 32.9621 56.4152 33.5179 57.1008 33.5179Z" fill="#280848"/>
                                    <path d="M64.55 33.5179C65.2356 33.5179 65.7914 32.9621 65.7914 32.2765C65.7914 31.5909 65.2356 31.0352 64.55 31.0352C63.8644 31.0352 63.3086 31.5909 63.3086 32.2765C63.3086 32.9621 63.8644 33.5179 64.55 33.5179Z" fill="#280848"/>
                                    <path d="M38.4811 45.932C38.4811 44.5608 37.3696 43.4492 35.9984 43.4492C34.6272 43.4492 33.5156 44.5608 33.5156 45.932V63.3113C33.5156 64.6825 34.6272 65.794 35.9984 65.794C37.3696 65.794 38.4811 64.6825 38.4811 63.3113V45.932Z" fill="#280848"/>
                                    <path d="M53.3796 45.932C53.3796 44.5608 52.268 43.4492 50.8968 43.4492C49.5256 43.4492 48.4141 44.5608 48.4141 45.932V63.3113C48.4141 64.6825 49.5256 65.794 50.8968 65.794C52.268 65.794 53.3796 64.6825 53.3796 63.3113V45.932Z" fill="#280848"/>
                                    <path d="M23.5866 45.932C23.5866 44.5608 22.475 43.4492 21.1039 43.4492C19.7327 43.4492 18.6211 44.5608 18.6211 45.932V63.3113C18.6211 64.6825 19.7327 65.794 21.1039 65.794C22.475 65.794 23.5866 64.6825 23.5866 63.3113V45.932Z" fill="#280848"/>
                                    <path d="M35.9988 39.7241C46.9683 39.7241 55.8608 30.8316 55.8608 19.8621C55.8608 8.89255 46.9683 0 35.9988 0C25.0293 0 16.1367 8.89255 16.1367 19.8621C16.1367 30.8316 25.0293 39.7241 35.9988 39.7241Z" fill="#A16BD8"/>
                                    <path d="M45.9308 17.3789H26.0687C24.6975 17.3789 23.5859 18.4905 23.5859 19.8617C23.5859 21.2329 24.6975 22.3444 26.0687 22.3444H45.9308C47.302 22.3444 48.4135 21.2329 48.4135 19.8617C48.4135 18.4905 47.302 17.3789 45.9308 17.3789Z" fill="#280848"/>
                                    </g>
                                    <defs>
                                    <clipPath id="clip0_17045_2259">
                                    <rect width="72" height="72" fill="white"/>
                                    </clipPath>
                                    </defs>
                                </svg>

                            <span>No NFT available</span>
                            <a className="buy-nft" href='https://app.moonfit.xyz/nft-sale-round-3' target='_bnak'>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g clip-path="url(#clip0_17045_2295)">
                                    <path d="M20.8145 3.18555H14.171C13.5329 3.18555 12.9331 3.43403 12.482 3.88525L3.08642 13.2808C2.6352 13.732 2.38672 14.3319 2.38672 14.9699C2.38672 15.608 2.6352 16.2078 3.08642 16.659L9.72973 23.3021C10.1954 23.7678 10.8071 24.0006 11.4188 24.0006C12.0305 24.0006 12.6422 23.7677 13.1078 23.302L22.5035 13.9064C22.9547 13.4552 23.2032 12.8554 23.2032 12.2173V5.5742C23.2032 4.25711 22.1316 3.18555 20.8145 3.18555ZM17.6295 11.1479C16.3123 11.1479 15.2408 10.0764 15.2408 8.75922C15.2408 7.44208 16.3123 6.37052 17.6295 6.37052C18.9466 6.37052 20.0182 7.44208 20.0182 8.75922C20.0182 10.0764 18.9466 11.1479 17.6295 11.1479Z" fill="#020722"/>
                                    <g opacity="0.7">
                                    <path d="M19.2246 0H12.5812C11.9431 0 11.3433 0.248484 10.8921 0.699703L1.49658 10.0953C1.04536 10.5465 0.796875 11.1463 0.796875 11.7844C0.796875 12.2835 0.9495 12.7588 1.23169 13.1583C1.41914 12.7922 1.66383 12.4533 1.96308 12.1541L11.3586 2.75855C12.1105 2.00662 13.1102 1.59248 14.1737 1.59248H20.817C21.0487 1.59248 21.2754 1.61348 21.4964 1.65169C21.185 0.694219 20.2845 0 19.2246 0Z" fill="#020722"/>
                                    </g>
                                    </g>
                                    <defs>
                                    <clipPath id="clip0_17045_2295">
                                    <rect width="24" height="24" fill="white"/>
                                    </clipPath>
                                    </defs>
                                </svg>
                                Buy NFT
                            </a>
                        </div>
                    }
                </div>
            </Fragment>
        )
    }

    const _renderDepositAsset = () => {
        let depositText = isSelectToken && (!amount || +amount <= 0 || +amount > +balance) ? 'Invalid Amount' : depositing ? 'Loading' : 'Deposit'
        let isDisabled = isSelectToken && (!amount || +amount <= 0 || +amount > +balance)

        if (assetSelected && ['MintPass', 'MoonBeast'].includes(assetSelected.type) && !assetSelected.isApproved) {
            depositText = 'Approve'
        }
        // console.log({assetSelected});

        if (assetSelected && assetSelected.type === 'MFG') {
            isDisabled = true
            depositText = 'Coming soon'
        }

        return (
            <Fragment>
                {assetSelected.name==="MANTA_ETH"&& <div className={`deposit-popup ${isOpenPopup?"active":""}`}>
                    <div className='deposit-popup-close' onClick={handleClosePopup}>
                        <img src={close}/>
                    </div>
                    <div className='deposit-popup-content'>
                        <div className='deposit-text-header'>
                        Warning!
                        </div>
                        <div className='deposit-popup-icon'>
                        <img src={warning}/>
                        </div>
                        <div className='small-text'>
                        Please note that participation in MoonFit tasks from MantaFest Social Week will require a deduction of ETH from your wallet balance to cover gas fees.
                        </div>
                        <div className='agree-button' onClick={handleClosePopup}>
                            <img src={agree}/>
                            <span>i agree</span>
                        </div>
                    </div>
                   
                </div>}
               
                <div className="relative flex items-center gap-x-2.5 mf-address-change">
                    <div className="section-inner p-5 from">
                        <p className="uppercase font-semibold text-[16px] text-[#abadc3] mb-0 from-label">from</p>
                        <p className=" text-white from-value">{user.wallet_address ? getShortAddress(user.wallet_address, 6) : ''}</p>
                    </div>
                    <div className="section-inner py-5 pl-8 to">
                        <p className="uppercase font-semibold text-base text-[#abadc3] mb-0 to-label">to</p>
                        <p className="text-white to-value">Spending Account</p>
                    </div>
                    <div className="absolute top-1/2 left-1/2" style={{transform: 'translate(-50%, -50%)'}}>
                        <ExchangeIcon width={100} height={100}/>
                    </div>
                </div>
                <div className="section-inner p-5 mt-3">
                    <div className="assets">
                        <p className="uppercase font-semibold text-[16px] text-[#abadc3] mb-3">Asset</p>
                        <MFAssetSelect listOption={listOption} assetSelected={assetSelected}
                                       handleChangeAsset={handleChangeAsset} isFocus={isFocus} handleOnFocus={handleOnFocusInput} handleOnBlur={handleOnBlurInput}/>
                    </div>

                    {
                        isSelectNFT &&
                        <div className="network mt-3">
                            <p className="uppercase font-semibold text-[16px] text-[#abadc3] mb-3">Network</p>
                            <div className='network-info'>
                                <img src={assetSelected.chainIcon} alt={assetSelected.networkName}/>
                                {assetSelected.networkName}
                            </div>
                        </div>
                    }

                    {
                        isSelectToken &&
                        <div className='amount mt-3'>
                            <p className="uppercase font-semibold text-[16px] text-[#abadc3] mb-3 amount-title">Amount</p>
                            <div className='amount-form'>
                                <Input
                                    placeholder={getPlaceholder()}
                                    className='amount-input'
                                    style={{
                                        width: '100%',
                                        background: '#1C0532',
                                        height: '50px',
                                        lineHeight: '50px',
                                        color: '#FFF',
                                        border: 'none',
                                        boxShadow: 'none',
                                        padding: '0 16px',
                                        fontSize: '18px',
                                        fontWeight: '600',
                                    }}
                                    value={amount}
                                    onChange={onChangeAmount}
                                />

                                <span className='max-value' onClick={handleClickMaxValue}>Max</span>
                            </div>
                            <div className='balance'><label>Balance: </label>{balance}</div>
                        </div>
                    }
                </div>
                <div className="mt-3 deposit-button">
                    <button
                        disabled={depositing}
                        onClick={handleBackDeposit}
                        className={`ant-btn back-deposit`}>
                            {/* <BackIcon width={18} height={18}/> */}
                            Back
                    </button>

                    <button
                        disabled={isDisabled || depositing}
                        onClick={_handleOpenModalDepositAsset}
                        className={`ant-btn`}>
                            {
                                depositing ? <LoadingOutlined className="loading-icon"/>  : <DepositIcon width={18} height={18}/>
                            }

                        {depositText}
                    </button>

                    {/* {
                        isDisplayDeposit &&
                        <span className='back-deposit' onClick={handleBackDeposit}>
                            <BackIcon width={18} height={18}/> Back
                        </span>
                    } */}
                </div>
            </Fragment>
        )
    }

    const _renderModalConfirm = () => {
        return (
            <div className='mf-modal-confirm'>
                <div className='mf-modal-confirm-box'>
                    <div className='mf-modal-confirm-content'>
                        <div className='confirm-text'>
                            Deposit this asset to <span>"{user.email}"</span> account?
                        </div>

                        <div className='confirm-button'>
                            <Button className='confirm-no' onClick={_handleCloseModalDepositAsset}>No</Button>
                            <Button className='confirm-yes' onClick={_handleDepositedAsset}>Yes</Button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const _renderModalResult = () => {
        return (
            <div className='mf-modal-confirm result'>
                <div className='mf-modal-confirm-box'>
                    <div className='mf-modal-confirm-content'>
                        <h3 className='mf-result-submitted'>
                            {
                                depositResult.success ? 'Transaction Submitted' : 'Transaction Failed'
                            }
                        </h3>
                        <div className='mf-result-image'>
                            {
                                depositResult.success ? <img src={iconSuccess} alt="Transaction Submitted"/> :
                                    <img src={iconFail} alt="Transaction Failed"/>
                            }
                        </div>

                        <p className='mf-result-message'>
                            {
                                depositResult.success ? 'It may take up to 5 minutes for the change to reflect on your Spending Account.' : depositResult.message
                            }
                        </p>

                        <div className='confirm-button'>
                            {
                                depositResult.success ?
                                    <>
                                        <Button className='confirm-done' onClick={_handleCloseModalResult}><span
                                            className='icon'><CheckIcon width={12} height={12}/></span>Done</Button>
                                        <a className='view-result' href={depositResult.txUrl}
                                           target="_blank"><ArrowSquareOut width={20} height={20}/>
                                            View Transaction
                                        </a>
                                    </>
                                    :
                                    <Button className='confirm-done' onClick={_handleCloseModalResult}><TryAgainIcon
                                        width={20} height={20}/>Try Again</Button>
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const _handleDepositedAsset = async () => {
        setDepositing(true)
        setIsModalConfirm(false)
        setIsModalResult(false)

        console.log({
            userIdSelected,
            assetSelected,
            isSelectToken,
            isSelectNFT,
            balance,
            amount,
        })

        provider && await switchToNetwork(provider, assetSelected.chainId)
        .then(async() => {
            await depositToMobileApp(provider, connector, {
                type: assetSelected.type,
                chainId: assetSelected.chainId,
                token_id: assetSelected.tokenId,
                user_id: user.id,
                address: user.wallet_address,
                value: amount,
            }, (response) => {
                console.log('responsive: ', response);
                setDepositResult({
                    ...response,
                    txUrl: `${assetSelected.scan}/tx/${response.txHash}`
                })
            })
        })
        .then(() => {
            setDepositing(false)
            setIsModalResult(true)
        })
        .catch(err => {
            setDepositing(false)
        })

        // await depositToMobileApp(provider, connector, {
        //     type: assetSelected.type,
        //     chainId: assetSelected.chainId,
        //     token_id: assetSelected.tokenId,
        //     user_id: user.id,
        //     address: user.wallet_address,
        //     value: amount,
        // }, (response) => {
        //     console.log('responsive: ', response);
        //     setDepositResult({
        //         ...response,
        //         txUrl: `${assetSelected.scan}/tx/${response.txHash}`
        //     })
        //     setDepositing(false)
        //     setIsModalResult(true)
        // })
    }

    const _handleCloseModalDepositAsset = () => {
        setIsModalConfirm(false)
    }

    const _handleOpenModalDepositAsset = () => {
       if (assetSelected && ['MintPass', 'MoonBeast'].includes(assetSelected.type) && !assetSelected.isApproved) {
            _handleDepositedAsset().then()
        } else {
            setIsModalConfirm(true)
        }
    }

    const _renderContainer = () => {
        if (!isSignature) {
            return (
                <div className={'flex mt-8 justify-center'} style={{marginTop: "30px"}}>
                    <div className="btn-connect">
                        <button type="button"
                                onClick={showWalletSelectModal}
                                className="button button-secondary">
                            <img className="mr-1" src={walletIcon}
                                 alt=""/> {isConnected ? 'Sign In MoonFit App' : 'Connect Wallet'}
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
                                    className="card-title flex flex-col lg:flex-row justify-center lg:justify-between items-start">
                                    <div className={'w-full moonfit-card-title'}>
                                        <span>
                                        {
                                            isChooseAcc ? 'Choose Account' : isDisplayDeposit ? 'Deposit' : 'User Info'
                                        }
                                        </span>

                                        {/* {
                                            isDisplayDeposit &&
                                            <span className='back-deposit' onClick={handleBackDeposit}>
                                                <BackIcon width={18} height={18}/> Back
                                            </span>
                                        } */}

                                    </div>
                                </div>
                                <div className="card-body">
                                    <div className={`card-wrapper ${isLogin ? 'is-loading' : ''}`}>
                                        {
                                            isDisplayDeposit ? _renderDepositAsset() : _renderUserInfo()
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
        <>
            <CurveBGWrapper className="page-nft-sale deposit-page" scrollBg={!isSignature} style={{zIndex: '1 !important'}}>
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

            {
                isModalConfirm && _renderModalConfirm()
            }

            {
                isModalResult && _renderModalResult()
            }
        </>
    )
}

export default NFTSaleRoundWorldCup
