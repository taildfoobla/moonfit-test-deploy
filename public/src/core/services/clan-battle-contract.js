import Web3 from 'web3'
import BigNumber from "bignumber.js"
import {BLC_CONFIGS} from '../utils/configs/blockchain'
import address from "address";

const web3 = new Web3(BLC_CONFIGS.MOONBEAM_WSS_URL)

const ClanBattle = require('../../core/abis/ClanBattle.json')

const getStringOfBigNumber = (bigNumber) => {
    return new BigNumber((bigNumber), 10).toString(10)
}

const weiToEther = balance => parseFloat(web3.utils.fromWei(String(balance), 'ether'))

const init = (contractAddress) => {
    class Transaction {
        constructor(options) {
            this.id = parseInt(options.id)
            this.address = options.owner
            this.clanId = parseInt(options.clanId, 10)
            this.balance = weiToEther(options.balance)
            this.balanceWei = parseInt(options.balance)
            this.createdAt = new Date(parseInt(options.blockTime, 10) * 1000)
            this.contractId = contractAddress
        }
    }

    class Clan {
        constructor(options) {
            this.id = parseInt(options.id)
            this.name = options.name
            this.balance = weiToEther(options.balance)
            this.balanceWei = parseInt(options.balance)
            this.contractId = contractAddress
        }
    }

    const contract = new web3.eth.Contract(ClanBattle.abi, contractAddress)

    const betTransaction = async (fromAddress, clanId, value) => {
        const nonce = await web3.eth.getTransactionCount(fromAddress, 'latest')
        const tx = {
            to: contractAddress,
            from: fromAddress,
            maxPriorityFeePerGas: null,
            maxFeePerGas: null,
            value: value.toString(),
            nonce: String(nonce),
            data: contract.methods.bet(clanId).encodeABI()
        }

        const gasLimit = await web3.eth.estimateGas(tx).catch(e => {
            e.funcName = 'estimateGas'

            throw e
        })
        tx.gas = web3.utils.numberToHex(gasLimit).toString()
        // console.log(tx)
        // console.log('GLMR', web3.utils.fromWei(getStringOfBigNumber(tx.value), 'ether'))
        // console.log('GAS', web3.utils.hexToNumber(gasLimit))

        return tx
    }

    const _transformerTx = (transactions) => {
        const data = transactions.map((tx) => new Transaction(tx))

        data.sort((a, b) => b.id - a.id)

        return data
    }

    return {
        async getClans() {
            const clans = await contract.methods.getClans().call()

            return clans.map(item => new Clan(item))
        },
        lastTransactions: async (size = 10) => {
            const transactions = await contract.methods.getLastTransactions(size).call()

            return _transformerTx(transactions)
        },
        transactions: async (endCursor, size) => {
            const to = endCursor - 1
            if (to < 0) {
                return []
            }

            let from = to - size + 1
            from = from > 0 ? from : 0

            const transactions = await contract.methods.getTransactions(from, to).call()


            return _transformerTx(transactions)
        },
        getTransactionsByUser: async (address, endCursor, size) => {
            const to = endCursor - 1
            if (to < 0) {
                return []
            }

            let from = to - size + 1
            from = from > 0 ? from : 0

            const result = await contract.methods.getTransactionsByUser(address, from, to).call()
            // console.log(result);
            const transactions = result[0]

            // console.log(transactions);

            return _transformerTx(transactions)
        },
        getLastTransactionsByUser: async (address, size) => {
            const result = await contract.methods.getLastTransactionsByUser(address, size).call()
            console.log('getLastTransactionsByUser', result);
            const transactions = result[0]

            console.log('getLastTransactionsByUser', transactions);

            return _transformerTx(transactions)
        },
        countTransactions() {
            return contract.methods.countTransactions().call()
        },
        getAllowDeposits() {
            return contract.methods.getAllowDeposits().call()
        },
        async getTransactionReceipt (txHash) {
            try {
                return web3.eth.getTransactionReceipt(txHash)
            } catch (e) {
                console.log('getTransactionReceipt', e)

                return false
            }
        },
        estimateReward(prizePool, clanBalance, amount, options = {deposited: false, unit: 'wei'}) {
            // console.log({
            //     prizePool,
            //     clanBalance,
            //     amount,
            //     options,
            // });
            const etherValue = options.unit === 'ether' ? amount : weiToEther(amount)
            const addPool = options.deposited ? 0 : etherValue
            const pool = prizePool + addPool
            const reward = pool - (pool * 0.05)
            const rate = etherValue / (clanBalance + addPool)

            return rate * reward
        },
        async clearSubscriptions() {
            web3.eth.clearSubscriptions()
        },
        async getUser(userId) {
            const user = await contract.methods.getUser(userId).call()

            return {
                ...user,
                deposit: weiToEther(user.deposit),
                withdraw: weiToEther(user.withdraw),
                totalTransaction: parseInt(user.transactions, 10),
            }
        },
        subscribeTransactions(callback, options = {}) {
            contract.events.NewTransition({}, (error, event) => {
                callback({...options, name: 'event', event, transaction: new Transaction(event.returnValues)})
            })
                .on("connected", (subscriptionId) => {
                    // console.log('NewTransition SubID: ', subscriptionId);
                })
                // .on('data', (event) => {
                //     // console.log('NewTransition event:', event);
                //     callback({...options, name: 'data', event, transaction: new Transaction(event.returnValues)})
                // })
                // .on('changed', (event) => {
                //     // console.log('NewTransition changed', event);
                //     callback({...options, name: 'changed', event, transaction: new Transaction(event.returnValues)})
                // })
                .on('error', (error, receipt) => {
                    // console.log('NewTransition error:', error, receipt);
                });
        },
        subscribeUpdateClanBalance(callback) {
            contract.events.UpdateClanBalance({}, function(error, event){ console.log('event', event); })
                .on("connected", function (subscriptionId) {
                    console.log('UpdateClanBalance SubID: ', subscriptionId);
                })
                .on('data', function (event) {
                    console.log('UpdateClanBalance event:', event);
                    callback({name: 'data', event})
                })
                .on('changed', function (event) {
                    console.log('UpdateClanBalance changed', event);
                    callback({name: 'changed', event})
                })
                .on('error', function (error, receipt) {
                    console.log('UpdateClanBalance error:', error, receipt);
                });
        },
        betTransaction,
        weiToEther,
        contract,
        async claimReward(fromAddress) {
            const nonce = await web3.eth.getTransactionCount(fromAddress, 'latest')
            const tx = {
                to: contractAddress,
                from: fromAddress,
                maxPriorityFeePerGas: null,
                maxFeePerGas: null,
                nonce: String(nonce),
                data: contract.methods.claimReward().encodeABI()
            }

            const gasLimit = await web3.eth.estimateGas(tx).catch(e => {
                e.funcName = 'estimateGas'

                throw e
            })
            tx.gas = web3.utils.numberToHex(gasLimit).toString()
            // console.log(tx)
            // console.log('GAS', web3.utils.hexToNumber(gasLimit))

            return tx
        },
        calculateReward(userId) {
            return contract.methods.calculateReward(userId).call()
        },
        roundBalance(value) {
            return parseInt(value * 100000, 10) / 100000
        },
        address: contractAddress,
    }
}

export default (contractAddress) => {
    return init(contractAddress)
}

