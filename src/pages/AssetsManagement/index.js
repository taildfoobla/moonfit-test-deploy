import React, {useEffect, useState} from "react"
import "./styles.less"
import AssetsManagementWrapper from "../../components/Wrapper/AssetsManagementWrapper"
import {Row, Col} from "antd"
import TokensManagement from "./components/Tokens"
import NftManagement from "./components/Nfts"
import ItemManagement from "./components/Items"
import {Segmented} from "antd"
import {getAccessTokenAPI, getAssetsDataAPI} from "../../core/services/assets-management"
import { getLocalStorage, removeLocalStorage,setLocalStorage } from "../../core/utils/helpers/storage"
import { LOCALSTORAGE_KEY } from "../../core/utils-app/storage"
import { useAuth } from "../../core/contexts/auth"
import { useNavigate } from "react-router-dom"


export default function AssetsManagement() {
    const navigate=useNavigate()
    const [selectedPage, setSelectedPage] = useState("Tokens")
    const [assetsData, setAssetsData] = useState({moonItems: [], nfts: [], tokens: []})
    const [isLoading,setIsLoading]=useState(true)

    const {isLoginSocial,setIsOpenModalSocial}=useAuth()

    const selectPageData = ["Tokens", "NFTs", "MoonItems"]

    useEffect(() => {
        if(isLoginSocial){
            getAssetsData()    

        }else{
            navigate("/")
        }
    }, [isLoginSocial])

    const handleChangePage = (value) => {
        setSelectedPage(value)
    }

    const checkApi = async (callback, array) => {

        try {
            let res
            if(array){
                res = await callback(array.map((item) => item))

            }else{
            
               res = await callback()

            }
            if (res.data === undefined) {
                return res
            }
            const {message, success} = res.data

            if (success) {
                return res
            } else {
                if (message === "User is invalid.") {
                    return AntdMessage.error({
                        key:"err",
                        content: message,
                        className: "message-error",
                        duration: 5,
                    })
                }
         
            }

            // return res
        } catch (err) {
            const errMessage = err?.response?.data?.message
            if(errMessage&&errMessage.includes("token has expired")){
                const newTokenRes = await getAccessTokenAPI()
                if (newTokenRes?.access_token) {
                  
                    const accessToken = newTokenRes?.access_token
                    const refreshToken = newTokenRes?.refresh_token
                    setLocalStorage(LOCALSTORAGE_KEY.ACCESS_TOKEN, accessToken)
                    setLocalStorage(LOCALSTORAGE_KEY.REFRESH_TOKEN, refreshToken)
                    let newData
                    if(array){
                        newData = await callback(array.map((item) => item))
                    }else{
                        newData=await callback()

                    }
                    return newData

                } else {
                    onDisconnect()
                    return AntdMessage.error({
                        key:"err",
                        content: "Your login session has expired",
                        className: "message-error",
                        duration: 5,
                    })
                }
            }
        }
    }

    const getAssetsData = async () => {
        const res = await checkApi(getAssetsDataAPI)
        const newMoonItem = res?.moonItem?.data.filter(item=>item.is_claim===true)||[]

        const value = {
            moonItems: newMoonItem|| [],
            nfts: res?.nfts?.data || [],
            tokens: res?.tokens || [],
        }
        setAssetsData(value)
        setIsLoading(false)
    }

    return (
        
        <AssetsManagementWrapper>
            <div className="assets-management-page">
                <h3 className="assets-mangement-page-header">Assets</h3>
               
               {isLoginSocial?<>   <Segmented
                    options={selectPageData}
                    value={selectedPage}
                    onChange={(e) => {
                        handleChangePage(e)
                    }}
                />
                <div className="page-content">
                    <div className="page-inner">
                        <TokensManagement isLoading={isLoading} tokens={assetsData?.tokens}/>

                        <NftManagement isLoading={isLoading} nfts={assetsData?.nfts}/>

                        <ItemManagement isLoading={isLoading} moonItems={assetsData?.moonItems} />
                    </div>
                    <div className="page-inner-mobile">
                        {selectedPage === "Tokens" && <TokensManagement isLoading={isLoading} tokens={assetsData?.tokens}/>}
                        {selectedPage === "NFTs" && <NftManagement isLoading={isLoading} nfts={assetsData?.nfts}/>}
                        {selectedPage === "MoonItems" && <ItemManagement isLoading={isLoading} moonItems={assetsData?.moonItems}/>}
                    </div>
                </div></>:<div className="not-login-social" onClick={()=>{
                    setIsOpenModalSocial(true)
                }}> login with social</div>}
             
            </div>
        </AssetsManagementWrapper>
    )
}

