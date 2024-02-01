import React, { useEffect, useState } from "react"
import Countdown from "react-countdown"
import "./styles.less"
import { getLocalStorage } from "../../core/utils/helpers/storage"

const MFCountdown = ({className, date, completedCallback = null, hasTitle = false, isExpired}) => {

  

  
    if (!date) {
        return <></>
    }

    const CountdownItem = ({time, timeTitle}) => {
        const formatZeroNumber = (number) => {
            return number >= 10 ? number : `0${number}`
        }

        return (
            <div className={`countdown-item ${className}`}>
                <div className="countdown">
                    <div className="countdown-number">
                        {/* <span>{formatZeroNumber(time)}</span> */}
                        {formatZeroNumber(time)}
                    </div>
                </div>
                {hasTitle && timeTitle && (
                    <div className="countdown-title">
                        {/* {`${timeTitle}${time > 1 ? "s" : ""}`} */}
                        {`${timeTitle}`}
                    </div>
                )}
            </div>
        )
    }

    const renderer = ({days, hours, minutes, seconds, completed}) => {
        if (completed && typeof completedCallback === "function") {
            setTimeout(completedCallback, 350)
        }

        return (
            <>
                {/* <CountdownItem time={days} timeTitle={""} /> */}
                {isExpired ? (
                    <>
                        {" "}
                        <CountdownItem time={0}timeTitle={"Hours"} />
                        <CountdownItem time={0} timeTitle={"Minutes"} />
                        <CountdownItem time={0} timeTitle={"Seconds"} />
                    </>
                ) : (
                    <>
                        {" "}
                        <CountdownItem time={hours} timeTitle={"Hours"} />
                        <CountdownItem time={minutes} timeTitle={"Minutes"} />
                        <CountdownItem time={seconds} timeTitle={"Seconds"} />
                    </>
                )}
            </>
        )
    }

    return <Countdown date={date} precision={3} intervalDelay={1000} renderer={renderer} />
}

export default MFCountdown

