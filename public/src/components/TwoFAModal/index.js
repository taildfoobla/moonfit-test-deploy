import React from "react"
import "./styles.less"
import ActiveTwoFA from "./ActiveTwoFA"
import AuthTwoFA from "./AuthTwoFA"

export default function TwoFAModal({
    isOpen,
    onOpen,
    isHave2FA,
    setIsHave2FA,
    onClose,
    selectedAsset,
    selectedNetwork,
    amountInput,
    toAddress,
    onToggleSubmittedModal
}) {
    return (
        <>
            {isHave2FA ? (
                <AuthTwoFA
                    isOpen={isOpen}
                    onClose={onClose}
                    selectedAsset={selectedAsset}
                    selectedNetwork={selectedNetwork}
                    amountInput={amountInput}
                    toAddress={toAddress}
                    onToggleSubmittedModal={onToggleSubmittedModal}
                />
            ) : (
                <ActiveTwoFA isOpen={isOpen} onOpen={onOpen} onClose={onClose} setIsHave2FA={setIsHave2FA}/>
            )}
        </>
    )
}

