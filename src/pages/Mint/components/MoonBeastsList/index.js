import React, {useEffect, useState} from "react"
import {Pagination} from "antd"
import MoonBeastItem from "../MoonBeastsItem"
import LoadingOutlined from "../LoadingOutlined"
import { range } from "../../../../core/utils-app/array"
import MoonBeastItemMinting from "../MoonBeastsV2/MoonBeastItemMinting"

export default function MoonBeastList({setMoonBeastLoading,moonBeastLoading, isRerender,isMinting,moonBeasts,total}) {
    const [currentPage, setCurrentPage] = useState(1)
    const [list,setList]=useState([])

    useEffect(()=>{
        const newList = moonBeasts.slice(6*(currentPage-1),6*(currentPage))
        setList(newList)
        const delay =setTimeout(()=>{
            setMoonBeastLoading(false)

        },500)
        return ()=>{
            clearTimeout(delay)
        }
    },[currentPage,moonBeasts])

    const _renderLoadMore = () => {
        if (moonBeasts?.length<=6) {
            return null
        }

        const _itemRender = (_, type, originalElement) => {
            if (type === "prev") {
                return <span>Prev</span>
            }

            if (type === "next") {
                return <span>Next</span>
            }

            return originalElement
        }

    
    const onChangePage=(e)=>{
        setCurrentPage(e)
        setMoonBeastLoading(true)
    }

        return (
            <Pagination
                size="small"
                defaultCurrent={1}
                current={currentPage}
                pageSize={6}
                total={moonBeasts?.length}
                hideOnSinglePage={true}
                showSizeChanger={false}
                onChange={onChangePage}
                itemRender={_itemRender}
            />
        )
    }

    const _renderMinting = () => {
       

        return range(1, total).map(i => <MoonBeastItemMinting isMinting={true} key={i} />)
    }
    return (
        <div className={"card-body-row flex flex-col mt-3 minted-nft"}>
            <div className="minted-nft-text flex justify-between cursor-pointer" onClick={() => handleRefresh(true)}>
                <div className={"flex card-body-row-title left"}>Your NFTs</div>
                <div className={"flex card-body-row-title right"}>Total {moonBeasts?.length}</div>
            </div>
            {moonBeastLoading?<LoadingOutlined/>:<>
            <div className={"beast-list-render grid grid-cols-4 lg:grid-cols-6 gap-4"}>
             
             {isRerender&&_renderMinting()}
               {list.map((mb, index) => (
                   <MoonBeastItem moonBeast={mb} key={index} />
               ))}
           </div>{" "}
           {_renderLoadMore()}
            </>}
         
        </div>
    )
}

