import React from "react"
import {Button, Image} from "antd"
import BannerImage from "../../../assets/images/banner/no-assets.banner.png"
import Container from "../../Container"

const BannerUserNoAssets = () => {
    return (
        // <Container className="banner__container">
        //     <div className="banner__image" data-aos="zoom-in" data-aos-duration={1000}>
        //         <Image src={BannerImage} alt="banner" preview={false} />
        //     </div>
        //     <h1 className="banner__title" data-aos="slide-up" data-aos-duration={600}>
        //         Your <br /> assets
        //     </h1>
        //     <div className="banner__sub-title" data-aos="slide-up" data-aos-duration={600}>
        //         You need to HOLD MoonFit NFTs' <br /> to be eligible for claiming below <br /> rewards
        //     </div>
        //     <div className="banner__cta" data-aos="slide-down" data-aos-duration={600}>
        //         <Button type="primary" className="-primary-2 banner__btn" block>
        //             Join Weekly Raffle TO WIN A NFT
        //         </Button>
        //         <Button type="primary" className="banner__ctaButton banner__btn" block>
        //             Buy NFT from tofunft
        //         </Button>
        //     </div>
        // </Container>
        <Container>
            <div className="banner__background" data-aos="zoom-in">
                <h1 className="banner__title">Your assets</h1>
            </div>
        </Container>
    )
}

export default BannerUserNoAssets
