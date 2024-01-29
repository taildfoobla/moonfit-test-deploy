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
                        onChangePage = () => null,
                        handleRefresh = () => null,
                        isExpired = false,
                        isLoading = true,
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
                size="small"
                defaultCurrent={1}
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
        <div className={'card-body-row flex flex-col mt-3 minted-nft'}>
            <div className="minted-nft-text flex justify-between cursor-pointer" onClick={() => handleRefresh(true)}>
                <div className={'flex card-body-row-title left'}>
                    Your minted NFTs
                </div>
                <div className={'flex card-body-row-title right'}>Total {total}
                </div>
            </div>
            <MoonBeastList moonBeasts={moonBeasts} moonBeastMinting={moonBeastMinting} isExpired={isExpired} isLoading={isLoading} />
            {_renderLoadMore()}
        </div>
    )
}

export default MoonBeasts