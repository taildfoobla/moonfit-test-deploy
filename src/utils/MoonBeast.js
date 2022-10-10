import configs from '../configs'

class MoonBeast {
    constructor({tokenId, uri, mintByContract, wallet, index}) {
        this.tokenId = parseInt(tokenId, 10)
        this.uri = uri
        this.mintByContract = mintByContract
        this.wallet = wallet
        this.index = index
    }

    getUri() {
        if (configs.env !== 'production') {
            return this.uri = `https://ipfs.io/ipfs/bafybeifg7z7bdbwuaw6f6geng63mersmul5rsnnt2ul4hlbn3awrmcmhqq/${this.tokenId}.json`
            // return this.uri = `https://bafybeifg7z7bdbwuaw6f6geng63mersmul5rsnnt2ul4hlbn3awrmcmhqq.ipfs.nftstorage.link/${this.tokenId}.json`
        }

        return this.uri
    }
}

export default MoonBeast
