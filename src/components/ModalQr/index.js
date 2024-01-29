import "./styles.less"
import React from "react"
import Modal from "antd/lib/modal/Modal"
import CloseBtn from "../../assets/images/lucky-wheel/close-border.svg"
import QRCode from "../../assets/images/qr-code.png"
import AppStore from "../../assets/images/banner/app-store.png"
import GooglePlay from "../../assets/images/banner/google-play.png"


export default function ModalQr({isOpen,setIsOpen}) {

    const handleCancel = () => {
        setIsOpen(false)
    }



    return (
        <Modal className="mobile-qr-code" open={isOpen} centered={true} onCancel={handleCancel} footer={false}>
           <div
                className="close-button"
                onClick={() => {
                    handleCancel()
                }}
            >    <img src={CloseBtn} alt="" /></div>
            <div className="download-app-qr">
                <h3>Download app</h3>
                {/* <div className="qr-code">
                    <img src={QRCode} alt="" />
                </div> */}
                <div className="download-platform">
                    <div className="app-store">
                        <img src={AppStore} alt="AppStore"/>
                    </div>
                    <div className="google-play">
                        <img src={GooglePlay} alt="GooglePlay"/>
                    </div>
                </div>
                <div className="download-app-qr-text">
                    {/* <p>Scan To Download</p> */}
                    <p>Get MoonFit For Any Devices</p>
                </div>
            </div>
        </Modal>
    )
}

