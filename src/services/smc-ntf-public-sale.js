import {NFT_SALE_ROUNDS_INFO} from "../constants/blockchain"
import configs from '../configs'
import Web3 from "web3";
import nftSaleABI from "../abis/MoonFitNFTPublicSale.json";
import MoonBeast from '../utils/MoonBeast'
import {moonBeastContract} from "./smc-moon-beast";

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
    console.log(wallet);
    let balance = await moonBeastContract.methods.balanceOf(wallet).call()
    balance = parseInt(balance , 10)
    let _moonBeasts
    console.log({balance, wallet});
    if (balance >= 200) {
        _moonBeasts = Array.from(Array(balance).keys()).map(index => new MoonBeast({wallet, index}))

        _moonBeasts.reverse()

        return _moonBeasts
    }

    const data = await saleContract.methods.getMoonBeast(wallet).call()

    _moonBeasts = data.map((item, index) => new MoonBeast({
        tokenId: item.tokenId,
        uri: item.uri,
        mintByContract: item.ownerMinted,
        wallet,
        index,
    }))

    _moonBeasts.sort((a, b) => b.tokenId - a.tokenId)

    return _moonBeasts
}

export const smcContract = saleContract;

export const NFT_SALE_ADDRESS = NFT_SALE_SC
