import React from "react"
import arrowRight from "../../../../assets/images/icons/arrow-right.svg"

const PrizeWarning = () => {
    return (
        <div className="prize-warning">
            <div className="prize-warning-item" span={8}>
                <h3 className="text-triple-gradient">1</h3>
                <p>
                    The reward delivery may take up to 24 hours after the match ends, so if you don't see your rewards, check back again on the next day!
                </p>
            </div>
            <div className="prize-warning-item" span={8}>
                <h3 className="text-triple-gradient">2</h3>
                <p>
                    In case the match ends in a draw, match stats will be considered in the following order to decide the winning team:
                </p>
                <p className="m-0"> <img src={arrowRight} /> Shots on target</p>
                <p className="m-0"> <img src={arrowRight} /> Total shots</p>
                <p className="m-0"> <img src={arrowRight} /> Ball possession</p>
            </div>
            <div className="prize-warning-item" span={8}>
                <h3 className="text-triple-gradient">3</h3>
                <p>
                    The resolution source for this prediction will be official information obtained from <a href="https://www.sofascore.com/tournament/football/world/world-cup/16" target="_blank">Sofascore</a>.
                </p>
            </div>
        </div>
    )
}

export default PrizeWarning