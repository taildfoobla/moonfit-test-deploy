import { getReactEnv } from "./env"
import { WEB3_METHODS } from "../constants/blockchain"
import { BLC_CONFIGS } from '../configs/blockchain'
import Web3 from "web3"
import mintPassABI from '../../abis/MintPassNFT.json'
import moonBeastABI from '../../abis/UMoonBeastNFT.json'

import BigNumber from "bignumber.js"
import ApiService from "../../services/api"

const { MINT_PASS_SC, MOONBEAST_SC } = BLC_CONFIGS

const ENV = getReactEnv('ENV')
const { MOONBEAM_SCAN_URL } = BLC_CONFIGS

export const getAddressScanUrl = (address, options = {}) => {
    const url = `${MOONBEAM_SCAN_URL}/address/${address}`
    const query = []

    if (options.to) {
        query.push(`toaddress=${options.to}`)
    }

    if (options.from) {
        query.push(`fromaddress=${options.from}`)
    }

    return `${url}?${query.join('&')}`.replace(/\?$/, '')
}

export const getTokenScanUrl = (contract, tokenId) => {
    return `${MOONBEAM_SCAN_URL}/token/${contract}?a=${tokenId}`
}

export const getTxScanUrl = (txHash) => {
    return `${MOONBEAM_SCAN_URL}/tx/${txHash}`
}

export const getNFTScanUrl = (smartContract, tokenId) => {
    return `https://moonbeam.nftscan.com/${smartContract}/${tokenId}`
}

export const formatAddress = (address) => `${address.substring(0, 5)}...${address.substring(address.length - 4, address.length)}`

export const switchNetwork = async (provider) => {
    switch (ENV) {
        case 'development':
            try {
                await provider.request(WEB3_METHODS.switchToMoonbaseAlphaNetwork)
            } catch (e) {
                console.log("Cannot switchToMoonbaseAlphaNetwork: ", e.message)
                await provider.request(WEB3_METHODS.addMoonbaseAlphaNetwork)
            }
            // await provider.request(WEB3_METHODS.switchToMoonbaseAlphaNetwork)
            break
        case 'production':
            try {
                await provider.request(WEB3_METHODS.switchToMoonbeamNetwork)
            } catch (e) {
                console.log("Cannot switchToMoonbeamNetwork: ", e.message)
                await provider.request(WEB3_METHODS.addMoonbeamNetwork)
            }
            break
        default:
            return provider.request(WEB3_METHODS.switchToMoonbaseAlphaNetwork)
    }
}

export const sendTransaction = async (provider, connector, tx) => {
    if (!provider && !connector) {
        throw new Error("No provider or connector detected. Please check your wallet.")
    }
    if (connector) {
        return await connector.sendTransaction(tx)
    } else {
        return await provider.request({
            method: 'eth_sendTransaction', params: [tx]
        })
    }
}

export const getShortAddress = (address, length = 4) => {
    return address ? address.slice(0, length) + "..." + address.slice(address.length - length, address.length) : ''
}

export const detectProvider = (providerNameParam) => {
    const providerReadyEvent = {
        'ethereum': 'ethereum#initialized', // Metamask ready event
        'SubWallet': 'subwallet#initialized', // SubWallet ready event
    }
    const providerName = providerNameParam
    return new Promise((resolve) => {
        if (window[providerName]) {
            resolve(window[providerName])
        } else {
            const timeout = setTimeout(() => {
                resolve(window[providerName])
            }, 2000)

            window.addEventListener(providerReadyEvent[providerName] || 'ethereum#initialized', () => {
                clearTimeout(timeout)
                resolve(window[providerName])
            })
        }
    })
}

export const getPersonalSignMessage = (message) => {
    return `0x${Buffer.from(message, 'utf8').toString('hex')}`
}

export const getNFTBalance = async (rpcUrl, account) => {
    const web3js = new Web3(rpcUrl)
    const mintPassContract = new web3js.eth.Contract(mintPassABI.abi, MINT_PASS_SC)
    const moonBeastContract = new web3js.eth.Contract(moonBeastABI.abi, MOONBEAST_SC)
    // TODO add other NFTs

    const [mpBalance, mbBalance] = await Promise.all([
        mintPassContract.methods.balanceOf(account).call(),
        moonBeastContract.methods.balanceOf(account).call(),
    ])

    return {
        total: parseInt(mbBalance) + parseInt(mpBalance),
        mintPass: parseInt(mpBalance),
        moonBeast: parseInt(mbBalance)
    }
}

export const getNFTInfo = async (contractMethods, tokenId) => {
    if (!tokenId) return { name: null, imageUrl: null }
    try {
        const tokenURI = await contractMethods.tokenURI(tokenId).call()
        const { data } = await ApiService.makeRequest.get(tokenURI)
        const { name, image } = data
        if (image.startsWith('ipfs://')) {
            const cid = image.replace('ipfs://', '')
            const imageUrl = `https://${cid}.ipfs.nftstorage.link/`
            return { name, imageUrl }
        } else return { name, imageUrl: image }
    } catch (e) {
        console.log("getNFTInfo Exception", e.message)
        return { name: null, imageUrl: null }
    }
}

export const getTokenBalance = async (contractMethods, account) => {
    try {
        const weiBalance = await contractMethods.balanceOf(account).call()
        const decimals = await contractMethods.decimals().call()
        return new BigNumber(weiBalance).div(10 ** decimals).toNumber()
    } catch (e) {
        console.log("getTokenBalance Exception", e.message)
        return 0
    }
}



