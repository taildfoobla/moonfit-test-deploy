import React from "react"
// import {Tabs} from "antd"
import "./styles.less"
import NTFSList from "./components/NTFTList"
import Container from "../../../../components/Container"
// import TokenList from "./components/TokenList"

const Assets = () => {
    return (
        <section className="assets">
            <Container>
                {/* <Tabs defaultActiveKey="1" prefixCls="assets" tabBarGutter={30} centered>
                    <Tabs.TabPane tab="nfts" key="1">
                        <NTFSList />
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="tokens" key="2">
                        <TokenList />
                    </Tabs.TabPane>
                </Tabs> */}
                 <NTFSList />
            </Container>
        </section>
    )
}

export default Assets
