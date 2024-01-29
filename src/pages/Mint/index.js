import React, {useContext, useEffect, useState} from "react"
import Bluebird from "bluebird"
// import WalletAuthContext from "../contexts/WalletAuthContext"
import {useAuth} from "../../core/contexts/auth"
// import * as notification from "../utils/notification"
import * as notification from "../../core/utils-app/notification"
import {switchNetwork} from "../../core/utils-app/blockchain"
// import Paths from "../routes/Paths"
import Paths from "../Deposit/components/Paths"
// import EnvWrapper from "../components/shared/EnvWrapper"
import EnvWrapper from "../Deposit/components/EnvWrapper"
// import WalletAuthRequiredNFTSale from "../components/WalletAuthRequiredNFTSale"
import WalletAuthRequiredNFTSale from "./components/WalletAuthRequiredNFTSale"
// import NFTStages from "../components/NFTStages"
import NFTStages from "./components/NFTStages"
// import Header from '../components/NFTSaleCurrentRound/Header'
import Header from "./components/Header"
import MoonBeasts from "./components/MoonBeastsV2/index"
// import { fetchMintPassByAccount } from "../services/smc-mint-pass"
import {fetchMintPassByAccount} from "../../core/services-app/smc-mint-pass"
// import { balanceOfAccount } from "../services/smc-moon-beast"
import {balanceOfAccount} from "../../core/services-app/smc-moon-beast"
// import {
//     getAvailableMintPass,
//     getAvailableSlots,
//     getMoonBeastByOwner,
//     firstTokenId,
//     lastTokenId,
// } from '../services/smc-ntf-sale-round-34'
import {
    getAvailableMintPass,
    getAvailableSlots,
    getMoonBeastByOwner,
    firstTokenId,
    lastTokenId,
} from "../../core/services-app/smc-ntf-sale-round-34"
// import CurveBGWrapper from '../wrappers/CurveBG'
import CurveBGWrapper from "../Deposit/components/CurveBG"
// import NFTSaleMoonBestInfo from '../components/NFTSaleRoundThree/SaleInfo'
import NFTSaleMoonBestInfo from "./components/SaleInfo"
import MintWrapper from "../../components/Wrapper/MintWrapper"
import "./style.less"
import {useGlobalContext} from "../../core/contexts/global"
import FreeMint from "../../components/FreeMint"
import {getTotalSalesAPI} from "../../core/services/mint"
import {checkApi} from "../../core/utils/helpers/check-api"
import {getAssetsDataAPI} from "../../core/services/assets-management"
import {message as AntdMessage} from "antd"
import MoonBeastList from "./components/MoonBeastsList"
import {useNavigate} from "react-router-dom"

const Mint = () => {
    const navigate = useNavigate()
    const [availableMintPass, setAvailableMintPass] = useState(0)
    const [moonBeastLoading, setMoonBeastLoading] = useState(true)
    const [saleLoading, setSaleLoading] = useState(true)
    const [mintPasses, setMintPasses] = useState([])
    const [moonBeasts, setMoonBeasts] = useState([])
    const [saleAmount, setSaleAmount] = useState(NaN)
    const [moonBeastMinting, setMoonBeastMinting] = useState(0)
    const [amount, setAmount] = useState({GLMR: 0, ASTR: 0})
    const [isRerender, setIsRerender] = useState(false)
    const [isRefresh, setIsRefresh] = useState(false)

    const {isConnected, wallet, provider, auth, showConnectModal, isLoginSocial} = useAuth()

    const {selectedNetwork} = useGlobalContext()
    const isAstar = selectedNetwork === "astar"
    const isFreeMint = selectedNetwork === "free"
    // useEffect(() => {
    //     if (!!auth?.user?.account) {
    //         fetchData().then()
    //     }
    //     notification.destroy()
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [auth?.user?.account])

    useEffect(() => {
        if (isLoginSocial) {
            getTotalSalesData()
            getMoonBeastData()
        } else {
            navigate("/")
        }
    }, [isLoginSocial])

    useEffect(() => {
        if (isRerender) {
            console.log("rerender")
            getTotalSalesData()
            getMoonBeastData()
        } else if (isRefresh) {
            console.log("refresh")
            getTotalSalesData()
            getMoonBeastData()
        }
    }, [isRerender, isRefresh])

    const getTotalSalesData = async () => {
        const res = await checkApi(getTotalSalesAPI)
        const {data, message, success} = res
        if (success) {
            setSaleAmount(data?.round3?.available)

            //mint-pass
            setSaleLoading(false)
        } else {
            // AntdMessage.config({
            //     className: "message-error",
            //     duration: 5,
            // })
            return AntdMessage.error({
                key: "err",

                content: message,
                className: "message-error",
                duration: 5,
            })
        }
    }

    const getMoonBeastData = async () => {
        const res = await checkApi(getAssetsDataAPI)
        const tokens = res?.tokens
        const glmr = tokens.find((token) => token.name === "GLMR")
        const astr = tokens.find((token) => token.name === "ASTR")
        setAmount({GLMR: glmr?.value, ASTR: astr?.value})

        const nfts = res?.nfts?.data
        const moonBeasts = nfts.filter((nft) => nft.type === "MoonBeast")
        const mintPasses = nfts.filter((nft) => nft.type === "MintPass")
        setMoonBeastLoading(false)
        setIsRefresh(false)
        if (isRerender) {
            setTimeout(() => {
                setMoonBeasts(moonBeasts)
                setAvailableMintPass(mintPasses?.length)

                setIsRerender(false)
            }, 2000)
        } else {
            setMoonBeasts(moonBeasts)
            setAvailableMintPass(mintPasses?.length)
        }
    }
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
            getAvailableMintPass(auth?.user?.account),
            fetchMintPassByAccount(auth?.user?.account),
        ])

        setMintPasses(_mintPassesBalance)
        setAvailableMintPass(_availableMintPass)

        setSaleLoading(false)
    }

    const _fetchMoonBeasts = async () => {
        setMoonBeastLoading(true)

        try {
            const countMoonBeasts = await balanceOfAccount(auth?.user?.account)
            console.log({countMoonBeasts})

            if (countMoonBeasts) {
                const result = await getMoonBeastByOwner(auth?.user?.account, 0, countMoonBeasts - 1)
                console.log(result)
                const _moonBeasts = Array.from(result[0])
                    .map((tokenId) => ({tokenId: parseInt(tokenId, 10)}))
                    .filter((item) => item.tokenId >= firstTokenId && item.tokenId <= lastTokenId)
                _moonBeasts.reverse()
                console.log({_moonBeasts})
                setMoonBeasts(_moonBeasts)
            }
        } catch (e) {
            console.log("fetch MoonBeasts error", e.message)

            await Bluebird.delay(5000)
            return _fetchMoonBeasts()
        }

        setMoonBeastLoading(false)
    }

    const fetchData = async () => {
        // Switch Network on Desktop Wallet Extension
        provider && (await switchNetwork(provider))

        await Promise.all([_getAvailableSlots(), _fetchMintPass(), _fetchMoonBeasts()])
    }

    const handleRefresh = async (e) => {
        e && e.preventDefault()

        setSaleLoading(true)
        setMoonBeastLoading(true)
        setIsRefresh(true)
        // return Promise.all([_getAvailableSlots(), _fetchMintPass(), _fetchMoonBeasts()])
    }

    const _renderContainer = () => {
        return (
            <div className="section-content" key={"_renderContainer"}>
                <div className="container">
                    <div className="moonfit-card">
                        <div className="moonfit-card-inner">
                            <div className="card-title flex flex-col lg:flex-row justify-center lg:justify-between items-center mx-auto mt-0 mb-6 lg:mb-8">
                                <div
                                    className={
                                        "card-title-text flex text-[20px] text-white leading-normal font-normal justify-center w-full lg:w-auto justify-center lg:justify-start mt-4 lg:mt-0"
                                    }
                                >
                                    PURCHASE MoonBeast
                                </div>
                                <div
                                    className={
                                        "card-title-button flex w-full lg:w-auto justify-center lg:justify-start mt-4 lg:mt-0"
                                    }
                                >
                                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                    <a
                                        href="#"
                                        className={
                                            "text-[18px] font-extrabold inline primary-color darker-grotesque-font leading-refresh"
                                        }
                                        type="button"
                                        onClick={(e) => handleRefresh(e)}
                                    >
                                        <svg
                                            width="18"
                                            height="22"
                                            viewBox="0 0 18 22"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M5.60938 9.12805H2.23438C2.08519 9.12805 1.94212 9.05674 1.83663 8.92981C1.73114 8.80288 1.67188 8.63073 1.67188 8.45122V4.39024C1.67392 4.25617 1.70821 4.12568 1.77061 4.01457C1.833 3.90346 1.92082 3.81649 2.02344 3.76418C2.12649 3.71398 2.2396 3.70165 2.34848 3.72875C2.45736 3.75586 2.55712 3.82118 2.63516 3.91646L3.92188 5.46471L4.22422 5.10092C5.49201 3.58097 7.20875 2.72754 8.99844 2.72754C10.7881 2.72754 12.5049 3.58097 13.7727 5.10092C13.8779 5.2278 13.9369 5.3997 13.9369 5.57893C13.9369 5.75815 13.8779 5.93005 13.7727 6.05694C13.7209 6.12063 13.6591 6.17125 13.5909 6.20581C13.5227 6.24036 13.4494 6.25816 13.3754 6.25816C13.3014 6.25816 13.2281 6.24036 13.1599 6.20581C13.0917 6.17125 13.0299 6.12063 12.9781 6.05694C11.9212 4.79014 10.4902 4.07888 8.99844 4.07888C7.50665 4.07888 6.07564 4.79014 5.01875 6.05694L4.71641 6.42073L6.01016 7.97744C6.08764 8.07256 6.14008 8.19307 6.16091 8.32389C6.18173 8.4547 6.17002 8.59 6.12723 8.71284C6.08444 8.83568 6.01248 8.9406 5.92037 9.01446C5.82825 9.08832 5.72007 9.12783 5.60938 9.12805V9.12805ZM15.7625 12.563H12.3875C12.2768 12.5632 12.1686 12.6027 12.0765 12.6765C11.9844 12.7504 11.9124 12.8553 11.8696 12.9782C11.8269 13.101 11.8151 13.2363 11.836 13.3671C11.8568 13.4979 11.9092 13.6184 11.9867 13.7136L13.2805 15.2703L12.9781 15.6341C11.9212 16.9009 10.4902 17.6121 8.99844 17.6121C7.50665 17.6121 6.07564 16.9009 5.01875 15.6341C4.96702 15.5704 4.90522 15.5198 4.837 15.4852C4.76878 15.4506 4.6955 15.4328 4.62148 15.4328C4.54746 15.4328 4.47419 15.4506 4.40597 15.4852C4.33775 15.5198 4.27595 15.5704 4.22422 15.6341C4.11902 15.761 4.05995 15.9329 4.05995 16.1121C4.05995 16.2913 4.11902 16.4632 4.22422 16.5901C5.4911 18.1121 7.20819 18.967 8.99844 18.967C10.7887 18.967 12.5058 18.1121 13.7727 16.5901L14.075 16.2263L15.3617 17.7745C15.4135 17.8395 15.4757 17.891 15.5447 17.9259C15.6136 17.9608 15.6877 17.9784 15.7625 17.9776C15.8349 17.9772 15.9065 17.9599 15.9734 17.9268C16.0761 17.8745 16.1639 17.7875 16.2263 17.6764C16.2887 17.5653 16.323 17.4348 16.325 17.3008V13.2398C16.325 13.1509 16.3105 13.0629 16.2822 12.9808C16.2539 12.8987 16.2125 12.824 16.1602 12.7612C16.108 12.6983 16.046 12.6485 15.9778 12.6145C15.9095 12.5805 15.8364 12.563 15.7625 12.563Z"
                                                fill="#4CCBC9"
                                            />
                                        </svg>
                                        <span> Refresh</span>
                                    </a>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className={"card-body-content mt-4 mb-6 lg:mt-8"}>
                                    <NFTSaleMoonBestInfo
                                        availableMintPass={availableMintPass}
                                        mintPasses={mintPasses}
                                        onRefresh={(e) => handleRefresh(e)}
                                        isLoading={saleLoading}
                                        amount={amount}
                                        isRerender={isRerender}
                                        setIsRerender={setIsRerender}
                                        setMoonBeastMinting={(val) => setMoonBeastMinting(val)}
                                        moonBeasts={moonBeasts}
                                        moonBeastLoading={moonBeastLoading}
                                        setMoonBeastLoading={setMoonBeastLoading}
                                    />
                                    {/* <MoonBeasts
                                        isLoading={moonBeastLoading}
                                        moonBeasts={moonBeasts}
                                        moonBeastMinting={moonBeastMinting}
                                    /> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        // <CurveBGWrapper className="page-nft-sale" scrollBg={!isConnected}>
        //     <EnvWrapper routeItem={Paths.NFTSale}>
        <MintWrapper>
            <WalletAuthRequiredNFTSale className={"section page-nft-sale"}>
                <NFTStages>
                    {[
                        <Header
                            availableSlots={saleAmount}
                            isLoading={Number.isNaN(saleAmount)}
                            roundInfo={{
                                number: "3",
                                hideDate: true,
                            }}
                            key="Header"
                        />,
                        isFreeMint ? <FreeMint setIsRerender={setIsRerender} /> : _renderContainer(),
                    ]}
                </NFTStages>
            </WalletAuthRequiredNFTSale>
        </MintWrapper>
        //     </EnvWrapper>
        // </CurveBGWrapper>
    )
}

export default Mint

