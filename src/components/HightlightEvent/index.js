import React from "react"
import {Link} from "react-router-dom"
import "./styles.less"

export default function HightlightEvent({imgLink, slug}) {
    return (
        <div className="hightlight-event-container">
            {slug === "lucky-wheel" ? (
                <Link className="hightlight-event-bg" to={`/${slug}`}>
                    <img src={imgLink} alt="" />
                    <div className="hightlight-event-type">HOT</div>
                </Link>
            ) : (
                <Link className="hightlight-event-bg" to={`/special-event/${slug}`}>
                    <img src={imgLink} alt="" />
                    <div className="hightlight-event-type">HOT</div>
                </Link>
            )}
        </div>
    )
}

