import React, { useState } from "react"
import { Row, Tooltip } from "antd"
import {
    CopyOutlined,
} from '@ant-design/icons';
import mint from "../../../../../../assets/images/mint-pass.png"

const RewardNft = () => {

    const [tooltip, setTooltip] = useState('Copy')
    const formatAddress = (address) => {
        return `${address.substring(0, 7)}...${address.substring(address.length - 8, address.length)}`
    }

    const onCopySuccess = () => {
        setTooltip('Copied')
        setTimeout(() => {
            setTooltip('Copy')
        }, 2000)
    }

    return (
        <>
            <Row>
                <h3>YOUR REWARD</h3>
            </Row>
            <div className="reward-nft-box">

                <div className="box-header">
                    <span className="color-white">NFT</span>
                    <h4>
                        <span className="color-secondary">MOONFIT </span>
                        <span className="color-primary">MINT PASS</span>
                    </h4>
                </div>
                <div className="box-mint-pass">
                    <img src={mint} />
                    <div className="box-mint-pass-inner">
                        <h4 className="color-secondary">MOONFIT</h4>
                        <h4 className="color-primary">MINT PASS #145</h4>
                        <a className="color-purple">View on NFTScan</a>
                    </div>
                </div>
                <div className="box-contract">
                    <p className="pass-contract">Mint pass contract</p>
                    <div className="wallet-address">
                        <span>{formatAddress('0xd034739c2ae807c70cd703092b946f62a49509d1')}</span>
                        <span className="btn-copy" onClick={onCopySuccess}>
                            <Tooltip title={tooltip}>
                                <CopyOutlined />
                            </Tooltip>
                        </span>
                    </div>
                    <a className="block-explorer">View on block explorer</a>
                </div>
            </div>
        </>

    )
}

export default RewardNft
