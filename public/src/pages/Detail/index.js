import React, { useCallback, useEffect, useState } from "react"
// import "./styles.less"
import Web3 from "web3"
import Container from "../../components/Container"
import { useAuth } from "../../core/contexts/auth"
import { useLocalStorage } from "../../core/hooks/useLocalStorage"
import EventService from "../../core/services/event"
import { BLC_CONFIGS } from "../../core/utils/configs/blockchain"
import EventContent from "./components/EventContent"
import EventHeader from "./components/EventHeader"
import mintPassABI from '../../core/abis/MintPassNFT.json'
import moonBeastABI from '../../core/abis/UMoonBeastNFT.json'
import { getLocalStorage, LOCALSTORAGE_KEY } from "../../core/utils/helpers/storage";
import { getNFTBalance, getNFTInfo } from "../../core/utils/helpers/blockchain";
import { range } from "../../core/utils/helpers/array";
import { useParams } from "react-router-dom"
import { Helmet } from "react-helmet"
// import LoadingWrapper from "../../components/LoadingWrapper"

const { MINT_PASS_SC, MOONBEAST_SC } = BLC_CONFIGS
const NFT_LIMIT = 3

const EventDetail = () => {
    const params = useParams()
    // eslint-disable-next-line
    const [loadingEvent, setLoadingEvent] = useState(false)
    const [event, setEvent] = useState(EventService.getDefaultEventData(params.id, {}))
    const [selectedNft, setSelectedNft] = useState("")
    const [nfts, setNfts] = useState([])
    const [network,] = useLocalStorage(LOCALSTORAGE_KEY.NETWORK)
    const [nftBalance, setNftBalance] = useState({})
    const [page, setPage] = useState(1)
    const [userEventData, setUserEventData] = useState({})
    const [moreLoading, setMoreLoading] = useState(false)
    const userData = JSON.parse(getLocalStorage(LOCALSTORAGE_KEY.WALLET_ACCOUNT))

    const { onDisconnect, auth } = useAuth()
    const { user } = auth
    // document.title = `MoonFit - ${event?.title}` || "Moonfit - Raffle game"

    useEffect(() => {
        fetchEventById(params.id)
        return () => {
            setNfts([])
            setPage(1)
        }
    }, [params.id, user, userEventData, onDisconnect])

    const fetchNftInfos = useCallback(async (nftBalanceParam, pageParam = 1) => {
        const web3js = new Web3(network.rpc_url)
        const mintPassContract = new web3js.eth.Contract(mintPassABI.abi, MINT_PASS_SC)
        const moonBeastContract = new web3js.eth.Contract(moonBeastABI.abi, MOONBEAST_SC)
        const { total, mpBalance, mbBalance } = nftBalanceParam
        const start = (pageParam - 1) * NFT_LIMIT
        const end = pageParam * NFT_LIMIT + 1 > total ? total : pageParam * NFT_LIMIT

        const newNFTs = await Promise.all(
            range(start, end - 1).map(async (i) => {
                if (i < mpBalance) {
                    const idx = i % mpBalance
                    const tokenId = await mintPassContract.methods.tokenOfOwnerByIndex(user.account, idx).call()
                    const { name, imageUrl } = await getNFTInfo(mintPassContract.methods, tokenId)
                    return { name, imageUrl, tokenId, type: 'mint_pass' }
                } else if (i >= mpBalance && i < mpBalance + mbBalance) {
                    const idx = (i - mpBalance) % mbBalance
                    const tokenId = await moonBeastContract.methods.tokenOfOwnerByIndex(user.account, idx).call()
                    const { name, imageUrl } = await getNFTInfo(moonBeastContract.methods, tokenId)
                    return { name, imageUrl, tokenId, type: 'moon_beast' }
                }
            })
        )
        setNfts(nfts => [...nfts, ...newNFTs])
    }, [network.rpc_url, user.account])

    useEffect(() => {
        const fetchNFTs = async () => {
            try {
                const {
                    total,
                    mintPass: mpBalance,
                    moonBeast: mbBalance
                } = await getNFTBalance(network.rpc_url, user.account)
                setNftBalance({ total, mpBalance, mbBalance })
                fetchNftInfos({ total, mpBalance, mbBalance }, 1).then()
            } catch (e) {
                console.error(e)
            } finally {
            }
        }

        if (user.account && network.rpc_url) {
            fetchNFTs().then()
        } else {
            setNfts([])
        }
    }, [network.rpc_url, user.account, userEventData, fetchNftInfos])

    const fetchEventById = async (id) => {
        const { data } = await EventService.getEventById(id)
        EventService.setDefaultEventData(params.id, data)
        setEvent(data)
    }

    const onClickLoadMore = async (nftBalance, page) => {
        setMoreLoading(true)
        await fetchNftInfos(nftBalance, page + 1)
        setPage(page => page + 1)
        setMoreLoading(false)
    }

    const isLoadMoreVisible = nfts.length < nftBalance.total

    return (
        <Container>
            <Helmet>
                <title>{event?.title ? `${event?.title} - MoonFit` : "Raffle game - Moonfit"}</title>
            </Helmet>
            {/* <LoadingWrapper loading={loadingEvent} /> */}
            {
                event && <div className="app__detail">
                    <EventHeader event={event} nftBalance={nftBalance} userEventData={userEventData} userData={userData} />
                    <EventContent
                        slug={params.id}
                        event={event}
                        nfts={nfts}
                        page={page}
                        moreLoading={moreLoading}
                        setNfts={setNfts}
                        userScore={userEventData?.point}
                        userEventData={userEventData}
                        setUserEventData={setUserEventData}
                        nftBalance={nftBalance}
                        selectedNft={selectedNft}
                        setLoadingEvent={setLoadingEvent}
                        setSelectedNft={setSelectedNft}
                        onClickLoadMore={onClickLoadMore}
                        isLoadMoreVisible={isLoadMoreVisible}
                    />
                </div>
            }
        </Container>
    )
}

export default EventDetail
