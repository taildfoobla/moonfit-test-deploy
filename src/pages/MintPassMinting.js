import React, {useContext, useEffect, useRef, useState} from 'react'
import Web3 from "web3"
import {getWalletMerklePath} from "../services/tokenSale"
import WalletAuthContext from "../contexts/WalletAuthContext"
import contractABI from '../abis/MintPassNFT.json'
import {notification, Spin, Typography} from "antd"
import {getMainMessage} from "../utils/tx-error"
import {
    getAddressScanUrl,
    getShortAddress,
    getTxScanUrl,
    sendTransaction,
    switchNetwork
} from "../utils/blockchain"
import configs from '../configs'
import LoadingWrapper from "../components/shared/LoadingWrapper"
import Paths from "../routes/Paths"
import EnvWrapper from "../components/shared/EnvWrapper"
import {LoadingOutlined} from "@ant-design/icons"
import CurveBGWrapper from "../wrappers/CurveBG"
import CopyIcon from "../components/shared/CopyIcon"
import WalletAuthRequiredMintPass from "../components/WalletAuthRequiredMintPass"
import MintPassNFT from "../components/MintPassMinting/MintPassNFT";
import classNames from "classnames";
import {fetchMintPassByAccount} from "../services/smc-mint-pass";

const {MINT_PASS_SC} = configs
const {Paragraph} = Typography

const MintPassMinting = (props) => {
    const [loading, setLoading] = useState(true)
    const [mintLoading, setMintLoading] = useState(false)
    const [mintPassInfo, setMintPassInfo] = useState({})
    const [mintPasses, setMintPasses] = useState([])
    const [mpLoading, setMpLoading] = useState(false)
    const [isConfirmedTx, setIsConfirmedTx] = useState(false)

    const mpRetrieverRef = useRef(0)

    const {wallet, network, provider, connector} = useContext(WalletAuthContext)

    useEffect(() => {
        !!wallet.account && fetchData().then()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [wallet.account, provider])

    useEffect(() => {
        if (mintPasses.length > 0 && isConfirmedTx) {
            clearMpInterval()
            setMpLoading(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mintPasses, isConfirmedTx])

    const clearMpInterval = () => mpRetrieverRef.current && clearInterval(mpRetrieverRef.current)

    const _fetchMintPass = async () => {
        const mintPasses = await fetchMintPassByAccount(wallet.account, false)

        setMintPasses(mintPasses)
        return mintPasses.length
    }

    const fetchTransaction = async (txHash) => {
        const web3js = new Web3(network.rpc_url)
        const receipt = await web3js.eth.getTransactionReceipt(txHash)

        if (receipt?.status === true) {
            const balance = await _fetchMintPass()
            setMintPassInfo({...mintPassInfo, balance})
            if (balance) {
                setIsConfirmedTx(true)
                setMpLoading(false)
                clearMpInterval()
            }
        }
    }

    const fetchData = async () => {
        setLoading(true)
        provider && await switchNetwork(provider)
        const web3js = new Web3(network.rpc_url)
        const mintPassContract = new web3js.eth.Contract(contractABI.abi, MINT_PASS_SC)
        const methods = mintPassContract.methods
        const isActive = await methods._isActive().call()
        const balance = await _fetchMintPass()

        setMintPassInfo({isActive, balance})
        setLoading(false)
    }

    const handleMintMintPass = async () => {
        setMintLoading(true)
        try {
            const web3js = new Web3(network.rpc_url)
            const nonce = await web3js.eth.getTransactionCount(wallet.account, 'latest')
            const mintPassContract = new web3js.eth.Contract(contractABI.abi, MINT_PASS_SC)
            // const gasPrice = await web3js.eth.getGasPrice() // estimate the gas price

            const {data, success} = await getWalletMerklePath(wallet.account)
            if (success && data.data.path) {
                const path = data.data.path
                const tx = {
                    to: MINT_PASS_SC,
                    from: wallet.account,
                    nonce: `${nonce}`,
                    // gasPrice: `${gasPrice}`,
                    maxPriorityFeePerGas: null,
                    maxFeePerGas: null,
                    data: mintPassContract.methods.mintNFT(path).encodeABI()
                }
                const gasLimit = await web3js.eth.estimateGas(tx)
                // tx.gas = `${gasLimit}`
                console.log('Gas', web3js.utils.hexToNumber(gasLimit))

                const txHash = await sendTransaction(provider, connector, tx)
                console.log("The hash of MFMP minting transaction is: ", txHash)
                setMpLoading(true)
                notification.destroy()
                setIsConfirmedTx(false)
                clearMpInterval()

                mpRetrieverRef.current = setInterval(() => fetchTransaction(txHash), 5000)

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
            console.log("!error", e.message)
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

    const listMintPass = () => {
        if (!mintPasses.length) {
            return null
        }

        const _render = mintPasses.map((mp, idx) => <MintPassNFT tokenId={mp.tokenId} imageUrl={mp.imageUrl} name={mp.name} key={idx} />)

        if (mpLoading) {
            _render.unshift(
                <div key="mpLoading" className={classNames('flex flex-col justify-center items-center mt-4 col-span-2 mp-item')}>
                    <div className={'flex h-[80px]'}>
                        <Spin indicator={<LoadingOutlined style={{fontSize: 24}} spin/>}/>
                    </div>
                    <div className={'flex flex-col normal-case race-sport-font text-sm mt-4'}>
                        <span className={'secondary-color text-center'}>MoonFit</span>
                        <span className={'primary-color text-center mt-1'}>Mint Pass</span>
                        <span className={'primary-color text-center mt-1'}>Minting</span>
                    </div>
                    <div className={'flex normal-case my-2 z-10'}>

                    </div>
                </div>
            )
        }

        return (
            <div className={"grid grid-cols-4 lg:grid-cols-6 gap-2 lg:gap-4"}>
                {_render}
            </div>
        )
    }

    const renderMintPass = () => {
        if (mpLoading && !mintPasses.length) {
            return (
                <div className="flex justify-center items-center h-[240px]">
                    <Spin indicator={<LoadingOutlined style={{fontSize: 24}} spin/>}/>
                </div>
            )
        }

        if (mintPasses.length > 0) {
            return listMintPass()
        }

        return (
            <div>
                <div className={'flex text-white normal-case'}>You don't own any mint pass yet.</div>
                <div className={'flex text-white normal-case'}>Please click "MINT A PASS" button bellow to mint one.
                </div>
            </div>
        )
    }

    const {isActive} = mintPassInfo

    return (
        <CurveBGWrapper>
            <EnvWrapper routeItem={Paths.MintPassMinting}>
                <WalletAuthRequiredMintPass className={'section page-mint-pass'}>
                    {
                        !loading && <div className="section-content">
                            <div className="container">
                                <div className={'flex flex-col'}>
                                    <div className={'flex justify-center'}>
                                        <h2 className={'font-bold text-3xl secondary-color'}>Mint Pass <span
                                            className={'text-white'}>Minting</span></h2>
                                    </div>
                                    <div className={'flex justify-center mt-4'}>
                                        {isActive ? (
                                            <span
                                                className="bg-[#60B159] text-[#020722] text-sm font-bold mr-2 px-2.5 py-0.5 rounded dark:bg-green-500 dark:text-white">
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
                                        <div
                                            className="card-title flex flex-col lg:flex-row justify-center lg:justify-between items-start mx-auto mt-0 mb-6 lg:mb-10">
                                            <div
                                                className={'flex text-white justify-center w-full lg:w-auto justify-center lg:justify-start mt-4 lg:mt-0'}>Minting
                                                information
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
                                            <div className={'mt-4 mb-6 lg:mt-8'}>
                                                <div className={'card-body-row flex flex-col'}>
                                                    <div className={'flex card-body-row-title'}>Your Wallet Address</div>
                                                    <div className={'flex flex-col'}>
                                                        <Paragraph className={'flex text-white'}
                                                                   copyable={{
                                                                       text: wallet.account,
                                                                       format: 'text/plain',
                                                                       icon: [<CopyIcon/>]
                                                                   }}>
                                                            {getShortAddress(wallet.account, 14)}
                                                        </Paragraph>
                                                        <div className={'flex'}>
                                                            {renderAddressLink(wallet.account)}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={'card-body-row flex flex-col mt-3'}>
                                                    <div className={'flex card-body-row-title'}>Mint Pass contract</div>
                                                    <div className={'flex flex-col'}>
                                                        <Paragraph className={'flex text-white'}
                                                                   copyable={{
                                                                       text: MINT_PASS_SC,
                                                                       format: 'text/plain',
                                                                       icon: [<CopyIcon/>]
                                                                   }}>
                                                            {getShortAddress(MINT_PASS_SC, 14)}
                                                        </Paragraph>
                                                        <div className={'flex'}>
                                                            {renderAddressLink(MINT_PASS_SC)}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={'card-body-row flex flex-col mt-3'}>
                                                    <div className={'flex card-body-row-title'}>Your Mint Passes</div>
                                                    {renderMintPass()}
                                                </div>
                                                {
                                                    mintPassInfo?.name ? (
                                                        <div/>
                                                    ) : (
                                                        <div className={'flex flex-row justify-center mt-4'}>
                                                            <button type="button"
                                                                    onClick={handleMintMintPass}
                                                                    disabled={mintLoading || mpLoading}
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
                                                                        <svg className="inline w-6 h-6 mr-2" width="24"
                                                                             height="18" viewBox="0 0 24 18" fill="none"
                                                                             xmlns="http://www.w3.org/2000/svg">
                                                                            <path
                                                                                d="M4.29736 17.2759L17.9813 13.6093L17.4637 11.6775C17.4067 11.465 17.5413 11.2426 17.7626 11.1833C17.984 11.124 18.2117 11.2493 18.2686 11.4618L18.7862 13.3936L22.8109 12.3152C23.0323 12.2559 23.1668 12.0335 23.1099 11.821L22.057 7.89164C22.0001 7.67913 21.7724 7.5538 21.551 7.61311C20.8869 7.79105 20.2038 7.41503 20.033 6.77752C19.8622 6.14001 20.2658 5.47282 20.9298 5.29489C21.1512 5.23557 21.2857 5.01318 21.2288 4.80067L20.2111 1.00265C20.1542 0.790149 19.9265 0.664811 19.7051 0.724124L15.6804 1.80254L16.1981 3.73439C16.255 3.94689 16.1205 4.16929 15.8991 4.2286C15.6778 4.28791 15.4501 4.16257 15.3931 3.95007L14.8755 2.01822L1.19153 5.68482C0.970174 5.74414 0.83565 5.96653 0.89259 6.17903L1.91027 9.97705C1.96721 10.1896 2.19491 10.3149 2.41626 10.2556C3.08034 10.0776 3.76343 10.4537 3.93425 11.0912C4.10507 11.7287 3.7015 12.3959 3.03743 12.5738C2.81607 12.6331 2.68155 12.8555 2.73849 13.068L3.79136 16.9974C3.8483 17.2099 4.076 17.3352 4.29736 17.2759ZM15.8072 5.49555C15.7503 5.28305 15.8848 5.06065 16.1062 5.00134C16.3275 4.94203 16.5552 5.06737 16.6122 5.27987L17.0263 6.82535C17.0832 7.03785 16.9487 7.26025 16.7273 7.31956C16.506 7.37888 16.2783 7.25354 16.2213 7.04103L15.8072 5.49555ZM16.6354 8.58651C16.5785 8.37401 16.713 8.15162 16.9344 8.0923C17.1557 8.03299 17.3834 8.15833 17.4404 8.37083L17.8545 9.91631C17.9114 10.1288 17.7769 10.3512 17.5556 10.4105C17.3342 10.4698 17.1065 10.3445 17.0496 10.132L16.6354 8.58651ZM6.61016 9.72815C6.62118 9.57612 6.71903 9.44223 6.86173 9.37915L8.26173 8.77626L8.55553 7.26471C8.58668 7.10729 8.70476 6.98454 8.86173 6.94248C9.01869 6.90043 9.18233 6.94768 9.28802 7.06844L10.2982 8.23058L11.8121 8.0527C11.9672 8.03598 12.1189 8.10301 12.2045 8.22916C12.289 8.35145 12.2932 8.51184 12.2165 8.6442L11.4315 9.9809L12.0786 11.3977C12.1461 11.537 12.1211 11.701 12.015 11.8206C11.9591 11.8853 11.8848 11.93 11.8043 11.9516C11.7359 11.9699 11.6673 11.9717 11.5946 11.9581L10.1134 11.6137L9.00274 12.6526C8.88454 12.7588 8.71745 12.7953 8.56991 12.7437C8.41834 12.6932 8.31461 12.5636 8.30344 12.4093L8.15543 10.8587L6.80729 10.0936C6.67469 10.0173 6.5981 9.87632 6.61016 9.72815V9.72815Z"
                                                                                fill="white"/>
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
                </WalletAuthRequiredMintPass>
            </EnvWrapper>
        </CurveBGWrapper>
    )
}

export default MintPassMinting
