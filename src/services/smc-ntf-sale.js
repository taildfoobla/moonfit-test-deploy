import {NFT_SALE_CURRENT_INFO} from "../constants/blockchain"
import configs from '../configs'
import Web3 from "web3";
import Bluebird from 'bluebird'
import nftSaleABI from "../abis/MFNFTSale.json";

const {MOONBEAST_NETWORK} = configs
const {NFT_SALE_SC} = NFT_SALE_CURRENT_INFO

const web3 = new Web3(MOONBEAST_NETWORK)
const saleContract = new web3.eth.Contract(nftSaleABI.abi, NFT_SALE_SC)

export const getMintPassAvailableSlots = async (tokenId, retryCount = 3) => {
    let availableSlots

    try {
        availableSlots = await saleContract.methods.getMintPassAvailableSlots(tokenId).call()
        availableSlots = parseInt(availableSlots, 10)
    } catch (e) {
        console.log(e)

        if(retryCount > 0) {
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
