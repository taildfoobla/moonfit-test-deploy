import React, { useState } from "react"
import { Row, Col, Button, message } from "antd"
import {
    CaretDownOutlined,
} from '@ant-design/icons';
import "./styles.less"
import aura from "../../../../assets/images/clan-battle/aura.png"
import { AMOUNTS_MORE, BATTLE_STATUS } from "../../../../core/utils/constants/clan-battle";
import DOMEventServices from "../../../../core/services/dom-event";
import PrizeInfo from './PrizeInfo'
import UserBattleInfo from './UserBattleInfo'
import CountdownComponent from './CountdownComponent'
import ClaimButton from './ClaimButton'
import { sendTransaction } from '../../../../core/utils/helpers/blockchain'
import { sentBattleDepositTransaction } from "../../../../core/utils/helpers/notification";
import PrizeWarning from "./PrizeWarning";

const PrizePool = (props) => {
    const { width, user, provider, connector, contract, betTimeLock, battleStatus, prizePool, clansBattle, depositMapping, battleUser, refreshTransaction, battle, victoryTeam } = props
    const [params, setParams] = useState({
        amount: 0,
        team: 0,
    })
    const [isSelectedMore, setIsSelectedMore] = useState(false)
    const [estimateReward, setEstimateReward] = useState(0)
    const [clickDeposit, setClickDeposit] = useState(false)

    const winner = victoryTeam ? battle.metadata.mappingClans[victoryTeam] : null;
    
    const handleBetTimeLocked = () => {
        if (typeof props.handleBetTimeLocked === 'function') {
            props.handleBetTimeLocked()
        }
    }
    const roundBalance = contract.roundBalance

    const onSelectTeam = (team) => {
        setParams({ ...params, team })
        if (params.amount && team) {
            setEstimateReward(props.contract.estimateReward(prizePool, clansBattle[team].balance, getValue(params.amount)))
        }
    }

    const onSelectAmount = (amount) => {
        if ([5, 10, 50].includes(amount)) setIsSelectedMore(false)
        setParams({ ...params, amount })
        setClickDeposit(false)
        if (params.team && amount) {
            setEstimateReward(props.contract.estimateReward(prizePool, clansBattle[params.team].balance, getValue(amount)))
        }
    }

    const renderWarning = (amount) => {
        let warning = ""
        if (amount !== 0) {
            warning = "Warning: deposits are non-fundarable in all circumstances!"
        }
        if (parseFloat(user?.currentBalance) < parseFloat(getValue(params.amount))) {
            warning = "Warning: Insufficient funds"
        }
        // if (!params.amount) {
        //     warning = "Please enter an amount"
        // }

        // if (!params.team) {
        //     warning = "Please pick a team"
        // }
        return warning
    }

    const getValue = (amount) => {
        return depositMapping[amount] || amount
    }

    const onDeposit = async () => {
        // console.log({ provider })
        // console.log("amount", params.amount, params)
        setClickDeposit(true)
        if (!params.amount) {
            return message.error({
                content: "Please enter an amount",
                className: "message-error",
            })
        }

        if (!params.team) {
            return message.error({
                content: "Please pick a team",
                className: "message-error",
            })
        }

        const tx = await props.contract.betTransaction(user.account, params.team, getValue(params.amount))
        const txHash = await sendTransaction(provider, connector, tx)
        console.log("The hash of MFB minting transaction is: ", txHash)
        await sentBattleDepositTransaction(txHash)
        // Add notification
        setClickDeposit(false)
        setParams({
            amount: 0,
            team: 0,
        })
    }

    const teamsInfo = () => {
        return Object.values(props.clansBattle).map((clan, index) => {
            const isSelected = params.team === clan.contract_clan

            return (<div key={clan.contract_clan}>
                <div onClick={() => onSelectTeam(clan.contract_clan)} className={`team${index + 1} ${isSelected ? "selected" : "un-selected"}`}>
                    {/* {
                        isSelected && <div className="aura1">
                            <img src={aura} />
                        </div>
                    } */}

                    {/* <img src={clan?.background2} alt={clan.name} /> */}
                    <img src={clan?.background} alt={clan.name} />
                </div>
            </div>)
        })
    }

    const teamsProgress = () => {
        return Object.values(props.clansBattle).map((clan, index) => {
            return (
                <div key={clan.contract_clan} className={`team${index + 1} ${clan?.rate === 100 ? "full-rate" : ""}`} style={{ width: `${clan.rate}%` }}>
                    {/* <span>{clan.rate}</span> */}
                </div>
            )
        })
    }

    const teamsProgressNumber = () => {
        return Object.values(props.clansBattle).map((clan, index) => {
            return (
                <div key={clan.contract_clan} className={`team${index + 1}`}>
                    <span style={{ marginRight: '5px' }} className={`${index === 0 ? "text-secondary" : "text-primary"}`}>
                        {clan.rate}%
                    </span>
                    ({clan.balance})
                </div>
            )
        })
    }

    const renderButton = () => {
        let output = <></>
        if (battleStatus === BATTLE_STATUS.RUNNING) {
            output = <Button onClick={onDeposit} disabled={parseFloat(user?.currentBalance) < getValue(params.amount)}>DEPOSIT</Button>
        } else if (battleStatus === BATTLE_STATUS.BET_LOCKED) {
            output = <Button disabled={true}>NO MORE PREDICTIONS</Button>
        } else if (battleStatus === BATTLE_STATUS.VERIFY) {
            output = <Button disabled={true}>NO MORE PREDICTIONS</Button>
        } else if (battleStatus === BATTLE_STATUS.CLAIM_REWARD) {
            output = <ClaimButton
                contract={contract}
                connector={connector}
                provider={provider}
                battleUser={battleUser}
            />
        }
        return output
    }

    const amountsMoreValues = AMOUNTS_MORE.map(item => item.value)

    return (
        <div className="prize-pool-bg-wrapper">
            <div className="prize-pool-container">
                <Row justify="center" gutter={[32, 0]}>
                    <Col xs={24} md={24} xl={12}>
                        <div className="prize-pool-instruction">
                            <PrizeInfo />
                            {/* <PrizeWarning /> */}
                            <UserBattleInfo
                                width={width}
                                contract={contract}
                                user={user}
                                prizePool={prizePool}
                                victoryTeam={props.victoryTeam}
                                clansBattle={props.clansBattle}
                                battleUser={battleUser}
                                refreshTransaction={refreshTransaction}
                            />
                        </div>
                    </Col>
                    <Col xs={24} xl={9}>
                        <div className="prize-pool-box">
                            <Row justify="center">
                                <h4 className="text-primary">prize pool</h4>
                            </Row>
                            <Row justify="center">
                                <h1>{roundBalance(prizePool)}</h1>
                            </Row>
                            <Row justify="center">
                                <h4 className="text-pink-glow">$GLMR</h4>
                            </Row>
                            <Row justify="center" style={{ marginTop: "15px" }}>
                                <span className="time-to-predict">TIME LEFT TO PREDICT</span>
                            </Row>
                            <Row justify="center">
                                <CountdownComponent date={betTimeLock} completedCallback={() => handleBetTimeLocked(true)} />
                            </Row>
                            {
                                [BATTLE_STATUS.RUNNING].includes(battleStatus) && <div className="amount-pick-container">
                                    <button className={`predict-amount ${params.amount === 5 ? "selected" : ""}`} onClick={() => onSelectAmount(5)}>
                                        <div className="border-predict-amount">
                                            <h3 className={params.amount === 5 ? "text-secondary" : "text-primary"}>05</h3>
                                            <h4>$GLMR</h4>
                                        </div>
                                    </button>
                                    <button className={`predict-amount ${params.amount === 10 ? "selected" : ""}`} onClick={() => onSelectAmount(10)}>
                                        <div className="border-predict-amount">
                                            <h3 className={params.amount === 10 ? "text-secondary" : "text-primary"}>10</h3>
                                            <h4>$GLMR</h4>
                                        </div>
                                    </button>
                                    <button className={`predict-amount ${params.amount === 50 ? "selected" : ""}`} onClick={() => onSelectAmount(50)}>
                                        <div className="border-predict-amount">
                                            <h3 className={params.amount === 50 ? "text-secondary" : "text-primary"}>50</h3>
                                            <h4>$GLMR</h4>
                                        </div>
                                    </button>
                                    <button className={`predict-amount option-more${(isSelectedMore || amountsMoreValues.includes(params.amount)) ? " selected" : ""}`}
                                        onClick={() => { setIsSelectedMore(!isSelectedMore); setParams({ ...params, amount: 0 }) }} onBlur={() => { setTimeout(() => { setIsSelectedMore(false) }, 150) }}>
                                        <div className="border-predict-amount">
                                            <h3 className={(isSelectedMore || amountsMoreValues.includes(params.amount)) ? "text-secondary" : "text-primary"}>{params.amount >= 100 ? params.amount : "MORE"} <CaretDownOutlined /> </h3>
                                            <h4>$GLMR</h4>
                                        </div>
                                    </button>
                                    {
                                        isSelectedMore && <div className="amount-more-container">
                                            {
                                                AMOUNTS_MORE.map(amount => (
                                                    <button
                                                        key={amount.value}
                                                        className={`predict-amount ${params.amount === amount.value ? "selected" : ""}`}
                                                        onClick={() => { onSelectAmount(amount.value); setIsSelectedMore(false) }}>
                                                        <div className="border-predict-amount">
                                                            <h3 className={params.amount === amount.value ? "text-secondary" : "text-primary"}>{amount.label}</h3>
                                                            <h4>$GLMR</h4>
                                                        </div>
                                                    </button>
                                                ))
                                            }
                                        </div>
                                    }
                                </div>
                            }
                            {
                                (params.amount !== 0 && params.team !== 0) && <Row justify="center">
                                    <h4 className="potential-win">potential win: {roundBalance(estimateReward)} $GLMR</h4>
                                </Row>
                            }
                            <div className={`team-pick-container ${[BATTLE_STATUS.CLAIM_REWARD].includes(battleStatus) ? "winner-bg" : ""}`}>
                                {
                                    [BATTLE_STATUS.CLAIM_REWARD].includes(battleStatus) && <>
                                        <h4 className="text-primary">The winner is {winner?.name}!</h4>
                                        <div className="victory-team">
                                            <img className="team" src={winner?.background} alt="victory-team" />
                                            {/* <img className="aura" src={aura} /> */}
                                            {/* <img className="winner-bg" src={winnerBg} alt="winner-bg" /> */}
                                        </div>
                                    </>
                                }
                                {
                                    [BATTLE_STATUS.RUNNING, BATTLE_STATUS.BET_LOCKED, BATTLE_STATUS.VERIFY].includes(battleStatus) && <>
                                        {/* {
                                            battleStatus === BATTLE_STATUS.RUNNING && <>
                                                <h4 className="text-primary">PICK THE TEAM YOU PREDICT</h4>
                                                <h4 className="text-primary">WILL WIN!</h4>
                                            </>
                                        }
                                        {
                                            [BATTLE_STATUS.BET_LOCKED, BATTLE_STATUS.VERIFY].includes(battleStatus) && <>
                                                <h4 className="text-primary">WHICH TEAM WILL WIN?</h4>
                                            </>
                                        } */}
                                        <h4 className="text-primary">WHICH TEAM WILL WIN?</h4>
                                        <div className="team-picker">
                                            {teamsInfo()}
                                        </div>
                                        <div className="team-progress">
                                            {teamsProgress()}
                                        </div>
                                        <div className="team-progress-number">
                                            {teamsProgressNumber()}
                                        </div>
                                    </>
                                }
                            </div>
                            <Row className="prize-pool-button">
                                {
                                    !user.account && <Button onClick={() => DOMEventServices.publish("openLoginModal")}>
                                        CONNECT WALLET
                                    </Button>
                                }
                                {
                                    user.account && renderButton()
                                }
                            </Row>
                            <Row justify="center" className="warning">
                                {renderWarning(params.amount)}
                            </Row>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    )
}

export default PrizePool
