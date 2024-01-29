import { Avatar, notification } from "antd"
import { getShortAddress, getTxScanUrl } from "./blockchain";
import React from "react";
import { format } from "timeago.js";

export const destroy = () => notification.destroy()

export const notify = (type, message, description, options = {}) => {
    return notification[type]({
        message,
        description: description || message,
        placement: options.placement || 'bottomLeft',
        duration: options.duration || 30
    })
}

export const notificationError = (message, description) => {
    return notification.success({
        message,
        description: description || message,
        placement: 'bottomLeft',
        duration: 30
    })
}

export const sentBattleDepositTransaction = (txHash) => {
    return notification.success({
        key: `_${txHash}`,
        message: 'Transaction Sent',
        description: (
            <div>
                The hash of deposit transaction is: <br />
                <a target="_blank" rel="noreferrer"
                   className={'text-blue-600'}
                   href={getTxScanUrl(txHash)}>{getShortAddress(txHash, 8)}</a>
            </div>
        ),
        // placement: 'bottomRight',
        placement: 'bottomLeft',
        duration: 120
    })
}

export const sentBattleClaimTransaction = (txHash) => {
    return notification.success({
        key: txHash,
        message: 'Transaction Sent',
        description: (
            <div>
                The hash of claim transaction is: <br />
                <a target="_blank" rel="noreferrer"
                   className={'text-blue-600'}
                   href={getTxScanUrl(txHash)}>{getShortAddress(txHash, 8)}</a>
            </div>
        ),
        placement: 'bottomRight',
        duration: 120
    })
}

export const battleClaimTransactionSuccess = (txHash) => {
    notification.close(txHash)

    return notification.success({
        key: txHash,
        message: 'Transaction Success',
        description: (
            <div>
                The hash of claim transaction is: <br />
                <a target="_blank" rel="noreferrer"
                   className={'text-blue-600'}
                   href={getTxScanUrl(txHash)}>{getShortAddress(txHash, 8)}</a>
            </div>
        ),
        placement: 'bottomRight',
        duration: 15
    })
}

export const battleClaimTransactionFailed = (txHash) => {
    notification.close(txHash)

    return notification.error({
        key: txHash,
        message: 'Transaction Failed',
        description: (
            <div>
                The hash of claim transaction is: <br />
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
                The hash of deposit transaction is: <br />
                <a target="_blank" rel="noreferrer"
                    className={'text-blue-600'}
                    href={getTxScanUrl(txHash)}>{getShortAddress(txHash, 8)}</a>
            </div>
        ),
        placement: 'bottomLeft',
        duration: 60
    })
}

export const newDepositTransaction = (transaction, txHash, clansBattle, options = {}) => {
    if (!transaction || !txHash) {
        return
    }

    try {
        notification.close(`_${txHash}`)
    } catch (e) {
        console.log(e);
    }

    return notification.success({
        key: txHash,
        description: (
            <div className="notification">
                <div className="notification-avatar">
                    <Avatar shape="square" size={60} src={clansBattle[transaction.clanId]?.background} />
                </div>
                <div className="notification-content">
                    <a target="_blank" rel="noreferrer" href={getTxScanUrl(txHash)}>{getShortAddress(txHash, 8)}</a>
                    <div className="amount"><h4 className="text-secondary">{transaction?.balance} GLMRs</h4> {clansBattle[transaction.clanId]?.name && <><div className="dot"></div> {clansBattle[transaction.clanId]?.name}</>}</div>
                    <p>{format(transaction.createdAt)}</p>
                </div>
            </div>
        ),
        placement: options.placement || 'bottomLeft',
        duration: options.duration || 60
    })
}

