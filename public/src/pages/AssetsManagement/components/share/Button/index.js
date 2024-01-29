import React from "react"
import "./styles.less"
import {useNavigate} from "react-router-dom"

export default function AssetsManagementButton({addClass}) {
    const navigate = useNavigate()

    const handleGoToPage = (page) => {
        navigate(`/${page}`)
    }

    return (
        <div className={`button-assets-management-wrapper ${addClass}`}>
            <button
                className="deposit"
                onClick={() => {
                    handleGoToPage("deposit")
                }}
            >
                Deposit
            </button>
            <button
                className="withdraw"
                onClick={() => {
                    handleGoToPage("withdraw")
                }}
            >
                Withdraw
            </button>
        </div>
    )
}

