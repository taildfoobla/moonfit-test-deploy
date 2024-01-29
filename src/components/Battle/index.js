import React from "react"
import { Image } from "antd"
import { useNavigate } from "react-router-dom"
import "./styles.less"
import wcBanner from "../../assets/wc-2022.jpg"

const Battle = ({ battle }) => {
    const navigate = useNavigate()
    const { name, description, banner, slug, status } = battle

    const onNavigateBattle = (status, slug) => {
        // if (status === "upcoming") {
        //     message.error({
        //         content: "Coming soon",
        //         className: "message-error",
        //         duration: 3
        //     })
        // } else {
        navigate(`/clan-battle/${slug}`)
        // }
    }

    return (
        <a onClick={() => onNavigateBattle(status, slug)}>
            <div className="event battle-event" data-aos="slide-up" data-aos-delay={0}>
                <div className="event__images">
                    <Image src={banner} preview={false} fallback={wcBanner} className="event__image" alt="event" height={185} />
                    {/* <div className={`event__status ${status}`}>{status}</div> */}
                </div>
                <div className="event__content">
                    <h4 className="event__title">{name}</h4>
                    <div className="event__description">{description}</div>
                </div>
            </div>
        </a>
    )
}

export default Battle
