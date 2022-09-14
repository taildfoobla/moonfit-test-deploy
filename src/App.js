import React from 'react'
import {renderRoutes} from "react-router-config"
import WebNavigation from "./components/shared/WebNavigation"
import MoonFitAuthWrapper from "./wrappers/MoonFitAuth"
import AppWrapper from "./wrappers/App"
import WalletAuthWrapper from "./wrappers/WalletAuth"

const App = ({route}) => {
    return (
        <AppWrapper>
            <MoonFitAuthWrapper>
                <WalletAuthWrapper>
                    <div>
                        <div className="section-effect-snow site-effect-snow" data-firefly-total="50" />
                        <WebNavigation/>
                        {renderRoutes(route.routes)}
                    </div>
                </WalletAuthWrapper>
            </MoonFitAuthWrapper>
        </AppWrapper>
    )
}

export default App
