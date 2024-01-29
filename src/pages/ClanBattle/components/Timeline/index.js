import React, { useState } from "react"
import { Row, Col, Avatar, Image, Button } from "antd"
import map from "../../../../assets/images/clan-battle/map.png"
import "./styles.less"
import MFModal from "../../../../components/MFModal"
import { classifyActivityType, hoursToDays, meterToKilometer, secondsToHours, secondsToMinutes } from "../../../../core/utils/helpers/clan-battle"
import moment from "moment"
import TimelineModal from "./TimelineModal"

const Timeline = (props) => {

    const { listTeam, slug, width, timelines, createdAt, battle } = props
    const [openTimeline, setOpenTimeline] = useState(false)
    const [isReloadModal, setIsReloadModal] = useState(false)
    const [isScrollBottom, setIsSrollBottom] = useState(false)
    const startTime = listTeam[0].start_time
    const day = startTime ? moment.duration(moment().diff(moment(startTime))).asHours() < battle.time ? moment().diff(moment(startTime), 'days') + 1 : hoursToDays(battle.time) : 1

    const toggleModal = () => {
        setTimeout(() => {
            setOpenTimeline(!openTimeline)
        }, 0);
        setIsReloadModal(!isReloadModal)
    }

    return (
        <div className="timeline-bg-wrapper">
            {
                timelines?.length > 0 ? <div className={`timeline-container`}>
                    <div className="timeline">
                        <div className="timeline-start">
                            <div className="circle"></div>
                        </div>
                        {
                            timelines.map(timeline => {
                                const { beast, game, user } = timeline?.metadata
                                return <div key={`${timeline.id}_${new Date().getTime()}`} className={`container${timeline.clan_id === listTeam[0].clan_id ? " right" : " left"}`}>
                                    <div className={`date ${timeline.clan_id === listTeam[0].clan_id ? "text-primary" : "text-secondary"}`}>AT {moment(timeline?.created_at).format("lll")}</div>
                                    <div className="dot"></div>
                                    <div className="content">
                                        {
                                            width > 996 && <><Row>
                                                <Col xs={24} xl={timeline?.type === "finish_run" ? 20 : 24}>
                                                    <h2>
                                                        <Avatar size={33} className="timeline-user-image" src={timeline?.User?.avatar} />
                                                        {`${timeline?.User?.name}${beast?.name ? ` #${beast?.name}` : ""} `}
                                                    </h2>
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
                            <span>Day {day && day < 10 ? `0${day}` : day}</span>
                        </div>
                    </div>
                    {
                        <Row className="btn-all-activities" justify="center" onClick={toggleModal}>
                            <Button>VIEW ALL ACTIVITIES</Button>
                        </Row>
                    }
                    <MFModal
                        title={"Battle timeline"}
                        visible={openTimeline}
                        centered={true}
                        width={width > 996 ? 1100 : null}
                        footer={false}
                        className={"modal-timeline-container"}
                        onCancel={toggleModal}
                        setIsSrollBottom={setIsSrollBottom}
                    >
                        <TimelineModal
                            width={width}
                            slug={slug}
                            isScrollBottom={isScrollBottom}
                            listTeam={listTeam}
                            createdAt={createdAt}
                            battle={battle}
                            isReloadModal={isReloadModal} />
                    </MFModal>
                </div> : <div className={`timeline-container`}></div>
            }
        </div>
    )
}

export default Timeline