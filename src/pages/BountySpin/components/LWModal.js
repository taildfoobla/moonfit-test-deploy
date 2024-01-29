import React from "react"
import {Modal} from "antd"
import PropTypes from "prop-types"

const LWModal = (props) => {
    const {title, open, onCancel, footer, children, centered, width, className} = props

    return (
        <Modal
            title={title}
            open={open}
            onCancel={onCancel}
            centered={centered}
            width={width || 585}
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
            wrapClassName={"mf-modal"}
            className={`mf-modal-content ${className}`}
            footer={footer}
        >
            {children}
        </Modal>
    )
}

LWModal.propTypes = {
    title: PropTypes.string,
    open: PropTypes.bool.isRequired,
    onCancel: PropTypes.func,
    footer: PropTypes.oneOfType([PropTypes.bool, PropTypes.node, PropTypes.instanceOf(React.ReactNode)]),
    children: PropTypes.node,
}

export default LWModal
