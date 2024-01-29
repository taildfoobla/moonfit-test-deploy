import React, {useEffect, useState} from "react"
import {Button} from "antd"
import {PoweroffOutlined} from '@ant-design/icons';
import {sendTransaction} from "../../../../core/utils/helpers/blockchain";
import {sentBattleClaimTransaction, battleClaimTransactionSuccess, battleClaimTransactionFailed} from "../../../../core/utils/helpers/notification";

const PrizePool = (props) => {
    const {provider, connector, contract, battleUser} = props
    const [isLoading, setIsLoading] = useState(true)
    const [reward, setReward] = useState(0)
    const [claimed, setClaimed] = useState(false)

    useEffect(() => {
        // console.log(battleUser);
        if (battleUser.withdraw) {
            return setClaimed(true)
        }

        setTimeout(async () => {
            const wei = await contract.calculateReward(battleUser.owner)
            const ether = contract.weiToEther(wei)
            setReward(ether)
            setIsLoading(false)
        }, 0)

        return () => null
    }, [battleUser])


    const onClaim = async () => {
        // console.log({ provider })
        const tx = await props.contract.claimReward(battleUser.owner)
        const txHash = await sendTransaction(provider, connector, tx)
        // console.log("The hash of MFB minting transaction is: ", txHash)
        await sentBattleClaimTransaction(txHash)

        clearInterval(window.sentBattleClaimTransaction)
        window.sentBattleClaimTransaction = setInterval(async () => {
            const txReceipt = await props.contract.getTransactionReceipt(txHash)

            if (!txReceipt) {
                return
            }

            clearInterval(window.sentBattleClaimTransaction)
            if (txReceipt.status === false) {
                battleClaimTransactionFailed(txReceipt)
            } else  {
                battleClaimTransactionSuccess(txReceipt)
            }
        }, 5000)
    }

    if (!battleUser.deposit || !battleUser.owner) {
        return <Button disabled>NO REWARD</Button>
    }

    if (claimed) {
        return <Button disabled>CLAIMED</Button>
    }

    if (isLoading) {
        return <Button icon={<PoweroffOutlined/>} loading/>
    }

    return (
        <Button onClick={onClaim} disabled={reward === 0}>CLAIM REWARD ({reward} $GLMR)</Button>
    )
}

export default PrizePool
