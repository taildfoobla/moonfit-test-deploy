import React, { useState } from 'react'
import { Row, Col, Carousel, Image, Tag, Button } from "antd"
import { getScByNftType } from '../../../../../../core/utils/helpers/ntf'

const DescriptionProduct = (props) => {
    const { event, nfts, setNfts, setSelectedNft, page, nftBalance, moreLoading, isLoadMoreVisible, onClickLoadMore } = props
    const onSelectNft = (item) => {
        const list = nfts.map(n => {
            return {
                ...n,
                checked: n.tokenId === item.tokenId
            }
        })
        setNfts(list)
        setSelectedNft(item)
    }

    return (
        <>
            <Row>
                <h3>DESCRIPTION</h3>
            </Row>
            <Row className="description">
                <p>{event.long_description}</p>
            </Row>
            <Row>
                <h3>YOUR ELIGIBLE NFTS</h3>
            </Row>
            <div className="eligible-nfts">
                <Row gutter={[24, 8]}>
                    {
                        !nfts.length > 0 && <Col>
                            No NFT is available in your collection
                        </Col>
                    }
                    {
                        nfts.length > 0 && <>
                            <Col xs={24} md={24} xl={24}>Please pick a NFT to claim this reward</Col>

                            {nfts.map((item) => (
                                <Col key={item.tokenId} xs={24} md={12} xl={8} onClick={() => onSelectNft(item)}>
                                    <div className="nft-detail">
                                        <div className={`nft-image ${item.checked ? 'active' : ''}`}>
                                            <img src={item.imageUrl} alt="" />
                                        </div>
                                        <Row className="nft-mint-pass" justify="center" >
                                            <Col>
                                                <h4 className="color-primary">{nftPrefix(item.name)}</h4>
                                            </Col>
                                            <Col>
                                                <h4 className="color-secondary">{nftSurfix(item.name)}</h4>
                                            </Col>
                                            <Col xs={24} xl={24}>
                                                <a
                                                    target="_blank"
                                                    href={genScanUrl(item.type, item.tokenId)}
                                                    className="color-purple">View on NFTSCAN</a>
                                            </Col>
                                        </Row>
                                    </div>
                                </Col>
                            ))
                            }
                        </>
                    }
                </Row>
                <Row justify="center">
                    {
                        isLoadMoreVisible && (
                            <div className={'btn-load-more'}>
                                <Button type={'primary'} block onClick={() => onClickLoadMore(nftBalance, page)}
                                    loading={moreLoading}>Load
                                    more</Button>
                            </div>
                        )
                    }
                </Row>
            </div>

            <Row className="fcfs" justify="space-between">
                <h3>REWARD</h3>
                <Tag color="#4CCBC9">FCFS</Tag>
            </Row>
            <Row className="list-rewards">
                <Col xs={0} md={8} xl={8} className="small-reward">
                    <Image src={event?.event_detail[0]?.url} className="reward2" />
                    <Image src={event?.event_detail[1]?.url} className="reward3" />
                </Col>
                <Col xs={0} md={16} xl={16} className="large-reward">
                    <Image src={event?.event_detail[2]?.url} />
                </Col>
                <Col xs={24} md={0} xl={0}>
                    <Carousel autoplay draggable>
                        <div className="carousel-img">
                            <Image src={event?.event_detail[2]?.url} preview={false} />
                        </div>
                        <div className="carousel-img">
                            <Image src={event?.event_detail[1]?.url} preview={false} />
                        </div>
                        <div className="carousel-img">
                            <Image src={event?.event_detail[0]?.url} preview={false} />
                        </div>
                    </Carousel>
                </Col>
            </Row>
        </>
    )
}

const genScanUrl = (type, tokenId) => {
    const sc = getScByNftType(type)
    return `https://www.nftscan.com/${sc}/${tokenId}`
}

const nftPrefix = (name) => {
    name = name.toLowerCase()
    let newName = ""
    if (name.includes('moonfit')) {
        newName = name.substring(0, 8)
    }
    if (name.includes('beauty')) {
        newName = name.substring(0, 7)
    }
    if (name.includes('beast')) {
        newName = name.substring(0, 6)
    }
    return newName
}

const nftSurfix = (name) => {
    name = name.toLowerCase()
    let newName = ""
    if (name.includes('moonfit')) {
        newName = name.substring(8, name.length)
    }
    if (name.includes('beauty')) {
        newName = name.substring(7, name.length)
    }
    if (name.includes('beast')) {
        newName = name.substring(6, name.length)
    }
    return newName
}

export default DescriptionProduct