import React from 'react';
import Select from 'react-select';

const colourOptions = [
    { value: 'ocean', label: 'Ocean', color: '#00B8D9', isFixed: true },
    { value: 'blue', label: 'Blue', color: '#0052CC', isDisabled: true },
    { value: 'purple', label: 'Purple', color: '#5243AA' },
    { value: 'red', label: 'Red', color: '#FF5630', isFixed: true },
    { value: 'orange', label: 'Orange', color: '#FF8B00' },
    { value: 'yellow', label: 'Yellow', color: '#FFC400' },
    { value: 'green', label: 'Green', color: '#36B37E' },
    { value: 'forest', label: 'Forest', color: '#00875A' },
    { value: 'slate', label: 'Slate', color: '#253858' },
    { value: 'silver', label: 'Silver', color: '#666666' },
]

const promiseOptions = (inputValue) => {
    setTimeout(() => {
        filterColors(inputValue);
    }, 1000);
}


const filterColors = (inputValue) =>
    colourOptions.filter((i) =>
        i.label.toLowerCase().includes(inputValue.toLowerCase())
    );

const customStyles = {
    control: (baseStyles, state) => ({
        ...baseStyles,
        height: 50,
        minHeight: 50,
        borderColor: '#1C0532',
        backgroundColor: '#1C0532'
    }),
    valueContainer: (provided, state) => ({
        ...provided,
        height: 50,
    }),
    input: (provided, state) => ({
        ...provided,
        margin: 0,
    }),
    indicatorSeparator: state => ({
        display: 'none',
    }),
    indicatorsContainer: (provided, state) => ({
        ...provided,
        height: 50,
    }),
    menu: (provided, state) => ({
        ...provided,
        borderColor: '#1C0532',
        backgroundColor: '#1C0532',
        borderColor: state.isFocused ? '#1C053250' : '#1C0532',
        zIndex: 9999
    }),
    menuPortal: provided => ({ ...provided, zIndex: 9999 }),
}

const MFAssetSelect = () => {
    return (
        <Select
            cacheOptions
            defaultOptions
            options={colourOptions}
            styles={customStyles}
        />
    );
};

export default MFAssetSelect;