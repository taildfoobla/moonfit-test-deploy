import Web3 from 'web3'
import Bluebird from 'bluebird'
import configs from '../configs'
import {NFT_SALE_CURRENT_INFO} from '../constants/blockchain'
import mintPassABI from "../abis/MintPassNFT.json"
import {range} from '../utils/array'
import {balanceOfAccount, tokenOfOwnerByIndex} from './smc-common'
import {getMintPassAvailableSlots} from './smc-ntf-sale'
import sortMintPass from '../utils/sortMintPass'

const {MOONBEAST_NETWORK, MINT_PASS_SC} = configs

const web3js = new Web3(MOONBEAST_NETWORK)
const mintPassContract = new web3js.eth.Contract(mintPassABI.abi, MINT_PASS_SC)

export const fetchMintPassByAccount = async (account) => {
    const balance = await balanceOfAccount(mintPassContract, account)
    const array = range(0, balance - 1)

    return Bluebird.map(array, async(index) => {
        const tokenId = await tokenOfOwnerByIndex(mintPassContract, account, index)
        // const {name, imageUrl} = await getNFTInfo(mintPassContract.methods, tokenId)
        const imageUrl = 'https://bafybeidedg4erz6vvoywe26obvqty5aiovsxzjrvakjsciusigdct2hoqy.ipfs.nftstorage.link'
        const name = `MoonFit Mint Pass #${tokenId}`

        return {
            name,
            imageUrl,
            tokenId,
        }
    }, {concurrency: 2})
}

export const addAvailableSlotForCurrenSale = async (mintPasses) => {
    const {nftPerPass} = NFT_SALE_CURRENT_INFO

    const _mintPasses = await Bluebird.map(mintPasses, async (item) => {
        let availableSlots = await getMintPassAvailableSlots(item.tokenId, true)
        availableSlots = availableSlots || 0
        const bought = nftPerPass - availableSlots
        const isOutOfSlot = availableSlots <= 0

        return {
            ...item,
            isUsed: !!bought,
            availableSlots,
            bought,
            isOutOfSlot,
            isSelected: !isOutOfSlot,
        }
    }, {concurrency: 2})

    _mintPasses.sort(sortMintPass)

    return _mintPasses
}
