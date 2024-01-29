import React from "react"
import { Row } from "antd"
import Left from "./Left"
import Right from "./Right"
import './styles.less'

const EventContent = (props) => {

    return (
        <div className="single-content">
            <Row gutter={[16, 32]}>
                <Left {...props} />
                <Right {...props} />
            </Row>
        </div>
    )
}

export default EventContent