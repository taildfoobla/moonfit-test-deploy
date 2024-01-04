import Web3 from "web3";
import BigNumber from "bignumber.js"

import {
    moonBeamNetwork,
    astarNetwork,
    binanceNetwork,
    mantaNetwork,
} from '../constants/blockchain'

import {getStringOfBigNumber} from "../utils/number";
import configs from "../configs";
import {fetchMintPassByAccount} from "./smc-mint-pass";
import {range} from "../utils/array";
import Bluebird from "bluebird";
import {balanceOfAccount as _balanceOfAccount, isApprovedForAll, tokenOfOwnerByIndex} from "./smc-common";
import {getNFTInfo2} from "../utils/blockchain";
import moonBeastABI from "../abis/MoonBeastNFT.json";

const _pickItem = (item, keys) => {
    const obj = {}
    keys.forEach(key => obj[key] = item[key])

    return obj
}
const getBaseBalance = async (rpc, address) => {
    try {
        const web3 = new Web3(rpc)

        const balance = await web3.eth.getBalance(address)

        return web3.utils.fromWei(getStringOfBigNumber(balance), 'ether')
    } catch (e) {
        await Bluebird.delay(300)

        return getBaseBalance(rpc, address)
    }
}

const loadMintPass = async (address) => {
    const nfts = await fetchMintPassByAccount(address)
    const web3js = new Web3(moonBeamNetwork.rpc)
    const _moonBeastContract = new web3js.eth.Contract(moonBeastABI.abi, moonBeamNetwork.MINT_PASS_ADDRESS)
    const isApproved = await isApprovedForAll(_moonBeastContract, address, moonBeamNetwork.MASTER_ADDRESS)

    return nfts.map(item => ({
        ..._pickItem(moonBeamNetwork, ['symbolIcon', 'chainIcon', 'symbol', 'currencySymbol', 'chainId', 'networkName', 'scan']),
        isApproved,
        ...item,
    }))
}

const loadNFT = async (network, contractAddress, address, maxLength = 100) => {
    try {
        const web3js = new Web3(network.rpc)
        const _moonBeastContract = new web3js.eth.Contract(moonBeastABI.abi, contractAddress)
        const balance = await _balanceOfAccount(_moonBeastContract, address)

        if (!balance) {
            return []
        }
        const isApproved = await isApprovedForAll(_moonBeastContract, address, network.MASTER_ADDRESS)
        let data = range(0, balance - 1)

        if (balance > maxLength) {
            data = data.slice(-maxLength)
        }

        const _tokenOfOwnerByIndex = async (address, index) => {
            return tokenOfOwnerByIndex(_moonBeastContract, address, index).catch(async e => {
                await Bluebird.delay(300)

                return tokenOfOwnerByIndex(_moonBeastContract, address, index)
            })
        }

        const newData = Bluebird.map(data, async index => {
            const tokenId = await _tokenOfOwnerByIndex(address, index)
            const {name, imageUrl, attributes} = await getNFTInfo2('MoonBeast', _moonBeastContract.methods, tokenId)

            return {name, imageUrl, tokenId, attributes, type: 'MoonBeast', isApproved}
        }, {concurrency: 5})

        return newData.map(item => ({
            ..._pickItem(network, ['symbolIcon', 'chainIcon', 'symbol', 'currencySymbol', 'chainId', 'networkName', 'scan']),
            ...item,
        }))
    } catch (e) {
        console.log('loadNFT', e)
        return []
    }
}

export const loadTokens = async (address) => {
    const [
        glmrBalance,
        astarBalance,
        // bnbBalance,
        mantaBalance,
    ] = await Promise.all([
        getBaseBalance(moonBeamNetwork.rpc, address),
        getBaseBalance(astarNetwork.rpc, address),
        // getBaseBalance(binanceNetwork.rpc, address),
        getBaseBalance(mantaNetwork.rpc, address),
    ])

    console.log({
        glmrBalance,
        astarBalance,
        // bnbBalance,
        mantaBalance,
    })

    return {
        tokens: [
            {
                ..._pickItem(moonBeamNetwork, ['symbolIcon', 'chainIcon', 'symbol', 'currencySymbol', 'chainId', 'scan', 'symbolDisplay']),
                symbol: 'MFG',
                symbolIcon: `${configs.IMAGE_CDN_URL}/image/original/assets/icons/MFG.png`,
                symbolDisplay: 'MFG',
                currencySymbol: 'MFG',
                balance: 0,
                value: 0,
            },
            {
                ..._pickItem(moonBeamNetwork, ['symbolIcon', 'chainIcon', 'symbol', 'currencySymbol', 'chainId', 'scan', 'symbolDisplay']),
                balance: glmrBalance,
                value: new BigNumber(glmrBalance, 10).dp(moonBeamNetwork.digit).toString()
            },
            {
                ..._pickItem(astarNetwork, ['symbolIcon', 'chainIcon', 'symbol', 'currencySymbol', 'chainId', 'scan', 'symbolDisplay']),
                balance: astarBalance,
                value: new BigNumber(astarBalance, 10).dp(astarNetwork.digit).toString()
            },
            // {
            //     ..._pickItem(binanceNetwork, ['symbolIcon', 'chainIcon', 'symbol', 'currencySymbol', 'chainId', 'scan', 'symbolDisplay']),
            //     balance: bnbBalance,
            //     value: new BigNumber(bnbBalance, 10).dp(binanceNetwork.digit).toString()
            // },
            {
                ..._pickItem(mantaNetwork, ['symbolIcon', 'chainIcon', 'symbol', 'currencySymbol', 'chainId', 'scan', 'symbolDisplay']),
                balance: mantaBalance,
                value: new BigNumber(mantaBalance, 10).dp(mantaNetwork.digit).toString()
            },
        ].map((item,index) => {
            return {
                id: `${item.symbol}_${index}`,
                ...item,
                name: item.symbol,
                type: item.symbol,
                assetType: 'token'
            }
        }),
    }
}

export const loadAsset = async (address) => {
    const [
        mintPass,
        glmrMoonBeast,
        astarMoonBeast,
        bnbMoonBeast,
    ] = await Promise.all([
        loadMintPass(address),
        loadNFT(moonBeamNetwork, moonBeamNetwork.MOON_BEAST_ADDRESS, address),
        loadNFT(astarNetwork, astarNetwork.MOON_BEAST_ADDRESS, address),
        // loadNFT(binanceNetwork, binanceNetwork.MOON_BEAST_ADDRESS, address),
    ])

    return {
        nfts: [
            ...mintPass,
            ...glmrMoonBeast,
            ...astarMoonBeast,
            // ...bnbMoonBeast,
        ].map(item => {
            return {
                id: `${item.type}_${item.tokenId}`,
                ...item,
                names: String(item.name || '').split(' '),
                assetType: 'nft'
            }
        })
    }
}
