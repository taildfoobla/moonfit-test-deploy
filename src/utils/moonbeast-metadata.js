import Bluebird from 'bluebird'
import axios from 'axios'
import * as url from "url";

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

const getMetadata = async (uri, delayTime) => {
    await Bluebird.delay(delayTime || 50)

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

        if(response.data.attributes.length === 0) {
            console.log('No attributes found', url, response.data)
            return getMetadata(uri, 2000)
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
