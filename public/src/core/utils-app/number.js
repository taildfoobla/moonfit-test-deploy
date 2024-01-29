import BigNumber from "bignumber.js"

export const getStringOfBigNumber = (bigNumber) => {
    return new BigNumber((bigNumber), 10).toString(10)
}

export const formatZeroNumber = (number) => {
    return number >= 10 ? number : `0${number}`
}

