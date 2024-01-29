import React, { useEffect } from "react"
import { message } from "antd"
import { useNavigate } from "react-router-dom"
import EventService from "../../../core/services/event"
import { getLocalStorage, LOCALSTORAGE_KEY, setLocalStorage } from "../../../core/utils/helpers/storage"

const RedirectEvent = () => {
    const navigate = useNavigate()
    const currentEvent = JSON.parse(getLocalStorage(LOCALSTORAGE_KEY.MF_CURRENT_EVENT))
    const url = window.location.href
    let userData = JSON.parse(getLocalStorage(LOCALSTORAGE_KEY.WALLET_ACCOUNT))

    useEffect(() => {
        if (url.indexOf("access_denied") > -1) {
            navigate(`/events/${currentEvent.slug}`)
        } else {
            const objUrl = getQueryParams(url)
            if (url.indexOf("discord") > -1 && objUrl.access_token) {
                onConnectDiscord(objUrl.access_token, currentEvent.id)
            }
            if (url.indexOf("twitter") > -1 && objUrl.code) {
                onConnectTwitter(objUrl.code, currentEvent.id)
            }
        }
        // eslint-disable-next-line
    }, [])

    const onCheckDiscord = async (event_id) => {
        const req = { event_id }
        const { error } = await EventService.checkDiscord(req)
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
        }
        navigate(`/events/${currentEvent.slug}`)
    }

    const onConnectDiscord = async (accessToken, eventId) => {
        const { data } = await EventService.connectDiscord(accessToken, eventId)
        if (data) {
            userData = {
                ...userData,
                appUser: data
            }
            setLocalStorage(LOCALSTORAGE_KEY.WALLET_ACCOUNT, JSON.stringify(userData))
            onCheckDiscord(eventId)
        }
    }

    const onConnectTwitter = async (code, eventId) => {
        const { data } = await EventService.connectTwitter(code, eventId)
        if (data) {
            userData = {
                ...userData,
                appUser: data
            }
            setLocalStorage(LOCALSTORAGE_KEY.WALLET_ACCOUNT, JSON.stringify(userData))
            navigate(`/events/${currentEvent.slug}`)
        }
    }

    const getQueryParams = (url) => {
        let objUrl = {}
        const queryParams = url.split("&") || []
        queryParams.forEach(s => {
            var [key, value] = s.split("=");
            objUrl[key] = value;
        });
        return objUrl
    }

    return (
        <></>
    )
}

export default RedirectEvent
