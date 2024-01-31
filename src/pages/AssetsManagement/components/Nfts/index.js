import React from "react"
import "./styles.less"
import AssetsManagementCard from "../share/Wrapper"
import socialIcon from "../../../../assets/images/mint/social.svg"
import enduranceIcon from "../../../../assets/images/mint/endurance.svg"
import luckIcon from "../../../../assets/images/mint/luck.svg"
import speedIcon from "../../../../assets/images/mint/speed.svg"
import astarIcon from "../../../../assets/images/assets-management/nfts/astar-icon.png"
import beastImg from "../../../../assets/images/assets-management/nfts/beast-img.png"
import {Col, Row} from "antd"
import AssetsManagementButton from "../share/Button"
import NoData from "../share/NoData"
import Loading from "../../../Mint/components/LoadingOutlined"

export default function NftManagement({isLoading, nfts}) {
    const nftsData = [
        {
            type: "Beauty",
            name: "#G0010809",
            picture: beastImg,
            icon: astarIcon,
            social: 123,
            endurance: 80,
            luck: 65,
            speed: 172,
            tag: "Common",
        },
        {
            type: "Beauty",
            name: "#G0010809",
            picture: beastImg,
            icon: astarIcon,
            social: 123,
            endurance: 80,
            luck: 65,
            speed: 172,
            tag: "Common",
        },
        {
            type: "Beauty",
            name: "#G0010809",
            picture: beastImg,
            icon: astarIcon,
            social: 123,
            endurance: 80,
            luck: 65,
            speed: 172,
            tag: "Common",
        },
        {
            type: "Beauty",
            name: "#G0010809",
            picture: beastImg,
            icon: astarIcon,
            social: 123,
            endurance: 80,
            luck: 65,
            speed: 172,
            tag: "Common",
        },
        {
            type: "Beauty",
            name: "#G0010809",
            picture: beastImg,
            icon: astarIcon,
            social: 123,
            endurance: 80,
            luck: 65,
            speed: 172,
            tag: "Common",
        },
        {
            type: "Beauty",
            name: "#G0010809",
            picture: beastImg,
            icon: astarIcon,
            social: 123,
            endurance: 80,
            luck: 65,
            speed: 172,
            tag: "Common",
        },
    ]

    const handleDisplayScrollbar = (e) => {
        let timeOut
        clearTimeout(timeOut)
        e.target.classList.add("display-scrollbar")
        timeOut = setTimeout(() => {
            e.target.classList.remove("display-scrollbar")
        }, 1000)
    }


    return (
        <AssetsManagementCard childClassName="nfts-management">
            <h3>NFTs</h3>
            {isLoading ? (
                <div className="loading">
                    <Loading />
                </div>
            ) : nfts && nfts?.length > 0 ? (
                <>
                    <Row
                        gutter={[30, 20]}
                        style={{marginBottom: "24px"}}
                        className="nft-list"
                        onScroll={(e) => {
                            handleDisplayScrollbar(e)
                        }}
                    >
                        {nfts.map((nft, index) => (
                            <Col xs={12} key={index}>
                                <div className="picture">
                                    <img className="big-picture" src={nft.image_url} alt="" />
                                    <img className="small-icon" src={nft.chainIcon} alt="" />
                                    <span
                                        className={`tag ${nft?.BeastRarity?.name === "Common" ? "common" : "uncommon"}`}
                                    >
                                        {nft?.BeastRarity?.name}
                                    </span>
                                </div>
                                {nft?.stamina&&nft?.endurance&&nft?.luck&&nft?.speed?  <ul className="attribute-list">
                                    <li className="attribute">
                                        <img src={socialIcon} alt="" />
                                        <p>{nft.stamina + nft.item_stamina}</p>
                                    </li>
                                    <li className="attribute">
                                        <img src={enduranceIcon} alt="" />
                                        <p>{nft.endurance + nft.item_endurance}</p>
                                    </li>
                                    <li className="attribute">
                                        <img src={luckIcon} alt="" />
                                        <p>{nft.luck + nft.item_luck}</p>
                                    </li>
                                    <li className="attribute">
                                        <img src={speedIcon} alt="" />
                                        <p>{nft.speed + nft.item_speed}</p>
                                    </li>
                                </ul>:""}
                              
                                <p className="nft-type">{nft.type}</p>
                                <p className="nft-name">#{nft.name}</p>
                            </Col>
                        ))}
                    </Row>
                    <AssetsManagementButton addClass={`nfts-management-button ${nfts.length > 2 ? "change-bg" : ""}`} />
                </>
            ) : (
                <NoData type="NFT" />
            )}
        </AssetsManagementCard>
    )
}

