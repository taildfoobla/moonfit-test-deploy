import configs from '../configs'

class MoonBeast {
    constructor(tokenId, uri, mintByContract) {
        this.tokenId = parseInt(tokenId, 10)
        this.uri = uri
        this.mintByContract = mintByContract

        if (configs.env !== 'production') {
            this.uri = `https://ipfs.io/ipfs/bafybeifg7z7bdbwuaw6f6geng63mersmul5rsnnt2ul4hlbn3awrmcmhqq/${tokenId}.json`
            this.uri = `https://bafybeifg7z7bdbwuaw6f6geng63mersmul5rsnnt2ul4hlbn3awrmcmhqq.ipfs.nftstorage.link/${tokenId}.json`
        }
    }
}

export default MoonBeast
