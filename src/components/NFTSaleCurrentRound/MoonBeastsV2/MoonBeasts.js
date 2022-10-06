import React from 'react'
import {Pagination} from 'antd';
import MoonBeastList from './MoonBeastList';

const MoonBeasts = ({
                        moonBeasts,
                        moonBeastMinting = 0,
                        hasPagination = false,
                        total = 0,
                        pageSize = 6,
                        currentPage = 1,
                        onChangePage = () => null
                    }) => {

    const _itemRender = (_, type, originalElement) => {
        if (type === 'prev') {
            return <span>Prev</span>;
        }

        if (type === 'next') {
            return <span>Next</span>;
        }

        return originalElement;
    };


    const _renderLoadMore = () => {
        if (!hasPagination) {
            return null
        }

        return (
            <Pagination
                defaultCurrent={currentPage}
                current={currentPage}
                pageSize={pageSize}
                total={total}
                hideOnSinglePage={true}
                showSizeChanger={false}
                onChange={onChangePage}
                itemRender={_itemRender}
            />
        )
    }

    return (
        <div className={'card-body-row flex flex-col mt-3'}>
            <div className="flex justify-between">
                <div className={'flex card-body-row-title'}>
                    Your NFTs
                </div>
                <div className={'flex card-body-row-title'}>Total {total}
                </div>
            </div>
            <MoonBeastList moonBeasts={moonBeasts} moonBeastMinting={moonBeastMinting}/>
            {_renderLoadMore()}
        </div>
    )
}

export default MoonBeasts
