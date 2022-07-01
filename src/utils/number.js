import BigNumber from "bignumber.js"

export const getStringOfBigNumber = (bigNumber) => {
    return new BigNumber((bigNumber), 10).toString(10)
}

