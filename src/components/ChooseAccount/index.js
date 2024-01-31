import "./styles.less"
import React, {useEffect, useState} from "react"
import {Button, Modal} from "antd"
import Popup from "../../assets/images/popup.png"
import Lottery from "../../assets/images/lottery.png"
import {useAuth} from "../../core/contexts/auth"
import {getShortAddress} from "../../core/utils-app/blockchain"
import moonfitLogo from "../../assets/images/deposit/logo3.png"
import imageStep1 from "../../assets/images/deposit/iPhone.png"
import imageStep2 from "../../assets/images/deposit/iPhone1.png"
import imageStep3 from "../../assets/images/deposit/iPhone2.png"
import imageStep4 from "../../assets/images/deposit/iPhone3.png"
import {ReactComponent as CheckIcon} from "../../assets/images/deposit/Check.svg"
import {getLocalStorage, setLocalStorage, removeLocalStorage} from "../../core/utils/helpers/storage"
import {Fragment} from "react"
import {Col, Row, Radio} from "antd"
import {useLocation} from "react-router-dom"
import { LOCALSTORAGE_KEY } from "../../core/utils-app/storage"
import Loading from "../../pages/Deposit/components/LoadingOutlined"

export default function ChooseAccountModal() {
    const location = useLocation()

   
    const [listAccount, setListAccount] = useState([])
    const [userIdSelected, setUserIdSelected] = useState("")
    const [isLoading,setIsLoading]=useState(true)
    const {
        listUsers,
        auth,
        connectToCyber,
        chooseUserData,
        setChooseUserData,
        handleLogin,
        handleLoginAfterChooseAccountCyberApp,
        handleLoginAfterChooseAccount,
        onDisconnect,
        isOpenModalChooseAccount,
        setIsOpenModalChooseAccount
    } = useAuth()
    useEffect(() => {
        // const selectedUserId = getLocalStorage("SELECTED_USER_ID")
        // if (auth.isConnected && !selectedUserId) {
        //     const walletSignature= JSON.parse(getLocalStorage(LOCALSTORAGE_KEY.WALLET_SIGNATURE))
        //     if(walletSignature!==null&&walletSignature!==undefined){
        //         const message =  walletSignature.signature

        //     }
          
        //     setIsChooseAcc(true)
        //     getListUsers()
        // }
        
        // accessWebsite()
        setTimeout(()=>{setIsLoading(false)},1000)
    }, [])

    const accessWebsite= async()=>{
        const selectedUserId = getLocalStorage("SELECTED_USER_ID")
        if (auth.isConnected && selectedUserId==null) {
            const walletSignature= JSON.parse(getLocalStorage(LOCALSTORAGE_KEY.WALLET_SIGNATURE))
            if(walletSignature!==null&&walletSignature!==undefined){
                try{
                    if(connectToCyber?.isConnected){

                    }else{
                       
                            handleLogin("","","reCall")
                       
                    }
                
                }catch(err){
                    onDisconnect()
                }

            }
            getListUsers()
            setIsOpenModalChooseAccount(true)
            
            
        }
    }

    const handleOk = () => {
        setIsModalOpen(false)
    }

    const handleCancel = () => {
        setIsOpenModalChooseAccount(false)
      
    }

    const getListUsers = () => {
        if (listUsers?.data?.length!==0&&listUsers?.data) {    
            setUserIdSelected(listUsers.data[0].id)
            setListAccount(listUsers.data)
        }
    }

    const onChangeAccount = ({target: {value}}) => {
        setUserIdSelected(value)
    }

    const handleConfirm = async () => {
        const account = auth?.user?.account
        const isConnectedCyberApp = connectToCyber?.isConnected
        let res
        if (isConnectedCyberApp) {
            res = await handleLoginAfterChooseAccountCyberApp(account, userIdSelected)
        } else {
            res = await handleLoginAfterChooseAccount(account, userIdSelected)
        }
        const data = res?.data?.data
        const accessToken = data?.access_token
        const refreshToken = data?.refresh_token
        removeLocalStorage("ACCESS_TOKEN")
        removeLocalStorage("REFRESH_TOKEN")
        setLocalStorage("ACCESS_TOKEN", accessToken)
        setLocalStorage("REFRESH_TOKEN", refreshToken)
        setLocalStorage("SELECTED_USER_ID", userIdSelected)
        setChooseUserData(data)
        setIsOpenModalChooseAccount(false)
     
    }

    const _renderUserInfo = () => {
        if(isLoading){
            return <Loading/>
        }
        if (isOpenModalChooseAccount&&listUsers?.success&&!isLoading) {
            return (
                <div className="section-choose-account">
                    <div className="choose-account-header">Choose MOONFIT account</div>
                    <Radio.Group name="radiogroup" value={userIdSelected} onChange={onChangeAccount}>
                        {listAccount.map((item, index) => (
                            <Radio key={item.id} value={item.id}>
                                <div className="Radio-text">
                                    <div className="account-image">
                                        <div className="account-image-box">
                                            <img src={item.avatar} alt={item.name} />
                                        </div>
                                    </div>

                                    <div className="account-info">
                                        <span className="account-name">{item.name}</span>
                                        <span className="account-email">{item.email}</span>
                                    </div>
                                </div>
                            </Radio>
                        ))}
                    </Radio.Group>

                    <Button type="primary" className="confirm" onClick={handleConfirm}>
                        <span className="confirm-icon">
                            <CheckIcon width={12} height={12} />
                        </span>
                        <span className="confirm-text">Confirm</span>
                    </Button>
                </div>
            )
        }

        if (!listUsers?.success&&!isLoading) {
            return (
                <Fragment>
                    <div className="section-connected-wallet">
                        <div className="section-connected-title">User info</div>
                        <div className="section-connected-massage">
                            <p>
                                Can't find user connected to{" "}
                                {listUsers?.account ? getShortAddress(listUsers?.account, 6) : ""} wallet.
                            </p>
                        </div>
                        <div className="section-connected-guide">
                            <div className="guide-title">
                                <img src={moonfitLogo} alt="MoonFit app" />
                                <p>
                                    Kindly open MoonFit app <br /> and connect your wallet first.
                                </p>
                            </div>
                            <div className="guide-steps">
                                <Row gutter={20}>
                                    <Col className="gutter-row" span={12}>
                                        <div className="step step-1">
                                            <span>Step 1</span>
                                            <div className="step-image">
                                                <img src={imageStep1} alt="step 1" />
                                            </div>
                                        </div>
                                    </Col>

                                    <Col className="gutter-row" span={12}>
                                        <div className="step step-2">
                                            <span>Step 2</span>
                                            <div className="step-image">
                                                <img src={imageStep3} alt="step 2" />
                                            </div>
                                        </div>
                                    </Col>
                                </Row>

                                <Row gutter={20}>
                                    <Col className="gutter-row" span={12}>
                                        <div className="step step-3">
                                            <span>Step 3</span>
                                            <div className="step-image">
                                                <img src={imageStep2} alt="step 3" />
                                            </div>
                                        </div>
                                    </Col>

                                    <Col className="gutter-row" span={12}>
                                        <div className="step step-4">
                                            <span>Step 4</span>
                                            <div className="step-image">
                                                <img src={imageStep4} alt="step 4" />
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </div>
                </Fragment>
            )
        }

       
    }

    return (
        <>
            {!location.pathname.includes("deposit") && (
                <Modal className="choose-account-modal"  centered={true} open={isOpenModalChooseAccount} onCancel={handleCancel} footer={false}>
                    <div
                        className="close-button"
                        onClick={() => {
                            handleCancel()
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                            <path
                                d="M18.75 5.75L5.25 19.25"
                                stroke="white"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M18.75 19.25L5.25 5.75"
                                stroke="white"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>
                    <div className="choose-user-info">{_renderUserInfo()}</div>
                </Modal>
            )}
        </>
    )
}

