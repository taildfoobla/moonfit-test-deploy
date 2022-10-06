import React, {useEffect, useState, useRef} from 'react'

const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;


const RandomNumber = ({min = 2, max =  50, className}) => {
    const [value, setValue] = useState(random(min, max))
    const setValueRef = useRef(0)


    const clearMpInterval = () => setValueRef.current && clearInterval(setValueRef.current)

    useEffect(() => {
        setValueRef.current = setInterval(() => {
            // setValue(value >= max ? min : (value + 1))
            setValue(random(min, max))
        }, 10)

        return clearMpInterval
    })

    return (
        <span className={className}>{value}</span>
    )
}

export default RandomNumber
