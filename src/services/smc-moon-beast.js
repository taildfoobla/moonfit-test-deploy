import configs from '../configs'
import Web3 from "web3";
import moonBeastABI from "../abis/MoonBeastNFT.json";
import {range} from "../utils/array";
import {balanceOfAccount, tokenOfOwnerByIndex} from './smc-common'
import {NFT_SALE_CURRENT_INFO} from '../constants/blockchain'
import {getNFTInfo} from "../utils/blockchain";
import Bluebird from "bluebird";

const {MOONBEAST_NETWORK, MOONBEAST_SC} = configs

const web3js = new Web3(MOONBEAST_NETWORK)
const _moonBeastContract = new web3js.eth.Contract(moonBeastABI.abi, MOONBEAST_SC)

export const fetchMoonBeastsByAccount = async (account) => {
    const balance = await balanceOfAccount(_moonBeastContract, account)

    const data = range(0, balance - 1)

    return Bluebird.map(data, async index => {
        // const tokenId = await moonBeastContract.methods.tokenOfOwnerByIndex(wallet.account, index).call()
        const tokenId = await tokenOfOwnerByIndex(_moonBeastContract, account, index)
        const isCurrentRound = parseInt(tokenId, 10) >= NFT_SALE_CURRENT_INFO.fromTokenID
        if (!isCurrentRound) {
            return {tokenId, isCurrentRound}
        }
        const {name, imageUrl} = await getNFTInfo(_moonBeastContract.methods, tokenId)
        return {name, imageUrl, tokenId, isCurrentRound}
    }, {concurrency: 5})
}


export const getTokenInfoOfOwnerByIndex = async (account, index) => {
    const tokenId = await _moonBeastContract.methods.tokenOfOwnerByIndex(account, index).call()
    const uri = await _moonBeastContract.methods.tokenURI(tokenId).call()
    return {
        tokenId,
        uri,
    }
}

export const moonBeastContract = _moonBeastContract
