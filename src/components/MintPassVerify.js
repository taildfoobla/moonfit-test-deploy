import React, { useState } from 'react'
import { Image } from 'antd';
import configs from "../configs";
import { NFT_SALE_CURRENT_INFO } from "../constants/blockchain";
import nftSaleABI from '../abis/MFNFTSale.json'
import mintPassABI from "../abis/MintPassNFT.json";
import Web3 from "web3";
import { getNFTInfo } from "../utils/blockchain"
import LoadingOutlined from './shared/LoadingOutlined'
const imageExample = require('../assets/images/tofunft.png')

const { MOONBEAST_NETWORK, MINT_PASS_SC } = configs
const { NFT_SALE_SC } = NFT_SALE_CURRENT_INFO

const MintPassVerify = () => {
    const defaultMessage = 'Make sure you are not buying an used MintPass'
    const [name, setName] = useState('');
    const [type, setType] = useState('warning');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState(defaultMessage);

    const _isNumeric = (value) => /^\d+$/.test(value);

    const handleSubmit = async (e) => {
        e.preventDefault();
        let tokenId = name.toLowerCase().trim();

        if (!tokenId) {
            setType('warning')
            setMessage(defaultMessage)
        }

        if (!_isNumeric(tokenId)) {
            let m;
            // eslint-disable-next-line
            const regex = new RegExp(`(MoonFit Mint Pass #)?\s*(\\d+)$`, 'gmi');

            while ((m = regex.exec(tokenId)) !== null) {
                // This is necessary to avoid infinite loops with zero-width matches
                if (m.index === regex.lastIndex) {
                    regex.lastIndex++;
                }

                if (m && m[2]) {
                    tokenId = m[2]
                }
            }
        }

        if (!_isNumeric(tokenId) || tokenId < 1) {
            setType('warning')
            setMessage('Invalid name. Please enter the MintPass name in the correct format!')
            return
        }

        const _displayMessage = (slot) => {
            if (slot >= 1) {
                setType('success')
                setMessage(`The MintPass is eligible for buying ${slot} NFT${slot > 1 ? 's' : ''} in this Sale Round.`)

                return
            }

            setType('error')
            setMessage('Don’t buy this MintPass! It can not be used in this Sale Round.')
        }

        setIsLoading(true)
        try {
            const web3js = new Web3(MOONBEAST_NETWORK)
            const saleContract = new web3js.eth.Contract(nftSaleABI.abi, NFT_SALE_SC)
            const mintPassContract = new web3js.eth.Contract(mintPassABI.abi, MINT_PASS_SC)

            const { isError } = await getNFTInfo(mintPassContract.methods, tokenId, false)
            if (isError) {
                setType('error')
                setMessage(`MoonFit Mint Pass #${tokenId} not found!`)
            } else {
                const slot = await saleContract.methods.getMintPassAvailableSlots(tokenId).call()
                _displayMessage(parseInt(slot, 10))
            }
        } catch (error) {
            console.error(error);
            setType('error')
            setMessage('Can\'t verify MintPassNFT. Please try again')
        }

        setTimeout(() => {
            setIsLoading(false)
        }, 250)
    }

    const icons = {
        warning: (<svg width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M17.4972 13.6848L10.6247 1.80981C10.4598 1.52542 10.2231 1.28935 9.93826 1.12524C9.65343 0.961136 9.33048 0.874756 9.00175 0.874756C8.67303 0.874756 8.35007 0.961136 8.06524 1.12524C7.78041 1.28935 7.5437 1.52542 7.37883 1.80981V1.81042L0.50627 13.6848C0.341266 13.9698 0.254226 14.2932 0.253907 14.6225C0.253588 14.9518 0.340003 15.2753 0.504455 15.5606C0.668907 15.8459 0.905597 16.0828 1.19071 16.2476C1.47582 16.4124 1.79929 16.4991 2.12858 16.4991H15.8749C16.2042 16.4991 16.5277 16.4124 16.8128 16.2476C17.0979 16.0828 17.3346 15.8459 17.4991 15.5606C17.6635 15.2753 17.7499 14.9518 17.7496 14.6225C17.7493 14.2932 17.6622 13.9698 17.4972 13.6848ZM8.37614 7.12475C8.37614 6.95899 8.44199 6.80002 8.5592 6.68281C8.67641 6.5656 8.83538 6.49975 9.00114 6.49975C9.1669 6.49975 9.32588 6.5656 9.44308 6.68281C9.5603 6.80002 9.62614 6.95899 9.62614 7.12475V10.2498C9.62614 10.4155 9.5603 10.5745 9.44308 10.6917C9.32588 10.8089 9.1669 10.8748 9.00114 10.8748C8.83538 10.8748 8.67641 10.8089 8.5592 10.6917C8.44199 10.5745 8.37614 10.4155 8.37614 10.2498V7.12475ZM9.0016 14C8.81618 14 8.63492 13.945 8.48075 13.842C8.32658 13.739 8.20642 13.5926 8.13546 13.4212C8.06451 13.2499 8.04594 13.0614 8.08211 12.8796C8.11829 12.6977 8.20758 12.5307 8.33869 12.3996C8.4698 12.2685 8.63685 12.1792 8.8187 12.143C9.00056 12.1068 9.18906 12.1254 9.36037 12.1963C9.53167 12.2673 9.67809 12.3875 9.7811 12.5416C9.88412 12.6958 9.9391 12.8771 9.9391 13.0625C9.93909 13.3111 9.84031 13.5496 9.6645 13.7254C9.48869 13.9012 9.25024 14 9.0016 14Z"
                fill="#EFAA5D" />
        </svg>
        ),
        success: (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M9 0.875C7.39303 0.875 5.82214 1.35152 4.486 2.24431C3.14985 3.1371 2.10844 4.40605 1.49348 5.8907C0.87852 7.37535 0.717618 9.00901 1.03112 10.5851C1.34463 12.1612 2.11846 13.6089 3.25476 14.7452C4.39106 15.8815 5.8388 16.6554 7.4149 16.9689C8.99099 17.2824 10.6247 17.1215 12.1093 16.5065C13.594 15.8916 14.8629 14.8502 15.7557 13.514C16.6485 12.1779 17.125 10.607 17.125 9C17.1225 6.84588 16.2657 4.7807 14.7425 3.25751C13.2193 1.73431 11.1541 0.87749 9 0.875ZM12.8696 7.57727L8.28589 11.9523C8.16935 12.0632 8.01463 12.125 7.85376 12.125C7.69289 12.125 7.53818 12.0632 7.42164 11.9523L5.13037 9.76477C5.01067 9.65011 4.94137 9.49262 4.9377 9.32689C4.93403 9.16117 4.99629 9.00077 5.11081 8.88092C5.22532 8.76107 5.38272 8.69157 5.54844 8.68769C5.71416 8.68381 5.87464 8.74587 5.99463 8.86023L7.85376 10.6357L12.0054 6.67273C12.1254 6.55837 12.2859 6.49631 12.4516 6.50019C12.6173 6.50407 12.7747 6.57357 12.8892 6.69342C13.0037 6.81327 13.066 6.97367 13.0623 7.13939C13.0586 7.30512 12.9893 7.46261 12.8696 7.57727Z"
                    fill="#A5D990" />
            </svg>
        ),
        error: (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M9 0.875C7.39303 0.875 5.82214 1.35152 4.486 2.24431C3.14985 3.1371 2.10844 4.40605 1.49348 5.8907C0.87852 7.37535 0.717618 9.00901 1.03112 10.5851C1.34463 12.1612 2.11846 13.6089 3.25476 14.7452C4.39106 15.8815 5.8388 16.6554 7.4149 16.9689C8.99099 17.2824 10.6247 17.1215 12.1093 16.5065C13.594 15.8916 14.8629 14.8502 15.7557 13.514C16.6485 12.1779 17.125 10.607 17.125 9C17.1225 6.84588 16.2657 4.7807 14.7425 3.25751C13.2193 1.73431 11.1541 0.87749 9 0.875ZM11.9419 11.0581C12 11.1161 12.0462 11.185 12.0776 11.2609C12.1091 11.3367 12.1254 11.418 12.1254 11.5001C12.1255 11.5823 12.1093 11.6636 12.0779 11.7395C12.0465 11.8153 12.0004 11.8843 11.9424 11.9424C11.8843 12.0004 11.8154 12.0465 11.7395 12.0779C11.6636 12.1093 11.5823 12.1254 11.5001 12.1254C11.418 12.1254 11.3367 12.1091 11.2609 12.0776C11.185 12.0462 11.1161 12 11.0581 11.9419L9 9.88379L6.9419 11.9419C6.82466 12.0589 6.66577 12.1246 6.50014 12.1245C6.33451 12.1244 6.1757 12.0585 6.05858 11.9414C5.94146 11.8243 5.87563 11.6655 5.87554 11.4999C5.87545 11.3342 5.94112 11.1753 6.05811 11.0581L8.11621 9L6.05811 6.94189C5.94112 6.82465 5.87545 6.66576 5.87554 6.50014C5.87563 6.33451 5.94146 6.17569 6.05858 6.05858C6.1757 5.94146 6.33451 5.87563 6.50014 5.87554C6.66577 5.87545 6.82466 5.94111 6.9419 6.05811L9 8.11621L11.0581 6.05811C11.1754 5.94111 11.3342 5.87545 11.4999 5.87554C11.6655 5.87563 11.8243 5.94146 11.9414 6.05858C12.0585 6.17569 12.1244 6.33451 12.1245 6.50014C12.1246 6.66576 12.0589 6.82465 11.9419 6.94189L9.88379 9L11.9419 11.0581Z"
                    fill="#EF2763" />
            </svg>
        ),
        spin: (
            <LoadingOutlined size={16} className="mp-verify__loading" />
        ),
        info: (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 20C15.5228 20 20 15.5228 20 10C20 4.47715 15.5228 0 10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20Z" fill="#583877" />
                <path d="M10 15C10.5523 15 11 14.5523 11 14C11 13.4477 10.5523 13 10 13C9.44772 13 9 13.4477 9 14C9 14.5523 9.44772 15 10 15Z" fill="white" />
                <path d="M10 11V10.375C10.3956 10.375 10.7822 10.2467 11.1111 10.0063C11.44 9.76597 11.6964 9.42433 11.8478 9.02462C11.9991 8.62491 12.0387 8.18507 11.9616 7.76074C11.8844 7.33641 11.6939 6.94663 11.4142 6.64071C11.1345 6.33478 10.7781 6.12644 10.3902 6.04203C10.0022 5.95763 9.60009 6.00095 9.23463 6.16651C8.86918 6.33208 8.55682 6.61246 8.33706 6.97219C8.1173 7.33192 8 7.75485 8 8.1875" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        )
    }

    return (
        <div className="section-content">
            <div className="container">
                <div className="moonfit-card">
                    <div className="moonfit-card-inner">
                        <div className="card-title flex flex-col lg:flex-row lg:justify-between items-start mx-auto mt-0">
                            <div className={'flex text-white w-full lg:w-auto lg:justify-start mt-0 mp-verify__title'}>
                                CHECK YOUR MINT PASS
                            </div>
                        </div>
                        <div className="mp-verify__info">
                            A MoonFit MintPass can be used to mint a maximum of 2 MoonBeasts in this Sale Round. Please enter the MintPass number in the below box to verify their minting eligibility before purchasing.
                        </div>
                        <form className="card-body" onSubmit={handleSubmit}>
                            <div className={'mt-4 mb-6'}>
                                <div className="mp-verify__body">
                                    <div className="mp-verify__header">
                                        PLEASE Enter the MINTPASS NUMBER
                                    </div>
                                    <div className="flex justify-between">
                                        <div className="w-full">
                                            <input
                                                onChange={(e) => setName(e.target.value)} value={name}
                                                placeholder="#2029"
                                                className="ant-input mp-verify__input"
                                                type="text" />
                                        </div>
                                        <div>
                                            <button type="submit" disabled={isLoading} className={`ant-btn mp-verify__btn ${isLoading ? 'ant-btn-loading' : ''}`}>
                                                {isLoading && icons.spin}
                                                VERIFY
                                            </button>
                                        </div>
                                    </div>

                                    <div className={`mp-verify__msg ${type}`}>
                                        {icons[type]}
                                        {message}
                                    </div>
                                </div>
                            </div>
                        </form>

                        <div className="mp-verify__img">
                            <Image src={imageExample} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MintPassVerify
