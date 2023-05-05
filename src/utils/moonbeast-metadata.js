import Bluebird from 'bluebird'
import axios from 'axios'

const _fetchMetadata = {}

const isMaximumFetchData = () => {
    return Object.values(_fetchMetadata).filter(loading => loading === true).length >= 5;
}

const startFetchData = (uri) => {
    _fetchMetadata[uri] = true
}

const endFetchData = (uri) => {
    _fetchMetadata[uri] = false
}

export const getNFTInfo = async (methods, tokenId, fetchMetadata = true) => {
    if (!tokenId) return {name: null, imageUrl: null}
    try {
        const tokenURI = await methods.tokenURI(tokenId).call()

        if (fetchMetadata) {
            const {data} = await axios.get(tokenURI)
            const {name, image} = data
            if (image.startsWith('ipfs://')) {
                const cid = image.replace('ipfs://', '')
                const imageUrl = `https://${cid}.ipfs.nftstorage.link/`
                return {name, imageUrl}
            }

            return {name, imageUrl: image}
        }

        return {tokenId, tokenURI}
    } catch (e) {
        console.log("getNFTInfo Exception: ", e.message)
        return {
            name: null,
            imageUrl: null,
            isNotFound: e.message.includes('URI query for nonexistent token'),
            isError: true
        }
    }
}

const getMetadata = async (uri) => {
    await Bluebird.delay(50)
    if (isMaximumFetchData()) {
        return getMetadata(uri)
    }

    startFetchData(uri)

    if (typeof _fetchMetadata[uri] === 'object') {
        return Promise.resolve(_fetchMetadata[uri])
    }

    return axios.get(uri).then(response => {
        let {image} = response.data

        if (image.startsWith('ipfs://')) {
            const cid = image.replace('ipfs://', '')
            image = `https://${cid}.ipfs.nftstorage.link/`
        }

        const attributes = {}

        response.data.attributes.forEach(item => {
            attributes[item.trait_type] = item.value
        })

        _fetchMetadata[uri] = {
            ...response.data,
            image,
            attributes: {
                Type: attributes.Type,
                Name: attributes.Name,
                Rarity: attributes.Rarity,
                Social: attributes.Social,
                Endurance: attributes.Endurance,
                Luck: attributes.Luck,
                Speed: attributes.Speed,
            }
        }

        return _fetchMetadata[uri]
    }).catch(e => {
        endFetchData(uri)
    })

}

export default getMetadata
