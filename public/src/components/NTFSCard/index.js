import React from "react"
import "./styles.less"
import { Image } from "antd"

// data-aos="fade" data-aos-delay={position * 100}

const NTFSCard = ({ name, imageUrl, position }) => {

    return (
        <div className="ntfs-card">
            <div className="ntfs-card__inner">
                <Image src={imageUrl} className="ntfs-card__image" preview={false} height={150} />
                <div className="ntfs-card__title">{name}</div>
            </div>
        </div>
    )
}

export default NTFSCard
