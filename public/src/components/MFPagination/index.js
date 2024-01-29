import { Pagination } from "antd"
import React from "react"
import "./styles.less"

const MFPagination = (props) => {

    const { currentPage, pageSize, total, onChange } = props

    const _itemRender = (_, type, originalElement) => {
        if (type === 'prev') {
            return <span>&#8249; Prev</span>;
        }

        if (type === 'next') {
            return <span>Next &#8250;</span>;
        }

        return originalElement;
    };

    const handleClick = (e, v) => {

    }

    return (
        <Pagination
            defaultCurrent={1}
            total={total}
            current={currentPage}
            pageSize={pageSize}
            showSizeChanger={false}
            hideOnSinglePage
            onChange={onChange}
            itemRender={_itemRender}
        />
    )

}

export default MFPagination
