import React from "react"
import LinkSocial from "./LinkSocial"
import SignSocial from "./SignSocial"
import {useAuth} from "../../core/contexts/auth"

export default function ConnectSocialModal({isOpen, onClose}) {
    const {auth} = useAuth()

    const handleClose = () => {
        onClose(false)
    }

    return (
        <>
            {auth?.isConnected ? (
                <LinkSocial isOpen={isOpen} onClose={handleClose} />
            ) : (
                <SignSocial isOpen={isOpen} onClose={handleClose} />
            )}
        </>
    )
}

