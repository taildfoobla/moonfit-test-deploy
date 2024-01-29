import React from "react"
import beast1 from "../../../assets/images/shapes/beast-1.png"
import beauty1 from "../../../assets/images/shapes/beauty-1.png"
import beauty2 from "../../../assets/images/shapes/beauty-2.png"
import tokenMfg2 from "../../../assets/images/christmas/token-mfg-2.png"
import tokenMfg3 from "../../../assets/images/christmas/token-mfg-3.png"
import tokenMfr1 from "../../../assets/images/christmas/token-mfr-1.png"
import tokenMfr2 from "../../../assets/images/shapes/token-mfr-2.png"
import "./styles.less"
import { ReactComponent as IconTelegram } from "@svgPath/telegram.svg"
import { ReactComponent as IconInstagram } from "@svgPath/instagram.svg"
import { ReactComponent as IconTwitter } from "@svgPath/twitter.svg"
import { ReactComponent as IconDiscord } from "@svgPath/discord.svg"
import { ReactComponent as IconMedium } from "@svgPath/medium.svg"
import { ReactComponent as IconEnvelope } from "@svgPath/envelope.svg"
import { ReactComponent as IconCloudDownload } from "@svgPath/cloud-download.svg"
import { Row, Col } from "antd"
import ConfigUrl from "@configPath/site-urls"

const ChristmasWrapper = ({ children }) => {
    return (
        <>
            <div className="christmas-wrapper">
                <div className="section-shape section-shape-beast-1 move-vertical-reversed">
                    <img loading="lazy" src={beast1} width="231"
                        height="230" alt="" />
                </div>
                <div className="section-shape section-shape-beauty-1 move-vertical-reversed">
                    <img loading="lazy" src={beauty1} width="181" height="216" alt="" />
                </div>
                <div className="section-shape section-shape-beauty-2 move-vertical">
                    <img loading="lazy" src={beauty2} width="152" height="184" alt="" />
                </div>
                <div className="section-shape section-shape-mfg-1 move-vertical">
                    <img loading="lazy" src={tokenMfg2} width="60"
                        height="60" alt="" />
                </div>
                <div className="section-shape section-shape-mfg-2 move-vertical">
                    <img loading="lazy" src={tokenMfg3} width="60"
                        height="60" alt="" />
                </div>
                <div className="section-shape section-shape-mfr-1 move-vertical">
                    <img loading="lazy" src={tokenMfr1} width="74"
                        height="67" alt="" />
                </div>
                <div className="section-shape section-shape-mfr-2 move-vertical">
                    <img loading="lazy" src={tokenMfr2} width="60"
                        height="60" alt="" />
                </div>
                <>
                    {children}
                </>

            </div>
            <div className="footer-christmas">
                <Row justify="center">
                    <Col>
                        <div className="footer__socials">
                            <Row justify="center" gutter={{ xs: 14, sm: 20 }}>
                                <Col>
                                    <a href="https://t.me/moonfit_official" target="_blank" className="footer__social" data-aos="zoom-in" data-aos-duration="600" rel="noreferrer">
                                        <IconTelegram className="footer__social-icon" />
                                    </a>
                                </Col>
                                <Col>
                                    <a href="https://www.instagram.com/moonfit_official" target="_blank" className="footer__social" data-aos="zoom-in" data-aos-duration="600" data-aos-delay={100} rel="noreferrer">
                                        <IconInstagram className="footer__social-icon" />
                                    </a>
                                </Col>
                                <Col>
                                    <a href="https://twitter.com/MoonFitOfficial" target="_blank" className="footer__social" data-aos="zoom-in" data-aos-duration="600" data-aos-delay={200} rel="noreferrer">
                                        <IconTwitter className="footer__social-icon" />
                                    </a>
                                </Col>
                                <Col>
                                    <a href="https://discord.com/invite/hStdUVtHXp" target="_blank" className="footer__social" data-aos="zoom-in" data-aos-duration="600" data-aos-delay={300} rel="noreferrer">
                                        <IconDiscord className="footer__social-icon" />
                                    </a>
                                </Col>
                                <Col>
                                    <a href="https://medium.com/@moonfit" target="_blank" className="footer__social" data-aos="zoom-in" data-aos-duration="600" data-aos-delay={400} rel="noreferrer">
                                        <IconMedium className="footer__social-icon" />
                                    </a>
                                </Col>
                            </Row>
                        </div>
                        <div className="footer__contact">
                            <Row justify="center" gutter={{ xs: 20, sm: 54 }}>
                                <Col>
                                    <div data-aos="fade-up" data-aos-offset="10">
                                        <IconEnvelope />
                                        <a href={`mailto:${ConfigUrl.mailContact}`} className="h-link footer__contactLink">
                                            hi@moonfit.xyz
                                        </a>
                                    </div>
                                </Col>
                                <Col>
                                    <div data-aos="fade-up" data-aos-offset="10">
                                        <IconCloudDownload />
                                        <a href={ConfigUrl.mediaKit} target="_blank" className="h-link footer__contactLink" rel="noreferrer">
                                            Download media kit
                                        </a>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                        <div className="footer__copyright">Copyright © 2023 by MoonFit - All rights reserved</div>
                    </Col>
                </Row>
            </div>
        </>
    )
}

export default ChristmasWrapper