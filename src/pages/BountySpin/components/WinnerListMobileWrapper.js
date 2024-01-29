import React from "react"
import WinnerListMobile from "./WinnerListMobile"

export default function WinnerListMobileWrapper({histories1, histories2}) {
    return (
        <>
            {histories1?.length > 0 && <WinnerListMobile index={5} id="sec5" histories={histories1} marginLeft={"0"} />}

            {histories2?.length > 0 && <WinnerListMobile index={6} id="sec6" histories={histories2} marginLeft={"0"} />}
        </>
    )
}

