import React, {useContext, useEffect, useState} from 'react'
import Web3 from "web3"
import {getMintPassInfo, getMintPassWalletInfo, getWalletMerklePath} from "../services/tokenSale"
import AuthContext from "../contexts/AuthContext"
import contractABI from '../abis/MintPassNFT.json'
import promotionBg from "../assets/images/promoting-bg.jpg"
import mediumSatellite1 from "../assets/images/shapes/medium-satellite-1.png"
import mediumSatellite2 from "../assets/images/shapes/medium-satellite-2.png"
import kusamaV2 from "../assets/images/shapes/kusama-v2.png"
import polkadot from "../assets/images/shapes/polkadot-v2.png"
import tokenMFR from "../assets/images/token-mfr.png"
import tokenMFG from "../assets/images/shapes/token-mfg.png"
import WalletAuthRequired from "./shared/WalletAuthRequired"
import {notification} from "antd"
import {getMainMessage} from "../utils/tx-error"
import {getAddressScanUrl, getTokenScanUrl, getTxScanUrl} from "../utils/blockchain"
import AppContext from "../contexts/AppContext"


const MintPassMinting = (props) => {
    const [mintLoading, setMintLoading] = useState(false)
    const [mintPassInfo, setMintPassInfo] = useState({})
    const [walletInfo, setWalletInfo] = useState({})

    const {user, onConnect} = useContext(AuthContext)
    const {loading, setLoading} = useContext(AppContext)

    useEffect(() => {
        user.account && fetchData().then()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user.account])

    // useEffect(() => {
    //     setLoading(true)
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [])

    const fetchData = async () => {
        setLoading(true)
        const fetchMintPassInfo = async () => {
            const {data, success} = await getMintPassInfo()
            if (data && success) {
                setMintPassInfo(data.data)
            }
        }
        const fetchWalletInfo = async () => {
            const {data, success} = await getMintPassWalletInfo(user.account)
            if (data && success) {
                setWalletInfo(data.data)
            }
        }
        await Promise.all([fetchMintPassInfo(), fetchWalletInfo()])
        setLoading(false)
    }

    const handleMintMintPass = async () => {
        setMintLoading(true)
        if (walletInfo.balance > 0) {
            setMintLoading(false)
            return notification.warn({
                message: `You already have a mint pass`,
                placement: 'bottomRight',
                duration: 3
            })
        }
        try {
            const provider = window.SubWallet
            if (!provider) {
                console.log('SubWallet is not installed')
            }
            const web3js = new Web3(provider)
            const nonce = await web3js.eth.getTransactionCount(user.account, 'latest')
            const mintPassContract = new web3js.eth.Contract(contractABI.abi, mintPassInfo.contract)
            const {data, success} = await getWalletMerklePath(user.account)
            if (success && data.data.path) {
                const path = data.data.path
                // console.log(path)
                const txHash = await provider.request({
                    method: 'eth_sendTransaction', params: [
                        {
                            to: mintPassInfo.contract,
                            from: user.account,
                            nonce: nonce,
                            // value: getStringOfBigNumber(10 ** 18),
                            data: mintPassContract.methods.mintNFT(path).encodeABI()
                        }
                    ]
                })
                console.log("The hash of MFMP minting transaction is: ", txHash)
                notification.success({
                    message: `Transaction Successful`,
                    description: (
                        <div>
                            The hash of MFMP minting transaction is: <br/>
                            <a target="_blank" rel="noreferrer"
                               className={'text-blue-600'}
                               href={getTxScanUrl(txHash)}>{txHash}</a>
                        </div>
                    ),
                    placement: 'bottomRight',
                    duration: 30000
                })
            } else {
                notification.error({
                    message: `Transaction Failed`,
                    description: 'Your wallet is not in white list',
                    placement: 'bottomRight',
                    duration: 3
                })
            }
            setMintLoading(false)
        } catch (e) {
            setMintLoading(false)
            showTxError(e.message)
            console.log("!error", e)
        }
    }

    const showTxError = (message) => {
        notification.error({
            message: `Transaction Failed`,
            description: getMainMessage(message),
            placement: 'bottomRight',
            duration: 3
        })
    }

    const renderAddressLink = (address) => {
        const url = getAddressScanUrl(address)
        return (
            <a href={url} target={'_blank'} rel={'noreferrer'} className={'text-blue-600 text-sm normal-case'}>View on
                block explorer</a>
        )
    }

    const renderNFTLink = (contract, tokenId) => {
        const url = getTokenScanUrl(contract, tokenId)
        return (
            <a href={url} target={'_blank'} rel={'noreferrer'} className={'text-blue-600'}>
                #{tokenId}
            </a>
        )
    }

    const {contract, isActive} = mintPassInfo
    const {balance, tokenId} = walletInfo

    return (
        <WalletAuthRequired isConnected={!!user.account} onConnect={onConnect} className={'section page-mfg-ps'}>
            <div className="section-shape section-shape-promoting-bg">
                <img loading="lazy" src={promotionBg} alt="Promoting an active lifestyle"
                     width="1920"
                     height="340"/>
            </div>
            <div className="section-shape section-shape-satellite-1">
                <img loading="lazy" src={mediumSatellite1} alt="satellite"
                     width="229" height="224"/>
            </div>
            <div className="section-shape section-shape-satellite-2">
                <img loading="lazy" src={mediumSatellite2} alt="satellite"
                     width="407" height="490"/>
            </div>
            <div className="section-shape section-shape-kusama move-vertical">
                <img loading="lazy" src={kusamaV2} alt="Kusama" width="238"
                     height="237"/>
            </div>
            <div className="section-shape section-shape-polkadot move-vertical-reversed">
                <img loading="lazy" src={polkadot} alt="Polkadot" width="218"
                     height="223"/>
            </div>
            <div className="section-shape shape-token-mfr-1 move-vertical-reversed">
                <img loading="lazy" src={tokenMFR} alt="shape"
                     width="70"
                     height="70"/>
            </div>
            <div className="section-shape shape-token-mfr-2">
                <img loading="lazy" src={tokenMFR} alt="shape" className="move-vertical"
                     width="70"
                     height="70"/>
            </div>
            <div className="section-shape shape-token-mfg-1">
                <img loading="lazy" src={tokenMFG} alt="shape" width="71"
                     height="51" className="move-vertical-reversed"/>
            </div>
            <div className="section-shape shape-token-mfg-2">
                <img loading="lazy" src={tokenMFG} alt="shape"
                     width="70"
                     height="70" className="move-vertical-reversed"/>
            </div>
            {
                !loading && contract && <div className="section-content">
                    <div className="container">
                        <div className={'flex justify-center items-start'}>
                            <div className={'flex mr-5'}>
                                <h2 className={'font-bold text-3xl secondary-color'}>Mint Pass Minting</h2>
                            </div>
                            <div className={'flex'}>
                                {isActive ? (
                                    <span
                                        className="bg-green-400 text-green-800 text-sm font-bold mr-2 px-2.5 py-0.5 rounded dark:bg-green-500 dark:text-white">
                                    Active
                                </span>
                                ) : (
                                    <span
                                        className="bg-indigo-100 text-indigo-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-indigo-200 dark:text-indigo-900">
                                    Inactive
                                </span>
                                )}
                            </div>
                        </div>
                        <div className="moonfit-card">
                            <div className="moonfit-card-inner">
                                <div className="card-title flex justify-between">
                                    <div className={'flex'}>Minting information</div>
                                    <div className={'flex'}>
                                        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                        <a href="#" className={'normal-case text-xs inline'} onClick={() => fetchData()}>
                                            <svg className="w-5 h-5 inline mr-1" fill="none" stroke="currentColor"
                                                 viewBox="0 0 24 24"
                                                 xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                                            </svg>
                                            Refresh
                                        </a>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <div className={'mt-8'}>
                                        <div className={'flex justify-between'}>
                                            <div className={'flex'}>Mint Pass contract</div>
                                            <div className={'flex flex-col'}>
                                                <div className={'flex text-green-500'}>
                                                    {contract}
                                                </div>
                                                <div className={'flex justify-end'}>
                                                    {renderAddressLink(contract)}
                                                </div>
                                            </div>
                                        </div>
                                        {/*<div className={'flex justify-between'}>*/}
                                        {/*    <div className={'flex'}>Purchase price</div>*/}
                                        {/*    <div className={'flex text-green-500'}>{1}</div>*/}
                                        {/*</div>*/}
                                        {/*<div className={'flex justify-between'}>*/}
                                        {/*    <div className={'flex'}>Sale rate</div>*/}
                                        {/*    <div className={'flex text-green-500'}>{1} (1 GLMR = {1} MFG)*/}
                                        {/*    </div>*/}
                                        {/*</div>*/}
                                        {/*<div className={'flex justify-between'}>*/}
                                        {/*    <div className={'flex'}>Remaining slot</div>*/}
                                        {/*    <div className={'flex text-green-500'}>{1}</div>*/}
                                        {/*</div>*/}
                                        <hr className={'my-4'}/>
                                        <div className={'flex justify-between'}>
                                            <div className={'flex'}>Your Mint Pass Balance</div>
                                            <div className={'flex text-green-500'}>{balance || "0"} NFT</div>
                                        </div>
                                        <div className={'flex justify-between mt-2'}>
                                            <div className={'flex'}>Token ID</div>
                                            <div
                                                className={'flex text-green-500'}>{renderNFTLink(contract, tokenId) || "Empty"}</div>
                                        </div>
                                        <div className={'flex flex-row justify-center mt-4'}>
                                            <button type="button"
                                                    onClick={handleMintMintPass}
                                                    disabled={mintLoading}
                                                    className="mt-3 button button-secondary flex items-center">
                                                {
                                                    mintLoading ? (
                                                        <svg role="status"
                                                             className="inline w-4 h-4 mr-3 text-white animate-spin"
                                                             viewBox="0 0 100 101" fill="none"
                                                             xmlns="http://www.w3.org/2000/svg">
                                                            <path
                                                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                                                fill="#E5E7EB"/>
                                                            <path
                                                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                                                fill="currentColor"/>
                                                        </svg>
                                                    ) : (
                                                        <svg className="inline w-6 h-6 mr-2" fill="none"
                                                             stroke="currentColor"
                                                             viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                                  strokeWidth={2}
                                                                  d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"/>
                                                        </svg>
                                                    )
                                                } Mint A Pass
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </WalletAuthRequired>
    )
}

export default MintPassMinting