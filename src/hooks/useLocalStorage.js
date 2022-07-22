import {useEffect, useState} from 'react'

export const useLocalStorage = (key, initialValue = '') => {
    const [storedValue, setStoredValue] = useState(initialValue)

    useEffect(() => {
        const item = typeof window !== 'undefined' ? window.localStorage.getItem(key) : false

        if (item) {
            try {
                setStoredValue(JSON.parse(item))
            } catch (e) {
                setStoredValue(initialValue)
            }
        }
    }, [initialValue, key, setStoredValue])

    const setValue = (value) => {
        setStoredValue(value)
        window.localStorage.setItem(key, JSON.stringify(value))
    }

    return [storedValue, setValue]
}
