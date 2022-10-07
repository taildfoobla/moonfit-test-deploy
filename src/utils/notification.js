import {notification} from "antd"
import {getShortAddress, getTxScanUrl} from "./blockchain";
import React from "react";
import {getMainMessage} from "./tx-error";

export const destroy = () => notification.destroy()

export const sentTransactionSuccess = (txHash) => {
    return notification.success({
        message: 'Transaction Sent',
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

export const sentTransactionFailed = (txHash) => {
    return notification.success({
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

export const error = (message) => notification.error({
    message: `Transaction Failed`,
    description: getMainMessage(message),
    placement: 'bottomRight',
    duration: 30
})
