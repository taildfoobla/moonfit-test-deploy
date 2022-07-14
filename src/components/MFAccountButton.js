import React, {useContext, useEffect, useRef, useState} from 'react'
import MoonFitAuthContext from "../contexts/MoonFitAuthContext"
import {Avatar, Modal, Spin, Typography} from "antd"
import QRCode from "react-qr-code"
import {getOrCreateSession, logoutSession, retrieveSessionToken} from "../services/webSession"
import {LoadingOutlined} from "@ant-design/icons"
import {getLocalStorage, LOCALSTORAGE_KEY, setLocalStorage} from "../utils/storage"
import {getReactEnv} from "../utils/env"

const {Paragraph} = Typography
const ENV = getReactEnv('ENV')


const MFAccountButton = (props) => {
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [sessionId, setSessionId] = useState('')
    const [logoutLoading, setLogoutLoading] = useState(false)

    const {user, setUser, isAuthenticated, setIsAuthenticated, logoutAccount} = useContext(MoonFitAuthContext)

    const tokenRetrieverRef = useRef(0)

    useEffect(() => {
        if(!!user.userId) {
            clearTokenInterval()
            setIsAuthenticated(true)
            hideModal()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user.userId])

    useEffect(() => {
        const storageSessionId = getLocalStorage(LOCALSTORAGE_KEY.SESSION_ID)
        storageSessionId && setSessionId(storageSessionId)
    }, [])

    const showModal = () => setIsModalVisible(true)

    const hideModal = () => {
        setIsModalVisible(false)
        clearTokenInterval()
    }

    const clearTokenInterval = () => tokenRetrieverRef.current && clearInterval(tokenRetrieverRef.current)

    const fetchSessionInfo = async () => {
        const {success, data} = await getOrCreateSession()
        if (success && data.data) {
            const {session_key: sessionId} = data.data
            setSessionId(sessionId)
            setLocalStorage(LOCALSTORAGE_KEY.SESSION_ID, sessionId)
            return sessionId
        } else {
            console.log('Error on fetching session info')
            return null
        }
    }

    const fetchSessionToken = async (sessionId) => {
        const {success, data} = await retrieveSessionToken(sessionId)
        if (success && data.data) {
            const {token, id: userId, name, avatar, email} = data.data
            const user = {userId, name, avatar, email}
            setUser(user)
            setLocalStorage(LOCALSTORAGE_KEY.MF_ACCOUNT, JSON.stringify(user))
            setLocalStorage(LOCALSTORAGE_KEY.ACCESS_TOKEN, token)
        } else console.log('Error on fetching session info')
    }

    const onOpenSignInModal = async () => {
        showModal()
        const sessionId = await fetchSessionInfo()
        if (sessionId) {
            tokenRetrieverRef.current = setInterval(() => fetchSessionToken(sessionId), 3000)
        }
    }

    const logout = async () => {
        setLogoutLoading(true)
        const {success, data} = await logoutSession(sessionId)
        if (success && data.data) {
            logoutAccount()
            setLogoutLoading(false)
            hideModal()
        } else alert('An error occurred when logging out account, please try again')
    }

    const getShortUsername = (name) => {
        return name.length > 15 ? name.slice(0, 6) + "..." + name.slice(name.length - 6, name.length) : name
    }

    return isAuthenticated ? (
        <div className={'ml-2'}>
            <button type="button"
                    onClick={showModal}
                    className="header-button button button-secondary">
                <svg className="inline mr-1" style={{marginTop: 4}} width="24" height="14"
                     viewBox="0 0 16 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M13.3256 3.12612L13.3326 3.02567L13.5598 0.160645H11.0963L8.57798 3.68064L8.81882 0.248042L6.13542 0.162319L3.12149 4.64938C3.12149 4.64938 2.34524 5.87227 1.04333 5.61477L0.197266 8.11681H2.03425C2.03425 8.11681 3.43807 8.09035 4.58012 6.82962C5.71553 5.56856 6.0733 4.79638 6.0733 4.79638V7.81979H8.44116L10.6841 4.79638L10.3951 7.81979H14.9151L15.5894 5.53574H13.1329L13.3256 3.12612Z"
                        fill="white"/>
                </svg>
                {getShortUsername(user?.name)}
            </button>
            <Modal title="Account Information"
                   visible={isModalVisible}
                   onCancel={hideModal}
                   wrapClassName={'mf-modal account-modal'}
                   className={'mf-modal-content account-modal-content'}
                   footer={[
                       <button type="button"
                               key="1"
                               onClick={logout}
                               style={{width: 90}}
                               className="button button-secondary">
                           {logoutLoading ? <Spin indicator={<LoadingOutlined style={{fontSize: 18}} spin/>}/>: 'Logout'}
                       </button>,
                       <button type="button"
                               key="2"
                               onClick={hideModal}
                               className="button button-primary">
                           Done
                       </button>
                   ]}>
                <div>
                    <div className="flex justify-center items-center">
                        <Avatar size={70} src={user.avatar} />
                    </div>
                    <div className="flex flex-col mt-6">
                        <div className={'flex'}>User ID</div>
                        <div className={'flex text-green-500 normal-case'}>{user.userId}</div>
                    </div>
                    <div className="flex flex-col mt-2">
                        <div className={'flex'}>Username</div>
                        <div className={'flex text-green-500 normal-case'}>{user.name}</div>
                    </div>
                    <div className="flex flex-col mt-2">
                        <div className={'flex'}>Email</div>
                        <div className={'flex text-green-500 normal-case'}>{user.email}
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    ) : (
        <div className={'ml-2'}>
            <button type="button"
                    onClick={onOpenSignInModal}
                    className="flex items-center header-button button button-secondary">
                <svg className="inline mr-1" style={{marginTop: 4}} width="24" height="14"
                     viewBox="0 0 16 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M13.3256 3.12612L13.3326 3.02567L13.5598 0.160645H11.0963L8.57798 3.68064L8.81882 0.248042L6.13542 0.162319L3.12149 4.64938C3.12149 4.64938 2.34524 5.87227 1.04333 5.61477L0.197266 8.11681H2.03425C2.03425 8.11681 3.43807 8.09035 4.58012 6.82962C5.71553 5.56856 6.0733 4.79638 6.0733 4.79638V7.81979H8.44116L10.6841 4.79638L10.3951 7.81979H14.9151L15.5894 5.53574H13.1329L13.3256 3.12612Z"
                        fill="white"/>
                </svg>
                Login
            </button>
            <Modal title="Web Cross Sign In"
                   visible={isModalVisible}
                   wrapClassName={'mf-modal cross-sign-in-modal'}
                   className={'mf-modal-content cross-sign-in-modal-content'}
                   onCancel={hideModal}
                   footer={[
                       <button type="button"
                               key="2"
                               onClick={hideModal}
                               className="button button-primary">
                           Done
                       </button>
                   ]}>
                {
                    sessionId ? (
                        <div className={'flex flex-col justify-center items-center m-auto'}>
                            <div className={'flex qr-wrap bg-white p-3 rounded'}>
                                <QRCode value={sessionId} size={200}
                                        title={'Scan this QR in MoonFit App to sign in'}/>
                            </div>
                            <div className={'flex flex-col text-center mt-8'}>
                                <h5>Sign in with QR Code</h5>
                                <p className={'normal-case'}>Scan this QR code with the mobile app to sign in
                                    instantly</p>
                                {/* TODO Only for Develop */}
                                {
                                    ENV === 'development' && <Paragraph className={'normal-case text-green-500 flex items-center justify-center'}
                                           copyable={{text: sessionId, format: 'text/plain'}}>Session
                                    ID: {sessionId}</Paragraph>
                                }
                            </div>
                        </div>
                    ) : (
                        <div className="flex justify-center items-center h-[380px]">
                            <Spin indicator={<LoadingOutlined style={{fontSize: 24}} spin/>}/>
                        </div>
                    )
                }
            </Modal>
        </div>
    )
}

export default MFAccountButton