import React, { useEffect, useState } from "react"
import { Col, Row } from "antd"
import "./styles.less"
import configUrls from "@configPath/site-urls"
import Tweet from "../../../../components/Tweet"
import Masonry from "react-smart-masonry"
import Container from "../../../../components/Container"
import ScrollAnimation from "../../../../components/ScrollAnimation"
import ApiService from "../../../../core/services/api"

const BREAKPOINTS = { mobile: 0, tablet: 576 }

const TweetsList = () => {
    const [tweets, setTweets] = useState([])
    useEffect(() => {
        fetchTwitter()
        const triggerLoadTweets = () => {
            window?.twttr?.widgets?.load(document.getElementById("tweetsContainer"))
        }
        triggerLoadTweets()
    }, [])

    const fetchTwitter = async () => {
        try {
            const res = await ApiService.makeRequest.get("manager-event/list-tweet")
            setTweets(res.data)
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <section className="tweets" id="tweetsContainer">
            <Container>
                <Row>
                    <Col xl={6} md={8} sm={6}>
                        <h3 className="tweets__title" data-aos="fade-right">
                            Tweets
                        </h3>
                        <a
                            href={configUrls.twitterOfficial}
                            target="_blank"
                            rel="noreferrer"
                            className="tweets__url"
                            data-aos="fade-right"
                        >
                            @MoonFitOfficial
                        </a>
                    </Col>
                    <Col xl={18} md={16} sm={18}>
                        <Masonry
                            breakpoints={BREAKPOINTS}
                            columns={{ mobile: 1, tablet: 2 }}
                            gap={{ mobile: 0, tablet: 30 }}
                            className="tweets__list"
                        >
                            {
                                tweets.map((tweet) => (
                                    <ScrollAnimation
                                        key={tweet.id}
                                        mobile={{ "data-aos": "fade", "data-aos-delay": 100 }}
                                        desktop={{ "data-aos": "slide-up", "data-aos-duration": 1000 }}
                                    >
                                        <Tweet tweet={tweet} />
                                    </ScrollAnimation>
                                ))
                            }
                        </Masonry>
                    </Col>
                </Row>
            </Container>
        </section>
    )
}

export default TweetsList
