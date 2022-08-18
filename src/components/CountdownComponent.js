import React from 'react'
import Countdown from "react-countdown"
import {formatZeroNumber} from "../utils/number"

export const CountdownComponent = ({date, completedMessage = 'You are good to go!', completedCallback = null}) => {

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
                <div className={'flex countdown-container text-lg'}>
                    <div className={'countdown countdown-date race-sport-font secondary-color'}>{formatZeroNumber(days)}</div>
                    <div className={'countdown countdown-hour race-sport-font secondary-color'}>{formatZeroNumber(hours)}</div>
                    <div className={'countdown countdown-minute race-sport-font secondary-color'}>{formatZeroNumber(minutes)}</div>
                    <div className={'countdown countdown-second race-sport-font secondary-color'}>{formatZeroNumber(seconds)}</div>
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