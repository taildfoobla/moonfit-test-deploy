import {createApiRequest, createAuthApiRequest} from "../utils/api"

export const getOrCreateSession = (address) => {
    return createApiRequest({
        url: "/web/add-session",
        method: "POST",
    })
}

export const retrieveSessionToken = (sessionId) => {
    return createApiRequest({
        url: `/web/auth/${sessionId}`,
        method: "POST",
    })
}

export const logoutSession = (sessionId) => {
    return createAuthApiRequest({
        url: `/web/auth/${sessionId}/logout`,
        method: "POST",
    })
}