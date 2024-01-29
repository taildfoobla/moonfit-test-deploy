import React from "react"
import "./style.less"
import FooterBg from "../../../assets/images/footer-bg.png"
import beast1 from "../../../assets/images/valentine/beast-1.png"
import beauty1 from "../../../assets/images/lunar/beauty-1.png"
import beauty3 from "../../../assets/images/beauty-3.png"
import tokenMfr1 from "../../../assets/images/christmas/token-mfr-1.png"
import tokenMfr2 from "../../../assets/images/shapes/token-mfr-2.png"
import tokenMfg3 from "../../../assets/images/christmas/token-mfg-3.png"
import astar1 from "../../../assets/images/astar-1.png"
import astar2 from "../../../assets/images/astar-2.png"
import {ReactComponent as IconTelegram} from "@svgPath/telegram.svg"
import {ReactComponent as IconInstagram} from "@svgPath/instagram.svg"
import {ReactComponent as IconTwitter} from "@svgPath/twitter.svg"
import {ReactComponent as IconDiscord} from "@svgPath/discord.svg"
import {ReactComponent as IconMedium} from "@svgPath/medium.svg"
import {ReactComponent as IconEnvelope} from "@svgPath/envelope.svg"
import {ReactComponent as IconCloudDownload} from "@svgPath/cloud-download.svg"
import {Row, Col} from "antd"
import ConfigUrl from "@configPath/site-urls"
import {useGlobalContext} from "../../../core/contexts/global"

export default function MintWrapper({children}) {
    const {selectedNetwork} = useGlobalContext()

    const isAstar = selectedNetwork === "astar"

    return (
        <div className="main-content page-content section-hero non-attachment-bg ">
            <div className="section-shape section-shape-beast-1 move-vertical-reversed">
                <img loading="lazy" src={beast1} width="108" height="108" alt="" />
            </div>
            <div className="section-shape section-shape-beauty-1 move-vertical-reversed">
                <img loading="lazy" src={beauty1} width="119" alt="" />
            </div>
            <div className="section-shape section-shape-beauty-2 move-vertical">
                <img loading="lazy" src={beauty3} width="101" height="120" alt="" />
            </div>
            <div className="section-shape section-shape-mfg-2 move-vertical">
                <img loading="lazy" src={tokenMfg3} width="60" height="60" alt="" />
            </div>
            <div className="section-shape section-shape-mfr-1 move-vertical">
                <img loading="lazy" src={tokenMfr1} width="74" height="67" alt="" />
            </div>
            <div className="section-shape section-shape-mfr-2 move-vertical">
                <img loading="lazy" src={tokenMfr2} width="60" height="60" alt="" />
            </div>
            {isAstar && (
                <>
                    <div className="section-shape section-shape-astar-1 move-vertical">
                        <img loading="lazy" src={astar1} width="80" height="80" alt="" />
                    </div>
                    <div className="section-shape section-shape-astar-2 move-vertical">
                        <img loading="lazy" src={astar2} width="74" height="74" alt="" />
                    </div>
                </>
            )}

            <div className="page-container page-nft-sale">{children}</div>
            <div className="footer-mint">
                <img src={FooterBg} alt=""/>
                <Row justify="center">
                    <Col>
                        <div className="footer__socials">
                            <Row justify="center" gutter={{xs: 14, sm: 20}} style={{marginLeft:0,marginRight:0}}>
                                <Col>
                                    <a
                                        href="https://t.me/moonfit_official"
                                        target="_blank"
                                        className="footer__social"
                                        data-aos="zoom-in"
                                        data-aos-duration="600"
                                        rel="noreferrer"
                                    >
                                        <IconTelegram className="footer__social-icon" />
                                    </a>
                                </Col>
                                <Col>
                                    <a
                                        href="https://www.instagram.com/moonfit_official"
                                        target="_blank"
                                        className="footer__social"
                                        data-aos="zoom-in"
                                        data-aos-duration="600"
                                        data-aos-delay={100}
                                        rel="noreferrer"
                                    >
                                        <IconInstagram className="footer__social-icon" />
                                    </a>
                                </Col>
                                <Col>
                                    <a
                                        href="https://twitter.com/MoonFitOfficial"
                                        target="_blank"
                                        className="footer__social"
                                        data-aos="zoom-in"
                                        data-aos-duration="600"
                                        data-aos-delay={200}
                                        rel="noreferrer"
                                    >
                                        <IconTwitter className="footer__social-icon" />
                                    </a>
                                </Col>
                                <Col>
                                    <a
                                        href="https://discord.com/invite/hStdUVtHXp"
                                        target="_blank"
                                        className="footer__social"
                                        data-aos="zoom-in"
                                        data-aos-duration="600"
                                        data-aos-delay={300}
                                        rel="noreferrer"
                                    >
                                        <IconDiscord className="footer__social-icon" />
                                    </a>
                                </Col>
                                <Col>
                                    <a
                                        href="https://medium.com/@moonfit"
                                        target="_blank"
                                        className="footer__social"
                                        data-aos="zoom-in"
                                        data-aos-duration="600"
                                        data-aos-delay={400}
                                        rel="noreferrer"
                                    >
                                        <IconMedium className="footer__social-icon" />
                                    </a>
                                </Col>
                            </Row>
                        </div>
                        <div className="footer__contact">
                            <Row justify="center" gutter={{xs: 20, sm: 54}} style={{marginLeft:0,marginRight:0}}>
                                <Col>
                                    <div data-aos="fade-up" data-aos-offset="10">
                                        <IconEnvelope />
                                        <a
                                            style={{fontWeight: "700"}}
                                            href={`mailto:${ConfigUrl.mailContact}`}
                                            className="h-link footer__contactLink"
                                        >
                                            hi@moonfit.xyz
                                        </a>
                                    </div>
                                </Col>
                                <Col>
                                    <div data-aos="fade-up" data-aos-offset="10">
                                        <IconCloudDownload />
                                        <a
                                            style={{fontWeight: "700"}}
                                            href={ConfigUrl.mediaKit}
                                            target="_blank"
                                            className="h-link footer__contactLink"
                                            rel="noreferrer"
                                        >
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
        </div>
    )
}

