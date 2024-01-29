import React from 'react'
import Countdown from "react-countdown"
import { formatZeroNumber } from "../../../core/utils-app/number"

export const CountdownComponent = ({ date, glow, completedCallback = null }) => {

    const renderCountdownItem = (time, timeTitle) => {
        return (
            <div className={'countdown-item'}>
                <div className={`countdown race-sport-font secondary-color${glow ? " countdown-glow" : ""}`}>
                    <div className="countdown-number">
                        {formatZeroNumber(time)}
                    </div>
                </div>
                <div className={'text-center normal-case text-sm text-white'}>
                    {`${timeTitle}${time > 1 ? 's' : ''}`}
                </div>
            </div>
        )
    }

    const renderer = ({ days, hours, minutes, seconds, completed }) => {
        if (completed && typeof completedCallback === 'function') {
            setTimeout(completedCallback, 350)
        }

        return (
            <div className={'grid grid-cols-4 gap-3 items-center countdown-container text-lg'}>
                {renderCountdownItem(days, 'day')}
                {renderCountdownItem(hours, 'hour')}
                {renderCountdownItem(minutes, 'minute')}
                {renderCountdownItem(seconds, 'second')}
            </div>
        )
    }
    return (
        <Countdown date={date} renderer={renderer} />
    )
}
