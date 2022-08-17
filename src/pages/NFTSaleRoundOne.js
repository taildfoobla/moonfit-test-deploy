import React, {useContext, useEffect, useRef, useState} from 'react'
import Web3 from "web3"
import WalletAuthContext from "../contexts/WalletAuthContext"
import nftSaleABI from '../abis/MFNFTSale.json'
import mintPassABI from '../abis/MintPassNFT.json'
import moonBeastABI from '../abis/MoonBeastNFT.json'
import {Image, notification, Progress, Typography} from "antd"
import {getMainMessage} from "../utils/tx-error"
import {
    getAddressScanUrl,
    getNFTScanUrl,
    getShortAddress,
    getTxScanUrl,
    sendTransaction,
    switchNetwork
} from "../utils/blockchain"
import {BLC_CONFIGS} from '../configs/blockchain'
import axios from "axios"
import LoadingWrapper from "../components/shared/LoadingWrapper"
import Paths from "../routes/Paths"
import EnvWrapper from "../components/shared/EnvWrapper"
import CurveBGWrapper from "../wrappers/CurveBG"
import CopyIcon from "../components/shared/CopyIcon"
import {range} from "../utils/array"
import {NFT_SALE_INFO} from "../constants/blockchain"
import {getStringOfBigNumber} from "../utils/number"
import BigNumber from "bignumber.js"
import classNames from "classnames"
import WalletAuthRequiredNFTSale from "../components/WalletAuthRequiredNFTSale"
import NFTSkeleton from "../components/NFTSkeleton"

const {MINT_PASS_SC, MOONBEAST_SC, R1_NFT_SALE_SC} = BLC_CONFIGS
const {Paragraph} = Typography
const {R1} = NFT_SALE_INFO

const NFTSaleRoundOne = (props) => {
    const [loading, setLoading] = useState(true)
    const [mintLoading, setMintLoading] = useState(false)
    const [mintPasses, setMintPasses] = useState([])
    const [moonBeasts, setMoonBeasts] = useState([])
    const [saleInfo, setSaleInfo] = useState({})
    const [selectedMp, setSelectedMp] = useState([])
    const [mbLoading, setMbLoading] = useState(false)
    const [isConfirmedTx, setIsConfirmedTx] = useState(false)

    const mbRetrieverRef = useRef(0)

    const {wallet, network, provider, connector} = useContext(WalletAuthContext)

    useEffect(() => {
        !!wallet.account && fetchData().then()
        setSelectedMp([])
        notification.destroy()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [wallet.account])

    useEffect(() => {
        if (isConfirmedTx) {
            // console.log('Effect isConfirmedTx', isConfirmedTx)
            clearMbInterval()
            setMbLoading(false)
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
                setSelectedMp([])
            }, 500)
            return true
        }
        return true
    }

    const fetchData = async (loading = true) => {
        loading && setLoading(true)

        // Switch Network on Desktop Wallet Extension
        provider && await switchNetwork(provider)

        const web3js = new Web3(network.rpc_url)
        const mintPassContract = new web3js.eth.Contract(mintPassABI.abi, MINT_PASS_SC)
        const saleContract = new web3js.eth.Contract(nftSaleABI.abi, R1_NFT_SALE_SC)
        const moonBeastContract = new web3js.eth.Contract(moonBeastABI.abi, MOONBEAST_SC)

        const [mpBalance, availableSlots, maxSaleSlots, mbBalance] = await Promise.all([
            mintPassContract.methods.balanceOf(wallet.account).call(),
            saleContract.methods.getAvailableSlots().call(),
            saleContract.methods._maxSaleAmount().call(),
            moonBeastContract.methods.balanceOf(wallet.account).call(),
        ])
        const mintPasses = await Promise.all(range(0, mpBalance - 1).map(async i => {
            const tokenId = await mintPassContract.methods.tokenOfOwnerByIndex(wallet.account, i).call()
            const {name, imageUrl} = await getNFTInfo(mintPassContract.methods, tokenId)
            const isUsed = await saleContract.methods.checkMintPass(tokenId).call()
            return {name, imageUrl, tokenId, isUsed}
        }))
        setMintPasses(mintPasses)

        const moonBeasts = await Promise.all(range(0, mbBalance - 1).map(async i => {
            const tokenId = await moonBeastContract.methods.tokenOfOwnerByIndex(wallet.account, i).call()
            const {name, imageUrl} = await getNFTInfo(moonBeastContract.methods, tokenId)
            return {name, imageUrl, tokenId}
        }))
        setMoonBeasts(moonBeasts)

        setSaleInfo({availableSlots, maxSaleSlots})
        loading && setLoading(false)
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

    const handleMintNFT = async () => {
        setMintLoading(true)
        try {
            const web3js = new Web3(network.rpc_url)
            const nonce = await web3js.eth.getTransactionCount(wallet.account, 'latest')
            const nftSaleContract = new web3js.eth.Contract(nftSaleABI.abi, R1_NFT_SALE_SC)
            // const gasPrice = await web3js.eth.getGasPrice() // estimate the gas price

            const value = new BigNumber(R1.price).multipliedBy(selectedMp.length).multipliedBy(R1.nftPerPass).multipliedBy(1e18)
            // const value = new BigNumber(0.01).multipliedBy(selectedMp.length).multipliedBy(R1.nftPerPass).multipliedBy(1e18)
            const tx = {
                to: R1_NFT_SALE_SC,
                from: wallet.account,
                nonce: `${nonce}`,
                // gasPrice: `${gasPrice}`,
                maxPriorityFeePerGas: null,
                maxFeePerGas: null,
                value: getStringOfBigNumber(value),
                data: nftSaleContract.methods.buyNFT(selectedMp).encodeABI()
            }
            // console.log(tx)
            const gasLimit = await web3js.eth.estimateGas(tx)
            // tx.gas = `${gasLimit}`
            console.log(web3js.utils.hexToNumber(gasLimit))

            const txHash = await sendTransaction(provider, connector, tx)
            console.log("The hash of MFB minting transaction is: ", txHash)
            setMbLoading(true)
            setIsConfirmedTx(false)
            clearMbInterval()
            notification.destroy()

            mbRetrieverRef.current = setInterval(() => fetchMoonBeasts(txHash), 3000)
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
            <a href={url} target={'_blank'} rel={'noreferrer'} className={'text-[#A16BD8] text-sm normal-case mt-2'}>
                View on block explorer
            </a>
        )
    }

    const renderNFTLink = (address, tokenId) => {
        const url = getNFTScanUrl(address.toLowerCase(), tokenId)
        return (
            <a href={url} target={'_blank'} rel={'noreferrer'} className={'text-[#A16BD8] text-sm normal-case'}>
                View on NFTScan
            </a>
        )
    }

    const onClickMintPass = (tokenId) => {
        if (selectedMp.includes(tokenId)) {
            const newList = selectedMp.filter(i => i !== tokenId)
            setSelectedMp(newList)
        } else {
            const newList = [...selectedMp, tokenId]
            setSelectedMp(newList)
        }
    }

    const renderMintPasses = () => {
        return mintPasses.length === 0 ? (
            <div className={'my-3'}>
                <div className={'text-center text-white normal-case'}>You don't own any mint pass yet.</div>
                <div className={'text-center text-white normal-case'}>No Mint-Pass = No Beast or Beauty NFT mint.</div>
            </div>
        ) : (
            <div className={"grid grid-cols-4 lg:grid-cols-6 gap-2 lg:gap-4"}>
                {
                    mintPasses.map((mp, idx) => {
                        const isSelected = selectedMp.includes(mp.tokenId)
                        const onClick = () => !mp.isUsed && onClickMintPass(mp.tokenId)
                        const nameArr = mp.name.split(' ')
                        const preName = nameArr[0]

                        return (
                            <div
                                className={classNames('flex flex-col justify-center items-center mt-4 col-span-2 mp-item', {
                                    'cursor-not-allowed mp-used': mp.isUsed,
                                })}
                                key={idx}
                                onClick={onClick}>
                                <div
                                    className={classNames('flex justify-center square-img-container', {'mp-selected': isSelected})}>
                                    <img
                                        // width={104}
                                        src={mp.imageUrl}
                                        alt={mp.name}
                                    />
                                </div>
                                <div className={'flex flex-col normal-case race-sport-font text-sm mt-4'}>
                                    <span className={'secondary-color text-center'}>{preName}</span>
                                    <span className={'primary-color text-center mt-1'}>Mint Pass</span>
                                    <span className={'primary-color text-center mt-1'}>#{mp.tokenId}</span>
                                </div>
                                <div
                                    className={'flex normal-case my-2 z-10'}>{renderNFTLink(MINT_PASS_SC, mp.tokenId)}</div>
                                {
                                    mp.isUsed && (
                                        // <div className={'used-overlay'}>
                                        <span className={'normal-case used-text'}>Used</span>
                                        // </div>
                                    )
                                }
                                {/*{*/}
                                {/*    !mp.isUsed && isSelected && (*/}
                                {/*        <div className={'selected-container'}>*/}
                                {/*            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"*/}
                                {/*                 xmlns="http://www.w3.org/2000/svg">*/}
                                {/*                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}*/}
                                {/*                      d="M5 13l4 4L19 7"/>*/}
                                {/*            </svg>*/}
                                {/*        </div>*/}
                                {/*    )*/}
                                {/*}*/}
                            </div>
                        )
                    })
                }
            </div>
        )
    }

    const renderMoonBeasts = () => {
        return moonBeasts.length === 0 ? (
            <div className={'my-3'}>
                <div className={'text-center text-white normal-case'}>You don't own any beast/beauty yet.</div>
                <div className={'text-center text-white normal-case'}>If you have a pass, please click "MINT NFT" button to
                    mint one.
                </div>
            </div>
        ) : (
            <div className={"grid grid-cols-4 lg:grid-cols-6 gap-4"}>
                {
                    moonBeasts.map((mb, idx) => {
                        const nameArr = mb.name.split(' ')
                        const preName = nameArr[0]
                        const typeName = nameArr[1]
                        const numberName = nameArr[2]

                        return (
                            <div className={'flex flex-col justify-center items-center mt-4 col-span-2 nft-item'}
                                 key={idx}>
                                <div className={'flex'}>
                                    <Image
                                        width={'100%'}
                                        src={mb.imageUrl}
                                        alt={mb.name}
                                    />
                                </div>
                                <div className={'flex flex-col normal-case race-sport-font text-sm mt-4'}>
                                    <span className={'secondary-color text-center'}>{preName}</span>
                                    <span className={'primary-color text-center mt-1'}>{typeName}</span>
                                    <span className={'primary-color text-center mt-1'}>{numberName}</span>
                                </div>
                                <div className={'flex normal-case mt-2'}>{renderNFTLink(MOONBEAST_SC, mb.tokenId)}</div>
                            </div>
                        )
                    })
                }
                {
                    mbLoading && range(0, selectedMp.length - 1).map(i =>
                        <NFTSkeleton className={'flex flex-col items-center mt-4 col-span-2 nft-item'}
                                     key={i}/>
                    )
                }
            </div>
        )
    }


    const {availableSlots, maxSaleSlots} = saleInfo
    const mintedSlots = maxSaleSlots - availableSlots
    const unusedPasses = mintPasses.filter(i => i.isUsed === false)
    const isMintBtnVisible = unusedPasses.length > 0 && availableSlots > 0
    const isMintBtnDisabled = selectedMp.length === 0 || mintLoading

    return (
        <CurveBGWrapper>
            <EnvWrapper routeItem={Paths.NFTSaleR1}>
                <WalletAuthRequiredNFTSale className={'section page-nft-sale'}>
                    {
                        !loading && <div className="section-content">
                            <div className="container">
                                <div className={'flex flex-col'}>
                                    <div className={'flex justify-center'}>
                                        <h2 className={'font-bold text-3xl secondary-color'}>NFT Sale <span
                                            className={'text-white'}>Round #1</span></h2>
                                    </div>
                                    <div className={'flex justify-center mt-6'}>
                                        <span
                                            className="bg-[#A16BD8] text-white normal-case font-bold px-4 pb-1 rounded dark:bg-green-500 dark:text-white">
                                            22nd August
                                        </span>
                                        {
                                            availableSlots > 0 ? (
                                                <span
                                                    className="ml-3 bg-[#4CCBC9] text-[#020722] normal-case font-bold px-4 pb-1 rounded dark:bg-green-500 dark:text-white">
                                                    {availableSlots} {`NFT${availableSlots > 1 ? 's' : ''}`} left
                                                </span>
                                            ) : (
                                                <span
                                                    className="ml-3 bg-[#EF2763] text-white normal-case font-bold px-4 pb-1 rounded dark:bg-green-500 dark:text-white">
                                                    Sold out
                                                </span>
                                            )
                                        }
                                    </div>
                                </div>
                                <div className="moonfit-card">
                                    <div className="moonfit-card-inner">
                                        <div
                                            className="card-title flex flex-col lg:flex-row justify-center lg:justify-between items-start mx-auto mt-0 mb-6 lg:mb-10">
                                            <div
                                                className={'flex text-white justify-center w-full lg:w-auto justify-center lg:justify-start mt-4 lg:mt-0'}>
                                                Mint with Mint Pass
                                            </div>
                                            <div
                                                className={'flex w-full lg:w-auto justify-center lg:justify-start mt-4 lg:mt-0'}>
                                                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                                <a href="#" className={'normal-case text-xs inline primary-color'}
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
                                            <div className={'mt-4 lg:mt-8'}>
                                                <div className={'card-body-row flex flex-col'}>
                                                    <div className={'flex card-body-row-title'}>NFT contract</div>
                                                    <div className={'flex flex-col'}>
                                                        <Paragraph className={'flex text-white'}
                                                                   copyable={{
                                                                       text: MOONBEAST_SC,
                                                                       format: 'text/plain',
                                                                       icon: [<CopyIcon/>]
                                                                   }}>
                                                            {getShortAddress(MOONBEAST_SC, 14)}
                                                        </Paragraph>
                                                        <div className={'flex'}>
                                                            {renderAddressLink(MOONBEAST_SC)}
                                                        </div>
                                                    </div>
                                                    <hr className={'card-body-separator'}/>
                                                    <div className={'flex card-body-row-title mt-3'}>NFT Price</div>
                                                    <div className={'flex flex-col'}>
                                                        <div className="flex justify-between items-center">
                                                            <div className={'text-[#4ccbc9]'}>{R1.price} GLMR</div>
                                                        </div>
                                                    </div>
                                                    <hr className={'card-body-separator'}/>
                                                    <div className={'flex justify-between items-center mt-2'}>
                                                        <div className={'flex card-body-row-title'}>Total Minted</div>
                                                        {
                                                            availableSlots > 0 ? (
                                                                <div
                                                                    className={'text-[#4ccbc9]'}>{mintedSlots} / {maxSaleSlots}</div>
                                                            ) : (
                                                                <div
                                                                    className="ml-3 bg-[#EF2763] text-white normal-case font-bold px-4 pb-1 rounded dark:bg-green-500 dark:text-white">
                                                                    Sold out
                                                                </div>
                                                            )
                                                        }
                                                    </div>
                                                    <div className={'flex flex-col text-[#4ccbc9]'}>
                                                        <div className="flex justify-between items-center">
                                                            {/*<div*/}
                                                            {/*    className={'w-[105px]'}>{mintedSlots} / {maxSaleSlots}</div>*/}
                                                            <Progress
                                                                strokeColor={{
                                                                    from: '#4ccbc9',
                                                                    to: '#e4007b',
                                                                }}
                                                                percent={Math.floor(mintedSlots / maxSaleSlots * 100)}
                                                                status="active"
                                                                showInfo={false}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={'card-body-row flex flex-col mt-3'}>
                                                    <div className="flex justify-between">
                                                        <div className={'flex card-body-row-title'}>Select A Pass to Mint
                                                        </div>
                                                        <div
                                                            className={'flex card-body-row-title'}>Selected {selectedMp.length}
                                                        </div>
                                                    </div>
                                                    {renderMintPasses()}
                                                </div>

                                                {/*<div className={'card-body-row flex flex-col mt-3'}>*/}
                                                {/*    <div className={'flex card-body-row-title'}>Your Wallet Address</div>*/}
                                                {/*    <div className={'flex flex-col'}>*/}
                                                {/*        <Paragraph className={'flex text-white'}*/}
                                                {/*                   copyable={{*/}
                                                {/*                       text: wallet.account,*/}
                                                {/*                       format: 'text/plain',*/}
                                                {/*                       icon: [<CopyIcon/>]*/}
                                                {/*                   }}>*/}
                                                {/*            {getShortAddress(wallet.account, 14)}*/}
                                                {/*        </Paragraph>*/}
                                                {/*        <div className={'flex'}>*/}
                                                {/*            {renderAddressLink(wallet.account)}*/}
                                                {/*        </div>*/}
                                                {/*    </div>*/}
                                                {/*</div>*/}

                                                <div className={'card-body-row flex flex-col mt-3'}>
                                                    <div className="flex justify-between">
                                                        <div className={'flex card-body-row-title'}>Your NFTs
                                                        </div>
                                                        <div
                                                            className={'flex card-body-row-title'}>Total {moonBeasts.length}
                                                        </div>
                                                    </div>
                                                    {renderMoonBeasts()}
                                                </div>
                                                {
                                                    isMintBtnVisible && (
                                                        <div className={classNames('flex flex-row items-center mt-6', {
                                                            'justify-between': selectedMp.length > 0,
                                                            'justify-center': selectedMp.length === 0
                                                        })}>
                                                            {
                                                                selectedMp.length > 0 && (
                                                                    <div className={'normal-case items-center'}>
                                                                        <span className={'mb-1'}>Total: </span>
                                                                        <span
                                                                        className={'race-sport-font primary-color'}>{R1.price * selectedMp.length} GLMR</span>
                                                                    </div>
                                                                )
                                                            }
                                                            <button type="button"
                                                                    onClick={handleMintNFT}
                                                                    disabled={isMintBtnDisabled}
                                                                    className="button button-secondary flex items-center">
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
                                                                        <svg className="inline w-6 h-6 mr-2" width="22"
                                                                             height="24" viewBox="0 0 22 24" fill="none"
                                                                             xmlns="http://www.w3.org/2000/svg">
                                                                            <path
                                                                                d="M18.9087 0H6.10555C5.08442 0 4.24161 0.686203 3.98047 1.60627H15.8961C17.8898 1.60627 19.5117 3.22823 19.5117 5.22188V20.904C20.4462 20.6402 21.118 19.7798 21.118 18.7781V2.20936C21.118 0.974719 20.1154 0 18.9087 0V0Z"
                                                                                fill="white"/>
                                                                            <path
                                                                                d="M13.6851 14.4205V9.57979L9.49295 7.1593L5.30078 9.57979V14.4205L9.49295 16.841L13.6851 14.4205ZM8.90791 15.0263L7.15047 12.39C6.99302 12.1538 6.99302 11.8461 7.15047 11.6099L8.90791 8.97397C9.17369 8.55993 9.81222 8.56002 10.078 8.97397L11.8354 11.6099C11.9928 11.8461 11.9928 12.1538 11.8354 12.39L10.078 15.0263C9.81222 15.4404 9.17364 15.4403 8.90791 15.0263Z"
                                                                                fill="white"/>
                                                                            <path
                                                                                d="M15.8953 3.01257H3.09217C1.85767 3.01257 0.882812 4.01523 0.882812 5.22193V21.7907C0.882812 23.0252 1.88547 24.0001 3.09217 24.0001H15.8953C17.13 24.0001 18.1047 22.9973 18.1047 21.7907V5.22193C18.1047 3.98729 17.102 3.01257 15.8953 3.01257ZM3.89533 9.17392C3.89533 8.92271 4.02934 8.69059 4.24689 8.56501L9.14219 5.73854C9.35978 5.61292 9.62776 5.61292 9.84536 5.73854L14.7407 8.56501C14.9582 8.69064 15.0922 8.92271 15.0922 9.17392V14.8265C15.0922 15.0777 14.9582 15.3098 14.7407 15.4354L9.84536 18.2619C9.62776 18.3875 9.35978 18.3875 9.14219 18.2619L4.24689 15.4354C4.02934 15.3098 3.89533 15.0777 3.89533 14.8265V9.17392ZM14.389 20.9875H4.59845C3.66653 20.9529 3.66723 19.6156 4.59845 19.5813H14.389C15.321 19.6159 15.3203 20.9533 14.389 20.9875Z"
                                                                                fill="white"/>
                                                                            <path
                                                                                d="M10.4068 12L9.49441 10.6316L8.58203 12L9.49441 13.3687L10.4068 12Z"
                                                                                fill="white"/>
                                                                        </svg>
                                                                    )
                                                                } Mint NFT
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
                </WalletAuthRequiredNFTSale>
            </EnvWrapper>
        </CurveBGWrapper>
    )
}

export default NFTSaleRoundOne