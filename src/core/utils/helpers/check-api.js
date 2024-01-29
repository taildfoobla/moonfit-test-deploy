import { getAccessTokenAPI } from "../../services/assets-management"
import { setLocalStorage,LOCALSTORAGE_KEY } from "./storage"
import { message as AntdMessage } from "antd"
import { signOutAllPlatform } from "./firebase"
import { useAuth } from "../../contexts/auth"

export const checkApi = async (callback, array) => {
    // const {isLoginSocial,setIsLoginSocial}=useAuth()

    try {
        let res
        if(array){
            console.log("here1")
            res = await callback(array)

        }else{
        
           res = await callback()
        }
        // if (res.data === undefined) {
        //     console.log("returnBoolean")
        //     return res
        // }
        // const {message, success} = res

        // if (success) {
            return res
        // } else {
          
        //         return AntdMessage.error({
        //             key:"err",
        //             content: message,
        //             className: "message-error",
        //             duration: 5,
        //         })
            
     
        // }

        // return res
    } catch (err) {
        const errMessage = err?.response?.data?.message
        console.log("err",err)
        if(errMessage&&errMessage.includes("token has expired")){
            console.log("beforeGetAccessToken")
            const newTokenRes = await getAccessTokenAPI()
            console.log("afterGetAccessToken",newTokenRes)
            if (newTokenRes?.access_token) {
              
                const accessToken = newTokenRes?.access_token
                const refreshToken = newTokenRes?.refresh_token
                setLocalStorage(LOCALSTORAGE_KEY.ACCESS_TOKEN, accessToken)
                setLocalStorage(LOCALSTORAGE_KEY.REFRESH_TOKEN, refreshToken)
                let newData
                if(array){
                    newData = await callback(array)
                    console.log("newDataReturn", newData)
                }else{
                    newData=await callback()
                    console.log("newDataReturn1", newData)

                }
                return newData

            } else {
                signOutAllPlatform()
                // setIsLoginSocial(false)
                  return AntdMessage.error({
                    key:"err",
                    content: "Your login session has expired",
                    className: "message-error",
                    duration: 5,
                })
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