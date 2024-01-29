import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import * as jdenticon from 'jdenticon';

const JdenticonComponent = ({ value = 'test', size = '100%' }) => {
    const icon = useRef(null);
    useEffect(() => {
        jdenticon.update(icon.current, value);
    }, [value]);

    return (
        <div className="jden-wrapper">
            <svg data-jdenticon-value={value} height={size} ref={icon} width={size} />
        </div>
    );
};

JdenticonComponent.propTypes = {
    size: PropTypes.string,
    value: PropTypes.string.isRequired
};
export default JdenticonComponent;
