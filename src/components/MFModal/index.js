import React, {useEffect} from "react"
import "./styles.less"
import {Modal} from "antd"
import PropTypes from "prop-types"

const MFModal = (props) => {
    const {
        title,
        visible,
        onCancel,
        footer,
        children,
        centered,
        width,
        className,
        setIsSrollBottom,
        maskClosable = true,
        modalWithBackground = false,
    } = props

    useEffect(() => {
        const elements = document.getElementsByClassName("ant-modal-body")
        if (elements[0]) {
            elements[0].addEventListener("scroll", (e) => {
                const element = e.target
                setIsSrollBottom(element.scrollHeight - element.scrollTop === element.clientHeight)
            })
        }
    })
    return (
        <Modal
            title={title}
            open={visible}
            onCancel={onCancel}
            centered={centered}
            width={width || 585}
            maskClosable={maskClosable}
            closeIcon={
                <svg
                    className={"cursor-pointer"}
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
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
            }
            wrapClassName={modalWithBackground ? "mf-background-modal" : "mf-modal"}
            className={`mf-modal-content top-12 sm:top-24 md:top-32 ${className}`}
            footer={footer}
        >
            {children}
        </Modal>
    )
}

MFModal.propTypes = {
    title: PropTypes.string,
    visible: PropTypes.bool.isRequired,
    onCancel: PropTypes.func,
    footer: PropTypes.oneOfType([PropTypes.bool, PropTypes.node, PropTypes.instanceOf(React.ReactNode)]),
    children: PropTypes.node,
}

export default MFModal
