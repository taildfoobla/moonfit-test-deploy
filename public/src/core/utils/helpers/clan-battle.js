export const classifyActivityType = (type, level = 0) => {
    let description = ""
    switch (type) {
        case "start_run":
            description = "has start his/her training"
            break
        case "start_upgrade":
            description = `has start evolving to level ${level}`
            break
        case "finish_upgrade":
            description = `has evolved to level ${level}. Hoooray!`
            break
        case "finish_run":
            description = "has finished his/her running"
            break
        default: break
    }
    return description
}

export const secondsToMinutesNumber = (time) => {
    return time ? Math.floor(time / 60) : 0
}

export const secondsToMinutes = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time - minutes * 60;
    return time ? `${minutes}'${seconds}''` : "0'00''"
}

export const secondsToHours = (time) => {
    const r = time % 3600
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor(r / 60);
    const seconds = r % 60;
    return time ? `${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}` : `00:00:00`
}

export const meterToKilometer = (distance) => {
    return distance ? (distance / 1000).toFixed(2) : `0`
}

export const hoursToDays = (hours) => {
    const hoursPerDay = 24
    return Math.ceil(hours / hoursPerDay)
}