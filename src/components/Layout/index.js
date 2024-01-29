import React, { useEffect, useState } from "react"
import {Outlet} from "react-router-dom"
import "./styles.less"
import Header from "../Header"
import Footer from "../Footer"
import {useLocation} from "react-router-dom"

const Layout = () => {
    const [isSmallWindow,setIsSmallWindow]=useState(false)
    const location = useLocation()
   
    useEffect(()=>{
        if(window.outerWidth<851&&location.pathname.includes("lucky-wheel")){
            setIsSmallWindow(true)
        }else{
            setIsSmallWindow(false)
        }
    },[window.innerWidth])

    return (
        <div className="app">
            <div className="stars-container" data-firefly-total="50">
                <div className="stars-container__star"></div>
            </div>
            {/* {!location.pathname.includes("lucky-wheel") && <Header />} */}
                    <Header/>
            <main>
                <Outlet />
            </main>
            {/* {location.pathname.includes("lucky-wheel")&&window.outerWidth<851?"": <Footer />} */}
           {!isSmallWindow &&<Footer />}
        </div>
    )
}

export default Layout

