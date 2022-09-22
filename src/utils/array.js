export const range = (start, stop, step = 1) => Array.from({length: (stop - start) / step + 1}, (_, i) => start + (i * step))

export const chunk = (inputArray, perChunk) => {
    return inputArray.reduce((resultArray, item, index) => {
        const chunkIndex = Math.floor(index/perChunk)

        if(!resultArray[chunkIndex]) {
            resultArray[chunkIndex] = [] // start a new chunk
        }

        resultArray[chunkIndex].push(item)

        return resultArray
    }, [])
}
