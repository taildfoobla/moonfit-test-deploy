import React from "react"
import Countdown from "react-countdown"

const CountdownComponent = ({ date, completedCallback = null }) => {
    if (!date) {
        return  (<></>)
    }

    const CountdownItem = ({ time, timeTitle }) => {
        const formatZeroNumber = (number) => {
            return number >= 10 ? number : `0${number}`
        }

        return (
            <div className="countdown-item">
                <div className="countdown">
                    <div className="countdown-number">
                        <h3>{formatZeroNumber(time)}</h3>
                    </div>
                </div>
                <div className="countdonw-title">
                    {/* {`${timeTitle}${time > 1 ? "s" : ""}`} */}
                    {`${timeTitle}`}
                </div>
            </div >
        )
    }

    const renderer = ({ days, hours, minutes, seconds, completed }) => {
        if (completed && typeof completedCallback === 'function') {
            setTimeout(completedCallback, 350)
        }

        return (
            <>
                <CountdownItem time={days} timeTitle={"DAY"} />
                <CountdownItem time={hours} timeTitle={"HR"} />
                <CountdownItem time={minutes} timeTitle={"MIN"} />
                <CountdownItem time={seconds} timeTitle={"SEC"} />
            </>
        )
    }
    return (
        <Countdown date={date} renderer={renderer} />
    )
}

export default CountdownComponent
