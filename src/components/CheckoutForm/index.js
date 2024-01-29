import React, { useEffect, useState } from "react"
import { Button, Col, Form, Input, Row, message } from "antd"
import "./styles.less"
import Container from "../Container";
import EventService from "../../core/services/event";
import { useNavigate } from "react-router-dom";

const CheckoutForm = (props) => {

    const navigate = useNavigate()
    const { eventId, size, color, selectedNft } = props
    const [form, setForm] = useState({
        event_id: eventId,
        nft_info: {
            nft_type: "",
            token_id: null
        },
        merchandise_reward_detail: {}
    })

    useEffect(() => {
        setForm({
            ...form,
            nft_info: {
                nft_type: selectedNft.type,
                token_id: parseInt(selectedNft.tokenId, 10)
            }
        })
    }, [selectedNft])

    const onFinish = async (values) => {
        const req = {
            ...form,
            merchandise_reward_detail: {
                size: size,
                color: color,
                ...values,
            }
        }
        try {
            const { error } = await EventService.claimMerchandise(req)
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

    return (
        <div className="checkout-form">
            <Container>
                <h4 className="checkout-form__title">Check out</h4>
                <Form
                    name="basic"
                    initialValues={initialValues}
                    onFinish={(values) => onFinish(values)}
                    autoComplete="off"
                >
                    <div className="checkout-form__group -contact">
                        <div className="checkout-form__heading">Contact information</div>
                        <Form.Item
                            name="fullname"
                            rules={[{ required: true, message: 'This field is required' }]}
                        >
                            <Input placeholder="Full name" className="checkout-form__input" maxLength={70} />
                        </Form.Item>
                        <Form.Item
                            name="email"
                            rules={[
                                { required: true, message: 'This field is required' },
                                { type: "email", message: "Email is invalid" }
                            ]}
                        >
                            <Input type="email" placeholder="Email address" name="email" className="checkout-form__input" maxLength={50} />
                        </Form.Item>
                        <Form.Item
                            name="phone"
                            rules={[{ required: true, message: 'This field is required' }]}
                        >
                            <Input type="phone" placeholder="Phone number" className="checkout-form__input" maxLength={15}
                                onKeyPress={(e) => (!/^[0-9]*\-?[0-9]*$/.test(e.key)) && e.preventDefault()}
                            />
                        </Form.Item>
                    </div>

                    <div className="checkout-form__group -shipping">
                        <div className="checkout-form__heading">Shipping details</div>
                        <Form.Item
                            name="street"
                            rules={[{ required: true, message: 'This field is required' }]}
                        >
                            <Input placeholder="Street address" className="checkout-form__input" maxLength={100} />
                        </Form.Item>
                        <Form.Item
                            name="detail"
                            rules={[{ required: true, message: 'This field is required' }]}
                        >
                            <Input placeholder="Apt, Suite, etc" className="checkout-form__input" maxLength={100} />
                        </Form.Item>


                        <Row gutter={12}>
                            <Col span={12}>
                                <Form.Item
                                    name="country"
                                    rules={[{ required: true, message: 'This field is required' }]}
                                >
                                    <Input placeholder="Country" className="checkout-form__input" maxLength={100} />
                                </Form.Item>

                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="city"
                                    rules={[{ required: true, message: 'This field is required' }]}
                                >
                                    <Input placeholder="City" className="checkout-form__input" maxLength={100} />
                                </Form.Item>

                            </Col>
                        </Row>

                        <Row gutter={12}>
                            <Col span={12}>
                                <Form.Item
                                    name="state"
                                    rules={[{ required: true, message: 'This field is required' }]}
                                >
                                    <Input placeholder="State" className="checkout-form__input" maxLength={100} />
                                </Form.Item>

                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="zip_code"
                                    rules={[{ required: true, message: 'This field is required' }]}
                                >
                                    <Input placeholder="Zip code" className="checkout-form__input" maxLength={6} />
                                </Form.Item>

                            </Col>
                        </Row>
                    </div>

                    <div className="checkout-form__cta">
                        <Form.Item >
                            <Button type="primary" htmlType="submit" block className="checkout-form__confirm">Confirm</Button>
                        </Form.Item>
                    </div>
                </Form>
            </Container>
        </div>
    )
}

const initialValues = {
    size: "",
    color: "",
    fullname: "",
    email: "",
    phone: "",
    city: "",
    street: "",
    detail: "",
    country: "",
    state: "",
    zip_code: ""
}


export default CheckoutForm
