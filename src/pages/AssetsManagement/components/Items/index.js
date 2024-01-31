import React from "react"
import "./styles.less"
import moonItemImg from "../../../../assets/images/assets-management/items/moon-item-img.png"
import moonItemTag from "../../../../assets/images/assets-management/items/moon-item-tag.png"
import AssetsManagementCard from "../share/Wrapper"
import {Row, Col} from "antd"
import NoData from "../share/NoData"
import iconPositon1 from "../../../../assets/images/assets-management/items/position_1.png"
import iconPositon2 from "../../../../assets/images/assets-management/items/position_2.png"
import iconPositon3 from "../../../../assets/images/assets-management/items/position_3.png"
import iconPositon4 from "../../../../assets/images/assets-management/items/position_4.png"
import Loading from "../../../Mint/components/LoadingOutlined"

export default function ItemManagement({isLoading, moonItems}) {
    const itemsData = [
        {
            type: "Legendary",
            name: "MoonItem",
            number: "#143526",
            picture: moonItemImg,
        },
        {
            type: "Legendary",
            name: "MoonItem",
            number: "#143526",
            picture: moonItemImg,
        },
        {
            type: "Legendary",
            name: "MoonItem",
            number: "#143526",
            picture: moonItemImg,
        },
        {
            type: "Legendary",
            name: "MoonItem",
            number: "#143526",
            picture: moonItemImg,
        },
        {
            type: "Legendary",
            name: "MoonItem",
            number: "#143526",
            picture: moonItemImg,
        },
        {
            type: "Legendary",
            name: "MoonItem",
            number: "#143526",
            picture: moonItemImg,
        },
        {
            type: "Legendary",
            name: "MoonItem",
            number: "#143526",
            picture: moonItemImg,
        },
        {
            type: "Legendary",
            name: "MoonItem",
            number: "#143526",
            picture: moonItemImg,
        },
    ]

    const renderPositionIcon = (position) => {
        switch (position) {
            case "position_1":
                return <img src={iconPositon1} alt={position} />
            case "position_2":
                return <img src={iconPositon2} alt={position} />
            case "position_3":
                return <img src={iconPositon3} alt={position} />
            case "position_4":
                return <img src={iconPositon4} alt={position} />
            default:
                return <img src={iconPositon1} alt={position} />
        }
    }

    const renderClassName = (name)=>{
       switch(name){
        case "Uncommon":
            return "uncommon"
        case "Common":
            return "common"
        case "Rare":
            return "rare"
        case "Mythical":
            return "mythical"
        case "Legendary":
            return "legendary"
       }
    }

    const handleDisplayScrollbar = (e) => {
        let timeOut
        clearTimeout(timeOut)
        e.target.classList.add("display-scrollbar")
        timeOut = setTimeout(() => {
            e.target.classList.remove("display-scrollbar")
        }, 1000)
    }


    return (
        <AssetsManagementCard childClassName="items-management">
            <h3>MoonItems</h3>

            {isLoading ? (
                <div className="loading">
                    <Loading />
                </div>
            ) : moonItems && moonItems?.length > 0 ? (
                <Row
                    gutter={[30, 30]}
                    className="moon-item-list"
                    onScroll={(e) => {
                        handleDisplayScrollbar(e)
                    }}
                >
                    {moonItems?.map((item, index) => (
                        <Col xs={12} key={index}>
                            <div className="moon-item">
                                <div className="tag-type">
                                    {renderPositionIcon(item?.position)}
                                    <span className={`type ${renderClassName(item?.ItemRarity?.name)}`}>
                                        {item.ItemRarity?.name}
                                    </span>
                                </div>
                                <img className="big-picture" src={item.image_url} alt="MoonItem" />
                                <p className="name">MoonItem</p>
                                <p className="number">#{item.name}</p>
                            </div>
                        </Col>
                    ))}
                </Row>
            ) : (
                <NoData type="MoonItem" />
            )}
        </AssetsManagementCard>
    )
}

