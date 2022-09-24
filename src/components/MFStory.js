import React, { useEffect, useState } from "react"
import appStore from "../assets/images/app-store.png"
import chPlay from "../assets/images/ch-play.png"
import video from "../assets/videos/video.mp4"
import videoPreview from "../assets/videos/preview.png"

const MFStory = () => {

    const [width, setWidth] = useState(window.innerWidth);

    const updateDimensions = () => {
        setWidth(window.innerWidth);
    }

    useEffect(() => {
        window.addEventListener("resize", updateDimensions);
        return () => window.removeEventListener("resize", updateDimensions);
    }, []);

    const onClickButton = (type) => {
        if (type === "1") {
            window.open("https://whitepaper.moonfit.xyz", "_blank")
        } else {
            window.open("https://moonfit.xyz/litepaper", "_blank")
        }
    }

    return (
        <div className="story-section">
            {
                width >= 1366 && <>
                    <div className="grid xl:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 gap-16">
                        <div className="moonfit-info">
                            <div className="youtube-video">
                                <video poster={videoPreview} controls>
                                    <source src={video} type="video/mp4" />
                                    Your browser does not support HTML video.
                                </video>
                            </div>
                        </div>
                        <div className="what-is-moonfit">
                            <div className="moonfit-description">
                                <h3 className="description-title mb-5">WHAT IS MOONFIT?</h3>
                                <p>MoonFit is a Web3 & NFT Lifestyle App that promotes active living by rewarding users anytime they burn calories through physical activities.</p>
                                <p>We believe our real-life lifestyle & fitness application benefit and the proper rewarding system will inspire people to take one more step every day while helping us get one step closer to our goal.</p>
                            </div>

                        </div>
                    </div>
                    <div className="grid xl:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 gap-4 mt-3">
                        <div className="flex justify-center list-store">
                            <a href="https://play.google.com/apps/testing/xyz.moonfit.app" target="_blank">
                                <img src={chPlay} alt="Chplay" />
                            </a>
                            <a href="https://testflight.apple.com/join/lfXF5Lbd" target="_blank">
                                <img src={appStore} alt="AppStore" />
                            </a>
                        </div>
                        <div className="flex btn-list sm:justify-center">
                            <button type="button" onClick={() => onClickButton("1")}
                                className="button button-secondary">
                                READ WHITEPAPER
                            </button>
                            <button type="button" onClick={() => onClickButton("2")}
                                className="button button-default ml-2">
                                READ LITEPAPER
                            </button>
                        </div>
                    </div>
                </>
            }
            {
                width < 1366 && <div className="grid xl:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 gap-12">
                    <div className="moonfit-info">
                        <div className="youtube-video">
                            <video poster={videoPreview} controls>
                                <source src={video} type="video/mp4" />
                                Your browser does not support HTML video.
                            </video>
                        </div>
                        <div className="flex justify-center list-store">
                            <a href="https://play.google.com/apps/testing/xyz.moonfit.app" target="_blank">
                                <img src={chPlay} alt="Chplay" />
                            </a>
                            <a href="https://testflight.apple.com/join/lfXF5Lbd" target="_blank">
                                <img src={appStore} alt="AppStore" />
                            </a>
                        </div>
                    </div>
                    <div className="what-is-moonfit">
                        <div className="moonfit-description">
                            <h3 className="description-title mb-5">WHAT IS MOONFIT?</h3>
                            <p>MoonFit is a Web3 & NFT Lifestyle App that promotes active living by rewarding users anytime they burn calories through physical activities.</p>
                            <p>We believe our real-life lifestyle & fitness application benefit and the proper rewarding system will inspire people to take one more step every day while helping us get one step closer to our goal.</p>
                        </div>
                        <div className="flex btn-list sm:justify-center">
                            <button type="button" onClick={() => onClickButton("1")}
                                className="button button-secondary">
                                READ WHITEPAPER
                            </button>
                            <button type="button" onClick={() => onClickButton("2")}
                                className="button button-default ml-2">
                                READ LITEPAPER
                            </button>
                        </div>
                    </div>
                </div>
            }

        </div>

    )
}

export default MFStory
