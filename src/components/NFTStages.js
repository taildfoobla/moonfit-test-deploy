import React from 'react'
import {NFT_SALE_INFO} from "../constants/blockchain"
import moonbeam from '../assets/images/icons/moonbeam.svg'
import mintPass from '../assets/images/icons/mintpass.svg'
import {getOrdinalDateMonthFormat} from "../utils/datetime"
import classNames from "classnames"
import {Timeline} from "antd"
import {CountdownComponent} from "./CountdownComponent"


const NFTStages = ({children, round, className = ''}) => {
    const roundKeys = Object.keys(NFT_SALE_INFO)
    const currentSale = NFT_SALE_INFO[`R${round}`]
    const isStarted = currentSale.time && currentSale.time <= new Date().getTime()
    console.log(currentSale, isStarted)

    // const isSubWalletInstalled = Boolean((window?.injectedWeb3 && window[PROVIDER_NAME.SubWallet]) || (window[PROVIDER_NAME.MetaMask]))

    const renderSecondRow = (saleObj) => {
        return (
            <div className={'flex flex-col lg:flex-row text-base items-start lg:items-center justify-between'}>
                <div className={'flex items-center'}>
                    <span className={'text-white'}>
                        {saleObj.amount} NFTs
                    </span>
                    <svg className={'mx-4'} width="3" height="3" viewBox="0 0 3 3" fill="none"
                         xmlns="http://www.w3.org/2000/svg">
                        <circle cx="1.5" cy="1.5" r="1.5" fill="#A8ADC3"/>
                    </svg>
                    <span className={'normal-case text-gray-400'}>
                        {saleObj.time ? getOrdinalDateMonthFormat(saleObj.time) : 'TBD'}
                    </span>
                </div>
                <div className={'flex items-center mt-3 lg:mt-0'}>
                    <img src={moonbeam} alt="GLMR"/>
                    <span className={'race-sport-font primary-color mt-2 ml-3'}>{saleObj.price}</span>
                    <svg className={'mx-4'} width="10" height="10" viewBox="0 0 10 10" fill="none"
                         xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M9.268 3.966L8.806 6.248H5.642L4.998 9.44H2.646L3.29 6.248H0.28L0.742 3.966H3.738L4.382 0.773999H6.734L6.09 3.966H9.268Z"
                            fill="#A8ADC3"/>
                    </svg>
                    <img src={mintPass} alt="Mint Pass"/>
                    <span className={'race-sport-font primary-color mt-2 ml-3'}>1</span>
                </div>
            </div>
        )
    }

    return isStarted ? (
        <div className={`nft-stages ${className || ''}`}>
            {children}
        </div>
    ) : (
        <div className={`nft-stages ${className || ''}`}>
            <div className="section-content">
                <div className="container">
                    <div className="moonfit-card" style={{marginTop: 0}}>
                        <div className="moonfit-card-inner">
                            <div className="card-title flex justify-center mt-0 mb-6 lg:mb-10">
                                <div
                                    className={'flex text-white flex-col lg:flex-row justify-center mt-4 lg:mt-0 text-2xl'}>
                                    <span className={'secondary-color text-center mr-0 lg:mr-2'}>MoonFit</span>
                                    <span className={'text-center'}>NFT Stages</span>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className={'grid grid-cols-1 mt-4 lg:mt-8 gap-4'}>
                                    <div className={'nft-timeline'}>
                                        <Timeline className="nft-timeline-ul relative">
                                            {
                                                roundKeys.map((key, index) => {
                                                    const saleObj = NFT_SALE_INFO[key]
                                                    const isCurrentRound = round === index + 1
                                                    return (
                                                        <Timeline.Item
                                                            className={classNames("pb-10", {'opacity-50': !isCurrentRound})}
                                                            dot={(
                                                                <div
                                                                    className="marker absolute w-3 h-3 rounded-full mt-1.5 -left-1.5"></div>
                                                            )}
                                                            key={key}>
                                                            <div className="mb-1 text-lg race-sport-font primary-color">
                                                                {saleObj.title}
                                                            </div>
                                                            {renderSecondRow(saleObj)}
                                                            {
                                                                isCurrentRound && (
                                                                    <div className={'flex items-center mt-8'}>
                                                                        <div
                                                                            className={'hidden md:block normal-case mr-2 text-white text-base'}>
                                                                            Start in:
                                                                        </div>
                                                                        <div>
                                                                            <CountdownComponent date={saleObj.time}
                                                                                                completedCallback={() => window.location.reload()}
                                                                                                completedMessage={"NFT Sale #1 have been started"}/>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            }
                                                        </Timeline.Item>
                                                    )
                                                })
                                            }
                                        </Timeline>
                                        {/*<ul className="nft-timeline-ul relative">*/}
                                        {/*    {*/}
                                        {/*        roundKeys.map((key, index) => {*/}
                                        {/*            const saleObj = NFT_SALE_INFO[key]*/}
                                        {/*            const isCurrentRound = round === index + 1*/}
                                        {/*            return (*/}
                                        {/*                <li className={classNames("mb-12 ml-4", {'opacity-50': !isCurrentRound})}*/}
                                        {/*                    key={key}>*/}
                                        {/*                    <div*/}
                                        {/*                        className="marker absolute w-3 h-3 rounded-full mt-1.5 -left-1.5"></div>*/}
                                        {/*                    <div className="mb-1 text-normal race-sport-font primary-color">*/}
                                        {/*                        {saleObj.title}*/}
                                        {/*                    </div>*/}
                                        {/*                    {renderSecondRow(saleObj)}*/}
                                        {/*                    {*/}
                                        {/*                        isCurrentRound && (*/}
                                        {/*                            <div className={'flex mt-4'}>*/}
                                        {/*                                <div className={'normal-case mr-4'}>Start in:</div>*/}
                                        {/*                                <div>*/}
                                        {/*                                    <CountdownComponent date={saleObj.time}/>*/}
                                        {/*                                </div>*/}
                                        {/*                            </div>*/}
                                        {/*                        )*/}
                                        {/*                    }*/}
                                        {/*                </li>*/}
                                        {/*            )*/}
                                        {/*        })*/}
                                        {/*    }*/}
                                        {/*</ul>*/}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NFTStages