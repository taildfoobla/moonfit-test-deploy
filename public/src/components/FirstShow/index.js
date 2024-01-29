import React, {useEffect, useState} from "react"
import {Button, Modal} from "antd"
import Popup from "../../assets/images/popup-2.png"
import Lottery from "../../assets/images/lottery.png"
import "./styles.less"
import {setLocalStorage, LOCALSTORAGE_KEY, getLocalStorage} from "../../core/utils/helpers/storage"
import {useNavigate} from "react-router-dom"

export default function FirstShow() {
    const navigate = useNavigate()
    const [isModalOpen, setIsModalOpen] = useState(false)

    useEffect(() => {
        const oldTime = getLocalStorage(LOCALSTORAGE_KEY.FIRST_SHOW_IN_DAY)
        if (oldTime !== null) {
            const oldDate = new Date(Number(oldTime))
            const oldDay = oldDate.getDate()
            const newDate = new Date()
            const newDay = newDate.getDate()
            if (newDay > oldDay || (newDay === 1 && oldDay !== 1)) {
                setIsModalOpen(true)
            }
        } else {
            const beginDate=new Date(2024,0,29);

            if(Date.now()>=Date.parse(beginDate)){
                setIsModalOpen(true)
            }
        }
    }, [])

    const handleOk = () => {
        setIsModalOpen(false)
        navigate("/special-event/bounty-spin")
    }

    const handleCancel = () => {
        setIsModalOpen(false)
        setLocalStorage(LOCALSTORAGE_KEY.FIRST_SHOW_IN_DAY, Date.now())
    }

    return (
        <>
            <Modal className="first-show-modal" open={isModalOpen} onCancel={handleCancel} footer={false} centered={true}>
               {/* <div className="overlay" onClick={handleCancel}></div> */}
                <div
                    className="close-button"
                    onClick={() => {
                        handleCancel()
                    }}
                >
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect
                            x="1"
                            y="1"
                            width="30"
                            height="30"
                            rx="6"
                            stroke="white"
                            strokeOpacity="0.2"
                            strokeWidth="2"
                        />
                        <path
                            d="M21.0625 10.9375L10.9375 21.0625"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M21.0625 21.0625L10.9375 10.9375"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>
                <div className="first-show">
                    <img src={Popup} alt="" />
                </div>
                <div
                    className="spin-button"
                    onClick={() => {
                        handleOk()
                    }}
                >
                    <img src={Lottery} alt="" />
                    <span>spin</span>
                </div>
            </Modal>
        </>
    )
}

