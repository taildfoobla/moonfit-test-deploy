import React, {useEffect, useState} from "react"
import appStore from "../../../assets/images/mint/app-store.png"
import chPlay from "../../../assets/images/mint/ch-play.png"
import videoPreview from "../../../assets/images/mint/videos/preview.png"

const MFStory = () => {
    const [width, setWidth] = useState(window.innerWidth)

    const updateDimensions = () => {
        setWidth(window.innerWidth)
    }

    useEffect(() => {
        window.addEventListener("resize", updateDimensions)
        return () => window.removeEventListener("resize", updateDimensions)
    }, [])

    const onClickButton = (type) => {
        if (type === "1") {
            window.open("https://whitepaper.moonfit.xyz", "_blank")
        } else {
            window.open("https://moonfit.xyz/litepaper", "_blank")
        }
    }

    return (
        <div className="story-section">
            {width >= 1366 && (
                <>
                    <div className="story-download grid xl:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 gap-24">
                        <div className="moonfit-info">
                            <div className="youtube-video">
                                <img src={videoPreview} alt="preview" />
                            </div>
                        </div>
                        <div className="what-is-moonfit">
                            <div className="moonfit-description">
                                <h3 className="description-title mb-5">WHAT IS MOONFIT?</h3>
                                <p>
                                    MoonFit is a Web3 & NFT Lifestyle App that promotes active living by rewarding users
                                    anytime they burn calories through physical activities.
                                </p>
                                <p>
                                    Your existence in the MoonFit Universe is represented via Beast or Beauty. Once you
                                    have an NFT, you can start training sessions and get rewards. The more calories you
                                    burn, the more rewards you can earn.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="story-button grid xl:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 gap-24 mt-3">
                        <div className="flex justify-center list-store">
                            <a
                                rel={"noreferrer"}
                                href="https://play.google.com/store/apps/details?id=xyz.moonfit.app&hl=en&gl=US"
                                target="_blank"
                            >
                                <img src={chPlay} alt="Chplay" />
                            </a>
                            <a rel={"noreferrer"} href="https://testflight.apple.com/join/lfXF5Lbd" target="_blank">
                                <img src={appStore} alt="AppStore" />
                            </a>
                        </div>
                        <div className="flex btn-list xl:justify-start md:justify-start sm:justify-center">
                            <button
                                type="button"
                                onClick={() => onClickButton("1")}
                                className="button button-secondary"
                            >
                                READ WHITEPAPER
                            </button>
                            <button
                                type="button"
                                onClick={() => onClickButton("2")}
                                className="button button-default ml-2"
                            >
                                READ LITEPAPER
                            </button>
                        </div>
                    </div>
                </>
            )}
            {width < 1366 && (
                <div className="story-download grid xl:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 gap-12">
                    <div className="moonfit-info">
                        <div className="youtube-video">
                            <img src={videoPreview} alt="preview" />
                        </div>
                        <div className="flex justify-center list-store">
                            <a
                                rel="noreferrer"
                                href="https://play.google.com/apps/testing/xyz.moonfit.app"
                                target="_blank"
                            >
                                <img src={chPlay} alt="GooglePlay" />
                            </a>
                            <a rel="noreferrer" href="https://testflight.apple.com/join/lfXF5Lbd" target="_blank">
                                <img src={appStore} alt="AppStore" />
                            </a>
                        </div>
                    </div>
                    <div className="what-is-moonfit">
                        <div className="moonfit-description">
                            <h3 className="description-title mb-5">WHAT IS MOONFIT?</h3>
                            <p>
                                MoonFit is a Web3 & NFT Lifestyle App that promotes active living by rewarding users
                                anytime they burn calories through physical activities.
                            </p>
                            <p>
                                Your existence in the MoonFit Universe is represented via Beast or Beauty. Once you have
                                an NFT, you can start training sessions and get rewards. The more calories you burn, the
                                more rewards you can earn.
                            </p>
                        </div>
                        <div className="flex btn-list sm:justify-center">
                            <button
                                type="button"
                                onClick={() => onClickButton("1")}
                                className="button button-secondary"
                            >
                                READ WHITEPAPER
                            </button>
                            <button
                                type="button"
                                onClick={() => onClickButton("2")}
                                className="button button-default ml-2"
                            >
                                READ LITEPAPER
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default MFStory

