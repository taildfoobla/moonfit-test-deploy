import configs from "../configs";
import Web3 from "web3";
import {getStringOfBigNumber} from "../utils/number";
import {sendTransaction} from "../utils/blockchain";
const {MOONBEAST_NETWORK} = configs

const web3 = new Web3(MOONBEAST_NETWORK)

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
    return web3.eth.getTransactionReceipt(txHash)
}

export const estimateGas = (tx) => web3.eth.estimateGas(tx)

export const fromWeiToEther = (value) => web3.utils.fromWei(getStringOfBigNumber(value), 'ether')

export const getGasNetwork = () => web3.eth.getGasPrice()

export const buyNFT = async (provider, connector, contract, tx) => {
    const nonce = await web3.eth.getTransactionCount(tx.from, 'latest')
    tx.nonce = String(nonce)

    const _gasLimit = await web3.eth.estimateGas(tx)

    // const walletEx = EVM_WALLETS.find(item => item.extensionName === walletExtKey)
    let gasLimit = _gasLimit
    // gasLimit = gasLimit < 20999 ? 20999 : gasLimit
    // gasLimit = gasLimit > 7920027 ? 7920027 : gasLimit

    console.log({_gasLimit, gasLimit, x: typeof _gasLimit})

    tx.gas = web3.utils.numberToHex(gasLimit).toString()

    console.log(tx)
    console.log('GLMR', web3.utils.fromWei(getStringOfBigNumber(tx.value), 'ether'))
    console.log('GAS', web3.utils.hexToNumber(gasLimit))

    const txHash = await sendTransaction(provider, connector, tx)

    return txHash
}
