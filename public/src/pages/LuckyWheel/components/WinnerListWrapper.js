import React, {useState} from "react"
import WinnerList from "./WinnerList"

export default function WinnerListWrapper({histories}) {
    const [isScrolling, setIsScrolling] = useState({list1: true, list2: false, list3: false, list4: false})

    const handleSetScrolling = (index) => {
        switch (index) {
            case 1:
                setIsScrolling({...isScrolling, list2: true, list1: false})
                break
            case 2:
                setIsScrolling({...isScrolling, list3: true, list2: false})
                break
            case 3:
                setIsScrolling({...isScrolling, list4: true, list3: false})
                break
            case 4:
                setIsScrolling({...isScrolling, list1: true, list4: false})
                break
        }
    }
    return (
        <>
            {histories.histories1 && (
                <WinnerList
                    index={1}
                    id="sec1"
                    histories={histories.histories1}
                    marginLeft={"0"}
                    isScrolling={isScrolling.list1}
                    setIsScrolling={handleSetScrolling}
                />
            )}
            {histories.histories2 && (
                <WinnerList
                    index={2}
                    id="sec2"
                    histories={histories.histories2}
                    marginLeft={"0"}
                    wrapperMarginLeft={"-20px"}
                    isScrolling={isScrolling.list2}
                    setIsScrolling={handleSetScrolling}
                />
            )}
            {histories.histories3 && (
                <WinnerList
                    index={3}
                    id="sec3"
                    histories={histories.histories3}
                    marginLeft={"20px"}
                    isScrolling={isScrolling.list3}
                    setIsScrolling={handleSetScrolling}
                />
            )}
            {histories.histories4 && (
                <WinnerList
                    index={4}
                    id="sec4"
                    histories={histories.histories4}
                    marginLeft={"20px"}
                    wrapperMarginLeft={"-20px"}
                    isScrolling={isScrolling.list4}
                    setIsScrolling={handleSetScrolling}
                />
            )}
        </>
    )
}

