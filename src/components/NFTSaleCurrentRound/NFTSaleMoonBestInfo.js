import React, { Fragment, useContext, useEffect, useState } from 'react'
import { Progress, Tooltip, Typography } from "antd"
import { getAddressScanUrl, getShortAddress, } from "../../utils/blockchain"
import CopyIcon from "../shared/CopyIcon"
import { NFT_SALE_CURRENT_INFO } from "../../constants/blockchain"
import configs from "../../configs";
import LoadingOutlined from "../shared/LoadingOutlined";
import WalletAuthContext from '../../contexts/WalletAuthContext'
import wallet from "../../assets/images/icons/Wallet.svg"
import QuestionIcon from '../../assets/images/icons/question.svg'
import Moonbeam from '../../assets/images/icons/moonbeam.svg'
import Pack1 from '../../assets/images/icons/pack-1.svg'
import Pack3 from '../../assets/images/icons/pack-3.svg'
import Pack5 from '../../assets/images/icons/pack-5.svg'
import Pack13 from '../../assets/images/icons/pack-13.svg'
import LockMintpass from '../../assets/images/icons/lock-mintpass.svg'
import { getListPack } from '../../services/smc-ntf-sale'
import { WITHOUT_MINT_PASS_PACK, WITH_MINT_PASS_PACK } from '../../constants/packs'

const NFTSaleMoonBestInfo = (props) => {
    const { isConnected, showWalletSelectModal } = useContext(WalletAuthContext)
    const [tab, setTab] = useState(1)
    const [loading, setLoading] = useState(false)
    const [listPack, setListPack] = useState([])
    const [selectedPack, setSelectedPack] = useState({})

    useEffect(() => {
        setListPack(tab === 1 ? WITH_MINT_PASS_PACK : WITHOUT_MINT_PASS_PACK)
    }, [tab])

    const renderPackIcon = (type) => {
        let icon = null
        switch (type) {
            case 'pack1': icon = Pack1
                break
            case 'pack3': icon = Pack3
                break
            case 'pack5': icon = Pack5
                break
            case 'pack13': icon = Pack13
                break
            default: break
        }
        return icon
    }

    const onChangePack = (pack) => {
        setSelectedPack(pack)
    }

    const handleLockMintpass = () => {
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
        }, 2000)
    }

    return (
        <div className={'card-body-row flex flex-col purchase-moonbest'}>
            <div className='text-center normal-case font-semibold mb-5'>
                <p className='text-white text-[20px] mb-0'>You have 2 Mint Pass available</p>
                <p className='text-[#A8ADC3] text-[18px] w-3/4 m-auto'>Each mint pass is one-time use only for buying 1 MoonBeast at a discounted price.</p>
            </div>

            <div className='flex justify-center normal-case tabs'>
                <div className={`tab ${tab === 1 ? 'active' : ''}`} onClick={() => setTab(1)}>With Mint Pass</div>
                <div className={`tab ${tab === 2 ? 'active' : ''}`} onClick={() => setTab(2)}>Without Mint Pass</div>
            </div>

            <ul className='packs p-0'>
                {
                    listPack.map((mintpass, index) => (
                        <li key={index} className={`pack flex justify-between items-center ${selectedPack.value === mintpass.value ? 'active' : ''}`} onClick={() => onChangePack(mintpass)}>
                            <div className='left flex items-center'>
                                <img src={renderPackIcon(mintpass.type)} />
                                <div className='pack-label ml-3'>
                                    <p className='flex text-[14px] race-sport-font mb-0'><span className='mr-2'>{mintpass.label}</span> 
                                    <Tooltip className='pack-tooltip' placement="top" title={mintpass.tooltip}>
                                        <img src={QuestionIcon} />
                                    </Tooltip>
                                    </p>
                                    {mintpass.discount && <p className='text-[15px] sub-label'><span>{mintpass.value} x {mintpass.amount}</span> <span className='text-[#EF2763]'>(-{mintpass.discount}%)</span></p>}
                                </div>
                            </div>
                            <div className='right flex items-center'>
                                <img className='mr-3' src={Moonbeam} /> <span className='font-bold text-[20px] text-[#4CCBC9]'>{mintpass.value * mintpass.amount}</span>
                            </div>
                            {mintpass.isRecommend && <div className='badge-recommend'><span className='text-[13px] font-semibold normal-case'>Recommended</span></div>}
                        </li>
                    ))
                }
            </ul>
            <hr className={'card-body-separator'} />
            <div className='flex justify-between items-center'>
                <div className='left'>
                    <span className='text-[16px] text-[#A8ADC3]'>FEE:</span>
                    <p className='text-[20px] text-[#4CCBC9] race-sport-font'>{selectedPack.value * selectedPack.amount} $GLMR</p>
                </div>
                <div className='right'>
                    <button type="button"
                        onClick={handleLockMintpass}
                        className="button button-secondary">
                            {
                                loading ? <Fragment>
                                    <LoadingOutlined className='text-white' /> <span className='ml-2'>Locking</span>
                                </Fragment> : <Fragment>
                                    <img className="mr-2" src={LockMintpass} alt="" /> Lock Mintpass
                                </Fragment>
                            }
                    </button>
                </div>
            </div>
            {
                !isConnected && <div className={'flex mt-8 justify-center form-mint-footer'} style={{ marginTop: "30px" }}>
                    <div className="btn-connect">
                        <button type="button"
                            onClick={showWalletSelectModal}
                            className="button button-secondary">
                            <img className="mr-1" src={wallet} alt="" /> Connect Wallet
                        </button>
                    </div>
                </div>
            }
        </div>
    )
}

export default NFTSaleMoonBestInfo
