import React from "react"
import { TwitterOutlined } from '@ant-design/icons';

const TwitterShareButton = (props) => {

    return (
        <div className="flex justify-center">
            <a
                target="_blank"
                href={`https://twitter.com/intent/tweet?text=Let%27s%20join%20this&url=${window.location.href}`}
                className="flex items-center header-button button button-twitter w-1/2 mt-3">
                <span className="nav-text"><TwitterOutlined className="mr-3" />Share on Twitter</span>
            </a>
        </div>
    )
}

export default TwitterShareButton