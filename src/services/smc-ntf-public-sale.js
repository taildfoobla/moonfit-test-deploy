import {NFT_SALE_ROUNDS_INFO} from "../constants/blockchain"
import configs from '../configs'
import Web3 from "web3";
import nftSaleABI from "../abis/MoonFitNFTPublicSale.json";
import MoonBeast from '../utils/MoonBeast'

const {MOONBEAST_NETWORK} = configs
const {NFT_SALE_SC} = NFT_SALE_ROUNDS_INFO.R4

const web3 = new Web3(MOONBEAST_NETWORK)
const saleContract = new web3.eth.Contract(nftSaleABI.abi, NFT_SALE_SC)

export const getAvailableSlots = async () => {
    const value = await saleContract.methods.getAvailableSlots().call()

    return parseInt(value)
}

export const getSaleMaxAmount = async () => {
    const value = await saleContract.methods._maxSaleAmount().call()

    return parseInt(value)
}

export const buyNFTData = (mintAmount) => {
    return saleContract.methods.buyNFT(mintAmount).encodeABI()
}

export const getMoonBeast = async (wallet) => {
    const data = await saleContract.methods.getMoonBeast(wallet).call()

    const moonBeasts = data.map(item => new MoonBeast(item.tokenId, item.uri, item.ownerMinted))

    moonBeasts.sort((a, b) => b.tokenId - a.tokenId)

    return moonBeasts
}

export const smcContract = saleContract;

export const NFT_SALE_ADDRESS = NFT_SALE_SC
