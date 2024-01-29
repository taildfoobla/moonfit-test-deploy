import React, { useEffect, useState } from "react"
import { Row, Col, Table, Button } from "antd"
import "./styles.less"
import MFPagination from "../../../../components/MFPagination"
import { format } from 'timeago.js';
import spin from "../../../../assets/images/icons/spin.svg"
import mintpass from "../../../../assets/images/clan-battle/mintpass.png"
import { getAddressScanUrl, formatAddress } from "../../../../core/utils/helpers/blockchain";
import Jdenticon from "../../../../components/Jdenticon"
import { ReactComponent as IconTelegram } from "@svgPath/telegram.svg"
import { ReactComponent as IconInstagram } from "@svgPath/instagram.svg"
import { ReactComponent as IconTwitter } from "@svgPath/twitter.svg"
import { ReactComponent as IconDiscord } from "@svgPath/discord.svg"
import { ReactComponent as IconMedium } from "@svgPath/medium.svg"
import { ReactComponent as IconEnvelope } from "@svgPath/envelope.svg"
import { ReactComponent as IconCloudDownload } from "@svgPath/cloud-download.svg"
import ConfigUrl from "@configPath/site-urls"

const TransactionHistory = (props) => {
    const pageSize = 6
    const [transactions, setTransactions] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [totalTransactions, setTotalTransactions] = useState(0)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        init()

        return () => null
    }, [props.contract])

    const init = () => {
        if (!props.contract) {
            return null
        }
        getTransactions(1).then()
    }

    const getTransactions = async (page) => {
        const start = Date.now()
        setIsLoading(true)
        setCurrentPage(page)

        let _transactions

        if (page === 1 || !totalTransactions) {
            _transactions = await props.contract.lastTransactions(pageSize)
            if (_transactions.length) {
                setTotalTransactions(_transactions[0].id + 1)
            }
        } else {
            const lastCursor = totalTransactions - (page - 1) * pageSize
            // console.log({lastCursor, totalTransactions})
            _transactions = await props.contract.transactions(lastCursor, pageSize)
        }

        // console.log(_transactions);
        setTransactions(_transactions.map(tx => ({ ...tx, key: tx.id })))

        const time = Date.now() - start - 350

        setTimeout(() => {
            setIsLoading(false)
        }, time > 0 ? 0 : -time)
    }

    const onChangePage = (page) => {
        return getTransactions(page)
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

    const buildTransitionLink = (address) => {
        return getAddressScanUrl(address, { to: props.contract.address })
    }

    const onRefresh = () => {
        init()
        props.setRefreshTransaction(true)
    }

    const columns = [
        {
            title: "ACCOUNT",
            dataIndex: "address",
            key: "id",
            render: (address) => <span className="txt-nowrap d-flex align-items-center">
                <div className="jden-icon">
                    <Jdenticon size="30" value={address} />
                </div>
                <a className="color-grey" href={buildTransitionLink(address)} target="_blank">{formatAddress(address)}</a>
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
                        <h4 className="m-0" style={{ color: "#F0489F" }}>{balance}</h4>
                    </div>
                )
            }
        },
        {
            title: "THE TEAM",
            dataIndex: "clanId",
            key: "id",
            render: (clanId) => {
                const clan = getClanInfo(clanId)

                return <div className="txt-nowrap d-flex align-items-center team-column">
                    <img src={clan.logo} alt="Logo" style={{ width: "30px", height: "20px", marginRight: "5px", borderRadius: "3px" }} />
                    <span style={{paddingBottom: "5px"}}>{clan.name || ''}</span>
                </div>
            }
        },
        {
            title: "TIME",
            dataIndex: "createdAt",
            key: "id",
            render: (date) => <span className="txt-nowrap">{format(date)}</span>
        }
    ];

    const _render = (
        <div className="transaction-bg-wrapper">
            <div className="transaction-container">
                <Row justify="center">
                    <h2 className="text-primary">Latest Transactions</h2>
                </Row>
                <Row className="section-refresh" justify="center">
                    <Button className="btn-refresh" onClick={onRefresh}>
                        <img className="loader" src={spin} />
                        REFRESH
                    </Button>
                </Row>
                <Row justify="center">
                    <Col className="transaction-table-container" xs={24} xl={11}>
                        <Table
                            className="transaction-table"
                            columns={columns}
                            dataSource={transactions}
                            pagination={false}
                            bordered={false}
                            loading={isLoading}
                        />
                        <Row justify="center">
                            <MFPagination currentPage={currentPage} pageSize={pageSize} total={totalTransactions}
                                onChange={onChangePage} />
                        </Row>
                    </Col>
                </Row>
            </div>
            <div className="footer-battle">
                <Row justify="center">
                    <Col>
                        <div className="footer__socials">
                            <Row justify="center" gutter={{ xs: 14, sm: 20 }}>
                                <Col>
                                    <a href="https://t.me/moonfit_official" target="_blank" className="footer__social" data-aos="zoom-in" data-aos-duration="600">
                                        <IconTelegram className="footer__social-icon" />
                                    </a>
                                </Col>
                                <Col>
                                    <a href="https://www.instagram.com/moonfit_official" target="_blank" className="footer__social" data-aos="zoom-in" data-aos-duration="600" data-aos-delay={100}>
                                        <IconInstagram className="footer__social-icon" />
                                    </a>
                                </Col>
                                <Col>
                                    <a href="https://twitter.com/MoonFitOfficial" target="_blank" className="footer__social" data-aos="zoom-in" data-aos-duration="600" data-aos-delay={200}>
                                        <IconTwitter className="footer__social-icon" />
                                    </a>
                                </Col>
                                <Col>
                                    <a href="https://discord.com/invite/hStdUVtHXp" target="_blank" className="footer__social" data-aos="zoom-in" data-aos-duration="600" data-aos-delay={300}>
                                        <IconDiscord className="footer__social-icon" />
                                    </a>
                                </Col>
                                <Col>
                                    <a href="https://medium.com/@moonfit" target="_blank" className="footer__social" data-aos="zoom-in" data-aos-duration="600" data-aos-delay={400}>
                                        <IconMedium className="footer__social-icon" />
                                    </a>
                                </Col>
                            </Row>
                        </div>
                        <div className="footer__contact">
                            <Row justify="center" gutter={{ xs: 20, sm: 54 }}>
                                <Col>
                                    <div data-aos="fade-up" data-aos-offset="10">
                                        <IconEnvelope />
                                        <a href={`mailto:${ConfigUrl.mailContact}`} className="h-link footer__contactLink">
                                            hi@moonfit.xyz
                                        </a>
                                    </div>
                                </Col>
                                <Col>
                                    <div data-aos="fade-up" data-aos-offset="10">
                                        <IconCloudDownload />
                                        <a href={ConfigUrl.mediaKit} target="_blank" className="h-link footer__contactLink">
                                            Download media kit
                                        </a>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                        <div className="footer__copyright">Copyright © 2023 by MoonFit - All rights reserved</div>
                    </Col>
                </Row>
            </div>
        </div>
    )

    return _render
}

export default TransactionHistory
