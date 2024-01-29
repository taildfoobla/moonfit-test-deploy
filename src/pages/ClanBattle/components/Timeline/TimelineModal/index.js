import React, { useCallback, useEffect, useState } from "react"
import { Row, Col, Avatar, Image, Spin } from "antd"
import map from "../../../../../assets/images/clan-battle/map.png"
import "../styles.less"
import { classifyActivityType, hoursToDays, meterToKilometer, secondsToHours, secondsToMinutes } from "../../../../../core/utils/helpers/clan-battle"
import moment from "moment"
import ClanBattleService from "../../../../../core/services/clan-battle"
import InfiniteScroll from 'react-infinite-scroller'

const TimelineModal = (props) => {

    const { listTeam, slug, width, isReloadModal, battle } = props
    const [timelines, setTimelines] = useState([])
    const [loading, setLoading] = useState(false)
    const [params, setParams] = useState({
        page: 0,
        limit: 1000
    })
    const [hasMore, setHasMore] = useState(true)
    const startTime = listTeam[0].start_time
    const day = startTime ? moment.duration(moment().diff(moment(startTime))).asHours() < battle.time ? moment().diff(moment(startTime), 'days') + 1 : hoursToDays(battle.time) : 1

    useEffect(() => {
        if (isReloadModal) {
            setHasMore(true)
            fetchActivities()
        } else {
            setTimelines([])
        }
    }, [isReloadModal])

    const fetchActivities = async () => {
        try {
            setLoading(true)
            setParams({ ...params, page: 1 })
            const query = {
                slug,
                page: 1,
                limit: params.limit
            }
            const res = await ClanBattleService.getBattleActivities(query)
            setLoading(false)
            setTimelines(res?.data?.activities)
        } catch (e) {
            console.error(e)
            setLoading(false)
        }
    }

    const fetchMore = useCallback(
        async () => {
            if (loading) {
                return;
            }

            setLoading(true);

            try {
                const newTimeline = [...timelines]
                const newPage = params.page + 1
                setParams({ ...params, page: newPage })
                const query = {
                    slug,
                    page: newPage,
                    limit: params.limit
                }
                const res = await ClanBattleService.getBattleActivities(query)
                if (newPage >= res?.data?.total_page) {
                    setHasMore(false)
                }
                setLoading(false)
                res?.data?.activities.forEach(activity => {
                    newTimeline.push(activity)
                })
                setTimelines(newTimeline)
            } finally {
                setLoading(false);
            }
        },
        [timelines, loading, slug, isReloadModal]
    )

    const generateKey = (pre) => {
        return `${pre}_${new Date().getTime()}`;
    }

    return (
        <InfiniteScroll
            loadMore={fetchMore}
            hasMore={hasMore}
            useWindow={false}
        >
            <div className={`timeline-container modal-timeline`}>
                {
                    timelines.length > 0 && <div className="timeline">
                        <div className="timeline-start">
                            <div className="circle"></div>
                        </div>
                        {
                            timelines.map(timeline => {
                                const { beast, game, user } = timeline?.metadata
                                return <div key={generateKey(timeline.id)} className={`container${timeline.clan_id === listTeam[0].clan_id ? " right" : " left"}`}>
                                    <div className={`date ${timeline.clan_id === listTeam[0].clan_id ? "text-primary" : "text-secondary"}`}>AT {moment(timeline?.created_at).format("lll")}</div>
                                    <div className="dot"></div>
                                    <div className="content">
                                        {
                                            width > 996 && <><Row>
                                                <Col xs={24} xl={timeline?.type === "finish_run" ? 20 : 24}>
                                                    <h2><Avatar size={33} className="timeline-user-image" src={timeline?.User?.avatar} />{`${timeline?.User?.name}${beast?.name ? ` #${beast?.name}` : ""} `}</h2>
                                                    <p>{classifyActivityType(timeline?.type, beast?.level)}</p>
                                                </Col>
                                                {
                                                    timeline?.type === "finish_run" && <Col span={4}>
                                                        <Image className="timeline-thumbnail" src={game && game.thumbnail ? game.thumbnail : map} preview={false} />
                                                    </Col>
                                                }
                                            </Row>
                                                {
                                                    game && <Row style={{ marginTop: "15px" }}>
                                                        <Col span={6}>
                                                            <p className="text-primary">{game?.kcal_burned || "0"}</p>
                                                            <span>kcal</span>
                                                        </Col>
                                                        <Col span={6}>
                                                            <p className="text-primary">{meterToKilometer(game?.distance)}</p>
                                                            <span>km</span>
                                                        </Col>
                                                        <Col span={6}>
                                                            <p className="text-primary">{secondsToMinutes(game?.avg_pace)}</p>
                                                            <span>Avg pace</span>
                                                        </Col>
                                                        <Col span={6}>
                                                            <p className="text-primary">{secondsToHours(game?.times)}</p>
                                                            <span>Time</span>
                                                        </Col>
                                                    </Row>
                                                }

                                            </>
                                        }
                                        {
                                            width <= 996 && <>
                                                <Row>
                                                    <Col xs={24} xl={18}>
                                                        <h2><Avatar className="timeline-user-image" src={timeline?.User?.avatar} />{`${timeline?.User?.name}${beast?.name ? ` #${beast?.name}` : ""} `}</h2>
                                                        <p>{classifyActivityType(timeline?.type, beast?.level)}</p>
                                                    </Col>
                                                </Row>
                                                <Row gutter={16}>
                                                    {
                                                        timeline?.type === "finish_run" && <Col span={6}>
                                                            <Image className="timeline-thumbnail" src={game && game.thumbnail ? game.thumbnail : map} preview={false} />
                                                        </Col>
                                                    }
                                                    {
                                                        game && <Col span={18}>
                                                            <Row>
                                                                <Col span={12}>
                                                                    <p className="text-primary">{game?.kcal_burned || "0"}</p>
                                                                    <span>kcal</span>
                                                                </Col>
                                                                <Col span={12}>
                                                                    <p className="text-primary">{meterToKilometer(game?.distance)}</p>
                                                                    <span>km</span>
                                                                </Col>

                                                            </Row>
                                                            <Row>
                                                                <Col span={12}>
                                                                    <p className="text-primary">{secondsToMinutes(game?.avg_pace)}</p>
                                                                    <span>Avg pace</span>
                                                                </Col>
                                                                <Col span={12}>
                                                                    <p className="text-primary">{secondsToHours(game?.times)}</p>
                                                                    <span>Time</span>
                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                    }
                                                </Row>
                                            </>
                                        }
                                    </div>
                                </div>
                            })
                        }
                        <div className="timeline-current">
                            {loading && <Spin style={{ marginRight: "5px" }} />}
                            <span>Day {day && day < 10 ? `0${day}` : day}</span>
                        </div>
                    </div>
                }

            </div>
        </InfiniteScroll>

    )
}

export default TimelineModal
