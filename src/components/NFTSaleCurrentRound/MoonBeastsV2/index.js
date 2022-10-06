import React, {useEffect, useState} from 'react'

import MoonBeasts from './MoonBeasts';
import LoadingOutlined from "../../shared/LoadingOutlined";

const MoonBeastsV2 = ({moonBeasts, isLoading, moonBeastMinting = 0}) => {
    const [data, setData] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [isFetchData, setIsFetchData] = useState(false)

    const itemInRow = 3
    const pageSize = itemInRow * 2

    useEffect(() => {
        init()
    })

    useEffect(() => {
        addItemWithMinting()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [moonBeastMinting])

    const init = () => {
        if (data.length) {
            return
        }

        if (moonBeasts.length <= 9) {
            setData(moonBeasts)
        } else {
            setData(moonBeasts.slice(0, pageSize))
        }
    }

    const addItemWithMinting = () => {
        let _data = [...data]

        while (_data.length < moonBeasts.length && (_data.length + moonBeastMinting) % itemInRow !== 0) {
            _data = _data.concat(moonBeasts.slice(_data.length, _data.length + 1))
        }

        setData(_data)
    }

    const onChangePage = (page, pageSize) => {
        if (page === currentPage) {
            return
        }

        let from = (page - 1) * pageSize - moonBeastMinting
        const to = from + pageSize
        from = from < 0 ? 0 : from

        setData(moonBeasts.slice(from, to))
        setCurrentPage(page)

        setTimeout(() => {
            setIsFetchData(false)
        }, 500)
    }

    const _render = () => <MoonBeasts moonBeasts={data}
                                      moonBeastMinting={moonBeastMinting}
                                      hasPagination={data.length < moonBeasts.length}
                                      onChangePage={onChangePage}
                                      total={moonBeasts.length}
                                      currentPage={currentPage}
                                      pageSize={pageSize}
    />

    if (isLoading || isFetchData) {
        return <LoadingOutlined>
            {_render()}
        </LoadingOutlined>
    }

    return _render()
}

export default MoonBeastsV2
