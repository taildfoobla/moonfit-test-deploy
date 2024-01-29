import {getReactEnv} from "./env"
import {WEB3_METHODS} from "../constants-app/blockchain"
import configs from "../configs-app"
import axios from "axios"
import Bluebird from "bluebird"

const ENV = getReactEnv("ENV")
const {MOONBEAM_SCAN_URL} = configs

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
    if (configs.env !== "production") {
        return `${configs.MOONBEAM_NFTSCAN_URL}/token/${smartContract}?a=${tokenId}`
    }

    return `${configs.MOONBEAM_NFTSCAN_URL}/${smartContract}/${tokenId}`
}

export const switchNetwork = async (provider) => {
    switch (ENV) {
        case "development":
            try {
                await provider.request(WEB3_METHODS.switchToMoonbaseAlphaNetwork)
            } catch (e) {
                console.log("Cannot switchToMoonbaseAlphaNetwork: ", e.message)
                await provider.request(WEB3_METHODS.addMoonbaseAlphaNetwork)
            }
            // await provider.request(WEB3_METHODS.switchToMoonbaseAlphaNetwork)
            break
        case "production":
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
export const switchToNetwork = async (provider, chainId) => {

    try {
        await provider.request(WEB3_METHODS.switchToChainId(chainId))
    } catch (e) {
        console.log(`Cannot switchToChaiId: ${chainId}`, e.message)
        await provider.request(WEB3_METHODS.addToChainId(chainId))
    }
}

export const switchToNetworkOnchain = async (provider, chainId, data = null) => {
  
    try {
         await provider.request(WEB3_METHODS.switchToChainId(chainId, data))
         return true
    } catch (e) {
        console.log(`Cannot switchToChaiId: ${chainId}`, e.message)
        if(e.code===4001){
            return false
        }else{
            try{
                await provider.request(WEB3_METHODS.addToChainId(chainId, data))
                return true
            }catch(err){
                console.log("err",err)
                return false
            }
        }
    }
}

export const sendTransaction = async (provider, connector, tx) => {
    if (!provider && !connector) {
        // console.log("No provider or connector detected")
        throw new Error("No provider or connector detected. Please check your wallet.")
    }

   
    if (connector) {
        return await connector.sendTransaction(tx).catch((e) => {
         
        })
    } else {
   
        return await provider.request({
            method: "eth_sendTransaction",
            params: [tx],
        })
    }
}

export const getShortAddress = (address, length = 4) => {
    return address ? address.slice(0, length) + "..." + address.slice(address.length - length, address.length) : ""
}

export const getShortEmail = (email, length) => {
    const positionAfter = email.indexOf("@")
    console.log("position: ", positionAfter)
    return email.length > 22 ? email.slice(0, length) + "..." + email.slice(positionAfter, email.length) : email
}

export const getNFTInfo = async (methods, tokenId, fetchMetadata = true) => {
    if (!tokenId) return {name: null, imageUrl: null}
    try {
        const tokenURI = await methods.tokenURI(tokenId).call()

        if (fetchMetadata) {
            const {data} = await axios.get(tokenURI)
            const {name, image, attributes} = data
            if (image.startsWith("ipfs://")) {
                const cid = image.replace("ipfs://", "")
                const imageUrl = `https://${cid}.ipfs.nftstorage.link/`
                return {name, imageUrl, attributes}
            }

            return {name, imageUrl: image, attributes}
        }

        return {tokenId, tokenURI}
    } catch (e) {
        console.log("getNFTInfo Exception: ", e.message)
        return {
            name: null,
            imageUrl: null,
            isNotFound: e.message.includes("URI query for nonexistent token"),
            isError: true,
        }
    }
}

const _loadNFTMetadata = async (tokenURI) => {
    let name,
        imageUrl,
        attributes = {}
    try {
        const response = await fetch(tokenURI)
        const data = await response.json()
        name = data.name
        imageUrl = data.image
        if (imageUrl.startsWith("ipfs://")) {
            const cid = imageUrl.replace("ipfs://", "")
            imageUrl = `https://${cid}.ipfs.nftstorage.link/`
        }
        if (Array.isArray(data.attributes)) {
            data.attributes.forEach((item) => {
                attributes[item.trait_type] = item.value
            })
        }
    } catch (e) {
        console.log(e)
    }

    return {name, imageUrl, attributes}
}

const _loadNFTInfo = async (methods, tokenId, key) => {
    try {
        const response = await _loadNFTMetadata(`${configs.IMAGE_CDN_URL}/metadata/${tokenId}.json`)
        if (response.name) {
            localStorage.setItem(key, JSON.stringify({...response, _updatedAt: Date.now()}))
        }

        return response
    } catch (e) {
        console.log(e)
        await Bluebird.delay(300)

        return _loadNFTInfo(methods, tokenId, key)
    }
}

window._NFT_Infos = []
window._NFT_InfosUpdate = []

let isInfosUpdateRunning = false
setInterval(async () => {
    if (isInfosUpdateRunning || !Array.isArray(window._NFT_InfosUpdate) || !window._NFT_InfosUpdate.length) {
        return
    }
    isInfosUpdateRunning = true
    try {
        await _loadNFTInfo(...window._NFT_InfosUpdate.shift())
    } catch (e) {
        console.log(e)
    }
    isInfosUpdateRunning = false
}, 2000)

export const getNFTInfo2 = async (nftType, methods, tokenId) => {
    if (!tokenId) {
        return {name: null, imageUrl: null, attributes: []}
    }

    const key = `NFT_Info_${nftType}_${tokenId}`
    if (window._NFT_Infos[key]) {
        return window._NFT_Infos[key]
    }

    try {
        let item = localStorage.getItem(key)
        if (item) {
            item = JSON.parse(item)
            if (!item._updatedAt || item._updatedAt < Date.now() - 24 * 60 * 60 * 1000) {
                window._NFT_InfosUpdate = Array.isArray(window._NFT_InfosUpdate) ? window._NFT_InfosUpdate : []
                window._NFT_InfosUpdate.push([methods, tokenId, key])
            }

            return item
        }
    } catch (e) {
        console.log(e)
    }

    try {
        return _loadNFTInfo(methods, tokenId, key)
    } catch (e) {
        console.log("getNFTInfo Exception: ", e.message)
        return {
            name: null,
            imageUrl: null,
            isNotFound: e.message.includes("URI query for nonexistent token"),
            isError: true,
        }
    }
}

