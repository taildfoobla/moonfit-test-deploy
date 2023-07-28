import Web3 from "web3";
import BigNumber from "bignumber.js"

import {
    moonBeamNetwork,
    astarNetwork,
    binanceNetwork,
} from '../constants/blockchain'

import {getStringOfBigNumber} from "../utils/number";
import configs from "../configs";
import {fetchMintPassByAccount} from "./smc-mint-pass";
import {range} from "../utils/array";
import Bluebird from "bluebird";
import {balanceOfAccount as _balanceOfAccount, tokenOfOwnerByIndex} from "./smc-common";
import {getNFTInfo2} from "../utils/blockchain";
import moonBeastABI from "../abis/MoonBeastNFT.json";

const _pickItem = (item, keys) => {
    const obj = {}
    keys.forEach(key => obj[key] = item[key])

    return obj
}
const getBaseBalance = async (rpc, address) => {
    const web3 = new Web3(rpc)

    const balance = await web3.eth.getBalance(address)

    return web3.utils.fromWei(getStringOfBigNumber(balance), 'ether')
}

const loadMintPass = async(address) => {
    const nfts = await fetchMintPassByAccount(address)

    return nfts.map(item => ({
        ..._pickItem(moonBeamNetwork, ['symbolIcon', 'chainIcon', 'symbol', 'currencySymbol', 'chainId']),
        ...item,
    }))
}

const loadNFT = async (network, contractAddress, address, maxLength = Number.MAX_SAFE_INTEGER) => {
    try {
        const web3js = new Web3(network.rpc)
        const _moonBeastContract = new web3js.eth.Contract(moonBeastABI.abi, contractAddress)
        const balance = await _balanceOfAccount(_moonBeastContract, address)

        if (!balance) {
            return []
        }
        let data = range(0, balance - 1)

        if (balance > maxLength) {
            data = data.slice(-maxLength)
        }
        console.log(data);

        const newData = Bluebird.map(data, async index => {
            const tokenId = await tokenOfOwnerByIndex(_moonBeastContract, address, index)
            const {name, imageUrl} = await getNFTInfo2('MoonBeast', _moonBeastContract.methods, tokenId)
            return {name, imageUrl, tokenId, type: 'MoonBeast'}
        }, {concurrency: 5})

        return newData.map(item => ({
            ..._pickItem(network, ['symbolIcon', 'chainIcon', 'symbol', 'currencySymbol', 'chainId']),
            ...item,
        }))
    } catch (e) {
        console.log(e)
        return []
    }
}

export const loadAsset = async (address) => {
    const [
        glmrBalance,
        astarBalance,
        bnbBalance,
    ] = await Promise.all([
        getBaseBalance(moonBeamNetwork.rpc, address),
        getBaseBalance(astarNetwork.rpc, address),
        getBaseBalance(binanceNetwork.rpc, address),
    ])

    const [
        mintPass,
        glmrMoonBeast,
        astarMoonBeast,
        bnbMoonBeast,
    ] = await Promise.all([
        loadMintPass(address),
        loadNFT(moonBeamNetwork, moonBeamNetwork.MOON_BEAST_ADDRESS, address),
        loadNFT(astarNetwork, astarNetwork.MOON_BEAST_ADDRESS, address),
        loadNFT(binanceNetwork, binanceNetwork.MOON_BEAST_ADDRESS, address),
    ])

    return {
        tokens: [
            {
                ..._pickItem(moonBeamNetwork, ['symbolIcon', 'chainIcon', 'symbol', 'currencySymbol', 'chainId']),
                symbol: 'MFG',
                symbolIcon: `${configs.IMAGE_CDN_URL}/image/original/assets/icons/MFG.png`,
                currencySymbol: 'MFG',
                balance: 0,
                value: 0,
            },
            {
                ..._pickItem(moonBeamNetwork, ['symbolIcon', 'chainIcon', 'symbol', 'currencySymbol', 'chainId']),
                balance: glmrBalance,
                value: new BigNumber(glmrBalance, 10).dp(moonBeamNetwork.digit).toString()
            },
            {
                ..._pickItem(astarNetwork, ['symbolIcon', 'chainIcon', 'symbol', 'currencySymbol', 'chainId']),
                balance: astarBalance,
                value: new BigNumber(astarBalance, 10).dp(astarNetwork.digit).toString()
            },
            {
                ..._pickItem(binanceNetwork, ['symbolIcon', 'chainIcon', 'symbol', 'currencySymbol', 'chainId']),
                balance: bnbBalance,
                value: new BigNumber(bnbBalance, 10).dp(binanceNetwork.digit).toString()
            },
        ],
        nfts: [
            ...mintPass,
            ...glmrMoonBeast,
            ...astarMoonBeast,
            ...bnbMoonBeast,
        ].map(item => {
            return {
                id: `${item.type}_${item.tokenId}`,
                ...item,
                names: String(item.name || '').split(' ')
            }
        })
    }
}