import configs from '../configs'
import Web3 from "web3";
import nftSaleABI from "../abis/MoonBeastNFTSaleRound34.json";
import {moonBeastContract} from "./smc-moon-beast";
import {getMoonBeast as _getMoonBeast} from "./smc-common";

const {MOONBEAM_WSS_URL} = configs

const web3 = new Web3(MOONBEAM_WSS_URL)
const saleContract = new web3.eth.Contract(nftSaleABI.abi, configs.R34_NFT_SALE_SC)

export const getAvailableSlots = async () => {
    const value = await saleContract.methods.getAvailableSlots().call()

    return parseInt(value)
}

export const getAvailableMintPass = async (owner) => {
    const value = await saleContract.methods.countMintPassLooking(owner).call()

    return parseInt(value)
}

export const mintNFTWithoutMintPassData = pack => saleContract.methods.mintNFTWithoutMintPassV2(pack).encodeABI()

export const mintNFTWithMintPassData = pack => saleContract.methods.mintNFTWithMintPassV2(pack).encodeABI()

export const lockMintPass = (mintPassIds) => saleContract.methods.lockMintPass(mintPassIds).encodeABI()

export const unlockMintPass = () => saleContract.methods.unlockMintPass2().encodeABI()



export const getSaleMaxAmount = async () => {
    const value = await saleContract.methods._maxSaleAmount().call()

    return parseInt(value)
}

export const buyNFTData = (mintAmount) => {
    return saleContract.methods.buyNFT(mintAmount).encodeABI()
}

export const getMoonBeast = async (wallet) => {
    return _getMoonBeast(moonBeastContract, saleContract, wallet)
}

export const NFT_SALE_ADDRESS = configs.R34_NFT_SALE_SC

export const smcContract = saleContract;

