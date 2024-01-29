import React, { useEffect, useState } from "react"
import { Button, Image } from "antd"
import { ReactComponent as IconWallet } from "@svgPath/wallet.svg"
import Container from "../../Container"
import BannerImage from "../../../assets/images/banner/not-logged-in.banner.png"
import DOMEventServices from "../../../core/services/dom-event"
import bg from "../../../assets/images/banner/bg.svg"
import cup from "../../../assets/images/banner/cup.svg"

const BannerNotLoggedIn = () => {
    const [width, setWidth] = useState(window.innerWidth);

    const updateDimensions = () => {
        setWidth(window.innerWidth);
    }

    useEffect(() => {
        window.addEventListener("resize", updateDimensions);
        return () => window.removeEventListener("resize", updateDimensions);
    }, []);

    return (
        <Container className="banner__container">
            <div className="banner__image" data-aos="zoom-in" data-aos-duration={1000}>
                {/* <Image src={BannerImage} alt="banner" preview={false} /> */}
                <div className="bg">
                    <Image src={bg} alt="banner" preview={false} />
                    <div className="cup">
                        <Image src={cup} alt="cup" preview={false} />
                    </div>
                </div>
            </div>

            <h1 className="banner__title" data-aos="slide-up" data-aos-duration={600}>
                Please <br /> connect wallet
            </h1>
            <div className="banner__sub-title" data-aos="slide-up" data-aos-duration={600}>
                to join exclusive events for HODLers
            </div>
            <div className="banner__cta" data-aos="slide-up" data-aos-duration={600}>
                <Button
                    style={{ marginBottom: '30px' }}
                    type="primary"
                    className="-primary-2 banner__ctaButton"
                    icon={<IconWallet />}
                    block
                    onClick={() => DOMEventServices.publish("openLoginModal")}
                >
                    Connect wallet
                </Button>
            </div>
        </Container>
    )
}

export default BannerNotLoggedIn
