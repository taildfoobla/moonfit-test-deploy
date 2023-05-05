import configs from "../configs";
import Bluebird from 'bluebird'
import Web3 from "web3";
import {getStringOfBigNumber} from "../utils/number";
import {sendTransaction} from "../utils/blockchain";
import {chunk} from "../utils/array";
import MoonBeast from "../utils/MoonBeast";
import BigNumber from "bignumber.js"
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
    const balance = await web3.eth.getBalance(tx.from)

    if (new BigNumber(tx.value).gt(new BigNumber(balance))) {
        throw new Error ('Insufficient balance.')
    }

    const nonce = await web3.eth.getTransactionCount(tx.from, 'latest')

    tx.nonce = String(nonce)

    const _gasLimit = await web3.eth.estimateGas(tx).catch(e => {
        e.funcName = 'estimateGas'

        throw e
    })

    let gasLimit = _gasLimit

    console.log({_gasLimit, gasLimit, x: typeof _gasLimit})

    tx.gas = web3.utils.numberToHex(gasLimit).toString()

    console.log(tx)
    console.log('GLMR', web3.utils.fromWei(getStringOfBigNumber(tx.value), 'ether'))
    console.log('GAS', web3.utils.hexToNumber(gasLimit))

    const txHash = await sendTransaction(provider, connector, tx)

    console.log('transaction hash:', 'txHash')

    return txHash
}

export const getMoonBeast = async (moonBeastContract, saleContract, wallet, options = {mintByContract: true, isOwnerMinted: true}) => {
    let balance = await moonBeastContract.methods.balanceOf(wallet).call()
    balance = parseInt(balance , 10)
    let _moonBeasts = []
    const arrIndex = Array.from(Array(balance).keys()).reverse()

    await Bluebird.map(chunk(arrIndex, 20), async (data) => {
        let beasts = await saleContract.methods.getMoonBeast(wallet, data).call()
        beasts = beasts.map((item, index) => {
            return new MoonBeast({
                tokenId: item.tokenId,
                uri: item.uri,
                mintByContract: item.mintByContract,
                isOwnerMinted: item.isOwnerMinted,
                wallet,
                index: data[index],
            })
        })

        _moonBeasts = _moonBeasts.concat(beasts)
    }, { concurrency: 1 })

    _moonBeasts = _moonBeasts.filter(item => {
        if (options && options.isOwnerMinted && !item.isOwnerMinted) {
            return  false
        }

        if (options && options.mintByContract && !item.mintByContract) {
            return  false
        }

        return true
    })

    _moonBeasts.sort((a, b) => b.tokenId - a.tokenId)

    return _moonBeasts
}
