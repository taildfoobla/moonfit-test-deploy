import React from "react"
import "./styles.less"
import AssetsManagementCard from "../share/Wrapper"
import tMFg from "../../../../assets/images/assets-management/tokens/t-mfg.png"
import AssetsManagementButton from "../share/Button"
import Loading from "../../../Mint/components/LoadingOutlined"

export default function TokensManagement({isLoading, tokens}) {
    const tokensList = [
        {
            icon: tMFg,
            name: "tMFG",
            value: 23.34,
        },
        {
            icon: tMFg,
            name: "tMFG",
            value: 23.34,
        },
        {
            icon: tMFg,
            name: "tMFG",
            value: 23.34,
        },
        {
            icon: tMFg,
            name: "tMFG",
            value: 23.34,
        },
        {
            icon: tMFg,
            name: "tMFG",
            value: 23.34,
        },
        {
            icon: tMFg,
            name: "tMFG",
            value: 23.34,
        },
        {
            icon: tMFg,
            name: "tMFG",
            value: 23.34,
        },
        {
            icon: tMFg,
            name: "tMFG",
            value: 23.34,
        },
        {
            icon: tMFg,
            name: "tMFG",
            value: 23.34,
        },
    ]


    const formatNumber = (number, digit) => {
        if(number&&digit){
            let numbertoString = number.toString()
            let newNumber
            if (numbertoString.includes(".")) {
                const arrNumber = numbertoString.split(".")
                const afterDot = arrNumber[1].slice(0, digit)
                const beforeDot = Number(arrNumber[0]).toLocaleString("en-US")
                newNumber = `${beforeDot}.${afterDot}`
            } else {
                newNumber = number.toLocaleString("en-US")
            }
    
            return newNumber
        }else{
            return number
        }
      
    }


    const handleDisplayScrollbar = (e) => {
        let timeOut
        clearTimeout(timeOut)
        e.target.classList.add("display-scrollbar")
        timeOut = setTimeout(() => {
            e.target.classList.remove("display-scrollbar")
        }, 1000)
    }
    return (
        <AssetsManagementCard childClassName="tokens-management">
            <h3>Tokens</h3>
            {isLoading ? (
                <div className="loading">
                    <Loading />
                </div>
            ) : (
                <>
                    <ul
                        className="tokens-list"
                        onScroll={(e) => {
                            handleDisplayScrollbar(e)
                        }}
                    >
                        {tokens &&
                            tokens.map((token, index) => (
                                <li className="token" key={index}>
                                    <div className="left">
                                        <img src={token?.image_url} alt="" />
                                        <span>{token?.name}</span>
                                    </div>
                                    <div className="right">
                                        <span>{formatNumber(token?.value,token?.digit)}</span>
                                    </div>
                                </li>
                            ))}
                    </ul>
                    <AssetsManagementButton addClass="tokens-management-button" />
                </>
            )}
        </AssetsManagementCard>
    )
}

