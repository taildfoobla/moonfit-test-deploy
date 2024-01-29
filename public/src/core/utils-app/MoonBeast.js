class MoonBeast {
    constructor({tokenId, uri, mintByContract, isOwnerMinted, wallet, index}) {
        this.tokenId = parseInt(tokenId, 10)
        this.uri = uri
        this.mintByContract = mintByContract
        this.isOwnerMinted = isOwnerMinted
        this.wallet = wallet
        this.index = index
    }

    getUri() {
        return this.uri
    }
}

export default MoonBeast
