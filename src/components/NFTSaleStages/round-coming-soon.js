import React from "react"
import arrowFatRight from "../../assets/images/icons/ArrowFatRight.svg"
import moonBeam from "../../assets/images/icons/moonbeam.svg";
import mintPass from "../../assets/images/icons/mintpass.svg";

const RoundComingSoon = ({stage}) => {

    const dateTitle = () => {

        return (
            <>
                <div className="flex">
                    <h1>TBA</h1>
                    <h3 className="pt-2">&nbsp;</h3>
                </div>
                <h3>&nbsp;</h3>
            </>
        )
    }

    return (
        <div className="stage sold-out">
            <div className="stage-content">
                {dateTitle(stage.dateMsg)}
                <h4 className="mt-5 mb-3">{stage.title}</h4>
                <div className="flex mb-2">
                    <img className="arrow-right" src={arrowFatRight} alt="" /> QUANTITY: <span className="text-white ml-1"> ? NFTs</span>
                </div>
                <div className="flex mb-3">
                    <img className="arrow-right" src={arrowFatRight} alt="" /> PRICE:
                    <img className="ic-moonbeam" src={moonBeam} alt="" /> <span className="text-[#4ccbc9] mr-1">?
                                    </span> + <img className="ic-mintpass" src={mintPass} alt="" /><span className="text-[#4ccbc9]">?</span>

                </div>
                <span className="description">&nbsp;</span>
                <div className="flex justify-center mt-5 mb-5">
                &nbsp;
            </div>
            </div>
            <button type="button" className="flex items-center header-button button button-secondary w-100 mt-4 disabled" disabled>
                Join now
            </button>
        </div>
    )
}

export default RoundComingSoon
