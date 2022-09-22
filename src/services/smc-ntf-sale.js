import {NFT_SALE_CURRENT_INFO} from "../constants/blockchain"
import {BLC_CONFIGS} from '../configs/blockchain'
import Web3 from "web3";
import nftSaleABI from "../abis/MFNFTSale.json";

const {MOONBEAST_NETWORK} = BLC_CONFIGS
const {NFT_SALE_SC} = NFT_SALE_CURRENT_INFO

const web3js = new Web3(MOONBEAST_NETWORK)
const saleContract = new web3js.eth.Contract(nftSaleABI.abi, NFT_SALE_SC)

export const getMintPassAvailableSlots = async (tokenId) => {
    let availableSlots

    try {
        availableSlots = await saleContract.methods.getMintPassAvailableSlots(tokenId).call()
        availableSlots = parseInt(availableSlots, 10)
    } catch (e) {
        //
    }

    return availableSlots
}

export const getAvailableSlots = () => {
    return saleContract.methods.getAvailableSlots().call()
}

export const getSaleMaxAmount = () => {
    return saleContract.methods._maxSaleAmount().call()
}
