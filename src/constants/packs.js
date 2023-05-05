const {env} = require('../configs')

const mapEnv = item => {
    env.price = item.value

    if (env === 'development') {
        env.price = item.value / 10 * 5
    }

    return env
}
export const WITH_MINT_PASS_PACK = [
    {
        type: 'pack1',
        amount: 1,
        value: 159,
        label: 'Pack 1',
        tooltip: '1 NFT is equivalent to 1km target - recommend for 1K runner'
    },
    {
        type: 'pack3',
        amount: 3,
        value: 405,
        discount: 10,
        label: 'Pack 3',
        isRecommend: true,
        tooltip: '3 NFT is equivalent to 3km target - recommend for 3K runner'
    },
    {
        type: 'pack5',
        amount: 5,
        value: 635,
        discount: 15,
        label: 'Pack 5',
        tooltip: '5 NFT is equivalent to 5km target - recommend for 5K runner'
    }, {
        type: 'pack13',
        amount: 13,
        value: 1347,
        discount: 20,
        label: 'Pack 13',
        tooltip: '13 NFT is equivalent to 10km target - recommend for 10K runner'
    }
].map(mapEnv)

export const WITHOUT_MINT_PASS_PACK = [
    {
        type: 'pack1',
        amount: 1,
        value: 199,
        label: 'Pack 1',
        tooltip: '1 NFT is equivalent to 1km target - recommend for 1K runner'
    },
    {
        type: 'pack3',
        amount: 3,
        value: 525,
        discount: 10,
        label: 'Pack 3',
        isRecommend: true,
        tooltip: '3 NFT is equivalent to 3km target - recommend for 3K runner'
    },
    {
        type: 'pack5',
        amount: 5,
        value: 835,
        discount: 15,
        label: 'Pack 5',
        tooltip: '5 NFT is equivalent to 5km target - recommend for 5K runner'
    }, {
        type: 'pack13',
        amount: 13,
        value: 2067,
        discount: 20,
        label: 'Pack 13',
        tooltip: '13 NFT is equivalent to 10km target - recommend for 10K runner'
    }
].map(mapEnv)