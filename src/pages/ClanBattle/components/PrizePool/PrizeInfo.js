import React from "react"
import { Row, Col } from "antd"

const PrizeInfo = () => {
    return (
        <>
            <h2 className="text-primary" style={{ marginBottom: 0 }}>Guess the battle result & win</h2>
            <h2 className="text-pink-glow-aura">$glmr!</h2>
            <div className="instruction-section">
                <Row className="mb-5">
                    <Col xs={24} xl={6}>
                        <h2 className="text-secondary">95%</h2>
                    </Col>
                    <Col xs={24} xl={18}>of deposited $GLMR will be rewarded for whoever guessed correctly</Col>
                </Row>
                <Row className="mb-5">
                    <Col xs={24} xl={6}>
                        <h2 className="text-secondary">5%</h2>
                    </Col>
                    <Col xs={24} xl={18}>of the pool will go to the ecosystem fund for future development</Col>
                </Row>
                <Row style={{ marginBottom: "10px" }}>
                    <Col xs={24} xl={6}>
                        <h3 className="text-secondary">BONUS</h3>
                    </Col>
                    <Col xs={24} xl={18}>entries in the next Weekly Raffle for whoever guessed wrong (based on the amount of $GLMR deposited - exclusively for NFT Holders)</Col>
                </Row>
                {/* <Row className="mb-5">
                    <Col xs={24} xl={6}>
                        <h2 className="text-secondary">95%</h2>
                    </Col>
                    <Col xs={24} xl={18}>of deposited $GLMR will be rewarded for whoever guessed correctly</Col>
                </Row>
                <Row className="mb-5">
                    <Col xs={24} xl={6}>
                        <h2 className="text-secondary">3%</h2>
                    </Col>
                    <Col xs={24} xl={18}>of the pool will go to MoonFit Treasury Fund for future Community Development.</Col>
                </Row>
                <Row style={{ marginBottom: "10px" }}>
                    <Col xs={24} xl={6}>
                        <h2 className="text-secondary">2%</h2>
                    </Col>
                    <Col xs={24} xl={18}>of the pool will be accrued for The final Raffle Draw among all participants of MoonFit x World Cup 2022 event.</Col>
                </Row> */}
            </div>
        </>
    )
}

export default PrizeInfo
