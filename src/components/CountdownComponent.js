import React from 'react'
import Countdown from "react-countdown"
import {formatZeroNumber} from "../utils/number"

export const CountdownComponent = ({date, completedMessage = 'You are good to go!', completedCallback = null}) => {

    const renderCountdownItem = (time, timeTitle) => {
        return (
            <div className={'countdown-item'}>
                <div className={'countdown race-sport-font secondary-color'}>{formatZeroNumber(time)}</div>
                <div className={'text-center normal-case text-sm text-white'}>
                    {`${timeTitle}${time > 1 ? 's' : ''}`}
                </div>
            </div>
        )
    }

    const renderer = ({days, hours, minutes, seconds, completed}) => {
        if (completed) {
            if (completedCallback) {
                setTimeout(() => {
                    completedCallback()
                }, 1000)
            }
            return <span className={'text-white text-xl'}>{completedMessage}</span>
        } else {
            return (
                <div className={'grid grid-cols-2 md:grid-cols-4 gap-3 items-center countdown-container text-lg'}>
                    {renderCountdownItem(days, 'day')}
                    {renderCountdownItem(hours, 'hour')}
                    {renderCountdownItem(minutes, 'minute')}
                    {renderCountdownItem(seconds, 'second')}
                </div>
            )
        }
    }
    return (
        <Countdown date={date}
                   renderer={renderer}
                   // zeroPadTime={2}
                   // zeroPadDays={2}
        />
    )
}