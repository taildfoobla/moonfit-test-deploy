import React from "react"
import "./styles.less"
import classNames from "classnames"

const Container = ({children, className = ""}) => {
    return <div className={classNames("mf-container", {[className]: !!className})}>{children}</div>
}

export default Container
