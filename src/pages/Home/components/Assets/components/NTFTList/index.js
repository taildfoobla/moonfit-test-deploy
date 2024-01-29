import React, { useCallback, useEffect, useState } from "react"
import NTFSCard from "../../../../../../components/NTFSCard"
import "./styles.less"
import { useLocalStorage } from "../../../../../../core/hooks/useLocalStorage"
import { LOCALSTORAGE_KEY } from "../../../../../../core/utils/helpers/storage"
import Web3 from "web3"
import { BLC_CONFIGS } from "../../../../../../core/utils/configs/blockchain"
import mintPassABI from "../../../../../../core/abis/MintPassNFT.json"
import moonBeastABI from "../../../../../../core/abis/UMoonBeastNFT.json"
import { useAuth } from "../../../../../../core/contexts/auth"
import { getNFTBalance, getNFTInfo } from "../../../../../../core/utils/helpers/blockchain"
import { range } from "../../../../../../core/utils/helpers/array"
import { Button } from "antd"
import { Link } from "react-router-dom"

const { MINT_PASS_SC, MOONBEAST_SC } = BLC_CONFIGS
const NFT_LIMIT = 10

const NTFSList = () => {
    const [nfts, setNfts] = useState([])
    const [network] = useLocalStorage(LOCALSTORAGE_KEY.NETWORK)
    const [loading, setLoading] = useState(true)
    const [nftBalance, setNftBalance] = useState({})
    const [page, setPage] = useState(1)
    const [moreLoading, setMoreLoading] = useState(false)

    const { auth } = useAuth()
    const { user } = auth

    useEffect(() => {
        return () => {
            setNfts([])
            setPage(1)
        }
    }, [])

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
                    return { name, imageUrl, tokenId }
                } else if (i >= mpBalance && i < mpBalance + mbBalance) {
                    const idx = (i - mpBalance) % mbBalance
                    const tokenId = await moonBeastContract.methods.tokenOfOwnerByIndex(user.account, idx).call()
                    const { name, imageUrl } = await getNFTInfo(moonBeastContract.methods, tokenId)
                    return { name, imageUrl, tokenId }
                }
            })
        )
        setNfts(nfts => [...nfts, ...newNFTs])
    }, [network.rpc_url, user.account])


    useEffect(() => {
        const fetchNFTs = async () => {
            try {
                setLoading(true)
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
                setLoading(false)
            }
        }

        if (user.account && network.rpc_url) {
            fetchNFTs().then()
        } else {
            setNfts([])
            setLoading(false)
        }
    }, [network.rpc_url, user.account, fetchNftInfos])

    const onClickLoadMore = async (nftBalance, page) => {
        setMoreLoading(true)
        await fetchNftInfos(nftBalance, page + 1)
        setPage(page => page + 1)
        setMoreLoading(false)
    }

    const openTofuNft = () => {
        window.open("https://tofunft.com/collection/moonfit-beast-and-beauty/items", "_blank")
    }

    const isLoadMoreVisible = nfts.length < nftBalance.total

    if (loading) return null

    if (nfts.length === 0)
        return (
            <div className="ntfs-empty">
                <div className="ntfs-empty__text">
                    You need to HOLD MoonFit NFTs to join exclusive campaigns for NFT HODLers
                </div>
                <div className="ntfs-empty__cta">
                    <a target='_blank' href="https://app.moonfit.xyz/nft-sale-round-3">
                        <Button style={{ marginBottom: '15px' }} type="primary" className="ntfs-empty__btn -primary-2" block>
                        Mint NFT
                        </Button>
                    </a>
                    <a href='"https://tofunft.com/collection/moonfit-beast-and-beauty/items' target='_blank' className="ant-btn ant-btn-primary ant-btn-block ntfs-empty__btn">
                        Buy from tofunft
                    </a>
                </div>
            </div>
        )

    return (
        <div className={'nft-list-container'}>
            <div className={"ntfs-list"}>
                {
                    nfts.map((nft, idx) => {
                        return (
                            <div className="ntfs-list__item" key={idx}>
                                <NTFSCard {...nft} position={idx} />
                            </div>
                        )
                    })
                }
            </div>
            {
                isLoadMoreVisible && (
                    <div className={'nfts-load-more'}>
                        <Button type={'primary'} block onClick={() => onClickLoadMore(nftBalance, page)}
                            loading={moreLoading}>Load
                            more</Button>
                    </div>
                )
            }
        </div>
    )
}

export default NTFSList
