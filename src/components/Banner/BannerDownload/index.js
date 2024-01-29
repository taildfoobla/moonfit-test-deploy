import React, {useRef} from "react"
import MoonFitLogo from "../../../assets/images/banner/moonfit-brand.png"
import BannerBackground from "../../../assets/images/banner/banner-bg.png"
import GooglePlay from "../../../assets/images/banner/google-play.png"
import AppStore from "../../../assets/images/banner/app-store.png"
import {Link} from "react-router-dom"
import {Carousel, message as AntdMessage} from "antd"
import "./style.less"
import HightlightEvent from "../../HightlightEvent"
import NextSlider from "../../../assets/images/banner/next-slider.png"
import PrevSlider from "../../../assets/images/banner/prev-slider.png"
import {useAuth} from "../../../core/contexts/auth"

export default function BannerDownload(props) {
    const {highlightEvent} = props

    const {auth,isLoginSocial}=useAuth()

    const handleOpenLink = (url) => {
        window.open(url)
    }

    const sliderRef = useRef()
    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    }

    const handleNextSlider = () => {
        sliderRef.current.next()
    }

    const handlePrevSlider = () => {
        console.log("prev")
        sliderRef.current.prev()
    }

    const handlePreventPassthrough=(e)=>{
        if(!isLoginSocial && !auth?.isConnected){
            e.preventDefault()
            return AntdMessage.error({
                key:"err",
                content: "Please connect wallet and login social",
                className: "message-error",
                duration: 5,})
        }
    }

    return (
        <div className="mf-container">
            <div className="home-banner">
                <div className="banner-download">
                    <div className="banner-content">
                        {/* <div className='banner-content-logo'>
            <img src={MoonFitLogo} alt='MoonFit'/>
        </div> */}
                        <div className="banner-content-text">
                            <p>Tasks, Burn,</p>
                            <p>Connect & Earn:</p>
                            <p>Web3 Fitness!</p>
                        </div>
                        <div className="button-download">
                            <Link
                                className="explore"
                                href="#campaign"
                                to="/explore"
                                // onClick={()=>{
                                //     handleOpenLink('https://play.google.com/store/apps/details?id=xyz.moonfit.app&hl=en&gl=US')
                                // }}
                            >
                                {/* <img src={GooglePlay} alt=''/> */}
                                <span> Explore</span>
                            </Link>
                        </div>
                    </div>
                    {/* <div className='banner-bg'>
        <img src={BannerBackground} alt=''/>
    </div> */}
                </div>
                <div className="banner-slider">
                    <Carousel dots={false} ref={sliderRef} autoplay={false}>
                        {highlightEvent.map((event, index) => (
                            <div key={index} className="hightlight-event-container">
                                <Link className="hightlight-event-bg" to={`/special-event/${event.event_type.title}`} onClick={(e)=>{
                                    handlePreventPassthrough(e)
                                }}>
                                    <img src={event?.banner_event?.url} alt="" />
                                    <div className="hightlight-event-type">HOT</div>
                                </Link>{" "}
                            </div>
                        ))}
                    </Carousel>
                    {highlightEvent?.length > 1 && (
                        <div className="slider-button">
                            <div
                                className="prev"
                                onClick={() => {
                                    handlePrevSlider()
                                }}
                            >
                                <img src={PrevSlider} alt="prev" />
                            </div>
                            <div
                                className="next"
                                onClick={() => {
                                    handleNextSlider()
                                }}
                            >
                                <img src={NextSlider} alt="next" />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

