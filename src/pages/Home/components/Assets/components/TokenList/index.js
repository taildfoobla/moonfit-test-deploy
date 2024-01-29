import React from "react"
import "./styles.less"
import { Col, Image, Row } from "antd"
import iconGLMR from "@imgPath/tokens/glmr.png"
import iconMFG from "@imgPath/tokens/mfg.png"
import { useTokeBalance } from "../../../../../../core/contexts/token-balance";

const ICONS = {
    glmr: iconGLMR,
    mfg: iconMFG,
}

const TOKENS = ["glmr", "mfg"]

const TokenList = () => {
    const tokenBalance = useTokeBalance()
    return (
        <div className="token-list">
            {TOKENS.map((token, idx) => {
                return (
                    <div className="token-list__item" key={idx}>
                        <Row gutter={20}>
                            <Col flex="none">
                                <Image width={28} src={ICONS[token]} className="token-list__icon" preview={false} />
                                <span className="token-list__title">{token}</span>
                            </Col>
                            <Col flex="auto">
                                <div className="token-list__value">
                                    {tokenBalance[token]}
                                </div>
                            </Col>
                        </Row>
                    </div>
                )
            })}
        </div>
    )
}

export default TokenList
