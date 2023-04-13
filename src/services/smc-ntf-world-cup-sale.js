import {NFT_SALE_ROUNDS_INFO} from "../constants/blockchain"
import configs from '../configs'
import Web3 from "web3";
import nftSaleABI from "../abis/MoonFitNFTWorldCupSale.json";
import {moonBeastContract} from "./smc-moon-beast";
import {getMoonBeast as _getMoonBeast} from "./smc-common";
import EventBus from "../utils/event-bus";

const {MOONBEAM_WSS_URL, MOONBEAST_NETWORK} = configs
const {NFT_SALE_SC, eventUpdateSaleAmountName: eventName} = NFT_SALE_ROUNDS_INFO.WC

const web3 = new Web3(MOONBEAST_NETWORK)

export const getContract = () => new web3.eth.Contract(nftSaleABI.abi, NFT_SALE_SC)

export const getAvailableSlots = async () => {
    const contract = new web3.eth.Contract(nftSaleABI.abi, NFT_SALE_SC)
    const value = await contract.methods.getAvailableSlots().call()

    return parseInt(value)
}

export const subscribeUpdateSaleAmount = () => {
    const web3 = new Web3(MOONBEAM_WSS_URL)
    const contract = new web3.eth.Contract(nftSaleABI.abi, NFT_SALE_SC)

    window.__events = window.__events || {}
    if (window.__events[eventName]) {
        return
    }

    try {
        window.__events[eventName] = contract.events.UpdateSaleAmount({}, (error, event) => {
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
    const value = await getContract().methods._maxSaleAmount().call()

    return parseInt(value)
}

export const buyNFTData = (mintAmount, team) => {
    return getContract().methods.buyNFT(mintAmount, team).encodeABI()
}

export const getMoonBeast = async (wallet, options =  {mintByContract: true, isOwnerMinted: true}) => {
    return _getMoonBeast(moonBeastContract, getContract(), wallet, options)
}

export const getPrice = () => getContract().methods._price().call();

export const NFT_SALE_ADDRESS = NFT_SALE_SC
