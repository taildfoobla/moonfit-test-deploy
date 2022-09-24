import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import React from 'react';

const Loading= ({className= '',size = 30, children}) => {
    const antIcon = <LoadingOutlined className={className} style={{ fontSize: size }} spin />;

    return <Spin indicator={antIcon}>
        {children}
    </Spin>
}

export default Loading
