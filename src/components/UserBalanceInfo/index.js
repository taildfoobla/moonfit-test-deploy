import React, {useEffect, useState} from "react"
import "./styles.less"
import userAvatar from "../../assets/images/bounty-spin/user-avatar.png"
import astrIcon from "../../assets/images/lucky-wheel/wheel/astar-wheel.png"
import historyIcon from "../../assets/images/lucky-wheel/lw-history-gift.png"
import {checkApi} from "../../core/utils/helpers/check-api"
import {getAssetsDataAPI} from "../../core/services/assets-management"
import {message as AntdMessage} from "antd"
import { useAuth } from "../../core/contexts/auth"
import { LOCALSTORAGE_KEY, getLocalStorage } from "../../core/utils/helpers/storage"
export default function UserBalanceInfo({tokens,onToggleHistoryModal}) {
    const {isLoginSocial}=useAuth()
    const [user,setUser]=useState({})
    useEffect(() => {
        if(isLoginSocial){
            const userLocal=JSON.parse(getLocalStorage(LOCALSTORAGE_KEY.SOCIAL_ACOUNT))
            setUser(userLocal)
            // getBalanceData()

        }
    }, [isLoginSocial])
   

    return (
        <div className="user-balance-info-container">
            <div className="user-avatar">
                <div className="border-gradient"></div>
                <div className="content">
                    <img src={user?.photoURL} alt="" />
                </div>
            </div>
            <div className="token-list">
                {tokens?.length>0&&tokens?.map((token, index) => (
                    <div className={`token ${token.type}`} key={index}>
                        <img src={token.image_url} alt="" />
                        <span className="value">{token.value}</span>
                    </div>
                ))}
            </div>
            <img
                className="history-icon"
                src={historyIcon}
                alt=""
                onClick={() => {
                    onToggleHistoryModal()
                }}
            />
        </div>
    )
}

