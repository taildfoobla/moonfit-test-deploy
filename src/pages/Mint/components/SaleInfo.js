import React, {useContext, useEffect, useState} from "react"
import LoadingOutlined from "./LoadingOutlined"
// import WalletAuthContext from '../../contexts/WalletAuthContext'
import {useAuth} from "../../../core/contexts/auth"
import PackItemInfo from "./PackItemInfo"
import LockMintPass from "../../../assets/images/mint/lock-mintpass.svg"
import Sell from "../../../assets/images/mint/sell.png"
// import {WITH_MINT_PASS_PACK, WITHOUT_MINT_PASS_PACK} from '../../constants/packs'
import {
    WITH_MINT_PASS_PACK,
    WITHOUT_MINT_PASS_PACK,
    WITHOUT_MINT_PASS_PACK_ASTR,
} from "../../../core/constants-app/packs"
// import {
//     mintNFTWithMintPassData,
//     mintNFTWithoutMintPassData,
//     NFT_SALE_ADDRESS,
//     smcContract,
//     lockMintPass,
//     unlockMintPass,
//     unlockMintPass2,
//     getMintPassLooking,
// } from "../../services/smc-ntf-sale-round-34";
import {
    mintNFTWithMintPassData,
    mintNFTWithoutMintPassData,
    NFT_SALE_ADDRESS,
    smcContract,
    lockMintPass,
    unlockMintPass,
    unlockMintPass2,
    getMintPassLooking,
} from "../../../core/services-app/smc-ntf-sale-round-34"
// import {buyNFT, getTransactionReceipt} from "../../services/smc-common";
import {buyNFT, getTransactionReceipt} from "../../../core/services-app/smc-common"

// import {checkApprove, MINT_PASS_ADDRESS, setApprovalForAllData} from "../../services/smc-mint-pass";
import {checkApprove, MINT_PASS_ADDRESS, setApprovalForAllData} from "../../../core/services-app/smc-mint-pass"
// import * as notification from "../../utils/notification";
import * as notification from "../../../core/utils-app/notification"
import Bluebird from "bluebird"
import BigNumber from "bignumber.js"
// import EventBus from "../../utils/event-bus";
import EventBus from "../../../core/utils-app/event-bus"
import {useGlobalContext} from "../../../core/contexts/global"
import {mintAPI} from "../../../core/services/mint"
import {Button, message as AndtMessage} from "antd"
import {getLocalStorage, LOCALSTORAGE_KEY} from "../../../core/utils/helpers/storage"
import MoonBeastList from "./MoonBeastsList"
import Loading from "./LoadingOutlined"
import {checkApi} from "../../../core/utils/helpers/check-api"

const BUTTON_TEXT = {
    MINTING: "Minting",
    LOCKING: "Locking",
    UNLOCKING: "Unlocking",
    APPROVING: "Approving",
    REJECTING: "Rejecting",
}

const SaleInfo = (props) => {
    const {isConnected, wallet, provider, connector, showConnectModal, auth} = useAuth()
    const [tab, setTab] = useState(1)
    const [loading, setLoading] = useState(false)
    const [mintPassApprove, setMintPassApprove] = useState(false)
    const [listPack, setListPack] = useState([])
    const [buttonText, setButtonText] = useState(BUTTON_TEXT.MINTING)
    const _oldSelectedPack = {
        1: {tab: 1, ...WITH_MINT_PASS_PACK.find((item) => item.isRecommend)},
        2: {tab: 2, ...WITHOUT_MINT_PASS_PACK.find((item) => item.isRecommend)},
    }
    const [selectedPack, setSelectedPack] = useState(_oldSelectedPack[1])
    const [oldSelectedPack, setOldSelectedPack] = useState(_oldSelectedPack)
    const [isOpenConfirmPopup, setIsOpenConfirmPopup] = useState(false)
    const [round, setRound] = useState("mint-round-3")
    const [isMinting, setIsMinting] = useState(false)
    const {amount, isRerender, setIsRerender, moonBeasts, moonBeastLoading, setMoonBeastLoading} = props

    const {selectedNetwork} = useGlobalContext()
    const isAstar = selectedNetwork === "astar"
    useEffect(() => {
        setListPack(tab === 1 ? WITH_MINT_PASS_PACK : isAstar ? WITHOUT_MINT_PASS_PACK_ASTR : WITHOUT_MINT_PASS_PACK)
    }, [tab])

    useEffect(() => {
        if (isAstar) {
            setTab(2)
            setSelectedPack({...(oldSelectedPack[2] || {}), tab: 2})
            setListPack(
                tab === 1 ? WITH_MINT_PASS_PACK : isAstar ? WITHOUT_MINT_PASS_PACK_ASTR : WITHOUT_MINT_PASS_PACK
            )
        } else {
            setTab(1)
            setSelectedPack({...(oldSelectedPack[2] || {}), tab: 1})
            setListPack(
                tab === 1 ? WITH_MINT_PASS_PACK : isAstar ? WITHOUT_MINT_PASS_PACK_ASTR : WITHOUT_MINT_PASS_PACK
            )
        }
    }, [selectedNetwork])

    useEffect(() => {
        if (auth?.isConnected && auth?.user?.account) {
            _checkApprove()
        }
    }, [auth?.isConnected, auth?.user?.account]) // eslint-disable-line

    function _checkApprove() {
        checkApprove(auth?.user?.account, NFT_SALE_ADDRESS).then((approve) => {
            setMintPassApprove(approve)
        })
    }
    const confirmTransaction = async (txHash, options, callback) => {
        const receipt = await getTransactionReceipt(txHash)

        if (receipt) {
            if (typeof callback === "function") {
                callback()
            }

            notification.close(txHash)

            if (!receipt.status) {
                notification.sentTransactionFailed(txHash, {...options, message: "Transaction Failed"})
            } else {
                notification.sentTransactionSuccess(txHash, options)
            }

            return
        }

        await Bluebird.delay(3000)

        return confirmTransaction(txHash, options, callback)
    }

    const onChangePack = (pack) => {
        setSelectedPack({...pack, tab})
        setOldSelectedPack({
            ...oldSelectedPack,
            [tab]: {...pack, tab},
        })
    }

    const onChangeTab = (value) => {
        setTab(value)
        setSelectedPack({...(oldSelectedPack[value] || {}), tab: value})
    }

    const _getTransaction = () => {
        let tx = {
            to: NFT_SALE_ADDRESS,
            from: auth?.user?.account,
            // gasPrice: `${gasPrice}`,
            maxPriorityFeePerGas: null,
            maxFeePerGas: null,
        }

        if (tab === 2) {
            return {
                transaction: {
                    ...tx,
                    value: selectedPack.price.toString(),
                    data: mintNFTWithoutMintPassData(selectedPack.pack),
                },
                text: BUTTON_TEXT.MINTING,
                txText: "mint",
            }
        }

        if (selectedPack.pack > props.availableMintPass) {
            const lockNumber = selectedPack.pack - props.availableMintPass
            const tokenIds = props.mintPasses.slice(0, lockNumber).map((item) => item.tokenId)
            console.log(`Lock ${lockNumber} MintPass`, tokenIds)

            return {
                transaction: {
                    ...tx,
                    data: lockMintPass(tokenIds),
                },
                text: BUTTON_TEXT.LOCKING,
                txText: `lock ${lockNumber} MintPass`,
            }
        }

        return {
            transaction: {
                ...tx,
                value: selectedPack.price.toString(),
                data: mintNFTWithMintPassData(selectedPack.pack),
            },
            text: BUTTON_TEXT.MINTING,
            txText: `mint`,
        }
    }
    const handleLockMintPass = async () => {
        setLoading(true)
        setButtonText(BUTTON_TEXT.MINTING)

        try {
            const {transaction, text, txText} = await _getTransaction()
            setButtonText(text)
            if (BUTTON_TEXT.MINTING === text) {
                props.setMoonBeastMinting(selectedPack.pack)
            }

            if (transaction && transaction.data) {
                try {
                    const txHash = await buyNFT(provider, connector, smcContract, transaction)

                    if (txHash) {
                        notification.sentTransactionSuccess(txHash, {
                            message: "Transaction Sending...",
                            description: `The hash of ${txText} transaction is`,
                        })
                        return confirmTransaction(
                            txHash,
                            {
                                message: "Transaction Sent",
                                description: `The hash of ${txText} transaction is`,
                            },
                            () => {
                                props.setMoonBeastMinting(0)
                                props.onRefresh()
                                EventBus.$dispatch("buyNFT", {})
                                setLoading(false)
                            }
                        ).then()
                    }

                    setLoading(false)
                } catch (e) {
                    props.setMoonBeastMinting(0)
                    notification.error(e.message, e)
                    setLoading(false)
                }
            }
        } catch (e) {
            props.setMoonBeastMinting(0)
            notification.error(e.message, e)
            setLoading(false)
        }
    }

    const handleOpenConfirmPopup = (round) => {
        if (isAstar && selectedPack.value <= amount.ASTR) {
            setIsOpenConfirmPopup(true)
            setRound(round)
        } else if (selectedPack.value <= amount.GLMR) {
            setIsOpenConfirmPopup(true)
            setRound(round)
        }
    }
    const handleCloseConfirmPopup = () => {
        setIsOpenConfirmPopup(false)
    }

    const handleMint = async (round) => {
        let value

        switch (round) {
            case "mint-round-3":
                if (amount?.GLMR < selectedPack.value) {
                    return
                }
                value = {
                    pack: selectedPack?.amount,
                }
                break
            case "mint-round-4":
                if (amount?.GLMR < selectedPack.value) {
                    return
                }
                value = {
                    pack: selectedPack?.amount,
                }
                break
            case "mint-nft-on-astar":
                if (amount?.ASTR < selectedPack.value) {
                    return
                }
                value = {
                    pack: selectedPack?.amount,
                    is_free: false,
                }
                break
            default:
                value = {
                    pack: 1,
                    is_free: true,
                }
        }
        setIsMinting(true)
        const res = await checkApi(mintAPI, [round, value])
        setIsMinting(false)
        const {data, message, success} = res
        setIsOpenConfirmPopup(false)
        if (success) {
            setIsRerender(true)
            return AndtMessage.success({
                key: "success",
                content: "Mint was successfully",
                className: "message-success",
                duration: 5,
            })
        } else {
            return AndtMessage.error({
                key: "err",
                content: message,
                className: "message-error",
                duration: 5,
            })
        }
    }

    const _unlockMintPass = async (contractAddress = NFT_SALE_ADDRESS, version = 2) => {
        setButtonText(BUTTON_TEXT.UNLOCKING)
        setLoading(true)
        console.log("Unlock", {contractAddress, version})
        const tx = {
            to: contractAddress,
            from: wallet.account,
            // gasPrice: `${gasPrice}`,
            maxPriorityFeePerGas: null,
            maxFeePerGas: null,
            data: version === 1 ? unlockMintPass() : unlockMintPass2(),
        }

        try {
            const txHash = await buyNFT(provider, connector, smcContract, tx)

            if (txHash) {
                notification.sentTransactionSuccess(txHash, {
                    message: "Transaction Sending...",
                    description: `The hash of unlock MintPass transaction is`,
                })
                return confirmTransaction(
                    txHash,
                    {
                        message: "Transaction Sent",
                        description: `The hash of unlock MintPass transaction is`,
                    },
                    () => {
                        props.onRefresh()
                        setLoading(false)
                    }
                ).then()
            }

            setLoading(false)
        } catch (e) {
            notification.error(e.message, e)
            setLoading(false)
        }
    }

    const _approvalForAllMintPass = async (status) => {
        const text = status ? BUTTON_TEXT.APPROVING : BUTTON_TEXT.REJECTING
        setLoading(true)
        setButtonText(text)

        const tx = {
            to: MINT_PASS_ADDRESS,
            from: auth?.user?.account,
            maxPriorityFeePerGas: null,
            maxFeePerGas: null,
            data: setApprovalForAllData(NFT_SALE_ADDRESS, !!status),
        }

        try {
            const txHash = await buyNFT(provider, connector, smcContract, tx)

            if (txHash) {
                notification.sentTransactionSuccess(txHash, {
                    message: "Transaction Sending...",
                    description: `The hash of ${text} for all MintPass transaction is`,
                })
                return confirmTransaction(
                    txHash,
                    {
                        message: "Transaction Sent",
                        description: `The hash of ${text} for all MintPass transaction is`,
                    },
                    () => {
                        _checkApprove()
                        setLoading(false)
                    }
                ).then()
            }

            setLoading(false)
        } catch (e) {
            notification.error(e.message, e)
            setLoading(false)
        }
    }

    window.getMintPassLooking = () => getMintPassLooking(wallet.account)
    window.unlockMintPass = _unlockMintPass
    window.approvalForAllMintPass = _approvalForAllMintPass

    const countMintPass = () => {
        return props.availableMintPass + props.mintPasses.length
    }

    const _renderModalConfirm = () => {
        const user = JSON.parse(getLocalStorage(LOCALSTORAGE_KEY.SOCIAL_ACOUNT))
        return (
            <div className="mf-modal-confirm">
                <div className="mf-modal-confirm-box">
                    <div className="mf-modal-confirm-content">
                        <div className="confirm-text">
                            Are you sure you want to mint a pack of {selectedPack.amount} NFTs with a price of{" "}
                            {selectedPack?.value} {isAstar ? "ASTR" : "GLMR"} for
                            <span>"{user?.email}"</span>?
                        </div>

                        <div className="confirm-button">
                            <Button className="confirm-no" onClick={handleCloseConfirmPopup}>
                                No
                            </Button>
                            <Button
                                className="confirm-yes"
                                onClick={() => {
                                    handleMint(round)
                                }}
                            >
                                {isMinting || isRerender ? <Loading /> : "Yes"}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const _renderButtonIcon = () => {
        if (isAstar) {
            return Sell
        } else {
            return LockMintPass
        }
    }

    const _renderButtonText = () => {
        // if (isAstar) {
        //     return "Buy MoonBeast"
        // } else {
        return `Mint Pack ${selectedPack.amount}`
        // }
    }

    const _renderButton = () => {
        if (loading) {
            return (
                <button className="button button-secondary" type="button">
                    <LoadingOutlined className="text-white" style={{color: "white"}} size={20} />
                    <span className="ml-2" style={{marginLeft: "8px"}}>
                        {buttonText}
                    </span>
                </button>
            )
        }

        if (!selectedPack.amount || selectedPack.tab !== tab) {
            return (
                <button className="button button-secondary disabled" type="button" disabled style={{padding: "0 10px"}}>
                    <img className="ml-2" style={{marginLeft: "8px"}} src={LockMintPass} alt="" />
                    <span>Select a pack</span>
                </button>
            )
        }
        if (tab === 1) {
            // if (!mintPassApprove) {
            //     return (
            //         <button
            //             className="button button-secondary"
            //             type="button"
            //             onClick={() => _approvalForAllMintPass(true)}
            //         >
            //             <img className="mr-2" src={LockMintPass} alt="" />
            //             <span>Approve</span>
            //         </button>
            //     )
            // }
            if (countMintPass() < selectedPack.amount) {
                return (
                    <button className="button button-secondary disabled" type="button" disabled>
                        <img className="ml-3" src={LockMintPass} alt="" />
                        <span>Insufficient MintPass</span>
                    </button>
                )
            }

            if(isAstar?amount?.ASTR<selectedPack.value:amount?.GLMR<selectedPack.value){
                return (
                    <button className="button button-secondary disabled" type="button" disabled>
                        <img className="ml-3" src={LockMintPass} alt="" />
                        <span>Insufficient Balance</span>
                    </button>
                )
            }
            return (
                <button
                    className={`button button-secondary ${
                        isAstar
                            ? amount?.ASTR < selectedPack.value
                                ? "disabled"
                                : ""
                            : amount?.GLMR < selectedPack.value
                            ? "disabled"
                            : ""
                    }`}
                    type="button"
                    onClick={() => {
                        handleOpenConfirmPopup(isAstar ? "mint-nft-on-astar" : "mint-round-3")
                    }}
                >
                    <img className="mr-2" src={_renderButtonIcon()} alt="" style={{width: "30px", height: "30px"}} />
                    <span>{_renderButtonText()}</span>
                </button>
            )
            // if (selectedPack.amount > props.availableMintPass) {
            //     return (
            //         <button className="button button-secondary" type="button" onClick={handleLockMintPass}>
            //             <img className="ml-3" src={LockMintPass} alt="" />
            //             <span>Lock {selectedPack.amount - props.availableMintPass} MintPass</span>
            //         </button>
            //     )
            // }
        }


        if(isAstar?amount?.ASTR<selectedPack.value:amount?.GLMR<selectedPack.value){
            return (
                <button className="button button-secondary disabled" type="button" disabled>
                    <img className="ml-3" src={LockMintPass} alt="" />
                    <span>Insufficient Balance</span>
                </button>
            )
        }

        return (
            <button
                className={`button button-secondary ${
                    isAstar
                        ? amount?.ASTR < selectedPack?.value
                            ? "disabled"
                            : ""
                        : amount?.GLMR < selectedPack.value
                        ? "disabled"
                        : ""
                }`}
                type="button"
                onClick={() => {
                    handleOpenConfirmPopup(isAstar ? "mint-nft-on-astar" : "mint-round-4")
                }}
            >
                <img className="mr-2" src={_renderButtonIcon()} alt="" style={{width: "30px", height: "30px"}} />
                <span>{_renderButtonText()}</span>
            </button>
        )
    }

    const renderHead = () => {
        const availableMintPass =
            props.isLoading || Number.isNaN(props.availableMintPass) ? (
                <span className="dot-flashing" />
            ) : (
                props.availableMintPass + props.mintPasses.length
            )

        return (
            <div
                className="card-body-row-header text-center normal-case font-semibold mb-5"
                // style={{margin: `${isAstar ? "-16px 0 5px" : ""}`}}
            >
                {isAstar ? (
                    <>
                        <p>Mint With $ASTR</p>
                        <p className="text-[#A8ADC3] leading-7 text-[20px] w-3/4 m-auto" style={{width: "100%"}}>
                            Ensure you have $ASTR deposited in the MoonFit App for minting MoonBeast NFTs.
                        </p>
                    </>
                ) : (
                    <>
                        <p className="text-white text-[18px] leading-normal poppins-font mb-0">
                            You have {availableMintPass} Mint Pass available
                        </p>
                        <p className="text-[#A8ADC3] leading-7 text-[20px] w-3/4 m-auto">
                            Each mint pass is one-time use only for buying 1 MoonBeast at a discounted price.
                        </p>
                    </>
                )}
            </div>
        )
    }

    const numberFormat = (number) => {
        const fmt = {
            prefix: "",
            decimalSeparator: ".",
            groupSeparator: ",",
            groupSize: 3,
            secondaryGroupSize: 0,
            fractionGroupSeparator: " ",
            fractionGroupSize: 0,
            suffix: "",
        }
        return new BigNumber(number).toFormat(0, fmt)
    }

    return (
        <>
            <div className={"card-body-row flex flex-col purchase-moonbest"}>
                {isOpenConfirmPopup && _renderModalConfirm()}
                {renderHead()}
                {!isAstar && (
                    <div className="flex justify-center normal-case tabs">
                        <div className={`tab ${tab === 1 ? "active" : ""}`} onClick={() => onChangeTab(1)}>
                            With Mint Pass
                        </div>
                        <div className={`tab ${tab === 2 ? "active" : ""}`} onClick={() => onChangeTab(2)}>
                            Without Mint Pass
                        </div>
                    </div>
                )}

                <ul className="packs mt-8 mb-2 p-0" style={{margin: `${isAstar ? " 0 " : ""}`}}>
                    {listPack.map((item, index) => {
                        let className = `pack ${selectedPack.amount === item.amount ? "active" : ""}`
                        if (item.amount > countMintPass()) {
                            className = `${className} disabled`
                        }

                        return (
                            <PackItemInfo
                                key={index}
                                className={className}
                                item={item}
                                onClick={() => onChangePack(item)}
                            />
                        )
                    })}
                </ul>
                {isAstar && (
                    <div className="note">
                        <p>Please note that minting times for large MoonBeast packs may take longer than usual.</p>{" "}
                    </div>
                )}
                <hr className={"card-body-separator"} />
                <div className="unlock-mintpass flex justify-between items-center">
                    <div className="left">
                        <span className="text-[16px] text-[#A8ADC3] fee-info">FEE:</span>
                        <p className="text-[20px] text-[#4CCBC9] race-sport-font fee-amount">
                            {selectedPack.tab === tab && selectedPack.value
                                ? `${numberFormat(selectedPack.value)} ${isAstar ? "$ASTR" : "$GLMR"}`
                                : "\u00A0"}
                        </p>
                    </div>

                    <div
                        className="right"
                        data-count-mint-pass={countMintPass()}
                        data-available-mint-pass={props.availableMintPass}
                        data-unlock-mint-pass={props.mintPasses.length}
                        data-mint-pass={props.mintPasses.map((item) => item.tokenId).join(",")}
                    >
                        {_renderButton()}
                    </div>
                </div>
                {/* {!auth?.isConnected && (
                    <div className={"flex mt-8 justify-center form-mint-footer"} style={{marginTop: "30px"}}>
                        <div className="btn-connect">
                            <button type="button" onClick={showConnectModal} className="button button-secondary">
                                <img className="mr-1" src={wallet} alt="" /> Connect Wallet
                            </button>
                        </div>
                    </div>
                )} */}
            </div>
            <MoonBeastList
                setMoonBeastLoading={setMoonBeastLoading}
                moonBeastLoading={moonBeastLoading}
                isRerender={isRerender}
                isMinting={isMinting}
                moonBeasts={moonBeasts}
                total={selectedPack.amount}
            />
        </>
    )
}

export default SaleInfo

