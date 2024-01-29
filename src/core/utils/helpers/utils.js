export const pluralize = (count, noun, suffix = "s") => `${noun}${count > 0 ? suffix : ""}`

export const addCommaEachThreeDigits = (number) => Number(number).toLocaleString()