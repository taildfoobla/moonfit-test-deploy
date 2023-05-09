import React, { useContext, useEffect, useState } from 'react'
import Bluebird from 'bluebird'
import WalletAuthContext from "../contexts/WalletAuthContext"
import * as notification from "../utils/notification"
import { switchNetwork } from "../utils/blockchain"
import Paths from "../routes/Paths"
import EnvWrapper from "../components/shared/EnvWrapper"
import WalletAuthRequiredNFTSale from "../components/WalletAuthRequiredNFTSale"
import NFTStages from "../components/NFTStages"
import Header from '../components/NFTSaleCurrentRound/Header'
import MoonBeasts from '../components/NFTSaleCurrentRound/MoonBeastsV2/index'
import {fetchMintPassByAccount} from "../services/smc-mint-pass"
import {balanceOfAccount} from "../services/smc-moon-beast"
import {
    getAvailableMintPass,
    getAvailableSlots,
    getMoonBeastByOwner,
    firstTokenId,
    lastTokenId,
} from '../services/smc-ntf-sale-round-34'
import CurveBGWrapper from '../wrappers/CurveBG'
import NFTSaleMoonBestInfo from '../components/NFTSaleRoundThree/SaleInfo'

const NFTSaleRoundThree = () => {
    const [availableMintPass, setAvailableMintPass] = useState(0)
    const [moonBeastLoading, setMoonBeastLoading] = useState(true)
    const [saleLoading, setSaleLoading] = useState(true)
    const [mintPasses, setMintPasses] = useState([])
    const [moonBeasts, setMoonBeasts] = useState([])
    const [saleAmount, setSaleAmount] = useState(NaN)
    const [moonBeastMinting, setMoonBeastMinting] = useState(0)

    const { isConnected, wallet, provider } = useContext(WalletAuthContext)

    useEffect(() => {
        if (!!wallet.account) {
            fetchData().then()
        }
        notification.destroy()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [wallet.account])


    const _getAvailableSlots = async () => {
        try {
            const value = await getAvailableSlots()

            if (!Number.isNaN(value)) {
                setSaleAmount(value)
            } else {
                await Bluebird.delay(60000)
                return _getAvailableSlots()
            }
        } catch (e) {
            //
        }
    }

    const _fetchMintPass = async () => {
        setSaleLoading(true)

        const [_availableMintPass, _mintPassesBalance] = await Promise.all([
            getAvailableMintPass(wallet.account),
            fetchMintPassByAccount(wallet.account),
        ])

        setMintPasses(_mintPassesBalance)
        setAvailableMintPass(_availableMintPass)

        setSaleLoading(false)
    }

    const _fetchMoonBeasts = async () => {
        setMoonBeastLoading(true)

        try {
            const countMoonBeasts =  await balanceOfAccount(wallet.account)
            console.log({countMoonBeasts})

            if (countMoonBeasts) {
                const result = await getMoonBeastByOwner(wallet.account, 0, countMoonBeasts - 1)
                console.log(result)
                const _moonBeasts = Array.from(result[0])
                    .map(tokenId => ({tokenId: parseInt(tokenId, 10)}))
                    .filter(item => item.tokenId >= firstTokenId && item.tokenId <= lastTokenId)
                _moonBeasts.reverse()
                console.log({_moonBeasts})
                setMoonBeasts(_moonBeasts)
            }
        } catch (e) {
            console.log('fetch MoonBeasts error', e.message)

            await Bluebird.delay(5000)
            return _fetchMoonBeasts()
        }

        setMoonBeastLoading(false)
    }

    const fetchData = async () => {
        // Switch Network on Desktop Wallet Extension
        provider && await switchNetwork(provider)

        await Promise.all([
            _getAvailableSlots(),
            _fetchMintPass(),
            _fetchMoonBeasts()
        ])
    }

    const handleRefresh = async (e) => {
        e && e.preventDefault()

        return Promise.all([
            _getAvailableSlots(),
            _fetchMintPass(),
            _fetchMoonBeasts(),
        ])
    }

    const _renderContainer = () => {
        return (
            <div className="section-content" key={'_renderContainer'}>
                <div className="container">
                    <div className="moonfit-card">
                        <div className="moonfit-card-inner">
                            <div
                                className="card-title flex flex-col lg:flex-row justify-center lg:justify-between items-center mx-auto mt-0 mb-6 lg:mb-8">
                                <div
                                    className={'flex text-[20px] text-white leading-normal font-normal justify-center w-full lg:w-auto justify-center lg:justify-start mt-4 lg:mt-0'}>
                                    PURCHASE MoonBeast
                                </div>
                                <div
                                    className={'flex w-full lg:w-auto justify-center lg:justify-start mt-4 lg:mt-0'}>
                                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                    <a href="#" className={'text-[18px] font-extrabold inline primary-color darker-grotesque-font leading-refresh'}
                                       type="button" onClick={e => handleRefresh(e)}>
                                        <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor"
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
                                    <NFTSaleMoonBestInfo
                                        availableMintPass={availableMintPass}
                                        mintPasses={mintPasses}
                                        onRefresh={(e) => handleRefresh(e)}
                                        isLoading={saleLoading}
                                        setMoonBeastMinting={val => setMoonBeastMinting(val)}
                                    />

                                    <MoonBeasts isLoading={moonBeastLoading}
                                                moonBeasts={moonBeasts}
                                                moonBeastMinting={moonBeastMinting}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <CurveBGWrapper className="page-nft-sale" scrollBg={!isConnected}>
            <EnvWrapper routeItem={Paths.NFTSale}>
                <WalletAuthRequiredNFTSale className={'section page-nft-sale'}>
                    <NFTStages>
                        {
                            [
                                <Header availableSlots={saleAmount} isLoading={Number.isNaN(saleAmount)} roundInfo={{
                                    number: '3',
                                    hideDate: true,
                                }} key="Header"/>,
                                _renderContainer()
                            ]
                        }
                    </NFTStages>
                </WalletAuthRequiredNFTSale>
            </EnvWrapper>
        </CurveBGWrapper>
    )
}

export default NFTSaleRoundThree
