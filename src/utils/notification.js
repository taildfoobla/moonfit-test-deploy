import {notification} from "antd"
import {getShortAddress, getTxScanUrl} from "./blockchain";
import React from "react";
import {getMainMessage} from "./tx-error";

export const destroy = () => notification.destroy()

export const sentTransactionSuccess = (txHash) => {
    return notification.success({
        key: txHash,
        message: 'Transaction Sent',
        description: (
            <div>
                The hash of deposit transaction is: <br/>
                <a target="_blank" rel="noreferrer"
                   className={'text-blue-600'}
                   href={getTxScanUrl(txHash)}>{getShortAddress(txHash, 8)}</a>
            </div>
        ),
        placement: 'bottomRight',
        duration: 60
    })
}
export const sentTransactionDepositSuccess = (txHash) => {
    return notification.success({
        key: txHash,
        message: 'Transaction Sent',
        description: (
            <div>
                The hash of deposit transaction is: <br/>
                <a target="_blank" rel="noreferrer"
                   className={'text-blue-600'}
                   href={getTxScanUrl(txHash)}>{getShortAddress(txHash, 8)}</a>
            </div>
        ),
        placement: 'bottomRight',
        duration: 120
    })
}

export const depositSuccess = (txHash, nftType) => {
    return notification.success({
        key: txHash,
        message: `Deposited ${nftType} success`,
        description: (
            <div>
                The hash of deposit transaction is: <br/>
                <a target="_blank" rel="noreferrer"
                   className={'text-blue-600'}
                   href={getTxScanUrl(txHash)}>{getShortAddress(txHash, 8)}</a> <br/>
                Please wait a moment and check the mobile app
            </div>
        ),
        placement: 'bottomRight',
        duration: 120
    })
}

export const sentTransactionFailed = (txHash) => {
    return notification.success({
        key: txHash,
        message: `Transaction Failed`,
        description: (
            <div>
                The hash of MFB minting transaction is: <br/>
                <a target="_blank" rel="noreferrer"
                   className={'text-blue-600'}
                   href={getTxScanUrl(txHash)}>{getShortAddress(txHash, 8)}</a>
            </div>
        ),
        placement: 'bottomRight',
        duration: 60
    })
}

export const close = key => notification.close(key)

export const error = (message, error) => {
    let description = getMainMessage(message)

    if (error && (error.funcName === 'estimateGas' || error.code === -32603)) {
        description = (
            <div>
                {/*{description} <br />*/}
                The gas fee of this transaction was too high and exceeded the limit. Please lower the amount of NFTs you want to mint to less than 5.
            </div>
        )
    }

    return notification.error({
        message: `Transaction Failed`,
        description,
        placement: 'bottomRight',
        duration: 30
    })
}
