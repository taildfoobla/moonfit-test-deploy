import React, {useState, useEffect} from "react"
import "./styles.less"
import {Col, Row} from "antd"
import {useAuth} from "../../core/contexts/auth"
import {getEvents} from "../Home/components/EventsList"
import Event from "../../components/Event"
import Bg from "../../assets/images/planet.png"
import InfiniteScroll from "react-infinite-scroll-component"
import {LoadingOutlined} from "@ant-design/icons"

const loadingIcon = <LoadingOutlined style={{fontSize: 40, color: "#FFF"}} spin />

let _events = []

let storage = localStorage.getItem("_events")
if (storage) {
    try {
        storage = JSON.parse(storage)
        if (Array.isArray(storage) && storage.length > 0 && storage[0].id && storage[0].title) {
            _events = storage.filter((event) => event.event_type.title !== "lucky-wheel")
        }
    } catch (e) {}
}

export default function Explore() {
    const {auth} = useAuth()
    const [events, setEvents] = useState(_events)
    const [totalEvents, setTotalEvents] = useState(_events.length)
    const [hasMore, setHasMore] = useState(true)
    const [skip, setSkip] = useState(9)
    const [limit, setLimit] = useState(4)
    const [fisrtTime,setFisrtTime]=useState(true)
    const isHolder = auth?.user?.appUser?.isHolder
    useEffect(() => {
        async function fetchEvents() {
            try {
                const res = await getEvents({skip: 0, limit: 9})
                const newEvent = [...res?.data?.events]
                localStorage.setItem("_events", JSON.stringify(newEvent))
                const finalEvents = newEvent.filter((event) => event.event_type.title !== "lucky-wheel")
                setEvents(finalEvents)
                setTotalEvents(res?.data?.count)
                // setFisrtTime(true)
            } catch (e) {
                console.error(e)
            }
        }

        fetchEvents()
        // eslint-disable-next-line
    }, [])

    const fetchMoreData = async () => {
            if (events.length < totalEvents - 1) {
                setTimeout(async () => {
                    const res = await getEvents({skip, limit})
                    const newEvent = res?.data?.events
                    setEvents(events.concat(newEvent))
                    setSkip(skip + 4)
                    setFisrtTime(false)
                }, 500)
            } 
            else if(fisrtTime){
                const res = await getEvents({skip, limit})
                const newEvent = res?.data?.events
                setEvents(events.concat(newEvent))
                setSkip(skip + 4)
                setTotalEvents(res?.data?.count)
                setFisrtTime(false)
            }
            else {
                setHasMore(false)
            }
        
   
    }
    return (
        <InfiniteScroll
            dataLength={events.length}
            next={fetchMoreData}
            hasMore={hasMore}
            loader={
                <div
                    style={{
                        position: "relative",
                        fontSize: "60px",
                        margin: 0,
                        top: "230px",
                        display: "flex",
                        justifyContent: "center",
                    }}
                >
                    {loadingIcon}
                </div>
            }
            // scrollableTarget="root"
            className="infinite-scroll"
        >
            <div className="explore-bg">
                <img src={Bg} alt="" />
            </div>
            <div className="mf-container">
                <div className="explore-container">
                    <div className="explore-header">Explore</div>
                    <div className="explore-event-list">
                        <Row
                            gutter={[
                                {xs: 20, sm: 30},
                                {xs: 20, sm: 30},
                            ]}
                            justify="center"
                        >
                            {events.map((event, index) => (
                                <Col lg={8} md={12} sm={12}key={index}>
                                    <Event key={event.id} event={event} isHolder={isHolder} position={index} />
                                </Col>
                            ))}
                        </Row>
                    </div>
                </div>
            </div>
        </InfiniteScroll>
    )
}

