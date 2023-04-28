const Paths = {
    Home: {
        path: '/',
        env: ['local', 'development', 'production']
    },
    NFTSale: {
        path: '/nft-sale',
        env: ['local', 'development', 'production']
    },
    NFTSaleRoundThree: {
        path: '/nft-sale-round-3',
        env: ['local', 'development', 'production'],
    },
    NFTPublicSale: {
        path: '/nft-public-sale',
        // env: ['local', 'development', 'production'],
        env: [],
    },
    NFTSaleRoundWorldCup: {
        path: '/nft-world-cup-sale',
        env: ['local', 'development', 'production']
    },
    PrivateSale: {
        path: '/private-sale',
        env: ['local']
    },
    MintPassMinting: {
        path: '/mint-pass',
        env: []
    },
    MintPassVerify: {
        path: '/mint-pass-verify',
        env: ['local', 'development', 'production']
    },
    NftSaleStages: {
        path: '/nft-sale',
        env: ['local', 'development', 'production']
    },
    Deposit: {
        path: '/deposit',
        env: ['local', 'development', 'production']
    }
}

export default Paths
