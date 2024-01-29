import React, { useEffect, useState } from "react"
import { Col, Row } from "antd"
import Event from "../../../../components/Event"
import "./styles.less"
import Container from "../../../../components/Container"
import ApiService from "../../../../core/services/api"
import HightlightEvent from "../../../../components/HightlightEvent"
import { Link } from "react-router-dom"

export const getEvents = ({skip,limit}) => {
    const endpoint = `/manager-event/find-event?skip=${skip}&limit=${limit}`
    if (!window[endpoint]) {
        window[endpoint] =  ApiService.makeEventRequest.get(endpoint)
    }
    return window[endpoint].then(r => {
        delete window[endpoint]

        return r
    })
}

// let _events = []

// let storage = localStorage.getItem('_events')
// if (storage) {
//     try {
//         storage = JSON.parse(storage)
//         if (Array.isArray(storage) && storage.length > 0 && storage[0].id && storage[0].title) {
//             _events = storage
//         }
//     } catch (e) {

//     }
// }

const EventsList = ({_events, auth,setHighlightEvent }) => {
    const [events, setEvents] = useState(_events)
    // eslint-disable-next-line
    const [loading, setLoading] = useState(false)
    const isHolder = auth?.user?.appUser?.isHolder
    useEffect(() => {
        async function fetchEvents() {
            try {
                setLoading(true)
                const res = await getEvents({skip:0,limit:9})
                setLoading(false)
                const newEvent = [...res?.data?.events]
                localStorage.setItem('_events', JSON.stringify(newEvent))
                const finalEvents =newEvent.slice(0,9).filter(event=>event.event_type.title!=="lucky-wheel")
                setEvents(finalEvents)
                setHighlightEvent(newEvent.filter(event=>event.is_highlight))
            } catch (e) {
                console.error(e)
            }
        }

        fetchEvents()
        // eslint-disable-next-line
    }, [])

    // useEffect(()=>{
    //     const result = events.filter(event=>event.is_highlight)
    //     const viewEvents = events.slice(0,9)
    //     const finalEvents= viewEvents.filter(event=>event.event_type.title!=="lucky-wheel")
    //     setHighlightEvent(result)
    //     setHighlightEvents(finalEvents)
    // },[events])

//     useEffect(()=>{
// if(events.length){
//     const dataSaveToLocal = events.map(event=>{
//         return {slug:event?.slug,end:event?.end}
//     })
//     localStorage.setItem("EVENTS_STATUS",JSON.stringify(dataSaveToLocal))
// }
//     },[events])
    return (
        <section className="events">
            <Container>
                {/* <div className="hight-light-event-list">
            <Row
                    gutter={[
                        { xs: 20, sm: 30 },
                        { xs: 20, sm: 30 },
                    ]}
                    justify="center"
                >
                {highlightEvents.map((event,index)=>(
                      <Col xl={12} md={12} sm={24} key={event.id}>
                    <HightlightEvent imgLink={event?.banner_event?.url} slug={event.event_type.title}/>
                  </Col>
                ))}
                 </Row>
                 </div> */}
                <h3   id="campaign" className="events__title" data-aos="slide-up">
                    {auth.isConnected ? "Campaigns" : "Campaigns"}
                </h3>
                <Row
                    gutter={[
                        { xs: 20, sm: 30 },
                        { xs: 20, sm: 30 },
                    ]}
                    justify="center"
                  
                >
                    {events.map((event, index) => (
                        <Col lg={8} md={12} sm={12} key={event.id}>
                            <Event key={event.id} event={event} isHolder={isHolder} position={index} />
                        </Col>
                    ))}
                </Row>
            </Container>
            {events.length>8&&<Link className="view-all" to="/explore">View all</Link>
}
        </section>
    )
}

export default EventsList
