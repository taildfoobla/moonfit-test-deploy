import React, { useEffect, useState } from "react"
import { Row, Button, Table } from "antd"
import Jdenticon from '../../../../components/Jdenticon';
import mintpass from "../../../../assets/images/clan-battle/mintpass.png"
import { format } from "timeago.js";
import { getAddressScanUrl, formatAddress } from "../../../../core/utils/helpers/blockchain";
import MFPagination from "../../../../components/MFPagination";

const DepositeList = (props) => {

    const { user, transactions } = props
    const getClanInfo = (clanId) => {
        if (!props.clansBattle || !props.clansBattle[clanId]) {
            return {}
        }

        const item = props.clansBattle[clanId]

        return {
            clan_id: '',
            logo: '',
            name: '',
            ...item
        }
    }

    return (
        <>
            {
                <>
                    {/* <h3 className="text-primary m-0">Your Deposits (total: {user.deposit} $GLMR)</h3> */}
                    {user.deposit !== 0 && <h3 className="text-primary m-0">Your Deposits: {user.deposit} $GLMR</h3>}
                    {
                        transactions.length > 0 && transactions.map(transaction => {
                            const clan = getClanInfo(transaction.clanId)
                            return (<>
                                <div key={transaction.id} className="deposite-box"  >
                                    <Row justify="space-between">
                                        <div className="d-flex">
                                            <Jdenticon size="30" value={transaction.address} />
                                            {/* <a href={buildTransitionLink(transaction?.address)} target="_blank" >{formatAddress(transaction?.address)}</a> */}
                                            <span style={{ marginLeft: "5px" }}>{formatAddress(transaction?.address)}</span>
                                        </div>

                                        <span>{format(transaction.date)}</span>
                                    </Row>
                                    <Row justify="space-between">
                                        <span>DEPOSITED</span>
                                        <h4 style={{ color: "#F0489F", fontSize: "16px" }}><img className="mintpass-img" src={mintpass} />{transaction.balance}</h4>
                                    </Row>
                                    <Row justify="space-between">
                                        <span>TEAM</span>
                                        <img src={clan.logo} style={{ width: "30px", height: "20px", borderRadius: "3px" }} />
                                    </Row>
                                    <Row justify="space-between">
                                        <span className="unrelized">UNRELIZED P/L</span>
                                        <h4 style={{ fontSize: "16px" }} className={`${(transaction.reward && transaction.reward < 0) ? "text-secondary" : "text-green"}`}>{transaction.reward ? (transaction.reward > 0 ? `+${transaction.reward}` : transaction.reward) : 'N/A'}</h4>
                                    </Row>
                                    {/* <Row> <Button disabled={true}>CLAIM</Button></Row> */}
                                </div>
                            </>
                            )
                        })
                    }
                </>

            }
        </>

    )
}

const DepositTable = (props) => {
    const { user, transactions } = props
    const columns = [
        {
            title: "ACCOUNT",
            dataIndex: "address",
            key: "id",
            render: (address) => <span className="txt-nowrap d-flex align-items-center">
                <div className="jden-icon">
                    <Jdenticon size="30" value={address} />
                </div>
                <a className="color-grey" href={buildTransitionLink(address)} target="_blank" style={{ marginLeft: "5px" }}>{formatAddress(address)}</a>
            </span>,
        },
        {
            title: "DEPOSITED",
            dataIndex: "balance",
            key: "id",
            render: (balance) => {
                return (
                    <div className="d-flex align-items-center">
                        <img className="mintpass-img" src={mintpass} />
                        <span className="font-race-sport" style={{ color: "#F0489F" }}>{balance}</span>
                    </div>
                )
            }
        },
        {
            title: "TEAM",
            dataIndex: "clanId",
            key: "id",
            render: (clanId) => {
                const clan = getClanInfo(clanId)

                return <div className="d-flex align-items-center txt-nowrap">
                    <img src={clan.logo} alt="Logo" style={{ width: "30px", height: "20px", marginRight: "3px", borderRadius: "3px" }} />
                    {/* <span style={{paddingBottom: "5px"}}>{clan.name || ''}</span> */}
                </div>
            }
        },
        {
            title: "UNDERLIZED P/L",
            dataIndex: "reward",
            key: "id",
            render: (reward) => <span className={`font-race-sport ${reward < 0 ? "text-secondary" : "text-green"}`}>
                {reward ? (reward > 0 ? `+${reward}` : reward) : 'N/A'}
            </span>
        },
        {
            title: "TIME",
            dataIndex: "createdAt",
            key: "id",
            render: (date) => <span className="txt-nowrap" style={{ textAlign: "right" }}>{format(date)}</span>
        }
    ];

    const buildTransitionLink = (address) => {
        return getAddressScanUrl(address, { to: props.contract.address })
    }

    const getClanInfo = (clanId) => {
        if (!props.clansBattle || !props.clansBattle[clanId]) {
            return {}
        }

        const item = props.clansBattle[clanId]

        return {
            clan_id: '',
            logo: '',
            name: '',
            ...item
        }
    }

    return (
        <>
            {
                transactions.length > 0 && <Row className="deposit-container">
                    <h3 className="text-primary m-0">Your Deposits: {user.deposit} $GLMR</h3>
                    <Table
                        columns={columns}
                        dataSource={transactions}
                        pagination={false}
                        bordered={false}
                    />
                </Row>
            }
        </>

    )
}

export default (props) => {
    const { width, contract, user, clansBattle, prizePool, victoryTeam, battleUser, refreshTransaction } = props
    const pageSize = 10
    const [transactions, setTransactions] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [totalTransactions, setTotalTransactions] = useState(0)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        init().then()
        return () => null
    }, [props.battleUser, refreshTransaction])

    const init = async () => {
        if (!props?.contract || !props?.battleUser?.deposit) {
            return null
        }

        await getTransactions(1)
    }

    const getTransactions = async (page) => {
        setIsLoading(true)
        setCurrentPage(page)

        let _transactions

        if (page === 1 || !totalTransactions) {
            _transactions = await contract.getLastTransactionsByUser(user.account, pageSize)
            if (_transactions.length) {
                setTotalTransactions(_transactions[0].id)
            }
        } else {
            const lastCursor = totalTransactions - (page - 1) * pageSize
            // console.log({ lastCursor, totalTransactions });
            _transactions = await contract.getTransactionsByUser(user.account, lastCursor, pageSize)
        }

        setTransactions(_transactions.map(tx => {
            let reward

            if (victoryTeam) {
                if (tx.clanId === victoryTeam) {
                    // console.log(clansBattle[victoryTeam], tx, '----');
                    reward = contract.estimateReward(prizePool, clansBattle[victoryTeam].balance, tx.balance, {
                        deposited: true,
                        unit: 'ether'
                    })

                    reward = contract.roundBalance(reward)
                } else {
                    reward = 0 - tx.balance
                }
            }

            return {
                ...tx,
                reward,
                key: tx.id
            }
        }))

        // setIsLoading(false)
        // TODO
        setTimeout(() => {
            setIsLoading(false)
        }, 300)
    }

    if (!battleUser) {
        return null
    }

    const onChangePage = (page) => {
        return getTransactions(page)
    }

    const renderData = () => {
        if (width > 768) {
            return <DepositTable user={battleUser} transactions={transactions} clansBattle={clansBattle} contract={contract} victoryTeam={victoryTeam} />
        }

        return <DepositeList user={battleUser} transactions={transactions} clansBattle={clansBattle} victoryTeam={victoryTeam} />
    }

    return (
        <>
            {renderData()}

            <Row justify="center" style={{ marginBottom: '15px' }}>
                <MFPagination currentPage={currentPage} pageSize={pageSize} total={totalTransactions}
                    onChange={onChangePage} />
            </Row>
        </>
    )

}
