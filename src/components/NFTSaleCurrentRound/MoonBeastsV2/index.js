import React, {useEffect, useState} from 'react'

import MoonBeasts from './MoonBeasts';
import LoadingOutlined from "../../shared/LoadingOutlined";
import EventBus from '../../../utils/event-bus'

const MoonBeastsV2 = ({moonBeasts, isLoading, moonBeastMinting = 0, handleRefresh = () => {}, isExpired = false}) => {
    const [data, setData] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [isFetchData, setIsFetchData] = useState(false)

    const itemInRow = 3
    const pageSize = itemInRow * 2

    useEffect(() => {
        init()
        EventBus.$on('buyNFT', () => {
            console.log('$on buyNFT')
            setCurrentPage(1)
            init(true)
        })
    })

    useEffect(() => {
        setCurrentPage(1)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [moonBeasts, moonBeastMinting])

    const _getData = () => {
        let from = (currentPage - 1) * pageSize - moonBeastMinting
        const to = from + pageSize
        from = from < 0 ? 0 : from

        return moonBeasts.slice(from, to)
    }

    const init = () => {
        const _newData = moonBeasts.length <= pageSize ? moonBeasts : _getData()
        const updated = JSON.stringify(_newData) !== JSON.stringify(data)

        if (updated) {
            setData(_newData)
        }
    }

    const onChangePage = (page) => {
        if (page === currentPage) {
            return
        }

        setData(_getData)
        setCurrentPage(page)

        setTimeout(() => {
            setIsFetchData(false)
        }, 500)
    }

    const _render = () => <MoonBeasts moonBeasts={data}
                                      moonBeastMinting={moonBeastMinting}
                                      hasPagination={data.length < moonBeasts.length}
                                      onChangePage={onChangePage}
                                      handleRefresh={handleRefresh}
                                      total={moonBeasts.length}
                                      currentPage={currentPage}
                                      pageSize={pageSize}
                                      isLoading={isLoading}
                                      isExpired={isExpired}
    />

    if (isLoading || isFetchData) {
        return <LoadingOutlined>
            {_render()}
        </LoadingOutlined>
    }

    return _render()
}

export default MoonBeastsV2
