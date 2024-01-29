import React, { useState, useEffect } from "react"
import { message, Row, Col, Tooltip, Image, Button } from "antd"
import {
    CheckOutlined,
    TwitterOutlined
} from "@ant-design/icons";
import { THIRD_PARTY_AUTH } from "../../../../../../core/utils/configs/third-party-auth"
import { useAuth } from "../../../../../../core/contexts/auth"
import EventService from "../../../../../../core/services/event"
import { getLocalStorage, LOCALSTORAGE_KEY, setLocalStorage } from "../../../../../../core/utils/helpers/storage";
import iconDiscord from "../../../../../../assets/images/icons/discord.svg"
import iconTwitter from "../../../../../../assets/images/icons/twitter.svg"
import lock from "../../../../../../assets/images/icons/lock.svg"
import spin from "../../../../../../assets/images/icons/spin.svg"
import ufo from "../../../../../../assets/images/icons/ufo.svg"
import clock from "../../../../../../assets/images/icons/clock.svg"
import { addCommaEachThreeDigits } from "../../../../../../core/utils/helpers/utils";

const discordAuthUrl = THIRD_PARTY_AUTH.DISCORD_AUTH
const twiterAuthUrl = THIRD_PARTY_AUTH.TWITTER_AUTH

const DescriptionToken = (props) => {
    const { event, setUserEventData, slug, nftBalance, setLoadingEvent } = props
    let userType = event?.user_type?.type.toLowerCase()
    const [userInfo, setUserInfo] = useState({})
    const { weekly_raffle } = event
    const userData = JSON.parse(getLocalStorage(LOCALSTORAGE_KEY.WALLET_ACCOUNT))
    const [loading, setLoading] = useState({
        loadingMoonBeast: false,
        loadingMintPass: false,
        loadingTwitter: false,
        loadingDiscord: false,
        loadingDaily: false,
        loadingThreeCheckin: false,
        loadingShareTwitter: false,
    })
    const notEligible = !(event.status === "live" && (userType === "everyone" || userType === "whitelisted" || (userType === "holders" && nftBalance.total > 0)))

    useEffect(() => {
        if (slug) {
            const currentEvent = { id: event.id, slug }
            setLocalStorage(LOCALSTORAGE_KEY.MF_CURRENT_EVENT, JSON.stringify(currentEvent))
        }
    }, [slug])

    const fetchUserByEvent = async (id) => {
        // setLoadingEvent(true)
        if (userData) {
            const { data } = await EventService.getUserInfoByEvent(id)
            setUserInfo(data.user)
            setUserEventData(data.user)
            // setLoadingEvent(false)
        }

    }

    const setLoadingObject = (name, value) => {
        setLoading({
            ...loading,
            [name]: value,
        })
    }

    const detectLoading = (obj) => {
        let count = 0
        Object.keys(obj).forEach(function (key) {
            if (obj[key]) {
                count++
            }
        });
        return count
    }

    const onCheckNft = async (nft_type) => {
        try {
            if (detectLoading(loading) !== 0) return
            if (!userData) {
                message.error({
                    content: "Please login first!",
                    className: "message-error",
                    duration: 5
                })
                return
            }
            if (notEligible) {
                message.error({
                    content: "You are not eligible to join this raffle",
                    className: "message-error",
                    duration: 5
                })
                return
            }
            const req = {
                event_id: event.id,
                nft_type
            }
            if (nft_type === "moon_beast") {
                setLoadingObject('loadingMoonBeast', true)
            } else {
                setLoadingObject('loadingMintPass', true)
            }
            const { error } = await EventService.checkHoldNft(req)
            setLoadingObject('loadingMoonBeast', false)
            setLoadingObject('loadingMintPass', false)
            if (error) {
                message.error({
                    content: error.message,
                    className: "message-error",
                    duration: 5
                })
                return
            } else {
                message.success({
                    content: `Check hold ${nft_type === "moon_beast" ? "Moon beast" : "Mint pass"} successfully.`,
                    className: "message-success",
                    duration: 5
                })
                fetchUserByEvent(event.id)
            }
        } catch (e) { }
        finally {
            setLoadingObject('loadingMoonBeast', false)
            setLoadingObject('loadingMintPass', false)
        }
    }

    const onDailyCheckin = async () => {
        try {
            if (detectLoading(loading) !== 0) return
            if (!userData) {
                message.error({
                    content: "Please login first!",
                    className: "message-error",
                    duration: 5
                })
                return
            }
            if (notEligible) {
                message.error({
                    content: "You are not eligible to join this raffle",
                    className: "message-error",
                    duration: 5
                })
                return
            }
            setLoadingObject('loadingDaily', true)
            const { error } = await EventService.dailyCheckin({ event_id: event.id })
            setLoadingObject('loadingDaily', false)
            if (error) {
                message.error({
                    content: error.message,
                    className: "message-error",
                    duration: 5
                })
                return
            } else {
                message.success({
                    content: `Daily checkin successfully.`,
                    className: "message-success",
                    duration: 5
                })
                fetchUserByEvent(event.id)
            }
        } catch (e) { }
        finally {
            setLoadingObject('loadingDaily', false)
        }
    }

    const onThreeCheckin = async () => {
        try {
            if (detectLoading(loading) !== 0) return
            if (userInfo?.three_checkin) return
            if (!userData) {
                message.error({
                    content: "Please login first!",
                    className: "message-error",
                    duration: 5
                })
                return
            }
            if (notEligible) {
                message.error({
                    content: "You are not eligible to join this raffle",
                    className: "message-error",
                    duration: 5
                })
                return
            }
            setLoadingObject('loadingThreeCheckin', true)
            const { error } = await EventService.threeCheckin({ event_id: event.id })
            setLoadingObject('loadingThreeCheckin', false)
            if (error) {
                message.error({
                    content: error.message,
                    className: "message-error",
                    duration: 5
                })
                return
            } else {
                message.success({
                    content: `Three checkins in a row successfully.`,
                    className: "message-success",
                    duration: 5
                })
                fetchUserByEvent(event.id)
            }
        } catch (e) { }
        finally {
            setLoadingObject('loadingThreeCheckin', false)
        }
    }

    const onChechAuth = async (social) => {
        try {
            if (detectLoading(loading) !== 0) return
            if (!userData) {
                message.error({
                    content: "Please login first!",
                    className: "message-error",
                    duration: 5
                })
                return
            }
            if (notEligible || !userData) {
                message.error({
                    content: "You are not eligible to join this raffle",
                    className: "message-error",
                    duration: 5
                })
                return
            }
            const req = { event_id: event.id }
            if (social === "discord") {
                if (userInfo?.join_discord) return
                if (userData.appUser.discord_id) {
                    setLoadingObject("loadingDiscord", true)
                    const { error } = await EventService.checkDiscord(req)
                    setLoadingObject("loadingDiscord", false)
                    if (error) {
                        message.error({
                            content: error.message,
                            className: "message-error",
                            duration: 5
                        })
                    } else {
                        message.success({
                            content: `Check join Discord successfully.`,
                            className: "message-success",
                            duration: 5
                        })
                        fetchUserByEvent(event.id)
                    }
                } else {
                    window.open(discordAuthUrl, "_blank")
                }
            }
            if (social === "twitter") {
                setLoadingObject("loadingTwitter", true)
                const { error } = await EventService.checkTwitter(req)
                setLoadingObject("loadingTwitter", false)
                if (error) {
                    message.error({
                        content: error.message,
                        className: "message-error",
                        duration: 5
                    })
                } else {
                    message.success({
                        content: `Check join Twitter successfully.`,
                        className: "message-success",
                        duration: 5
                    })
                    fetchUserByEvent(event.id)
                }
            }
        } catch (e) { }
        finally {
            setLoadingObject("loadingDiscord", false)
            setLoadingObject("loadingTwitter", false)
        }
    }

    const onCheckShareTwitter = async () => {
        try {
            if (detectLoading(loading) !== 0) return
            if (userInfo?.share_tweet) return
            if (!userData) {
                message.error({
                    content: "Please login first!",
                    className: "message-error",
                    duration: 5
                })
                return
            }
            if (notEligible) {
                message.error({
                    content: "You are not eligible to join this raffle",
                    className: "message-error",
                    duration: 5
                })
                return
            }
            setLoadingObject("loadingShareTwitter", true)
            const { error } = await EventService.shareTwitter({ event_id: event.id, url: window.location.href })
            setLoadingObject("loadingShareTwitter", false)
            if (error) {
                message.error({
                    content: error.message,
                    className: "message-error",
                    duration: 5
                })
                return
            } else {
                message.success({
                    content: `Check share Twitter successfully.`,
                    className: "message-success",
                    duration: 5
                })
                fetchUserByEvent(event.id)
            }
        } catch (e) { }
        finally {
            setLoadingObject("loadingShareTwitter", false)
        }
    }

    const checkConnectTwitter = () => {
        if (userData.appUser.twitter_id) return
        window.open(twiterAuthUrl, "_blank")
    }

    const { onDisconnect, auth: { user } } = useAuth()

    useEffect(() => {
        fetchUserByEvent(event.id)
    }, [user, onDisconnect])

    const navigateDiscord = (e) => {
        e.stopPropagation();
        window.open("https://discord.com/invite/hStdUVtHXp", "_blank")
    }

    const navigateTwitter = (e) => {
        e.stopPropagation();
        window.open("https://twitter.com/MoonFitOfficial", "_blank")
    }

    const openShareTwitter = (e) => {
        e.stopPropagation()
        window.open(`http://twitter.com/share?text=Let's join this event&url=${window.location.href}`, "_blank")
    }

    return (
        <div>
            <Row>
                <h3 className="raffle-game-title">DESCRIPTION</h3>
            </Row>
            <Row className="description">
                <div style={{ width: "100%" }} dangerouslySetInnerHTML={{ __html: event?.long_description?.replace(/\n/g, '<br />') }} />
            </Row>
            {
                event?.event_type?.title !== "outside_event" && <Row>
                    <h3 className="raffle-game-title">THIS WEEK REWARD</h3>
                </Row>
            }
            <Row justify="center" align="center">
                <div className="token-reward">
                    <img src={event?.event_detail[0]?.url} alt="reward" />
                </div>
            </Row>
            {
                event?.event_type?.title !== "outside_event" && <>
                    <Row justify="space-between" align="middle">
                        <Col>
                            <h3 className="raffle-game-title">YOUR ENTRIES: <span className="entry-count">{`${addCommaEachThreeDigits(userInfo?.point || 0)}/${addCommaEachThreeDigits(weekly_raffle?.point_claim)}`}</span></h3>
                        </Col>
                        <Col>
                            <h4>Total entries: <span style={{ color: "#e4007b" }}>{addCommaEachThreeDigits(event?.sum_entries || 0)}</span></h4>
                        </Col>
                    </Row>
                    {
                        event?.status === "live" && <Row>
                            <ul className="list-entries">
                                {
                                    weekly_raffle?.is_hold_moon_beast && <li className={`entry-item${userInfo?.hold_moon_beast ? " checked-hold" : ""}`} onClick={() => onCheckNft("moon_beast")}>
                                        <div className="entry-item-left">
                                            <div className={`entry-point-counter${userInfo?.point_moon_beast > 0 ? " has-point" : ""}`}>
                                                <h3>{userInfo?.point_moon_beast || 0}</h3>
                                            </div>
                                            <span className="entry-title">HODL a MoonFit Beast & Beauty</span>
                                        </div>
                                        <Tooltip color="#a16bd8" placement="left" title={userInfo?.point_moon_beast > 0 ? `Click to update your entries` : `This is worth ${weekly_raffle.hold_moon_beast} per NFT`}>
                                            <div className={`entry-achived nft`}>
                                                {loading.loadingMoonBeast ? <Loading /> : (<>
                                                    <p>{`+${weekly_raffle.hold_moon_beast}`}</p>
                                                    <span>PER NFT</span>
                                                </>)}
                                            </div>
                                        </Tooltip>
                                    </li>
                                }
                                {
                                    weekly_raffle?.is_hold_mint_pass && <li className={`entry-item${userInfo?.hold_mint_pass ? " checked-hold" : ""}`} onClick={() => onCheckNft("mint_pass")}>
                                        <div className="entry-item-left">
                                            <div className={`entry-point-counter${userInfo?.point_mint_pass > 0 ? " has-point" : ""}`}>
                                                <h3>{userInfo?.point_mint_pass || 0}</h3>
                                            </div>
                                            <span className="entry-title">HODL a Mint Pass</span>
                                        </div>
                                        <Tooltip color="#a16bd8" placement="left" title={userInfo?.point_mint_pass > 0 ? `Click to update your entries` : `This is worth ${weekly_raffle.hold_mint_pass} per NFT`}>
                                            <div className={`entry-achived nft`}>
                                                {loading.loadingMintPass ? <Loading /> : (<>
                                                    <p>{`+${weekly_raffle.hold_mint_pass}`}</p>
                                                    <span>PER NFT</span>
                                                </>)}
                                            </div>
                                        </Tooltip>
                                    </li>
                                }
                                {
                                    weekly_raffle?.is_daily_checkin && <li className={`entry-item${userInfo?.daily_checkin ? " checked-daily" : ""}`} onClick={onDailyCheckin}>
                                        <div className="entry-item-left">
                                            <div className={`entry-point-counter${userInfo?.point_daily_checkin > 0 ? " has-point" : ""}`}>
                                                <h3>{userInfo?.point_daily_checkin || 0}</h3>
                                            </div>
                                            <span className="entry-title">Daily Checkin</span>
                                        </div>
                                        <Tooltip color="#a16bd8" overlayStyle={{ maxWidth: '300px' }} overlayInnerStyle={{ width: '250px' }} placement="left" title={userInfo?.point_daily_checkin > 0 ? `Done! You can check-in again tomorrow` : `Enter each day for an extra entry`}>
                                            <span className={`entry-achived`}>
                                                {loading.loadingDaily ? <Loading /> : (userInfo?.daily_checkin ? <img src={clock} /> : `+${weekly_raffle.daily_checkin}`)}
                                            </span>
                                        </Tooltip>
                                    </li>
                                }
                                {
                                    weekly_raffle?.is_three_checkin && <li className={`entry-item${userInfo?.three_checkin ? " checked" : " locked"}`} onClick={onThreeCheckin}>
                                        <div className="entry-item-left">
                                            <div className={`entry-point-counter${userInfo?.point_three_checkin ? " has-point" : ""}`}>
                                                <h3>{userInfo?.point_three_checkin || 0}</h3>
                                            </div>
                                            <span className="entry-title">Check In for 3 Consecutive Days and Get {weekly_raffle?.three_checkin} Bonus Entries</span>
                                        </div>
                                        <Tooltip color="#a16bd8" overlayStyle={{ maxWidth: '320px' }} overlayInnerStyle={{ width: '270px' }} placement="left" title={userInfo?.three_checkin ? `Done! You got ${weekly_raffle?.three_checkin} entries` : (parseInt(userInfo?.count_daily, 10) < 3 ? `Check in for 3 consecutive days to unlock this task: ${userInfo?.count_daily}/3 days completed!` : `This is worth ${weekly_raffle.three_checkin > 1 ? `${weekly_raffle.three_checkin} entries` : `${weekly_raffle.three_checkin} entry`}`)}>
                                            <span className={`entry-achived`}>
                                                {loading.loadingThreeCheckin ? <Loading /> : (userInfo?.three_checkin ? <CheckOutlined /> : (parseInt(userInfo?.count_daily, 10) < 3 ? <img src={lock} /> : `+${weekly_raffle?.three_checkin}`))}
                                            </span>
                                        </Tooltip>
                                    </li>
                                }
                                {
                                    weekly_raffle?.is_join_discord && <li
                                        className={`entry-item${userInfo?.join_discord ? " checked" : ""}`}
                                        onClick={() => onChechAuth("discord")}>
                                        <div className="entry-item-left">
                                            <div className={`entry-point-counter${userInfo?.point_discord > 0 ? " has-point" : ""}`}>
                                                <h3>{userInfo?.point_discord || 0}</h3>
                                            </div>
                                            <span className="entry-title">Join <a className="h-link discord" onClick={navigateDiscord}><img src={iconDiscord} /> MoonFit Discord server</a></span>
                                        </div>
                                        <Tooltip color="#a16bd8" placement="left" title={userInfo?.point_discord > 0 ? `Done! You got one entry` : `This is worth ${weekly_raffle.join_discord > 1 ? `${weekly_raffle.join_discord} entries` : `${weekly_raffle.join_discord} entry`}`}>
                                            <span className={`entry-achived`}>
                                                {loading.loadingDiscord ? <Loading /> : (userInfo?.join_discord ? <CheckOutlined /> : `+${weekly_raffle.join_discord}`)}
                                            </span>
                                        </Tooltip>
                                    </li>
                                }
                                {
                                    weekly_raffle?.is_follow_twitter && <li
                                        className={`entry-item${userInfo?.follow_twitter ? " checked" : ""}`}
                                        onClick={() => onChechAuth("twitter")}>
                                        <div className="entry-item-left">
                                            <div className={`entry-point-counter${userInfo?.point_twitter > 0 ? " has-point" : ""}`}>
                                                <h3>{userInfo?.point_twitter || 0}</h3>
                                            </div>
                                            <span className="entry-title">Follow <a className="h-link twitter" onClick={navigateTwitter}><img src={iconTwitter} /> @MoonFitOfficial</a></span>
                                        </div>
                                        <Tooltip color="#a16bd8" placement="left" title={userInfo?.point_twitter > 0 ? `Done! You got one entry` : `This is worth ${weekly_raffle.follow_twitter > 1 ? `${weekly_raffle.follow_twitter} entries` : `${weekly_raffle.follow_twitter} entry`}`}>
                                            <span className={`entry-achived`}>
                                                {loading.loadingTwitter ? <Loading /> : (userInfo?.follow_twitter ? <CheckOutlined /> : `+${weekly_raffle.follow_twitter}`)}
                                            </span>
                                        </Tooltip>
                                    </li>
                                }
                                {
                                    (userData?.appUser?.twitter_id && weekly_raffle?.is_follow_twitter) && <li
                                        className={`entry-item${userInfo?.follow_twitter ? " checked" : ""}`}
                                        onClick={() => onChechAuth("twitter")}>
                                        <div className="entry-item-left">
                                            <div className={`entry-point-counter${userInfo?.point_twitter > 0 ? " has-point" : ""}`}>
                                                <h3>{userInfo?.point_twitter || 0}</h3>
                                            </div>
                                            <span className="entry-title">Follow <a className="h-link twitter" onClick={navigateTwitter}><img src={iconTwitter} /> @MoonFitOfficial</a></span>
                                        </div>
                                        <Tooltip color="#a16bd8" placement="left" title={userInfo?.point_twitter > 0 ? `Done! You got one entry` : `This is worth ${weekly_raffle.follow_twitter > 1 ? `${weekly_raffle.follow_twitter} entries` : `${weekly_raffle.follow_twitter} entry`}`}>
                                            <span className={`entry-achived`}>
                                                {loading.loadingTwitter ? <Loading /> : (userInfo?.follow_twitter ? <CheckOutlined /> : `+${weekly_raffle.follow_twitter}`)}
                                            </span>
                                        </Tooltip>
                                    </li>
                                }
                                {
                                    (userData?.appUser?.twitter_id && weekly_raffle?.is_share_tweet) && <li className={`entry-item${userInfo?.share_tweet ? " checked" : ""}`} onClick={onCheckShareTwitter}>
                                        <div className="entry-item-left">
                                            <div className={`entry-point-counter${userInfo?.point_share_tweet ? " has-point" : ""}`}>
                                                <h3>{userInfo?.point_share_tweet || 0}</h3>
                                            </div>
                                            <div className="entry-title">Share this event on Twitter <Button type="primary"
                                                className="btn-twitter"
                                                shape="round"
                                                size="small"
                                                onClick={(e) => openShareTwitter(e)}
                                                icon={<TwitterOutlined />}>
                                                SHARE
                                            </Button></div>
                                        </div>
                                        <Tooltip color="#a16bd8" placement="left" title={`This is worth ${weekly_raffle.share_tweet > 1 ? `${weekly_raffle.share_tweet} entries` : `${weekly_raffle.share_tweet} entry`}`}>
                                            <span className={`entry-achived`}>
                                                {loading.loadingShareTwitter ? <Loading /> : (userInfo?.share_tweet ? <CheckOutlined /> : `+${weekly_raffle?.share_tweet}`)}
                                            </span>
                                        </Tooltip>
                                    </li>
                                }
                            </ul>
                        </Row>
                    }
                    {
                        event?.status === "expired" && <Row>
                            <div className="raffle-end">
                                <Row className="raffle-end-icon" justify="center">
                                    <Image src={ufo} preview={false} />
                                </Row>
                                <div className="raffle-end-text" justify="center">
                                    <h3>The raffle has ended.</h3>
                                    <h4>Winner will be announced soon!</h4>
                                </div>
                            </div>
                        </Row>
                    }
                </>
            }
        </div>
    )
}

const Loading = () => {
    return (
        <img className="loader" src={spin} />
    )
}

export default DescriptionToken