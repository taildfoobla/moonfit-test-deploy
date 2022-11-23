import {NFT_SALE_ROUNDS_INFO} from "../constants/blockchain"
import configs from '../configs'
import Web3 from "web3";
import nftSaleABI from "../abis/MoonFitNFTWorldCupSale.json";
import {moonBeastContract} from "./smc-moon-beast";
import {getMoonBeast as _getMoonBeast} from "./smc-common";
import EventBus from "../utils/event-bus";

const {MOONBEAM_WSS_URL} = configs
const {NFT_SALE_SC, eventUpdateSaleAmountName: eventName} = NFT_SALE_ROUNDS_INFO.WC

console.log({round: 'WC2022', eventName, NFT_SALE_SC});

const web3 = new Web3(MOONBEAM_WSS_URL)
const saleContract = new web3.eth.Contract(nftSaleABI.abi, NFT_SALE_SC)

export const getAvailableSlots = async () => {
    const value = await saleContract.methods.getAvailableSlots().call()

    return parseInt(value)
}

export const subscribeUpdateSaleAmount = () => {
    window.__events = window.__events || {}
    if (window.__events[eventName]) {
        return
    }

    try {
        window.__events[eventName] = saleContract.events.UpdateSaleAmount({}, (error, event) => {
            console.log(event);
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
                console.log(`Event ${eventName} SubID:`, subscriptionId);
            })
            .on('error', (error, receipt) => {
                // console.log('NewTransition error:', error, receipt);
            })
    } catch (e) {
        console.log(e);
    }
}

export const getSaleMaxAmount = async () => {
    const value = await saleContract.methods._maxSaleAmount().call()

    return parseInt(value)
}

export const buyNFTData = (mintAmount, team) => {
    return saleContract.methods.buyNFT(mintAmount, team).encodeABI()
}

export const getMoonBeast = async (wallet) => {
    return _getMoonBeast(moonBeastContract, saleContract, wallet)
}

export const smcContract = saleContract;

export const NFT_SALE_ADDRESS = NFT_SALE_SC
