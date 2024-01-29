import React from "react"
import "./styles.less"

export default function AssetsManagementCard({children,childClassName}) {
    return (
        <div className="assets-card-wrapper">
            <div className={`assets-card-inner ${childClassName}`}>{children}</div>
        </div>
    )
}

