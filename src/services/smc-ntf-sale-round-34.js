import configs from '../configs'
import {NFT_SALE_ROUNDS_INFO} from '../constants/blockchain'
import Web3 from "web3";
import nftSaleABI from "../abis/MoonBeastNFTSaleRound34.json";

const {MOONBEAM_WSS_URL} = configs

const web3 = new Web3(MOONBEAM_WSS_URL)
const saleContract = new web3.eth.Contract(nftSaleABI.abi, configs.R34_NFT_SALE_SC)
export const firstTokenId = NFT_SALE_ROUNDS_INFO.R3.fromTokenID
export const lastTokenId = NFT_SALE_ROUNDS_INFO.R3.lastTokenId
export const getAvailableSlots = async () => {
    const value = await saleContract.methods.getAvailableSlots().call()

    return parseInt(value)
}

export const getSaleMaxAmount = async () => {
    const value = await saleContract.methods._maxSaleAmount().call()

    return parseInt(value)
}

export const getAvailableMintPass = async (owner) => {
    const value = await saleContract.methods.countMintPassLooking(owner).call()

    return parseInt(value)
}

export const mintNFTWithoutMintPassData = pack => saleContract.methods.mintNFTWithoutMintPassV2(pack).encodeABI()

export const mintNFTWithMintPassData = pack => saleContract.methods.mintNFTWithMintPassV2(pack).encodeABI()

export const lockMintPass = (mintPassIds) => saleContract.methods.lockMintPass(mintPassIds).encodeABI()

export const unlockMintPass = () => saleContract.methods.unlockMintPass().encodeABI()
export const unlockMintPass2 = () => saleContract.methods.unlockMintPass2().encodeABI()

export const countMintByOwner = (owner) => saleContract.methods.countMintByOwner(owner).call().then(value => parseInt(value, 10))
export const getMintByOwner = (owner, from, to) => saleContract.methods.getMintByOwner(owner, from, to).call()
export const getMoonBeastByOwner = (owner, from, to) => {
    console.log({owner, from, to})
    return saleContract.methods.getMoonBeastByOwner(owner, from, to).call()
}

export const getMintPassLooking = async (owner) => {
    return saleContract.methods.getMintPassLooking(owner).call()
}

export const NFT_SALE_ADDRESS = configs.R34_NFT_SALE_SC

export const smcContract = saleContract;

