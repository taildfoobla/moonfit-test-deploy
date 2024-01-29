import React from 'react'
import flames from "../../../assets/images/mint/flames.png"
import moonbeast from "../../../assets/images/mint/moonbeast-nft.png"
import moonegg from "../../../assets/images/mint/moonegg-nft.png"
import leveling from "../../../assets/images/mint/leveling-system.png"
import shop from "../../../assets/images/mint/moon-shop.png"
import marketplace from "../../../assets/images/mint/marketplace.png"
import item from "../../../assets/images/mint/moonitem-nft.png"
import clan from "../../../assets/images/mint/clan-group.png"

const MFUtilities = () => {

    return (
        <div className="utilities-section">
            <div className="utilities-header flex justify-center">
                <h3>NFT UTILITIES</h3>
            </div>

            <div className="utilities-content grid xl:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-12">
                <div className="grid-item">
                    <div className="block-game-feature block-frame">
                        <div className="block-frame-border"></div>
                        <div className="block-game-feature-content">
                            <div className="block-game-feature-icon">
                                <img loading="lazy" src={flames} alt="Web3Fitness" width="58" height="76" />
                            </div>
                            <h4 className="block-game-feature-title">Web3Fitness</h4>
                            <div className="block-game-feature-description">
                                Elevate the Fitness with Web3 Experiences
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid-item">
                    <div className="block-game-feature block-frame">
                        <div className="block-frame-border"></div>
                        <div className="block-game-feature-content">
                            <div className="block-game-feature-icon">
                                <img loading="lazy" src={moonbeast}
                                    alt="NFT MoonBeast" width="66" height="78" />
                            </div>
                            <h4 className="block-game-feature-title">MoonBeast NFT</h4>
                            <div className="block-game-feature-description">
                                Choose between two types with four special attributes
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid-item">
                    <div className="block-game-feature block-frame">
                        <div className="block-frame-border"></div>
                        <div className="block-game-feature-content">
                            <div className="block-game-feature-icon">
                                <img loading="lazy" src={moonegg}
                                    alt="Breeding & MoonEgg NFT" width="80" height="76" />
                            </div>
                            <h4 className="block-game-feature-title">Breeding & MoonEgg NFT</h4>
                            <div className="block-game-feature-description">
                                Grow your clan and improve your NFT stash
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid-item">
                    <div className="block-game-feature block-frame">
                        <div className="block-frame-border"></div>
                        <div className="block-game-feature-content">
                            <div className="block-game-feature-icon">
                                <img loading="lazy" src={leveling}
                                    alt="Leveling System" width="69" height="69" />
                            </div>
                            <h4 className="block-game-feature-title">Leveling System</h4>
                            <div className="block-game-feature-description">Level up your MoonBeast and increase
                                earning chance

                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid-item">
                    <div className="block-game-feature block-frame">
                        <div className="block-frame-border"></div>
                        <div className="block-game-feature-content">
                            <div className="block-game-feature-icon">
                                <img loading="lazy" src={shop}
                                    alt="MoonShop" width="69" height="55" />
                            </div>
                            <h4 className="block-game-feature-title">MoonShop</h4>
                            <div className="block-game-feature-description">Pick and purchase real items with a few
                                taps
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid-item">
                    <div className="block-game-feature block-frame">
                        <div className="block-frame-border"></div>
                        <div className="block-game-feature-content">
                            <div className="block-game-feature-icon">
                                <img loading="lazy" src={marketplace}
                                    alt="Marketplace" width="62" height="62" />
                            </div>
                            <h4 className="block-game-feature-title">Marketplace</h4>
                            <div className="block-game-feature-description">Trade your NFTS securely with blockchain
                                technology
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid-item">
                    <div className="block-game-feature block-frame">
                        <div className="block-frame-border"></div>
                        <div className="block-game-feature-content">
                            <div className="block-game-feature-icon">
                                <img loading="lazy" src={item}
                                    alt="MoonItem NFT" width="62" height="62" />
                            </div>
                            <h4 className="block-game-feature-title">MoonItem NFT</h4>
                            <div className="block-game-feature-description">Equip your MoonBeasts and boost their
                                abilities
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid-item">
                    <div className="block-game-feature block-frame">
                        <div className="block-frame-border"></div>
                        <div className="block-game-feature-content">
                            <div className="block-game-feature-icon">
                                <img loading="lazy" src={clan}
                                    alt="Clan/Group Running" width="62" height="62" />
                            </div>
                            <h4 className="block-game-feature-title">Clan | Group Training</h4>
                            <div className="block-game-feature-description">Train with friends and have more fun!
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MFUtilities
