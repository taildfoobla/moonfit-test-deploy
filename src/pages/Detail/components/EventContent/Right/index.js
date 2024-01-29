import React, { useState } from "react"
import { Row, Col, Button, Modal, message } from "antd"
import RewardProduct from "./RewardProduct"
import RewardToken from "./RewardToken"
import RewardNft from "./RewardNft"
import "./styles.less"
import CheckoutForm from "../../../../../components/CheckoutForm"
import EventService from "../../../../../core/services/event"
import prohibit from "../../../../../assets/images/icons/prohibit.svg"
import { useNavigate } from "react-router-dom";
import { pluralize } from "../../../../../core/utils/helpers/utils"
import { THIRD_PARTY_AUTH } from "../../../../../core/utils/configs/third-party-auth"

const googleForm = THIRD_PARTY_AUTH.GOOGLE_FORM

const Right = (props) => {
    const navigate = useNavigate()
    const { event, userEventData, selectedNft, userScore, nftBalance } = props
    const [isOpenModal, setIsOpenModal] = useState(false)
    const [size, setSize] = useState({})
    const [color, setColor] = useState({})

    const claimReward = () => {
        let content = ""
        if (event?.event_type?.title === "merchandise") {
            if (!size?.value) {
                content = "Please choose your size"
            }
            if (!color) {
                content = "Please choose your color"
            }
            if (!selectedNft) {
                content = "Please choose your NFT"
            }
        }
        if (event?.event_type?.title === "raffle_game") {
            if (userScore < event?.weekly_raffle?.point_claim) {
                content = "Your entries are not fulfill to claim rewards"
            }
        }
        // if (!event.is_claim) {
        //     content = "This reward has been claimed"
        // }
        if (content) {
            message.error({
                content,
                className: "message-error",
                duration: 5
            })
            return
        }
        if (event?.event_type?.title === "merchandise") {
            setIsOpenModal(true);
        }
        if (event?.event_type?.title === "raffle_game") {
            // claimRaffle()
            window.open(googleForm, "_blank")
        }
        if (event?.event_type?.title === "nft") {
            claimMintPass()
        }
    };

    const joinOutsideEvent = () => {
        window.open(event?.outside_event?.links, "_blank")
    }

    const claimRaffle = async () => {
        try {
            const { error } = await EventService.claimRaffle({ event_id: event.id })
            if (error) {
                message.success({
                    content: error.message,
                    className: 'message-error',
                })
            } else {
                message.success({
                    content: "Claim reward successfully.",
                    className: 'message-success',
                })
                navigate("/")
            }
        } catch (e) { }
    }

    const claimMintPass = async () => {
        try {
            const { error } = await EventService.claimMintPass({ event_id: event.id })
            if (error) {
                message.success({
                    content: error.message,
                    className: 'message-error',
                })
            } else {
                message.success({
                    content: "Claim reward successfully.",
                    className: 'message-success',
                })
                navigate("/")
            }
        } catch (e) { }
    }

    const hideModal = () => {
        setIsOpenModal(false);
    }

    const outOfSlot = event.number_slot > 0 ? event.count >= event.number_slot : false
    // const expiredEvent = moment() > moment(event.end)
    // const notEligible = !((event?.is_claim && (event?.user_type?.type?.toLowerCase() === "everyone" || (nftBalance > 0 || event?.user_type?.type?.toLowerCase() === "whitelisted"))))
    const notEligible = !((event?.user_type?.type?.toLowerCase() === "everyone" && userEventData?.is_claimed) || ((event?.user_type?.type?.toLowerCase() === "whitelisted" || (event?.user_type?.type?.toLowerCase() === "holders" && nftBalance.total > 0)) && userEventData?.is_claimed))
    // console.log('outOfSlot', outOfSlot)
    // console.log('expiredEvent', expiredEvent)
    // console.log('notEligible', notEligible)
    return (
        <>
            <Col xs={24} xl={8}>
                <div className={`sticky-reward${event?.event_type?.title === "outside_event" ? " outside-event" : ""}`}>
                    {
                        event?.event_type?.title === "merchandise" && <RewardProduct {...props}
                            size={size}
                            setSize={setSize}
                            color={color}
                            setColor={setColor}
                        />
                    }
                    {
                        event?.event_type?.title === "raffle_game" && <RewardToken {...props} />
                    }
                    {
                        event?.event_type?.title === "nft" && <RewardNft {...props} />
                    }
                    {
                        event?.event_type?.title !== "outside_event" && <Row className="btn-claim">
                            <Button
                                type="primary"
                                className={`-primary-2${(outOfSlot || notEligible) ? ' disabled' : ''}`}
                                onClick={claimReward}
                                disabled={outOfSlot || notEligible}
                            >
                                {(outOfSlot || notEligible) ? <>{<img src={prohibit} alt="" />} WIN TO CLAIM REWARD</> : 'CLAIM REWARD'}
                            </Button>
                        </Row>
                    }
                    {
                        event?.event_type?.title === "outside_event" && <Row className="btn-claim">
                            <Button
                                type="primary"
                                className={`-primary-2`}
                                onClick={joinOutsideEvent}
                            >
                                JOIN HERE
                            </Button>
                        </Row>
                    }
                    {
                        <Row className="claim-count" justify="center">
                            <p><span className="total-count">{event.number_slot ? `${event.count}/${event.number_slot}` : event.count}</span> {event?.event_type?.title === "raffle_game" ? "people joined" : `${pluralize(event.count, "reward")} claimed`}</p>
                        </Row>
                    }
                </div>

            </Col>
            <Modal
                className="checkout-modal"
                open={isOpenModal}
                footer={false}
                onCancel={hideModal}>
                <CheckoutForm
                    hideModal={hideModal}
                    eventId={event.id}
                    size={size.value}
                    color={color.value}
                    selectedNft={selectedNft}
                />
            </Modal>
        </>
    )
}


export default Right
