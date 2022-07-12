import React, {useContext, useState} from 'react'
import MoonFitAuthContext from "../contexts/MoonFitAuthContext"


const MFAccountButton = ({isConnected}) => {
    const [isModalVisible, setIsModalVisible] = useState(false)

    const {user, isAuthenticated} = useContext(MoonFitAuthContext)

    const showWalletModal = () => setIsModalVisible(true)

    const hideWalletModal = () => setIsModalVisible(false)

    return (
        <div className={'ml-2'}>
            {
                isAuthenticated ? (
                    <button type="button"
                            onClick={showWalletModal}
                            className="header-button button button-secondary">
                        <svg className="inline mr-1" style={{marginTop: 4}} width="24" height="14"
                             viewBox="0 0 16 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M13.3256 3.12612L13.3326 3.02567L13.5598 0.160645H11.0963L8.57798 3.68064L8.81882 0.248042L6.13542 0.162319L3.12149 4.64938C3.12149 4.64938 2.34524 5.87227 1.04333 5.61477L0.197266 8.11681H2.03425C2.03425 8.11681 3.43807 8.09035 4.58012 6.82962C5.71553 5.56856 6.0733 4.79638 6.0733 4.79638V7.81979H8.44116L10.6841 4.79638L10.3951 7.81979H14.9151L15.5894 5.53574H13.1329L13.3256 3.12612Z"
                                fill="white"/>
                        </svg>
                        {user?.email}
                    </button>
                ) : (
                    <button type="button"
                            onClick={showWalletModal}
                            className="flex items-center header-button button button-secondary">
                        <svg className="inline mr-1" style={{marginTop: 4}} width="24" height="14"
                             viewBox="0 0 16 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M13.3256 3.12612L13.3326 3.02567L13.5598 0.160645H11.0963L8.57798 3.68064L8.81882 0.248042L6.13542 0.162319L3.12149 4.64938C3.12149 4.64938 2.34524 5.87227 1.04333 5.61477L0.197266 8.11681H2.03425C2.03425 8.11681 3.43807 8.09035 4.58012 6.82962C5.71553 5.56856 6.0733 4.79638 6.0733 4.79638V7.81979H8.44116L10.6841 4.79638L10.3951 7.81979H14.9151L15.5894 5.53574H13.1329L13.3256 3.12612Z"
                                fill="white"/>
                        </svg>
                        Login
                    </button>
                )
            }
        </div>
    )
}

export default MFAccountButton