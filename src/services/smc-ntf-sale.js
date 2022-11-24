import {NFT_SALE_ROUNDS_INFO} from "../constants/blockchain"
import configs from '../configs'
import Web3 from "web3";
import Bluebird from 'bluebird'
import nftSaleABI from "../abis/MFNFTSale.json";
import sortMintPass from '../utils/sortMintPass'
import {getMoonBeast as _getMoonBeast} from './smc-common'
import EventBus from '../utils/event-bus'

const {moonBeastContract} = require('./smc-moon-beast')

const {MOONBEAM_WSS_URL} = configs
const {NFT_SALE_SC, eventUpdateSaleAmountName: eventName} = NFT_SALE_ROUNDS_INFO.R3
// console.log({round: 3, NFT_SALE_SC});

const web3 = new Web3(MOONBEAM_WSS_URL)
const saleContract = new web3.eth.Contract(nftSaleABI.abi, NFT_SALE_SC)

export const getMintPassAvailableSlots = async (tokenId, retryCount = 3) => {
    let availableSlots

    try {
        availableSlots = await saleContract.methods.getMintPassAvailableSlots(tokenId).call()
        availableSlots = parseInt(availableSlots, 10)
    } catch (e) {
        console.log(e)

        if (retryCount > 0) {
            await Bluebird.delay(200)

            return getMintPassAvailableSlots(tokenId, retryCount - 1)
        }
    }

    return availableSlots
}

export const getAvailableSlots = async () => {
    const value = await saleContract.methods.getAvailableSlots().call()

    return parseInt(value)
}

export const getSaleMaxAmount = async () => {
    const value = await saleContract.methods._maxSaleAmount().call()

    return parseInt(value)
}

export const buyNFTData = (mintPassTokenIds, mintAmount) => {
    return saleContract.methods.buyNFT(mintPassTokenIds, mintAmount).encodeABI()
}

export const getMintPass = async (wallet, sort = true) => {
    const data = await saleContract.methods.getMintPass(wallet).call()

    const mintPass = data.map(item => {
        const bought = parseInt(item.bought)
        const maxAmount = parseInt(item.maxAmount)
        const availableSlots = maxAmount - bought
        const imageUrl = 'https://bafybeidedg4erz6vvoywe26obvqty5aiovsxzjrvakjsciusigdct2hoqy.ipfs.nftstorage.link'

        return {
            tokenId: item.tokenId,
            bought,
            maxAmount,
            availableSlots,
            imageUrl,
            name: `MoonFit Mint Pass #${item.tokenId}`,
            isOutOfSlot: bought === maxAmount,
            isUsed: !!bought,
            isSelected: bought !== maxAmount,
        }
    })

    mintPass.reverse()

    if (sort) {
        mintPass.sort(sortMintPass)
    }

    return mintPass
}

export const subscribeUpdateSaleAmount = () => {
    window.__events = window.__events || {}
    if (window.__events[eventName]) {
        return
    }

    try {
        window.__events[eventName] = saleContract.events.UpdateSaleAmount({}, (error, event) => {
            try {
                if (!event || !event.returnValues || !event.returnValues.maxSaleAmount) {
                    return
                }

                EventBus.$dispatch(eventName, {
                    eventName,
                    soldAmount: parseInt(event.returnValues.soldAmount, 10),
                    maxSaleAmount: parseInt(event.returnValues.maxSaleAmount, 10),
                    availableSlot: parseInt(event.returnValues.availableSlot, 10),
                })
            } catch (e) {
                console.log(e);
            }
        })
            .on("connected", (subscriptionId) => {
                console.log('R3UpdateSaleAmount SubID: ', subscriptionId);
            })
            .on('error', (error, receipt) => {
                // console.log('NewTransition error:', error, receipt);
            })
    } catch (e) {
        console.log(e);
    }
}

export const getMoonBeast = async (wallet) => {
    return _getMoonBeast(moonBeastContract, saleContract, wallet)
}

export const smcContract = saleContract;

export const NFT_SALE_ADDRESS = NFT_SALE_SC
