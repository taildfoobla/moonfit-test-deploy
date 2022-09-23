import configs from "../configs";
import Web3 from "web3";
import {getStringOfBigNumber} from "../utils/number";
const {MOONBEAST_NETWORK} = configs

const web3js = new Web3(MOONBEAST_NETWORK)

export const balanceOfAccount = async (contract, account) => {
    return contract.methods.balanceOf(account).call()
}

export const tokenOfOwnerByIndex = async (contract, account, index) => {
    let tokenId

    try {
        tokenId = await contract.methods.tokenOfOwnerByIndex(account, index).call()
    } catch (e) {
        //
    }

    return tokenId
}

export const getTransactionReceipt = (txHash) => {
    return web3js.eth.getTransactionReceipt(txHash)
}

export const estimateGas = (tx) => web3js.eth.estimateGas(tx)

export const fromWeiToEther = (value) => web3js.utils.fromWei(getStringOfBigNumber(value), 'ether')
