import { getAccessTokenAPI } from "../../services/assets-management"
import { setLocalStorage,LOCALSTORAGE_KEY, getLocalStorage } from "./storage"
import { message as AntdMessage } from "antd"
import { signOutAllPlatform } from "./firebase"
import { useAuth } from "../../contexts/auth"
import { createUserAPI, sendUserTimezoneAPI } from "../../services/create-user-in-db"

export const checkApi = async (callback, array) => {
    const socialAccount =JSON.parse(getLocalStorage(LOCALSTORAGE_KEY.SOCIAL_ACOUNT))
    if(socialAccount)
    try {
        let res
        if(array){
            console.log("here",array)
            res = await callback(array)

        }else{
        
           res = await callback()
        }
    
        const {message, success} = res
        if(!success){
            if(message==="User not found"&&socialAccount){
                const uId = socialAccount?.uid
                const value = {
                    input: {
                        uid: uId,
                        data: {is_testnet: false},
                    },
                }
                const dataTimezone={
                    "timezone_offset_minute": new Date().getTimezoneOffset(),
                    "timezone": Intl.DateTimeFormat().resolvedOptions().timeZone,
                }
               await createUserAPI(value)
               await sendUserTimezoneAPI(dataTimezone)
               if(array){
                res = await callback(array)
    
            }else{
            
               res = await callback()
            }

            }
        }
            return res
       
    } catch (err) {
        const errMessage = err?.response?.data?.message
        if(errMessage&&errMessage.includes("expired")){
            const newTokenRes = await getAccessTokenAPI()
            if (newTokenRes?.access_token) {
              
                const accessToken = newTokenRes?.access_token
                const refreshToken = newTokenRes?.refresh_token
                setLocalStorage(LOCALSTORAGE_KEY.ACCESS_TOKEN, accessToken)
                setLocalStorage(LOCALSTORAGE_KEY.REFRESH_TOKEN, refreshToken)
                let newData
                if(array){
                    newData = await callback(array)
                }else{
                    newData=await callback()

                }
                return newData

            } else {
                signOutAllPlatform()
                // setIsLoginSocial(false)
                  AntdMessage.error({
                    key:"err",
                    content: "Your login session has expired",
                    className: "message-error",
                    duration: 5,
                })

                location.reload()
            }
        }else{
            
            return {success:false,message:errMessage,data:[]}

        //    return AntdMessage.error({
        //         key:"err",
        //         content: errMessage,
        //         className: "message-error",
        //         duration: 5,
        //     })
        }
    }
}