import React, { useContext, useState } from 'react'
import mfBrand from "../assets/images/brand.png"
import nftCard from "../assets/images/universe-image.png"
import WalletAuthContext from "../contexts/WalletAuthContext"
import { CountdownComponent } from "./CountdownComponent"
import { NFT_SALE_CURRENT_INFO } from "../constants/blockchain"
import calendar from "../assets/images/icons/calendar.svg"
import outlook from "../assets/images/icons/outlook.svg"
import yahoo from "../assets/images/icons/yahoo.svg"
import office365 from "../assets/images/icons/office365.svg"
import wallet from "../assets/images/icons/Wallet.svg"
import calendarCheck from "../assets/images/icons/CalendarCheck.svg"
import MFStory from './MFStory'
import MFUtilities from './MFUtilities'
import MFWeb3Fitness from './MFWeb3Fitness'


const WalletAuthRequiredNFTSale = ({ children, className }) => {
    const { isConnected, showWalletSelectModal } = useContext(WalletAuthContext)
    const currentSale = NFT_SALE_CURRENT_INFO
    const [isStarted, setIsStarted] = useState(currentSale.time && currentSale.time <= new Date().getTime())
    const [toggleCalendar, setToggleCalendar] = useState(false)

    // const isSubWalletInstalled = Boolean((window?.injectedWeb3 && window[PROVIDER_NAME.SubWallet]) || (window[PROVIDER_NAME.MetaMask]))

    const _renderCountdown = () => {
        if (isStarted) {
            // return `NFT Sale #${NFT_SALE_CURRENT_INFO.number} have been started`
            return <div className="flex justify-center">
                <button
                    className="button button-secondary btn-join-whitelist" type="button"
                    onClick={showWalletSelectModal}>JOIN WHITELIST SALE</button>
            </div>
        }

        return <>
            {/* <div className={'hidden md:block normal-case mr-2 text-white text-base'}>
                Start in:
            </div> */}
            <div className={'flex justify-center'}>
                <CountdownComponent
                    date={NFT_SALE_CURRENT_INFO.time}
                    glow={true}
                    completedCallback={() => setIsStarted(true)}
                />
            </div>
        </>
    }

    const RenderIdioms = () => {
        return (
            <div>
                <span className="block-text-white">Look like a Beauty, run like a Beast🏃‍♂️🔥</span>
                <span className="block-text-white">Bear in mind that 1 Mint Pass can mint max 2 MoonBeasts.</span>
                <span className="block-text-white">Save the date - Round 3 is getting closer.</span>
            </div>
        )
    }

    const renderContent = () => {
        return !isConnected ? (
            <div className={'flex flex-col landing-text-wrap justify-center z-[9]'}>
                <div className="lg:hidden flex brand-image justify-center">
                    <img loading="lazy" src={mfBrand} alt="Moonfit Branding" width="356" />
                </div>
                <h1 className="section-title flex flex-col justify-center">
                    <span className={'text-center primary-color current-title text-4xl xl:text-7xl'}>
                        {NFT_SALE_CURRENT_INFO.title}
                    </span>
                    <span className="text-center secondary-color text-2xl xl:text-3xl my-2 xl:my-3 xl:text-5xl">
                        {NFT_SALE_CURRENT_INFO.dateMsg}
                    </span>
                </h1>
                <div className="section-description-wrap text-center">
                    <RenderIdioms />
                    <div className={'flex items-center mt-8 justify-center '}>
                        {_renderCountdown()}
                    </div>
                </div>
                {
                    !isStarted && <div div className={'flex mt-8 justify-center'}>
                        <div className="btn-connect">
                            <button type="button"
                                onClick={showWalletSelectModal}
                                className="button button-secondary">
                                <img className="mr-1" src={wallet} /> Connect Wallet
                            </button>
                        </div>

                        <div className="dropdown ml-2">
                            <button
                                type="button"
                                onClick={() => setToggleCalendar(true)}
                                onBlur={() => setToggleCalendar(false)}
                                className="button button-default dropbtn"
                            >
                                <img className="mr-1" src={calendarCheck} /> Add to Calendar
                            </button>
                            <div className={`dropdown-content${toggleCalendar ? " toggle-calendar" : ""}`}>
                                <a href="https://calendar.google.com/calendar/render?action=TEMPLATE&dates=20220924T140000Z%2F20220924T150000Z&details=Look%20like%20a%20Beauty%2C%20run%20like%20a%20Beast%F0%9F%8F%83%E2%80%8D%E2%99%82%EF%B8%8F%F0%9F%94%A5%0ABear%20in%20mind%20that%201%20Mint%20Pass%20can%20mint%20max%202%20MoonBeasts.%0ASave%20the%20date%20-%20Round%202%20is%20getting%20closer.&location=https%3A%2F%2Fapp.moonfit.xyz%2Fnft-sale&text=MoonFit%20NFT%20SALE%20%232" target="_blank"><img src={calendar} alt="Google calendar" /> Google Calendar</a>
                                <a href="https://outlook.office.com/calendar/0/deeplink/compose?allday=false&body=Look%20like%20a%20Beauty%2C%20run%20like%20a%20Beast%F0%9F%8F%83%E2%80%8D%E2%99%82%EF%B8%8F%F0%9F%94%A5%0ABear%20in%20mind%20that%201%20Mint%20Pass%20can%20mint%20max%202%20MoonBeasts.%0ASave%20the%20date%20-%20Round%202%20is%20getting%20closer.&enddt=2022-09-24T15%3A00%3A00%2B00%3A00&location=https%3A%2F%2Fapp.moonfit.xyz%2Fnft-sale&path=%2Fcalendar%2Faction%2Fcompose&rru=addevent&startdt=2022-09-24T14%3A00%3A00%2B00%3A00&subject=MoonFit%20NFT%20SALE%20%232" target="_blank"><img src={outlook} alt="Microsoft Outlook" /> Microsoft Outlook</a>
                                <a href="https://outlook.office.com/calendar/0/deeplink/compose?allday=false&enddt=2022-09-23T11%3A45%3A00%2B00%3A00&path=%2Fcalendar%2Faction%2Fcompose&rru=addevent&startdt=2022-09-23T11%3A15%3A00%2B00%3A00" target="_blank"><img src={office365} alt="Office 365" /> Office 365</a>
                                <a href="https://calendar.yahoo.com/?dur=&et=20220923T114500Z&st=20220923T111500Z&v=60" target="_blank"><img src={yahoo} alt="Yahoo" />Yahoo! Calendar</a>
                            </div>
                        </div>
                    </div>
                }

            </div >
        ) : children
    }

    return (
        <div className={`wallet-auth-required-nft-sale ${className || ''}`}>
            {renderContent()}
            {
                !isConnected && <><MFStory />
                    <MFUtilities />
                    <MFWeb3Fitness />
                </>
            }

        </div>
    )
}

export default WalletAuthRequiredNFTSale
