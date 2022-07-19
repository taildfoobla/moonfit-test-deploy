import React, {useContext, useEffect, useRef, useState} from 'react'
import Web3 from "web3"
import {getWalletMerklePath} from "../services/tokenSale"
import WalletAuthContext from "../contexts/WalletAuthContext"
import contractABI from '../abis/MintPassNFT.json'
import WalletAuthRequired from "../components/shared/WalletAuthRequired"
import {Image, notification, Spin, Typography} from "antd"
import {getMainMessage} from "../utils/tx-error"
import {getAddressScanUrl, getShortAddress, getTxScanUrl} from "../utils/blockchain"
import {BLC_CONFIGS} from '../configs/blockchain'
import axios from "axios"
import LoadingWrapper from "../components/shared/LoadingWrapper"
import Paths from "../routes/Paths"
import EnvWrapper from "../components/shared/EnvWrapper"
import {LoadingOutlined} from "@ant-design/icons"

const {MINT_PASS_SC} = BLC_CONFIGS
const {Paragraph} = Typography

const MintPassMinting = (props) => {
    const [loading, setLoading] = useState(true)
    const [mintLoading, setMintLoading] = useState(false)
    const [mintPassInfo, setMintPassInfo] = useState({})
    // const [txHash, setTxHash] = useState('')
    const [mpLoading, setMpLoading] = useState(false)
    const [isConfirmedTx, setIsConfirmedTx] = useState(false)

    const mpRetrieverRef = useRef(0)

    const {wallet, onConnect, detectProvider} = useContext(WalletAuthContext)

    useEffect(() => {
        !!wallet.account && fetchData().then()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [wallet.account])

    useEffect(() => {
        if (!!mintPassInfo.name && isConfirmedTx) {
            clearMpInterval()
            setMpLoading(false)
        }
        return () => clearMpInterval()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mintPassInfo.name, isConfirmedTx])

    const clearMpInterval = () => mpRetrieverRef.current && clearInterval(mpRetrieverRef.current)

    const fetchMintPass = async (txHash) => {
        const provider = await detectProvider('SubWallet')
        if (!provider) {
            console.log('SubWallet is not installed')
            return
        }
        const web3js = new Web3(provider)
        const mintPassContract = new web3js.eth.Contract(contractABI.abi, MINT_PASS_SC)
        const methods = mintPassContract.methods
        const balance = await methods.balanceOf(wallet.account).call()
        const receipt = await web3js.eth.getTransactionReceipt(txHash)
        // console.log(balance, receipt?.status)
        if (parseInt(balance) > 0 && receipt?.status === true) {
            // console.log("Successful !!")
            const tokenId = parseInt(balance) > 0 ? await methods.tokenOfOwnerByIndex(wallet.account, 0).call() : null
            const {name, imageUrl} = await getNFTInfo(methods, tokenId)
            setMintPassInfo({...mintPassInfo, tokenId, name, imageUrl})
            setIsConfirmedTx(true)
            return true
        }
        return true
    }

    const fetchData = async () => {
        setLoading(true)
        const provider = await detectProvider('SubWallet')
        if (!provider) {
            console.log('SubWallet is not installed')
            return
        }
        const web3js = new Web3(provider)
        const mintPassContract = new web3js.eth.Contract(contractABI.abi, MINT_PASS_SC)
        const methods = mintPassContract.methods
        const [isActive, balance] = await Promise.all([
            methods._isActive().call(),
            methods.balanceOf(wallet.account).call(),
        ])
        const tokenId = parseInt(balance) > 0 ? await methods.tokenOfOwnerByIndex(wallet.account, 0).call() : null
        const {name, imageUrl} = await getNFTInfo(methods, tokenId)
        setMintPassInfo({isActive, balance, tokenId, name, imageUrl})
        setLoading(false)
    }

    const getNFTInfo = async (methods, tokenId) => {
        if (!tokenId) return {name: null, imageUrl: null}
        try {
            const tokenURI = await methods.tokenURI(tokenId).call()
            // console.log(tokenId, tokenURI)
            const {data} = await axios.get(tokenURI)
            const {name, image} = data
            const cid = image.replace('ipfs://', '')
            const imageUrl = `https://${cid}.ipfs.nftstorage.link/`
            return {name, imageUrl}
        } catch (e) {
            console.log("getNFTInfo Exception", e.message)
            return {name: null, imageUrl: null}
        }
    }

    const handleMintMintPass = async () => {
        setMintLoading(true)
        if (mintPassInfo.balance > 0) {
            setMintLoading(false)
            return notification.warn({
                message: `You already have a mint pass`,
                placement: 'bottomRight',
                duration: 3
            })
        }
        try {
            const provider = await detectProvider('SubWallet')
            if (!provider) {
                console.log('SubWallet is not installed')
            }
            const web3js = new Web3(provider)
            const nonce = await web3js.eth.getTransactionCount(wallet.account, 'latest')
            // console.log(MINT_PASS_SC)
            const mintPassContract = new web3js.eth.Contract(contractABI.abi, MINT_PASS_SC)
            const {data, success} = await getWalletMerklePath(wallet.account)
            if (success && data.data.path) {
                const path = data.data.path
                // console.log(path)
                const txHash = await provider.request({
                    method: 'eth_sendTransaction', params: [
                        {
                            to: MINT_PASS_SC,
                            from: wallet.account,
                            nonce: nonce,
                            data: mintPassContract.methods.mintNFT(path).encodeABI()
                        }
                    ]
                })
                console.log("The hash of MFMP minting transaction is: ", txHash)
                // setTxHash(txHash)
                setMpLoading(true)
                mpRetrieverRef.current = setInterval(() => fetchMintPass(txHash), 3000)

                notification.success({
                    message: `Transaction Sent`,
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
                    description: 'Your wallet is not whitelisted',
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

    // const renderNFTLink = (contract, tokenId) => {
    //     const url = getTokenScanUrl(contract, tokenId)
    //     return (
    //         <a href={url} target={'_blank'} rel={'noreferrer'} className={'text-blue-600'}>
    //             #{tokenId}
    //         </a>
    //     )
    // }

    const renderMintPass = () => {
        // if (mpLoading) {
        //     return (
        //         <div className="flex justify-center items-center h-[240px]">
        //             <Spin indicator={<LoadingOutlined style={{fontSize: 24}} spin/>}/>
        //         </div>
        //     )
        // }
        if (mintPassInfo.name) {
            return (
                <div className={'flex flex-col justify-center items-center mt-4'}>
                    <div className={'flex'}>
                        <Image
                            width={150}
                            src={mintPassInfo.imageUrl}
                            alt={mintPassInfo.name}
                        />
                        {/*<img src={mintPassInfo.imageUrl} alt={mintPassInfo.name} width={150}/>*/}
                    </div>
                    <div className={'flex normal-case text-green-500 mt-2'}>{mintPassInfo.name}</div>
                </div>
            )
        } else if (mpLoading) {
            return (
                <div className="flex justify-center items-center h-[240px]">
                    <Spin indicator={<LoadingOutlined style={{fontSize: 24}} spin/>}/>
                </div>
            )
        } else return <div className={'flex text-green-500 normal-case'}>You don't own any mint pass yet</div>
    }

    const {isActive} = mintPassInfo

    return (
        <EnvWrapper routeItem={Paths.MintPassMinting}>
            <WalletAuthRequired isConnected={!!wallet.account} onConnect={onConnect}
                                className={'section page-mint-pass'}>
                {
                    !loading && <div className="section-content">
                        <div className="container">
                            <div className={'flex flex-col'}>
                                <div className={'flex justify-center'}>
                                    <h2 className={'font-bold text-3xl secondary-color'}>Mint Pass Minting</h2>
                                </div>
                                <div className={'flex justify-center mt-4'}>
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
                                    <div className="card-title flex justify-between items-start">
                                        <div className={'flex'}>Minting information</div>
                                        <div className={'flex'}>
                                            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                            <a href="#" className={'normal-case text-xs inline'}
                                               onClick={() => fetchData()}>
                                                <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor"
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
                                            <div className={'flex flex-col'}>
                                                <div className={'flex'}>Mint Pass contract</div>
                                                <div className={'flex flex-col'}>
                                                    <Paragraph className={'flex text-green-500'}
                                                               copyable={{text: MINT_PASS_SC, format: 'text/plain'}}>
                                                        {getShortAddress(MINT_PASS_SC, 14)}
                                                    </Paragraph>
                                                    <div className={'flex'}>
                                                        {renderAddressLink(MINT_PASS_SC)}
                                                    </div>
                                                </div>
                                            </div>
                                            <hr className={'my-4'}/>
                                            <div className={'flex flex-col mt-2'}>
                                                <div className={'flex'}>Your Wallet Address</div>
                                                <div className={'flex flex-col'}>
                                                    <Paragraph className={'flex text-green-500'}
                                                               copyable={{text: wallet.account, format: 'text/plain'}}>
                                                        {getShortAddress(wallet.account, 14)}
                                                    </Paragraph>
                                                    <div className={'flex'}>
                                                        {renderAddressLink(wallet.account)}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={'flex flex-col mt-2'}>
                                                <div className={'flex'}>Your Mint Pass</div>
                                                {renderMintPass()}
                                            </div>
                                            {/*<div className={'flex flex-col mt-2'}>*/}
                                            {/*    <div className={'flex'}>Token ID</div>*/}
                                            {/*    <div*/}
                                            {/*        className={'flex text-green-500'}>{tokenId ? renderNFTLink(MINT_PASS_SC, tokenId) : "Empty"}</div>*/}
                                            {/*</div>*/}
                                            {
                                                mintPassInfo?.balance > 0 ? (
                                                    <div/>
                                                ) : (
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
                                                                         viewBox="0 0 24 24"
                                                                         xmlns="http://www.w3.org/2000/svg">
                                                                        <path strokeLinecap="round" strokeLinejoin="round"
                                                                              strokeWidth={2}
                                                                              d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"/>
                                                                    </svg>
                                                                )
                                                            } Mint A Pass
                                                        </button>
                                                    </div>
                                                )
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
                <LoadingWrapper loading={loading}/>
            </WalletAuthRequired>
        </EnvWrapper>
    )
}

export default MintPassMinting