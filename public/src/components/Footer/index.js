import React from "react"
import {Button, Col, Row} from "antd"
import "./styles.less"
import {ReactComponent as IconTelegram} from "@svgPath/telegram.svg"
import {ReactComponent as IconInstagram} from "@svgPath/instagram.svg"
import {ReactComponent as IconTwitter} from "@svgPath/twitter.svg"
import {ReactComponent as IconDiscord} from "@svgPath/discord.svg"
import {ReactComponent as IconMedium} from "@svgPath/medium.svg"
import {ReactComponent as IconEnvelope} from "@svgPath/envelope.svg"
import {ReactComponent as IconCloudDownload} from "@svgPath/cloud-download.svg"
import ConfigUrl from "@configPath/site-urls"
import {useLocation} from "react-router-dom"
import MoonFitBrand from "../../assets/images/banner/moonfit-brand.png"

const Footer = () => {
    const {pathname} = useLocation()
    const onNavigateWhitelisted = () => {
        window.open("https://app.moonfit.xyz/nft-sale/", "_blank")
    }

    if (pathname.includes("clan-battle") || (pathname.includes("special-event") && !pathname.includes("lucky-wheel"))||pathname.includes("mint")||pathname.includes("astar-rewards")||pathname.includes("manage-assets")||pathname.includes("deposit")||pathname.includes("withdraw")||pathname.includes("two-fa")||pathname.includes("bounty-spin"))
        return null
    const isChangeFooter =location.pathname.includes("lucky-wheel") || location.pathname.includes("explore")
    return (
        <footer className="footer" style={isChangeFooter?{paddingTop:"300px"}:{paddingTop:"120px"}}>
            <Row justify="center">
                <Col>
                    { isChangeFooter? (
                        ""
                    ) : (
                        <>
                            <div className="footer-img">
                                <img src={MoonFitBrand} alt="" />
                            </div>
                            <h2 className="footer__title" data-aos="zoom-in">
                                Tasks, Burn, Connect & Earn:
                                <br />
                                Web3 Fitness!
                            </h2>
                        </>
                    )}

                    {/* <div className="footer__cta" data-aos="zoom-in">
                        <Button onClick={onNavigateWhitelisted} type="primary" className="footer__ctaButton -primary-2">
                            Join whitelist sale
                        </Button>
                    </div> */}
                    <div className="footer__socials">
                        <Row justify="center" gutter={{xs: 14, sm: 20}}>
                            <Col>
                                <a
                                    href="https://t.me/moonfit_official"
                                    target="_blank"
                                    className="footer__social"
                                    data-aos="zoom-in"
                                    data-aos-duration="600"
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
                                >
                                    <IconMedium className="footer__social-icon" />
                                </a>
                            </Col>
                        </Row>
                    </div>
                    <div className="footer__contact">
                        <Row justify="center" gutter={{xs: 20, sm: 54}}>
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
                                    <a href={ConfigUrl.mediaKit} target="_blank" className="h-link footer__contactLink">
                                        Download media kit
                                    </a>
                                </div>
                            </Col>
                        </Row>
                    </div>
                    <div className="footer__copyright">Copyright © 2023 by MoonFit - All rights reserved</div>
                </Col>
            </Row>
        </footer>
    )
}

export default Footer

