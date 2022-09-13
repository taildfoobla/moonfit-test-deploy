export const getOrdinalDateMonthFormat = (date) => {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    const dateObj = new Date(date)
    const ordinal = {
        one: 'st',
        two: 'nd',
        few: 'rd',
        other: 'th'
    }[new Intl.PluralRules('en-GB', {type: 'ordinal'}).select(dateObj.getDate())]

    return `${dateObj.getDate()}${ordinal} ${monthNames[dateObj.getMonth()]}`
}