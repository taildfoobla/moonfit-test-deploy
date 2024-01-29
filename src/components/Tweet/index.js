import React from "react"
import "./styles.less"
import { Col, Row, Avatar } from "antd"
import moment from "moment"
import { ReactComponent as IconTwitter } from "@svgPath/twitter.svg"
import tweetOfficial from "../../assets/images/icons/tweet_official.jpg"

const Tweet = (props) => {

    const { tweet } = props

    const openTweet = (url) => {
        const a = document.createElement("a");
        a.href = url;
        a.target = "_blank";
        document.body.appendChild(a);
        a.click();
        a.remove();
    }

    return (
        <div className="tweet">
            <a onClick={() => openTweet(`https://twitter.com/${tweet?.user?.screen_name}/status/${tweet?.id_str}?ref_src=twsrc%5Etfw`)}>
                <div className="tweet__inner" >
                    <Row>
                        <Col>
                            <Row gutter={12} align="middle">
                                <Col>
                                    {/* <div className="tweet__avatar"> */}
                                    {/* <Avatar src={tweet?.user?.profile_image_url || `https://pbs.twimg.com/profile_images/1561536393402535936/QMSpIpcb_normal.jpg`} /> */}
                                    <Avatar src={tweetOfficial} />
                                    {/* <img className="tweet__avatar" src={tweet?.user?.profile_image_url} /> */}
                                    {/* </div> */}
                                </Col>
                                <Col flex="auto">
                                    <div className="tweet__user">{tweet?.user?.name}</div>
                                    <div className="tweet__profile">@{tweet?.user?.screen_name}</div>
                                </Col>
                                <Col>
                                    <div className="tweet__icon">
                                        <IconTwitter width={20} height={20} />
                                    </div>
                                </Col>
                            </Row>

                            <div className="tweet__content">
                                <div dangerouslySetInnerHTML={{ __html: tweet.text?.replace(/\n/g, '<br />') }}>
                                </div>
                            </div>

                            <div className="tweet__time">
                                {moment(tweet.created_at).format("HH:mm")}
                                <div className="dot"></div>
                                {moment(tweet.created_at).format("ll")}
                            </div>
                        </Col>
                    </Row>
                </div>
            </a>

        </div>
    )
}

export default Tweet