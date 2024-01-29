import React from 'react'
import "./styles.less"
import FooterBg from "../../assets/images/footer-bg.png"
import { Row,Col } from 'antd'
import {ReactComponent as IconTelegram} from "@svgPath/telegram.svg"
import {ReactComponent as IconInstagram} from "@svgPath/instagram.svg"
import {ReactComponent as IconTwitter} from "@svgPath/twitter.svg"
import {ReactComponent as IconDiscord} from "@svgPath/discord.svg"
import {ReactComponent as IconMedium} from "@svgPath/medium.svg"
import {ReactComponent as IconEnvelope} from "@svgPath/envelope.svg"
import {ReactComponent as IconCloudDownload} from "@svgPath/cloud-download.svg"
import ConfigUrl from "@configPath/site-urls"


export default function FooterSocial({name,isHaveFooterBg}) {
  return (
    <div className={`footer-social-container ${name}`}>
        {isHaveFooterBg&&    <img src={FooterBg} alt=""/>}

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
  )
}
