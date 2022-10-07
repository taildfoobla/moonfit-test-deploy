import {NFT_SALE_ROUNDS_INFO} from "../constants/blockchain"
import configs from '../configs'
import Web3 from "web3";
import Bluebird from 'bluebird'
import nftSaleABI from "../abis/MFNFTSale.json";
import MoonBeast from '../utils/MoonBeast'
import sortMintPass from '../utils/sortMintPass'

const {MOONBEAST_NETWORK} = configs
const {NFT_SALE_SC} = NFT_SALE_ROUNDS_INFO.R3

const web3 = new Web3(MOONBEAST_NETWORK)
const saleContract = new web3.eth.Contract(nftSaleABI.abi, NFT_SALE_SC)

export const getMintPassAvailableSlots = async (tokenId, retryCount = 3) => {
    let availableSlots

    try {
        availableSlots = await saleContract.methods.getMintPassAvailableSlots(tokenId).call()
        availableSlots = parseInt(availableSlots, 10)
    } catch (e) {
        console.log(e)

        if (retryCount > 0) {
            await Bluebird.delay(200)

            return getMintPassAvailableSlots(tokenId, retryCount - 1)
        }
    }

    return availableSlots
}

export const getAvailableSlots = async () => {
    const value = await saleContract.methods.getAvailableSlots().call()

    return parseInt(value)
}

export const getSaleMaxAmount = async () => {
    const value = await saleContract.methods._maxSaleAmount().call()

    return parseInt(value)
}

export const buyNFTData = (mintPassTokenIds, mintAmount) => {
    return saleContract.methods.buyNFT(mintPassTokenIds, mintAmount).encodeABI()
}

export const getMintPass = async (wallet, sort = true) => {
    const data = await saleContract.methods.getMintPass(wallet).call()

    const mintPass = data.map(item => {
        const bought = parseInt(item.bought)
        const maxAmount = parseInt(item.maxAmount)
        const availableSlots = maxAmount - bought
        const imageUrl = 'https://bafybeidedg4erz6vvoywe26obvqty5aiovsxzjrvakjsciusigdct2hoqy.ipfs.nftstorage.link'

        return {
            tokenId: item.tokenId,
            bought,
            maxAmount,
            availableSlots,
            imageUrl,
            name: `MoonFit Mint Pass #${item.tokenId}`,
            isOutOfSlot: bought === maxAmount,
            isUsed: !!bought,
            isSelected: bought !== maxAmount,
        }
    })

    mintPass.reverse()

    if (sort) {
        mintPass.sort(sortMintPass)
    }

    return mintPass
}

export const getMoonBeast = async (wallet) => {
    const data = await saleContract.methods.getMoonBeast(wallet).call()

    const moonBeasts = data.map(item => new MoonBeast(item.tokenId, item.uri, item.ownerMinted))

    moonBeasts.sort((a, b) => b.tokenId - a.tokenId)

    return moonBeasts
}

export const smcContract = saleContract;

export const NFT_SALE_ADDRESS = NFT_SALE_SC
