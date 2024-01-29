import React from "react"
// import { NFT_SALE_CURRENT_INFO } from "../../constants/blockchain"
import {NFT_SALE_CURRENT_INFO} from "../../../core/constants-app/blockchain"
// import LoadingOutlined from "../../components/shared/LoadingOutlined";
import LoadingOutlined from "./LoadingOutlined"
import {useGlobalContext} from "../../../core/contexts/global"

const Header = ({availableSlots, isLoading = true, roundInfo = NFT_SALE_CURRENT_INFO, isExpired = false}) => {
    const {selectedNetwork} = useGlobalContext()

    const isAstar = selectedNetwork === "astar"
    const isFreeMint = selectedNetwork === "free"

    const _renderProgress = () => {
        if (isLoading || Number.isNaN(availableSlots)) {
            return <LoadingOutlined className="ml-3" />
        }

        if (isExpired) {
            return (
                <span className="ml-3 bg-[#EF2763] text-[16px] text-white uppercase font-bold px-4 rounded dark:bg-green-500 dark:text-white">
                    SALE ENDED
                </span>
            )
        }

        if (availableSlots > 0) {
            const nft = availableSlots > 1 ? "NFTs" : "NFT"

            return (
                <span
                    className="ml-3 bg-[#A16BD8] text-white text-[16px] uppercase font-extrabold px-4 rounded dark:bg-green-500 dark:text-white"
                    style={{paddingTop: "0.25rem", paddingBottom: "0.35rem"}}
                >
                    {availableSlots} {nft} left
                </span>
            )
        }

        return (
            <span className="ml-3 bg-[#EF2763] text-[16px] text-white uppercase font-bold px-4 rounded dark:bg-green-500 dark:text-white">
                Sold out
            </span>
        )
    }

    const _renderDate = () => {
        if (roundInfo.hideDate) {
            return (
                <div
                    className={`${isLoading ? "nft-total-loading" : "nft-total"} flex justify-center mt-6`}
                    style={{minHeight: "32px"}}
                >
                    {_renderProgress()}
                </div>
            )
        }

        return (
            <div
                className={`${isLoading ? "nft-total-loading" : "nft-total"} flex justify-center mt-6`}
                style={{minHeight: "32px"}}
            >
                <span className="bg-[#A16BD8] text-[16px] text-white uppercase font-bold px-4 rounded dark:text-white">
                    {roundInfo.specialRound ? roundInfo.dateRange : roundInfo.dateMsg}
                </span>
                {_renderProgress()}
            </div>
        )
    }

    return (
        <div className="container" key={"_renderHead"}>
            <div className={"flex flex-col worldcup-round-header"}>
                <div className={"nft-header flex justify-center"}>
                    <h2 className="font-bold text-3xl secondary-color text-center">
                        {isAstar ? (
                            <span className={"text-white"}>Mint with ASTR</span>
                        ) : isFreeMint ? (
                            <span className={"text-white"}>free minting nft</span>
                        ) : roundInfo.specialRound ? (
                            <div className="header-title">
                                <span className={"text-white"}>{roundInfo?.headerTitle}</span>
                                <p className="text-triple-gradient mt-3">special round</p>
                            </div>
                        ) : (
                            <>
                                {/* NFT Sale <span className={"text-white"}>Round #{roundInfo.number}</span> */}
                                <span className={"text-white"}>mint with glmr </span>
                            </>
                        )}
                    </h2>
                </div>

                {_renderDate()}
                {/* {roundInfo.specialRound && _headerInfoItems()} */}
            </div>
        </div>
    )
}

export default Header

