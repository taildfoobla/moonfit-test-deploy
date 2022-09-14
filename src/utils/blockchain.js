import {getReactEnv} from "./env"
import {WEB3_METHODS} from "../constants/blockchain"
import {BLC_CONFIGS} from '../configs/blockchain'
import axios from "axios"

const ENV = getReactEnv('ENV')
const {MOONBEAM_SCAN_URL} = BLC_CONFIGS

export const getAddressScanUrl = (address) => {
    return `${MOONBEAM_SCAN_URL}/address/${address}`
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
        // console.log("No provider or connector detected")
        throw new Error("No provider or connector detected")
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

export const getNFTInfo = async (methods, tokenId) => {
    if (!tokenId) return {name: null, imageUrl: null}
    try {
        const tokenURI = await methods.tokenURI(tokenId).call()
        // console.log(tokenId, tokenURI)
        const {data} = await axios.get(tokenURI)
        const {name, image} = data
        if (image.startsWith('ipfs://')) {
            const cid = image.replace('ipfs://', '')
            const imageUrl = `https://${cid}.ipfs.nftstorage.link/`
            return {name, imageUrl}
        } else return {name, imageUrl: image}
    } catch (e) {
        console.log("getNFTInfo Exception", e.message)
        return {name: null, imageUrl: null}
    }
}