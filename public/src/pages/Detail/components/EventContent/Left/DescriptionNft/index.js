import React from "react"
import { Row, Col } from "antd"
import nftReward from "../../../../../../assets/images/nft-reward.png"

const DescriptionNft = () => {
    return (
        <>
            <Row className="description">
                <h3>DESCRIPTION</h3>
                <p>Mint Pass is a pre-mint admission that secures your spot to purchase your MoonFit NFT. Finish the tasks and get a free Mint Pass.</p>
            </Row>
            <Row>
                <h3>YOUR REWARDS</h3>
            </Row>
            <Row className="list-rewards" align="middle" gutter={[16, 8]}>
                <Col xl={12} className="nft-reward">
                    <img src={nftReward} />
                </Col>
                <Col xl={12}>
                    <p className="mint-pass-title">MoonFit Mint Pass #123</p>
                    <a>View on NFTScan</a>
                </Col>
            </Row>
        </>
    )
}

export default DescriptionNft
